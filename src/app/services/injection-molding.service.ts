import { Injectable } from '@angular/core';
import {
  AddInjectionMoulding,
  UpdateInjectionMoulding,
} from '../models/injection-molding';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InjectionMoldingService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'https://localhost:7030/api';
  AddInjection(
    injection: AddInjectionMoulding
  ): Observable<AddInjectionMoulding> {
    return this.http.post<AddInjectionMoulding>(
      `${this.apiUrl}/InjectionModling`,
      injection
    );
  }

  getparemeterSet(): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/InjectionModling/GetLastParameterSet`
    );
  }

  UpdateInjection(
    id: number,
    injection: UpdateInjectionMoulding
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/InjectionModling/update?id=${id}`,
      injection
    );
  }

  GetByIdInjection(id: number): Observable<UpdateInjectionMoulding> {
    return this.http.get<UpdateInjectionMoulding>(
      `${this.apiUrl}/InjectionModling/GetById?id=${id}`
    );
  }

  GetInjectionByRecipeId(
    recipeId: number,
    searchDate?: string
  ): Observable<any> {
    const url = `${this.apiUrl}/InjectionModling/GetByRecipeId/${recipeId}`;
    let params = new HttpParams();

    if (searchDate) {
      params = params.set('searchDate', searchDate);
    }

    return this.http.get<any>(url, { params });
  }
  deleteinjection(injectionID: number, deletedBy: number): Observable<string> {
    const url = `${this.apiUrl}/InjectionModling?moldingId=${injectionID}&deletedBy=${deletedBy}`;
    return this.http.delete(url, { responseType: 'text' });
  }
}
