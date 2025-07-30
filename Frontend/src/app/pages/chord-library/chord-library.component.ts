import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Chord {
  name: string;
  description: string;
  imagePath: string;
  audioPath: string;
  type: 'major' | 'minor' | 'other';
  difficulty: 'easy' | 'medium' | 'hard';
  isFavorite: boolean;
}

interface PracticeStats {
  totalFavorites: number;
  practiceTime: number;
  completedSessions: number;
  streak: number;
}

@Component({
  selector: 'app-chord-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chord-library.component.html',
  styleUrls: ['./chord-library.component.css'],
})
export class ChordLibraryComponent implements OnInit, OnDestroy {
  chords: Chord[] = [
    {
      name: 'A Major',
      description: 'Bright and classic. Used in rock, pop, and country.',
      imagePath: 'assets/chords/a-major.png',
      audioPath: 'assets/audio-chords/a-major.mp3',
      type: 'major',
      difficulty: 'easy',
      isFavorite: false
    },
    {
      name: 'A Minor',
      description: 'Sad and melancholic. Common in emotional ballads.',
      imagePath: 'assets/chords/a-minor.png',
      audioPath: 'assets/audio-chords/a-minor.mp3',
      type: 'minor',
      difficulty: 'easy',
      isFavorite: false
    },
    {
      name: 'C Major',
      description: 'Warm tone. Great for beginners and ballads.',
      imagePath: 'assets/chords/c-major.png',
      audioPath: 'assets/audio-chords/c-major.mp3',
      type: 'major',
      difficulty: 'easy',
      isFavorite: false
    },
    {
      name: 'D Major',
      description: 'Crisp and joyful. Common in folk and acoustic music.',
      imagePath: 'assets/chords/d-major.png',
      audioPath: 'assets/audio-chords/d-major.mp3',
      type: 'major',
      difficulty: 'easy',
      isFavorite: false
    },
    {
      name: 'E Minor',
      description: 'Moody and versatile. Great for intros and solos.',
      imagePath: 'assets/chords/e-minor.png',
      audioPath: 'assets/audio-chords/e-minor.mp3',
      type: 'minor',
      difficulty: 'easy',
      isFavorite: false
    },
    {
      name: 'G Major',
      description: 'Bright and open. Very popular in songwriting.',
      imagePath: 'assets/chords/g-major.png',
      audioPath: 'assets/audio-chords/g-major.mp3',
      type: 'major',
      difficulty: 'medium',
      isFavorite: false
    },
    {
      name: 'F Major',
      description: 'Challenging barre chord. Essential for progress.',
      imagePath: 'assets/chords/f-major.png',
      audioPath: 'assets/audio-chords/f-major.mp3',
      type: 'major',
      difficulty: 'hard',
      isFavorite: false
    },
    {
      name: 'B Minor',
      description: 'Expressive barre chord. Used in many rock songs.',
      imagePath: 'assets/chords/b-minor.png',
      audioPath: 'assets/audio-chords/b-minor.mp3',
      type: 'minor',
      difficulty: 'hard',
      isFavorite: false
    },
  ];

  // Existing properties
  progress: number[] = this.chords.map(() => 0);
  isPlaying: boolean[] = this.chords.map(() => false);
  volumes: number[] = this.chords.map(() => 70);
  isMuted: boolean[] = this.chords.map(() => false);
  activeFilter: string = 'all';
  searchQuery: string = '';
  imageLoadError = new Set<string>();
  audioLoadError = new Set<number>();
  showFavoriteToast = false;
  toastMessage = '';
  isToastError = false;

  // New enhanced features
  isPracticeMode = false;
  currentPracticeChord = 0;
  practiceInterval: any = null;
  showPracticeModeToast = false;
  practiceModeMessage = '';

  showProgressionBuilder = false;
  chordProgression: Chord[] = [];

  isMetronomeActive = false;
  metronomeInterval: any = null;
  bpm = 120;

  showStats = false;
  practiceStats: PracticeStats = {
    totalFavorites: 0,
    practiceTime: 0,
    completedSessions: 0,
    streak: 1
  };

  ngOnInit() {
    this.loadFavorites();
    this.loadPracticeStats();
  }

