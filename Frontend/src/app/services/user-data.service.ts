import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private api = 'http://localhost:5000/api/data';

  constructor(private http: HttpClient) {}

  getUserData() {
    return this.http.get(this.api);
  }

  saveUserData(data: any) {
    return this.http.post(this.api, data);
  }
}
