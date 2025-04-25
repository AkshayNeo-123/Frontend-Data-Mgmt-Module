// // src/app/services/auth.service.ts

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   getLoggedInUser() {
//     throw new Error('Method not implemented.');
//   }
//   private apiUrl = 'https://localhost:7030/api/Account';

//   constructor(private http: HttpClient) {}

//   login(userName: string, password: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, { userName, password }, { responseType: 'text' });
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoggedInUser {
  name: string;
  email?: string;
  // add other fields as needed
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7030/api/Account';

  constructor(private http: HttpClient) {}

  login(userName: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { userName, password }, { responseType: 'text' });
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
