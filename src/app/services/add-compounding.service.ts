import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddCompoundingRequest } from './../models/compounding.model'; 
import { APP_CONSTANTS } from './Constants';

@Injectable({
  providedIn: 'root'
})
export class AddCompoundingService {
  private addCompounding = `${APP_CONSTANTS.apiUrls.loadApiUrl}/CompoundingData`;

  constructor(private http: HttpClient) {}

  addCompoundingData(compounding: AddCompoundingRequest): Observable<any> {  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.addCompounding, compounding, { headers });
  }


getCompoundingDataById(id: number): Observable<any> {
  return this.http.get<any>(`${this.addCompounding}/GetDataByCompoundingId`, {
    params: { id: id.toString() }
  });
}


updateCompoundingData(id: number, compounding: any): Observable<any> {
  const url = `${this.addCompounding}?CompoundingId=${id}`;
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.put<any>(url, compounding, { headers });
}


getCompoundingDataByRecipeId(recipeId: number, searchDate?: string): Observable<any> {
  const url = `${this.addCompounding}/get-by-recipe-id/${recipeId}`;
  let params = new HttpParams();

  if (searchDate) {
    params = params.set('searchDate', searchDate);
  }

  return this.http.get<any>(url, { params });
}



deleteCompoundingData(compoundingId: number, deletedBy: number): Observable<any> {
  return this.http.delete(`${APP_CONSTANTS.apiUrls.loadApiUrl}/CompoundingData?CompoundingId=${compoundingId}&DeletedBy=${deletedBy}`);
}

getLastCommonSet(): Observable<any> {
  return this.http.get<any>(`${this.addCompounding}/GetCommonSet`);
}

}
