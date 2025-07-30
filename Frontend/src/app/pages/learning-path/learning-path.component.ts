import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

type Level = 'beginner' | 'intermediate' | 'advanced';

interface Phase {
  phase: string;
  duration: string;
  title: string;
  color: string;
  image: string;
  skills: string[];
  description: string;
}

@Component({
  selector: 'app-learning-path',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.css']
})
export class LearningPathComponent {
  selectedLevel: Level = 'beginner';

  constructor(private router: Router) {}

  phases: Record<Level, Phase> = {
    beginner: {
      phase: 'Phase 1',
      duration: '2-4 weeks',
      title: 'Foundations',
      color: 'purple',
      image: 'assets/PhaseImg/Phase1.png', // ✅ use path as string
      skills: [
        'Basic chords (C, G, D, Em)',
        'Proper finger positioning',
        'Simple strumming patterns',
        'Tuning basics',
      ],
      description: 'Start your guitar journey by learning the essential chords and rhythm basics.',
    },
    intermediate: {
      phase: 'Phase 2',
      duration: '4-6 weeks',
      title: 'Song Fundamentals',
      color: 'blue',
      image: 'assets/PhaseImg/Phase2.png',
      skills: [
        'Chord transitions',
        'Basic fingerpicking',
        'Simple Bollywood songs',
        'Rhythm techniques',
      ],
      description: 'Take your skills further by learning how to play and switch chords smoothly.',
    },
    advanced: {
      phase: 'Phase 3',
      duration: '6+ weeks',
      title: 'Performance Ready',
      color: 'purple',
      image: 'assets/PhaseImg/Phase3.png',
      skills: [
        'Barre chords mastery',
        'Advanced strumming',
        'Full song arrangements',
        'Performance techniques',
      ],
      description: 'Master complex techniques and perform full songs with confidence.',
    }
  };

  startPhase(phaseNumber: number) {
    this.router.navigate(['/learning/phase', phaseNumber]);
  }

  startLearning() {
    window.alert('🎸 More lessons are coming soon..!');
  }
}
