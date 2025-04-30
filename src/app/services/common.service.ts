import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private apiUrl = 'https://localhost:7030/api'; 
 private GetManufacture='https://localhost:7030/api/Contact/GetAllManufacturer';

  constructor(private http: HttpClient) {}

  // Method to get additives from the API
  getAdditives(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Additive`);
  }

  getMainPolymers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/MainPolymer`);
  }

 getManufacture(): Observable<any[]> {
    return this.http.get<any[]>(`${this.GetManufacture}`);
  }

}
