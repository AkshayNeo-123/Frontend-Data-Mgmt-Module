import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MainPolymer } from '../models/contacts';

@Injectable({
  providedIn: 'root'
})
export class MainpolymerserviceService {

  private baseUrl="https://localhost:7030/api/MainPolymer";
  constructor(private http:HttpClient) { }
     
  getAllPolymers():Observable<MainPolymer[]>{
  return this.http.get<MainPolymer[]>(this.baseUrl)
  }

  addMainPolymers(mainPolymer:MainPolymer):Observable<MainPolymer>{
    return this.http.post<MainPolymer>(`${this.baseUrl}`,mainPolymer);
  }

  updateMainPolymer(id:number,contact: MainPolymer):Observable<MainPolymer> {
    return this.http.put<MainPolymer>(`${this.baseUrl}/${id}`, contact);
  }

  deletePolymer(id: number): Observable<any> {
    return this.http.delete<MainPolymer>(`${this.baseUrl}/${id}`);
  }
}