  ngOnDestroy() {
    if (this.practiceInterval) {
      clearInterval(this.practiceInterval);
    }
    if (this.metronomeInterval) {
      clearInterval(this.metronomeInterval);
    }
  }

  // Existing methods
  togglePlay(audio: HTMLAudioElement, index: number) {
    if (this.audioLoadError.has(index)) {
      this.showToast('Audio for this chord is not available', true);
      return;
    }
    
    if (audio.paused) {
      this.stopAllExcept(index);
      audio.volume = this.isMuted[index] ? 0 : this.volumes[index] / 100;
      audio.play().catch(() => {
        this.handleAudioError(index);
      });
      this.isPlaying[index] = true;
    } else {
      audio.pause();
      this.isPlaying[index] = false;
    }
  }

  stopAllExcept(currentIndex: number) {
    const audios = document.querySelectorAll('audio');
    audios.forEach((el, i) => {
      const audioEl = el as HTMLAudioElement;
      if (i !== currentIndex) {
        audioEl.pause();
        audioEl.currentTime = 0;
        this.isPlaying[i] = false;
        this.progress[i] = 0;
      }
    });
  }

  onTimeUpdate(audio: HTMLAudioElement, index: number) {
    if (audio.duration > 0) {
      const percentage = (audio.currentTime / audio.duration) * 100;
      this.progress[index] = Math.min(100, percentage);
    }

    if (audio.ended) {
      this.isPlaying[index] = false;
      this.progress[index] = 0;
    }
  }

  seekAudio(audio: HTMLAudioElement, index: number, event: MouseEvent) {
    if (this.audioLoadError.has(index) || !audio.duration) return;
    
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const percentage = (clickX / width) * 100;
    
    audio.currentTime = (percentage / 100) * audio.duration;
    this.progress[index] = percentage;
  }

  setVolume(audio: HTMLAudioElement, index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const volume = parseInt(target.value);
    this.volumes[index] = volume;
    audio.volume = volume / 100;
    
    if (volume > 0 && this.isMuted[index]) {
      this.isMuted[index] = false;
      audio.muted = false;
    }
  }

  toggleMute(audio: HTMLAudioElement, index: number) {
    this.isMuted[index] = !this.isMuted[index];
    audio.muted = this.isMuted[index];
    
    if (!this.isMuted[index]) {
      audio.volume = this.volumes[index] / 100;
    }
  }

  toggleFavorite(chord: Chord, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    chord.isFavorite = !chord.isFavorite;
    this.saveFavorites();
    
    const message = chord.isFavorite 
      ? `${chord.name} added to favorites` 
      : `${chord.name} removed from favorites`;
    this.showToast(message, false);
  }

  private saveFavorites() {
    const favorites = this.chords
      .map((chord, index) => chord.isFavorite ? index : null)
      .filter(index => index !== null);
    localStorage.setItem('chordFavorites', JSON.stringify(favorites));
    this.practiceStats.totalFavorites = favorites.length;
    this.savePracticeStats();
  }

  private loadFavorites() {
    const savedFavorites = localStorage.getItem('chordFavorites');
    if (savedFavorites) {
      const favoriteIndices: number[] = JSON.parse(savedFavorites);
      favoriteIndices.forEach(index => {
        if (index >= 0 && index < this.chords.length) {
          this.chords[index].isFavorite = true;
        }
      });
    }
  }

  showToast(message: string, isError: boolean) {
    this.toastMessage = message;
    this.isToastError = isError;
    this.showFavoriteToast = true;
    
    setTimeout(() => {
      this.showFavoriteToast = false;
    }, 3000);
  }

  handleImageError(event: Event, chordName: string) {
    this.imageLoadError.add(chordName);
  }

  handleAudioError(index: number) {
    this.audioLoadError.add(index);
    this.isPlaying[index] = false;
    this.progress[index] = 0;
  }

  get filteredChords() {
    let filtered = [...this.chords];
    
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(chord => 
        this.activeFilter === 'favorites' ? chord.isFavorite : chord.type === this.activeFilter
      );
    }
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(chord => 
        chord.name.toLowerCase().includes(query) || 
        chord.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }

