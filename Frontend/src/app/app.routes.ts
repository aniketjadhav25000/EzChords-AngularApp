import { Routes } from '@angular/router';

// Page Components
import { HomeComponent } from './pages/home/home.component';
import { BeginnerLessonsComponent } from './pages/beginner-lessons/beginner-lessons.component';
import { ChordLibraryComponent } from './pages/chord-library/chord-library.component';
import { BollywoodSongsComponent } from './pages/bollywood-songs/bollywood-songs.component';
import { SongDetailComponent } from './pages/bollywood-songs/song-detail/song-detail.component';
import { LearningPathComponent } from './pages/learning-path/learning-path.component';
import { PhaseDetailComponent } from './pages/learning-path/phase-detail/phase-detail.component';
import { ContactComponent } from './pages/contact/contact.component';
import { UserDataComponent } from './user-data/user-data/user-data.component';

// Auth Components


export const routes: Routes = [
  // Public Routes
  { path: '', component: HomeComponent },
 // changed "register" to "signup" for consistency
  { path: 'contact', component: ContactComponent },

  // Learning Path
  { path: 'beginner-lessons', component: BeginnerLessonsComponent },
  { path: 'chord-library', component: ChordLibraryComponent },
  { path: 'bollywood-songs', component: BollywoodSongsComponent },
  { path: 'bollywood-songs/:id', component: SongDetailComponent },
  { path: 'learning-path', component: LearningPathComponent },
  { path: 'learning/phase/:id', component: PhaseDetailComponent },

  // User Data Page
  { path: 'data', component: UserDataComponent },

  // Wildcard
  { path: '**', redirectTo: '' }
];
