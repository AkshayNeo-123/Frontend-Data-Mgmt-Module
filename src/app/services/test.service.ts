import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private baseUrl = 'https://localhost:7030/api/Test';

  constructor(private http: HttpClient) { }

  getAllTest(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/GetAllTestData`);
    }
// ?testId=

deleteTest(testid:number,deletedBY:number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}?testId=${testid}&deletedBy=${deletedBY}`);
  }



}
