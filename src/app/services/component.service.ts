import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  private baseUrl = 'https://localhost:7030/api/RecipeComponent';

  constructor(private http: HttpClient) {}

  getAllComponents(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      catchError(err => {
        console.error('Error fetching components:', err);
        return of([]);
      })
    );
  }
}
