<<<<<<< HEAD
=======

>>>>>>> c477ba636f07611a056c741a5ee16fc3d0db392e
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoggedInUser {
  name: string;
  email?: string;
<<<<<<< HEAD
  userid: number;
=======
 
>>>>>>> c477ba636f07611a056c741a5ee16fc3d0db392e
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7030/api/Account';

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
