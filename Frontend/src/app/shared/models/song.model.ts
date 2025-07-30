// src/app/shared/models/song.model.ts
export interface Song {
  id: string;
  title: string;
  movie?: string;
  imageUrl?: string;
  lyrics: string;
  year?: number;
  key?: string;
  tempo?: number;
  capo?: string;
  strumming?: string;
  difficulty?: string;
  chords: string;
  tips?: string;
  youtubeId?: string;
  artist?: string;
  duration?: string; // Add this line to include the duration property
}