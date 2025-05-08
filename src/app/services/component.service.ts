import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  private baseUrl = 'https://localhost:7030/api/RecipeComponent';
  private componentUrl = 'https://localhost:7030/api/Component';


  constructor(private http: HttpClient) {}
  
//   getAllRecipeComponents(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}`);
//   }

  getAllComponents(): Observable<any[]> {
    return this.http.get<any[]>(this.componentUrl);
  }
}
