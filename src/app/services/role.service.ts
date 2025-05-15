import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = 'https://localhost:7030/api/Role'; 

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/roles`);
  }  

  getRoleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }


  addRole(role: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, role);
  }


  updateRole(id: number, updatedRole: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, updatedRole);
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  getAllMenus(): Observable<Menu[]> {
  return this.http.get<Menu[]>(`https://localhost:7030/api/Menu`);
  }

}
