// src/app/services/recipe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { CommonTest, Recipe, RecipeAndProject } from '../models/recipe.model';
import { APP_CONSTANTS } from './Constants';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  // private baseUrl = 'https://localhost:7030/api/Recipe';
  private baseUrl = `${APP_CONSTANTS.apiUrls.recipeUrl}`;

  constructor(private http: HttpClient) {}

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/GetAll`).pipe(
      catchError(error => {
        console.error('Error fetching recipes:', error);
        return of([]);
      })
    );
  }
  getRecipeById(id: number): Observable<Recipe> {
  return this.http.get<Recipe>(`${this.baseUrl}/GetById?recipeId=${id}`);
}

 

  addRecipe(newRecipe: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddRecipe`, newRecipe);
  }




      deleteRecipes(id:number,deletedBy:number):Observable<any>{
        return this.http.delete<Recipe>(`${this.baseUrl}/deleteRecipesData?id=${id}&deletedBy=${deletedBy}`)
      }

  getRecipeAndProject(search: string = '',
     
  tensileModulusMax?: number,
  tensileModulusMin?: number,
 
  charpyImpactMax?: number,
   charpyImpactMin?: number,
 
  stressAtYieldMax?: number,
   stressAtYieldMin?: number,
  ): Observable<RecipeAndProject[]> {
    let params = new HttpParams().set('search', search);
    if(tensileModulusMax!=null)params=params.set('tensileModulusMax',tensileModulusMax);
    if(tensileModulusMin!=null)params=params.set('tensileModulusMin',tensileModulusMin);
    
  if (charpyImpactMax != null) params = params.set('charpyImpactMax', charpyImpactMax);
    if (charpyImpactMin != null) params = params.set('charpyImpactMin', charpyImpactMin);

  if (stressAtYieldMax != null) params = params.set('stressAtYieldMax', stressAtYieldMax);
    if (stressAtYieldMin != null) params = params.set('stressAtYieldMin', stressAtYieldMin);


    return this.http.get<RecipeAndProject[]>(`${this.baseUrl}/GetRecipeAndProject`, { params });
  }


  


  getRecipeAndProjectById(id:number):Observable<RecipeAndProject>{
    return  this.http.get<RecipeAndProject>(`${this.baseUrl}/GetRecipeAndProjectById?id=${id}`);
  }


  getTestPropertiesByRecipe(id:number):Observable<CommonTest>{
    return this.http.get<CommonTest>(`${this.baseUrl}/GetTestPropertiesByRecipe?id=${id}`)
  }


updateRecipe(id: number, updatePayload: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/UpdateRecipeandComponent/${id}`, updatePayload);
}

}

  
