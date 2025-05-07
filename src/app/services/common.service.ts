// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class CommonService {
//   private apiUrl = 'https://localhost:7030/api'; 
//  private GetManufacture='https://localhost:7030/api/Contact/GetAllManufacturer';
// private GetSupplier="https://localhost:7030/api/Contact/GetAllSupplier";
//   constructor(private http: HttpClient) {}


//   getAdditives(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/Additive`);
//   }

//   getMainPolymers(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/MainPolymer`);
//   }

//  getManufacture(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.GetManufacture}`);
//   }

//   getSupplier(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.GetSupplier}`);
//   }

// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecipeComponentType } from '../models/recipe-component-type.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private apiUrl = 'https://localhost:7030/api'; 

  constructor(private http: HttpClient) {}

  getAdditives(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Additive`);
  }

  getMainPolymers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/MainPolymer`);
  }

  getManufacture(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Contact/GetAllManufacturer`);
  }

  getSupplier(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Contact/GetAllSupplier`);
  }

  getRecipeComponentTypes(): Observable<RecipeComponentType[]> {
    return this.http.get<RecipeComponentType[]>(`${this.apiUrl}/RecipeComponentType`);
  }
}
