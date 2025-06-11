import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { APP_CONSTANTS } from './Constants';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  private baseUrl = `${APP_CONSTANTS.apiUrls.loadApiUrl}/RecipeComponent`;
  private componentUrl = `${APP_CONSTANTS.apiUrls.loadApiUrl}/Component`;


  constructor(private http: HttpClient) {}
  
  getAllComponents(): Observable<any[]> {
    return this.http.get<any[]>(this.componentUrl);
  }
}