  getDifficultyColor(difficulty: string): string {
    switch(difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  // New enhanced methods
  togglePracticeMode() {
    this.isPracticeMode = !this.isPracticeMode;
    
    if (this.isPracticeMode) {
      this.startPracticeSession();
    } else {
      this.stopPracticeSession();
    }
  }

  startPracticeSession() {
    const favoritedChords = this.chords.filter(chord => chord.isFavorite);
    if (favoritedChords.length === 0) {
      this.showToast('Add some chords to favorites first!', true);
      this.isPracticeMode = false;
      return;
    }

    this.currentPracticeChord = 0;
    this.showPracticeModeToast = true;
    this.practiceModeMessage = 'Practice mode started! Focus on highlighted chords.';
    
    setTimeout(() => {
      this.showPracticeModeToast = false;
    }, 3000);

    // Auto-advance through practice chords every 30 seconds
    this.practiceInterval = setInterval(() => {
      this.currentPracticeChord = (this.currentPracticeChord + 1) % favoritedChords.length;
    }, 30000);

    this.practiceStats.completedSessions++;
    this.savePracticeStats();
  }

  stopPracticeSession() {
    if (this.practiceInterval) {
      clearInterval(this.practiceInterval);
      this.practiceInterval = null;
    }
    this.currentPracticeChord = 0;
  }

  toggleProgressionBuilder() {
    this.showProgressionBuilder = !this.showProgressionBuilder;
    if (!this.showProgressionBuilder) {
      this.clearProgression();
    }
  }

  addToProgression(chord: Chord, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    
    if (this.chordProgression.length < 8) {
      this.chordProgression.push(chord);
      this.showToast(`${chord.name} added to progression`, false);
    } else {
      this.showToast('Maximum 8 chords in progression', true);
    }
  }

  removeFromProgression(index: number) {
    const removedChord = this.chordProgression.splice(index, 1)[0];
    this.showToast(`${removedChord.name} removed from progression`, false);
  }

  playProgression() {
    if (this.chordProgression.length === 0) return;
    
    let currentIndex = 0;
    const playNext = () => {
      if (currentIndex < this.chordProgression.length) {
        const chord = this.chordProgression[currentIndex];
        this.showToast(`Playing: ${chord.name}`, false);
        currentIndex++;
        setTimeout(playNext, 2000); // 2 seconds per chord
      }
    };
    
    playNext();
  }

  clearProgression() {
    this.chordProgression = [];
  }

  toggleMetronome() {
    this.isMetronomeActive = !this.isMetronomeActive;
    if (!this.isMetronomeActive) {
      this.stopMetronome();
    }
  }

   startMetronome() {
  if (this.metronomeInterval) return;

  const interval = 60000 / this.bpm;
  this.metronomeInterval = setInterval(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine'; // Soft tone
    oscillator.frequency.value = 1200; // Slightly higher pitch for clarity

    // 🔊 Louder tick sound
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime); // Increased from 0.1 to 0.4
    gainNode.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 0.08); // smoother decay

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.08); // slightly longer than 0.05
  }, interval);
}

    stopMetronome() {
      if (this.metronomeInterval) {
        clearInterval(this.metronomeInterval);
        this.metronomeInterval = null;
      }
    }

    increaseBPM() {
      if (this.bpm < 200) {
        this.bpm += 5;
        if (this.metronomeInterval) {
          this.stopMetronome();
          this.startMetronome();
        }
      }
    }

    decreaseBPM() {
      if (this.bpm > 40) { // ✅ allow down to 40 BPM now
        this.bpm -= 5;
        if (this.metronomeInterval) {
          this.stopMetronome();
          this.startMetronome();
        }
      }
    }


  // Stats methods
  getTotalFavorites(): number {
    return this.chords.filter(chord => chord.isFavorite).length;
  }

  getPracticeTime(): number {
    return this.practiceStats.practiceTime;
  }

  getCompletedSessions(): number {
    return this.practiceStats.completedSessions;
  }

  getStreak(): number {
    return this.practiceStats.streak;
  }

  private loadPracticeStats() {
    const saved = localStorage.getItem('practiceStats');
    if (saved) {
      this.practiceStats = JSON.parse(saved);
    }
  }

  private savePracticeStats() {
    localStorage.setItem('practiceStats', JSON.stringify(this.practiceStats));
  }
}
