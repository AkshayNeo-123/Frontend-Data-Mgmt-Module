import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://localhost:7030/api/User'; //backend API

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl);
  }

  deleteUser(id: number,deletedBy:number){
    return this.http.delete(`https://localhost:7030/api/User/${id}?deletedBy=${deletedBy}`);
  }

  addUser(user: any): Observable<any> {
    return this.http.post(this.baseUrl, user);
  }

  updateUser(id: number, updatedUser: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, updatedUser);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getRoles() {
    return this.http.get<any[]>('https://localhost:7030/api/Role');
  }

}
