import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private api = 'http://localhost:5000/api/data';

  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get<{ content: string }>(this.api);
  }

  saveData(content: string) {
    return this.http.post(this.api, { content });
  }
}
