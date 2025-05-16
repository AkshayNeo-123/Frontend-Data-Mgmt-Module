import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoggedInUser {
  name: string;
  email?: string;
  userid: number;
  rolePermissions: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7030/api/Account';
  // https://localhost:7030/api/Account/login

  constructor(private http: HttpClient) {}

  // 🔥 Correct login function
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  setLoggedInUser(user: LoggedInUser): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getLoggedInUser(): LoggedInUser | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  performLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
