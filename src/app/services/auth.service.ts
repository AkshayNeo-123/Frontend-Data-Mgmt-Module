import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONSTANTS } from './Constants';

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
  private apiUrl = `${APP_CONSTANTS.apiUrls.loadApiUrl}/Account`;
  private passwordApiUrl = `${APP_CONSTANTS.apiUrls.loadApiUrl}/Password`;
  // https://localhost:7030/api/Account/login

  constructor(private http: HttpClient) { }

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
  isLoggedIn(): boolean {
    return !!localStorage.getItem('UserId');  // Or your actual auth check
  }

  sendOtp(email: string): Observable<any> {
    console.log("auth service method called");
    return this.http.post(`${this.passwordApiUrl}/send-otp`, { email });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.passwordApiUrl}/verify-otp`, { email, otp });
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.passwordApiUrl}/reset-password`, { email, newPassword });
  }
}
