// src/app/services/recipe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = 'https://localhost:7030/api/Recipe';

  constructor(private http: HttpClient) {}

 
  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/GetAll`).pipe(
      catchError(error => {
        console.error('Error fetching recipes:', error);
        return of([]);
      })
    );
  }
}
