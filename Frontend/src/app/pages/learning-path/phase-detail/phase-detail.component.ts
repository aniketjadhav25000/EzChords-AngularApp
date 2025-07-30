import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Phase {
  id: string;
  title: string;
  color: string;
  icon: string;
  description: string;
  skills: string[];
  practice: PracticeItem[];
  challenge: string;
  duration: string;
  difficulty: string;
  prerequisites?: string[];
  nextPhase?: string;
}

interface PracticeItem {
  emoji: string;
  duration: string;
  activity: string;
  completed?: boolean;
}

@Component({
  selector: 'app-phase-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './phase-detail.component.html',
  styleUrls: ['./phase-detail.component.css']
})
export class PhaseDetailComponent implements OnInit {
  phaseId: string | null = null;
  currentPhase: Phase | null = null;
  progress: number = 0;
  completedPractices: Set<number> = new Set();
  practiceTimer: any;
  currentPracticeIndex: number = -1;
  isTimerRunning: boolean = false;
  timeRemaining: number = 0;

  private phases: Phase[] = [
    {
      id: '1',
      title: 'Foundations',
      color: 'amber',
      icon: '🎯',
      description: 'Master the essential building blocks of guitar playing',
      duration: '2-3 weeks',
      difficulty: 'Beginner',
      skills: [
        'Basic open chords: C, G, D, Em',
        'Proper finger placement and posture',
        'Simple strumming patterns',
        'Guitar tuning techniques',
        'Fret board familiarity'
      ],
      practice: [
        { emoji: '🎯', duration: '10', activity: 'Finger warm-up exercises' },
        { emoji: '🎸', duration: '15', activity: 'Chord transitions (G → C → D)' },
        { emoji: '🪕', duration: '10', activity: 'Strumming with metronome' },
        { emoji: '🎧', duration: '5', activity: 'Listen to sample tracks' }
      ],
      challenge: 'Play the chord loop: C - G - D - Em smoothly in under 30 seconds',
      nextPhase: '2'
    },
    {
      id: '2',
      title: 'Song Fundamentals',
      color: 'blue',
      icon: '🎶',
      description: 'Start playing real songs with confidence',
      duration: '3-4 weeks',
      difficulty: 'Beginner-Intermediate',
      prerequisites: ['Complete Phase 1'],
      skills: [
        'Clean chord transitions & tempo control',
        'Introduction to fingerpicking',
        'Simple Bollywood and Pop songs',
        'Beat counting & 4/4 rhythm structure',
        'Song structure understanding'
      ],
      practice: [
        { emoji: '🎯', duration: '10', activity: 'Smooth chord transitions' },
        { emoji: '🎵', duration: '15', activity: 'Practice 3-chord songs' },
        { emoji: '🎧', duration: '5', activity: 'Listen and analyze reference songs' },
        { emoji: '📹', duration: '10', activity: 'Record and review yourself' }
      ],
      challenge: 'Perform a full verse with correct chords and rhythm in one take',
      nextPhase: '3'
    },
    {
      id: '3',
      title: 'Performance Ready',
      color: 'purple',
      icon: '🎤',
      description: 'Develop performance skills and advanced techniques',
      duration: '4-6 weeks',
      difficulty: 'Intermediate',
      prerequisites: ['Complete Phase 2'],
      skills: [
        'Barre chords like F and Bm',
        'Advanced strumming patterns and rhythms',
        'Full song arrangements & smooth transitions',
        'Live performance techniques',
        'Stage presence and confidence'
      ],
      practice: [
        { emoji: '🔁', duration: '10', activity: 'Barre chord repetition' },
        { emoji: '🎸', duration: '15', activity: 'Play full songs confidently' },
        { emoji: '📹', duration: '10', activity: 'Record performance videos' },
        { emoji: '🎭', duration: '15', activity: 'Perform in front of others' }
      ],
      challenge: 'Perform and record a full song with rhythm, dynamics, and confidence'
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    // Load saved progress from localStorage (if available)
    this.loadProgress();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.phaseId = params.get('id');
      this.currentPhase = this.phases.find(phase => phase.id === this.phaseId) || null;
      this.calculateProgress();
    });
  }

  togglePracticeComplete(index: number): void {
    if (this.completedPractices.has(index)) {
      this.completedPractices.delete(index);
    } else {
      this.completedPractices.add(index);
    }
    this.calculateProgress();
    this.saveProgress();
  }

  calculateProgress(): void {
    if (!this.currentPhase) return;
    
    const total = this.currentPhase.practice.length;
    const completed = this.completedPractices.size;
    this.progress = Math.round((completed / total) * 100);
  }

  startPracticeTimer(index: number): void {
    if (!this.currentPhase) return;
    
    this.currentPracticeIndex = index;
    this.timeRemaining = this.parseDuration(this.currentPhase.practice[index].duration) * 60;
    this.isTimerRunning = true;
    
    this.practiceTimer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.stopPracticeTimer();
        this.togglePracticeComplete(index);
      }
    }, 1000);
  }

  stopPracticeTimer(): void {
    if (this.practiceTimer) {
      clearInterval(this.practiceTimer);
      this.practiceTimer = null;
    }
    this.isTimerRunning = false;
    this.currentPracticeIndex = -1;
    this.timeRemaining = 0;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  goToLearningPath(): void {
    this.router.navigate(['/learning-path']);
  }

  goToNextPhase(): void {
    if (this.currentPhase?.nextPhase) {
      this.router.navigate(['/learning/phase', this.currentPhase.nextPhase]);
    }
  }

  private saveProgress(): void {
    if (this.phaseId) {
      const progressData = {
        completedPractices: Array.from(this.completedPractices),
        progress: this.progress
      };
      localStorage.setItem(`phase_${this.phaseId}_progress`, JSON.stringify(progressData));
    }
  }

  private loadProgress(): void {
    if (this.phaseId) {
      const saved = localStorage.getItem(`phase_${this.phaseId}_progress`);
      if (saved) {
        const progressData = JSON.parse(saved);
        this.completedPractices = new Set(progressData.completedPractices);
        this.progress = progressData.progress;
      }
    }
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-400';
      case 'beginner-intermediate': return 'text-yellow-400';
      case 'intermediate': return 'text-orange-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }

  parseDuration(duration: string): number {
    return parseInt(duration, 10);
  }

  calculateTimerProgress(practice: PracticeItem): number {
    if (this.currentPracticeIndex === -1 || !this.isTimerRunning) {
      return 0;
    }
    const totalSeconds = this.parseDuration(practice.duration) * 60;
    const elapsedSeconds = totalSeconds - this.timeRemaining;
    return (elapsedSeconds / totalSeconds) * 100;
  }

  ngOnDestroy(): void {
    if (this.practiceTimer) {
      clearInterval(this.practiceTimer);
    }
  }
}