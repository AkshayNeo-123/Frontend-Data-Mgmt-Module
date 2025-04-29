import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddPRoject, Project } from '../models/project.model';  

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = 'https://localhost:7030/api/Projects';
private addProject='https://localhost:7030/api/Projects/AddProject';
  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/GetAllProjects`);
  }
  AddProject(project:AddPRoject):Observable<AddPRoject>{
    return this.http.post<AddPRoject>('https://localhost:7030/api/Projects/AddProject',project)
    
  }
  deleteProject(projectId: number): Observable<any> {
    const url = `https://localhost:7030/api/Projects/DeleteProject?id=${projectId}`;
    return this.http.delete(url);
}
}
