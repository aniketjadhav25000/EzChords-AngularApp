import { Component, HostListener, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-beginner-lessons',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './beginner-lessons.component.html',
  styleUrls: ['./beginner-lessons.component.css']
})
export class BeginnerLessonsComponent implements OnDestroy {
  constructor(
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.loadPracticeStreak();
  }

  lessons = [
    { id: 1, title: 'Guitar Setup & Posture', description: 'Learn how to properly hold your guitar and position your hands for optimal playing.', videoId: 'dUpjh7CcY_0', icon: '🪑', duration: '8 min' },
    { id: 2, title: 'Basic Open Chords', description: 'Master the essential chords every beginner needs to know: C, G, D, E, and A.', videoId: '66eNG7dS80Y', icon: '🎼', duration: '12 min' },
    { id: 3, title: 'Strumming Patterns', description: 'Develop rhythm with these fundamental strumming techniques for beginners.', videoId: 'okgzdPklcvE', icon: '🥁', duration: '10 min' },
    { id: 4, title: 'Finger Exercises', description: 'Build strength and dexterity with these simple but effective exercises.', videoId: 'yoRg2fHQyLM', icon: '✋', duration: '15 min' },
    { id: 5, title: 'Chord Transitions', description: 'Learn how to smoothly switch between chords without losing rhythm.', videoId: '5B4LURZ-BNw', icon: '🔄', duration: '14 min' },
    { id: 6, title: 'First Simple Song', description: 'Apply what you\'ve learned by playing your first complete song!', videoId: 'QTN3pGWWU0Y', icon: '🎶', duration: '18 min' }
  ];

  commonChords = ['C', 'G', 'D', 'Em', 'Am', 'F', 'A', 'E', 'Dm', 'B7'];
  currentPracticeStreak = 3;
  metronomeTempo = 80;
  metronomeActive = false;
  metronomeInterval: any;
  audioContext: AudioContext | null = null;

  showModal = false;
  currentVideoId: string = '';
  rawVideoUrl: string = '';
  sanitizedVideoUrl!: SafeResourceUrl;

  showAssistant = false;
  userQuery = '';
  aiResponse = '';

  ngOnDestroy() {
    this.stopMetronome();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  openVideo(videoId: string) {
    this.currentVideoId = videoId;
    this.rawVideoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    this.showModal = true;
  }

  closeVideo() {
    this.showModal = false;
    this.currentVideoId = '';
  }

  openInNewTab() {
    if (this.rawVideoUrl) {
      window.open(this.rawVideoUrl, '_blank');
    }
  }

  toggleProgress(id: number) {
    const stored = JSON.parse(localStorage.getItem('lessonProgress') || '{}');
    stored[id] = !stored[id];
    localStorage.setItem('lessonProgress', JSON.stringify(stored));
    if (stored[id]) this.updatePracticeStreak();
  }

  isCompleted(id: number): boolean {
    const stored = JSON.parse(localStorage.getItem('lessonProgress') || '{}');
    return !!stored[id];
  }

  getCompletionPercentage(): number {
    const stored = JSON.parse(localStorage.getItem('lessonProgress') || '{}');
    const completed = Object.values(stored).filter((v: any) => v).length;
    return Math.round((completed / this.lessons.length) * 100);
  }

  getCurrentLessonTitle(): string {
    const lesson = this.lessons.find(l => l.videoId === this.currentVideoId);
    return lesson ? lesson.title : '';
  }

  getCurrentLessonDescription(): string {
    const lesson = this.lessons.find(l => l.videoId === this.currentVideoId);
    return lesson ? lesson.description : '';
  }

  toggleAIAssistant() {
    this.showAssistant = !this.showAssistant;
    if (this.showAssistant) this.aiResponse = '';
  }

  sendAIQuery() {
    if (!this.userQuery.trim()) return;
    const responses = [
      "For better chord transitions, practice moving between two chords slowly at first. Try G to C - focus on getting all fingers in place before strumming.",
      "A good beginner song is 'Horse With No Name' by America - it uses just two chords (Em and D6/9)!",
      "If your fingers hurt, that's normal at first. Take short breaks and gradually increase practice time. The pain will go away as you develop calluses.",
      "For clearer chords, make sure each finger is right behind the fret and not touching adjacent strings.",
      "Try practicing 10-15 minutes daily rather than long sessions once a week. Consistency is key!"
    ];
    this.aiResponse = "🎸 " + responses[Math.floor(Math.random() * responses.length)];
    this.userQuery = '';
  }

  loadPracticeStreak() {
    const lastPracticeDate = localStorage.getItem('lastPracticeDate');
    if (lastPracticeDate) {
      const today = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastPracticeDate === today) return;
      this.currentPracticeStreak = (lastPracticeDate === yesterday.toDateString())
        ? (parseInt(localStorage.getItem('practiceStreak') || '0', 10) + 1)
        : 1;
    }
  }

  updatePracticeStreak() {
    const today = new Date().toDateString();
    const lastPracticeDate = localStorage.getItem('lastPracticeDate');
    if (lastPracticeDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      this.currentPracticeStreak = (lastPracticeDate === yesterday.toDateString())
        ? this.currentPracticeStreak + 1
        : 1;
      localStorage.setItem('lastPracticeDate', today);
      localStorage.setItem('practiceStreak', this.currentPracticeStreak.toString());
    }
  }

  toggleMetronome() {
    this.metronomeActive ? this.stopMetronome() : this.startMetronome();
  }

  startMetronome() {
    this.metronomeActive = true;
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const interval = 60000 / this.metronomeTempo;
    this.metronomeInterval = setInterval(() => {
      this.playMetronomeSound();
    }, interval);
  }

  stopMetronome() {
    this.metronomeActive = false;
    if (this.metronomeInterval) clearInterval(this.metronomeInterval);
  }

  playMetronomeSound() {
    if (!this.audioContext) return;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.5;
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  increaseTempo() {
    if (this.metronomeTempo < 200) {
      this.metronomeTempo += 5;
      if (this.metronomeActive) {
        this.stopMetronome();
        this.startMetronome();
      }
    }
  }

  decreaseTempo() {
    if (this.metronomeTempo > 40) {
      this.metronomeTempo -= 5;
      if (this.metronomeActive) {
        this.stopMetronome();
        this.startMetronome();
      }
    }
  }

  handleLearning() {
    this.router.navigate(['/learning-path']);
  }

  handleChord() {
    this.router.navigate(['/chord-library']);
  }

  goToLearningPath() {
    this.router.navigate(['/learning-path']);
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    if (this.showModal) this.closeVideo();
    if (this.showAssistant) this.toggleAIAssistant();
  }
}
