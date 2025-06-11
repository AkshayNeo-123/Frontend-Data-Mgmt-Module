import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONSTANTS } from './Constants';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  getMenu(): Observable<any[]> {
    return this.http.get<any[]>(`${APP_CONSTANTS.apiUrls.loadApiUrl}/Menu`);
  }
  getMenuForSideBar(): Observable<any[]> {
    return this.http.get<any[]>(`${APP_CONSTANTS.apiUrls.loadApiUrl}/Menu/ForSideBar`);
  }
}
