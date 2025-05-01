import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AddPRoject, Project, UpdateProject } from '../models/project.model';  

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = 'https://localhost:7030/api/Projects';
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
updateProject(id: number, project: UpdateProject): Observable<any> {
  return this.http.put(`https://localhost:7030/api/Projects/UpdateProject?id=${id}`, project);
}

getProjectTypes() {
  return this.http.get<any[]>('https://localhost:7030/api/ProjectType/GetAllProjectTypes');
}

getAreas() {
  return this.http.get<any[]>('https://localhost:7030/api/Areas/GetAllAreas');
}

refreshProjects$ = new Subject<void>();

triggerRefresh() {
  this.refreshProjects$.next();
}
}
