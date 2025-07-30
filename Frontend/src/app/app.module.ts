import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { BeginnerLessonsComponent } from './pages/beginner-lessons/beginner-lessons.component';
import { ChordLibraryComponent } from './pages/chord-library/chord-library.component';
import { BollywoodSongsComponent } from './pages/bollywood-songs/bollywood-songs.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SongDetailComponent } from './pages/bollywood-songs/song-detail/song-detail.component';
import { LearningPathComponent } from './pages/learning-path/learning-path.component';
import { PhaseDetailComponent } from './pages/learning-path/phase-detail/phase-detail.component';


import { UserDataComponent } from './user-data/user-data/user-data.component';
import { AiAgentComponent } from './components/ai-agent/ai-agent.component';

import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BeginnerLessonsComponent,
    ChordLibraryComponent,
    BollywoodSongsComponent,
    SongDetailComponent,
    ContactComponent,
    LearningPathComponent,
    PhaseDetailComponent,
    
    UserDataComponent,
    AiAgentComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,              // ✅ Required for [(ngModel)]
    ReactiveFormsModule,      // ✅ Required for [formGroup]
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
