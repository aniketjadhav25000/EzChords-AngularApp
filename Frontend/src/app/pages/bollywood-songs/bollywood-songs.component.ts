// bollywood-songs.component.ts
import { Component, OnInit } from '@angular/core';
import { BOLLYWOOD_SONGS } from '../../shared/models/songs.data';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Song } from '../../shared/models/song.model';

@Component({
  selector: 'app-bollywood-songs',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './bollywood-songs.component.html',
  styleUrls: ['./bollywood-songs.component.css']
})
export class BollywoodSongsComponent implements OnInit {
  songs: Song[] = BOLLYWOOD_SONGS;
  searchInput: string = '';
  filteredSongsList: Song[] = [];
  sortOrder: string = 'none';
  difficultyFilter: string = 'all';
  gridView: boolean = true;
  showComingSoonMessage: boolean = false; // New property for message visibility

  ngOnInit() {
    this.applyFilters();
  }

  applySearch() {
    this.applyFilters();
  }

  applyFilters() {
    const lowerQuery = this.searchInput.toLowerCase().trim();
    let tempSongs = this.songs.filter(song => {
      const matchesSearch = lowerQuery === '' ||
        (song.title?.toLowerCase() ?? '').includes(lowerQuery) ||
        (song.movie?.toLowerCase() ?? '').includes(lowerQuery) ||
        (song.chords?.toLowerCase() ?? '').includes(lowerQuery) ||
        (song.strumming?.toLowerCase() ?? '').includes(lowerQuery);

      const matchesDifficulty = this.difficultyFilter === 'all' ||
        (song.difficulty?.toLowerCase() === this.difficultyFilter.toLowerCase());

      return matchesSearch && matchesDifficulty;
    });

    this.filteredSongsList = tempSongs;
    this.sortSongs();
  }

  clearSearch() {
    this.searchInput = '';
    this.applyFilters();
  }

  clearDifficultyFilter() {
    this.difficultyFilter = 'all';
    this.applyFilters();
  }

  clearFilters() {
    this.searchInput = '';
    this.difficultyFilter = 'all';
    this.sortOrder = 'none';
    this.applyFilters();
  }

  sortSongs() {
    if (this.sortOrder === 'none') {
      return;
    }

    this.filteredSongsList.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      switch (this.sortOrder) {
        case 'titleAsc':
          valA = (a.title ?? '').toLowerCase();
          valB = (b.title ?? '').toLowerCase();
          return valA.localeCompare(valB);
        case 'titleDesc':
          valA = (a.title ?? '').toLowerCase();
          valB = (b.title ?? '').toLowerCase();
          return valB.localeCompare(valA);
        case 'movieAsc':
          valA = (a.movie ?? '').toLowerCase();
          valB = (b.movie ?? '').toLowerCase();
          return valA.localeCompare(valB);
        case 'movieDesc':
          valA = (a.movie ?? '').toLowerCase();
          valB = (b.movie ?? '').toLowerCase();
          return valB.localeCompare(valA);
        case 'difficultyAsc':
          valA = this.getDifficultyValue(a.difficulty);
          valB = this.getDifficultyValue(b.difficulty);
          return valA - valB;
        case 'difficultyDesc':
          valA = this.getDifficultyValue(a.difficulty);
          valB = this.getDifficultyValue(b.difficulty);
          return valB - valA;
        default:
          return 0;
      }
    });
  }

  getDifficultyValue(difficulty?: string): number {
    switch(difficulty?.toLowerCase()) {
      case 'beginner': return 1;
      case 'intermediate': return 2;
      case 'advanced': return 3;
      default: return 0;
    }
  }

  getDifficultyBadgeClass(difficulty?: string): string {
    switch(difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  toggleViewMode() {
    this.gridView = !this.gridView;
  }

  onNavbarSearch(query: string) {
    this.searchInput = query;
    this.applyFilters();
  }

  displayComingSoonMessage() { // New method to show message
    this.showComingSoonMessage = true;
    setTimeout(() => {
      this.showComingSoonMessage = false;
    }, 3000); // Message will disappear after 3 seconds
  }
}