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
}
