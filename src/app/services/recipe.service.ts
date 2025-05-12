// src/app/services/recipe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Recipe, RecipeAndProject } from '../models/recipe.model';

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

  addRecipe(newRecipe: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Add`, newRecipe).pipe(
      catchError(error => {
        console.error('Error adding recipe:', error);
        return of(null);
      })
    );
  }

  getRecipeAndProject(search: string = ''): Observable<RecipeAndProject[]> {
    const params = new HttpParams().set('search', search);
  
    return this.http.get<RecipeAndProject[]>(`${this.baseUrl}/GetRecipeAndProject`, { params });
  }


  getRecipeAndProjectById(id:number):Observable<RecipeAndProject>{
    return  this.http.get<RecipeAndProject>(`${this.baseUrl}/GetRecipeAndProjectById?id=${id}`);
  }
  
}
