import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AddPRoject, Project, UpdateProject } from '../models/project.model';  

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = 'https://localhost:7030/api/Projects';
  private loadApiUrl='https://localhost:7030/api';
  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/GetAllProjects`);
  }
  AddProject(project:AddPRoject):Observable<AddPRoject>{
    return this.http.post<AddPRoject>(`${this.apiUrl}/AddProject`,project)
    
  }
  deleteProject(projectId: number,deletedBy:number): Observable<any> {
    const url = `${this.apiUrl}/DeleteProject?id=${projectId}&deletedBy=${deletedBy}`;
    return this.http.delete(url);
}
updateProject(id: number, project: UpdateProject): Observable<any> {
  return this.http.put(`${this.apiUrl}/UpdateProject?id=${id}`, project);
}

getProjectTypes() {
  return this.http.get<any[]>(`${this.loadApiUrl}/ProjectType/GetAllProjectTypes`);
}

getAreas() {
  return this.http.get<any[]>(`${this.loadApiUrl}/Areas/GetAllAreas`);
}
getPriorities() {
  return this.http.get<any[]>(`${this.loadApiUrl}/Priorities/GetAllPriorities`);
}

getStatus() {
  return this.http.get<any[]>(`${this.loadApiUrl}/Status/GetAllStatus`);
}

exportData(): void {
  this.http.get(`${this.loadApiUrl}/Projects/Expoted file`, { responseType: 'blob' })
    .subscribe((response: Blob) => {
      const a = document.createElement('a');
      const file = new Blob([response], { type: 'application/csv' });
      a.href = URL.createObjectURL(file);
      a.download = 'projects.csv';
      a.click();
    });
  }
  getLatestProjectCode(): Observable<string> {
    return this.http.get(`${this.loadApiUrl}/Projects/GetLastProjectNumber`,{ responseType: 'text' });
  }

refreshProjects$ = new Subject<void>();

triggerRefresh() {
  this.refreshProjects$.next();
}
}
