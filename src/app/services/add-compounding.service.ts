import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddCompoundingRequest } from './../models/compounding.model'; 

@Injectable({
  providedIn: 'root'
})
export class AddCompoundingService {
  private addCompounding = 'https://localhost:7030/api/CompoundingData';

  constructor(private http: HttpClient) {}

  addCompoundingData(compounding: AddCompoundingRequest): Observable<any> {  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.addCompounding, compounding, { headers });
  }

  getCompoundingDataById(): Observable<any> {
  const id = 10; // hardcoded ID
  const url = `${this.addCompounding}/GetDataByCompoundingId?id=${id}`;
  return this.http.get<any>(url);
}

 updateCompoundingData(compounding: any): Observable<any> {
  const id = 10; // hardcoded ID
  const url = `${this.addCompounding}?CompoundingId=${id}`;
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.put<any>(url, compounding, { headers });
}


}
