import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Song } from "../../../shared/models/song.model";
import { BOLLYWOOD_SONGS } from '../../../shared/models/songs.data';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-song-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.css']
})
export class SongDetailComponent implements OnInit {
  song: Song | undefined;
  isScrolling = false;
  isCountingDown = false;
  countdown = 10;
  private scrollInterval: any;
  private countdownInterval: any;
  similarSongs: Song[] = []; // NEW: Property to store similar songs

  @ViewChild('lyricsContainer') lyricsContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSong();
    this.route.params.subscribe(params => {
      this.loadSong();
    });
  }

  private loadSong(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.song = BOLLYWOOD_SONGS.find((s: Song) => s.id === id);
    this.stopAutoScroll();
    // NEW: Populate similarSongs when the main song loads
    if (this.song) {
      this.similarSongs = this.generateSimilarSongs(this.song);
    }
  }

  navigateToSong(songId: string): void {
    this.router.navigate(['/bollywood-songs', songId]);
  }

  getDifficultyColor(difficulty: string = ''): string {
    switch(difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }

  getChordsArray(chords: string = ''): string[] {
    return chords.split(',').map(c => c.trim()).filter(c => c);
  }

  // MODIFIED: Renamed to avoid direct call from template and ensure it's called once
  private generateSimilarSongs(currentSong: Song): Song[] {
    if (!currentSong) return [];

    let similarSongsCandidates: Song[] = [];
    const otherSongs = BOLLYWOOD_SONGS.filter(s => s.id !== currentSong.id);

    // 1. Prioritize songs from the same movie or artist
    const byMovieOrArtist = otherSongs.filter(s =>
      (currentSong.movie && s.movie === currentSong.movie) ||
      (currentSong.artist && s.artist === currentSong.artist)
    );

    byMovieOrArtist.forEach(s => {
      if (!similarSongsCandidates.find(existS => existS.id === s.id)) {
        similarSongsCandidates.push(s);
      }
    });

    // 2. If less than 3, fill with other random songs
    if (similarSongsCandidates.length < 3) {
      const remainingSongs = otherSongs.filter(s => !similarSongsCandidates.find(existS => existS.id === s.id));
      const shuffledRemaining = remainingSongs.sort(() => 0.5 - Math.random()); // Shuffle to pick randomly
      
      const needed = 3 - similarSongsCandidates.length;
      similarSongsCandidates = [...similarSongsCandidates, ...shuffledRemaining.slice(0, needed)];
    }

    // Ensure we return at least 3, and no more than 5 (or however many are available if less than 5 but >= 3)
    return similarSongsCandidates.slice(0, Math.max(3, Math.min(similarSongsCandidates.length, 5)));
  }

  toggleAutoScroll(): void {
    if (this.isScrolling) {
      this.stopAutoScroll();
    } else {
      this.beginCountdownToScroll();
    }
  }

  private beginCountdownToScroll(): void {
    this.isCountingDown = true;
    this.countdown = 10;

    this.countdownInterval = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown === 0) {
        clearInterval(this.countdownInterval);
        this.isCountingDown = false;
        this.startAutoScroll();
      }
    }, 1000);
  }

  private startAutoScroll(): void {
    const container = this.lyricsContainer?.nativeElement;
    if (!container) return;

    this.isScrolling = true;
    this.scrollInterval = setInterval(() => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight) {
        this.stopAutoScroll();
      } else {
        container.scrollTop += 1;
      }
    }, 60);
  }

  private stopAutoScroll(): void {
    this.isScrolling = false;
    clearInterval(this.scrollInterval);
    clearInterval(this.countdownInterval);
    this.scrollInterval = null;
    this.countdownInterval = null;
    this.isCountingDown = false;
    this.countdown = 10;
  }

  printLyrics(): void {
    if (this.song) {
      const printWindow = window.open('', '_blank', 'height=600,width=800');
      if (printWindow) {
        let lyricsContent = this.lyricsContainer ? this.lyricsContainer.nativeElement.innerText : this.song.lyrics;

        const htmlContent = `
          <html>
            <head>
              <title>${this.song.title} - Lyrics</title>
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 30px; color: #2c3e50; line-height: 1.6; }
                h1 { color: #6a05ad; font-size: 38px; margin-bottom: 15px; text-align: center; font-weight: 700; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; }
                h2 { color: #8e44ad; font-size: 26px; margin-top: 35px; margin-bottom: 12px; border-bottom: 1px solid #dcdcdc; padding-bottom: 8px; font-weight: 600; }
                p { margin-bottom: 10px; font-size: 16px; }
                strong { color: #4a235a; font-weight: 600; }
                pre { white-space: pre-wrap; word-wrap: break-word; font-family: 'Fira Code', 'Lucida Console', monospace; font-size: 15px; line-height: 1.7; background-color: #fcfcfc; padding: 20px; border-radius: 10px; border: 1px solid #e7e7e7; color: #333; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                .chords-list { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 10px; }
                .chord-item { display: inline-block; background-color: #e6e6fa; color: #4b0082; padding: 8px 15px; border-radius: 25px; font-weight: bold; font-size: 14px; border: 1px solid #c8a2c8; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.2s ease-in-out; }
                .chord-item:hover { background-color: #d8bfd8; }
                .info-item { margin-bottom: 8px; font-size: 16px; }
                .section-header { margin-top: 20px; margin-bottom: 15px; font-size: 32px; color: #6a05ad; }
                @page { size: A4 portrait; margin: 2.5cm; }
                @media print { body { font-size: 11pt; } h1 { font-size: 28pt; padding-bottom: 8px; } h2 { font-size: 20pt; margin-top: 25px; padding-bottom: 6px; } pre { font-size: 9.5pt; padding: 15px; } p, .info-item, .chord-item { font-size: 10pt; } }
              </style>
            </head>
            <body>
              <h1 class="section-header">${this.song.title}</h1>
              <p class="info-item"><strong>Movie:</strong> ${this.song.movie || 'N/A'}</p>
              ${this.song.artist ? `<p class="info-item"><strong>Artist:</strong> ${this.song.artist}</p>` : ''}
              ${this.song.year ? `<p class="info-item"><strong>Year:</strong> ${this.song.year}</p>` : ''}
              ${this.song.key ? `<p class="info-item"><strong>Key:</strong> ${this.song.key}</p>` : ''}
              ${this.song.tempo ? `<p class="info-item"><strong>Tempo:</strong> ${this.song.tempo}</p>` : ''}
              ${this.song.capo ? `<p class="info-item"><strong>Capo:</strong> ${this.song.capo}</p>` : ''}
              ${this.song.strumming ? `<p class="info-item"><strong>Strumming Pattern:</strong> <code>${this.song.strumming}</code></p>` : ''}
              ${this.song.difficulty ? `<p class="info-item"><strong>Difficulty:</strong> ${this.song.difficulty}</p>` : ''}
              ${this.song.tips ? `<p class="info-item"><strong>Pro Tip:</strong> <em>${this.song.tips}</em></p>` : ''}
              ${this.song.duration ? `<p class="info-item"><strong>Duration:</strong> ${this.song.duration}</p>` : ''}

              <h2>Chords Used:</h2>
              <div class="chords-list">
                ${this.getChordsArray(this.song.chords).map(chord => `<span class="chord-item">${chord}</span>`).join('')}
              </div>

              <h2>Lyrics with Chords:</h2>
              <pre>${lyricsContent}</pre>
            </body>
          </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      } else {
        alert('Could not open print window. Please allow pop-ups for this site.');
      }
    }
  }

  playSongOnYoutube(): void {
    if (this.song && this.song.youtubeId) {
      // FIX: Correctly embed the youtubeId into the URL using template literals
      const youtubeEmbedUrl = `http://www.youtube.com/embed/${this.song.youtubeId}?autoplay=1`;
      const windowFeatures = 'width=800,height=500,resizable=yes,scrollbars=yes,status=yes';

      const newWindow = window.open(youtubeEmbedUrl, '_blank', windowFeatures);

      // Check if the popup was blocked by the browser
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        alert('Popup blocked! Please allow pop-ups for this site to play the video.');
      }
    } else {
      alert('YouTube video not available for this song. (Missing YouTube ID in data)');
    }
  }

  safeGet(property: keyof Song, defaultValue: any = ''): any {
    return this.song ? this.song[property] || defaultValue : defaultValue;
  }
}