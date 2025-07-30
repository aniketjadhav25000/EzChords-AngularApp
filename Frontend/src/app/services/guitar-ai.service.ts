import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GuitarAiService {
  constructor(private http: HttpClient) {}

  askQuestion(question: string) {
    return this.http.post<{ answer: string }>('http://localhost:8000/ask', { question });
  }
}
