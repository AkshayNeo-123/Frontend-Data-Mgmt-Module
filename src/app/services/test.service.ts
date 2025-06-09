import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExportTestDataDto } from '../models/test';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private baseUrl = 'https://localhost:7030/api/Test';

  constructor(private http: HttpClient) { }

  getAllTest(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/GetAllTestData`);
    }


deleteTest(testid:number,deletedBY:number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}?testId=${testid}&deletedBy=${deletedBY}`);
  }


 addTest(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/AddTest`, data);
  }


  getRecipeDataForTest(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/GetRecipeDataForTestList`);
    }

    getTestById(testId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/GetTestById/${testId}`);
}

    updateTest(testId: number, data: any): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/Update/${testId}`, data);
}


ExportData(): Observable<ExportTestDataDto[]> {
      return this.http.get<ExportTestDataDto[]>(`${this.baseUrl}/ExpoortTestData`);
    }

}
