import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  Additives } from '../models/contacts';

@Injectable({
  providedIn: 'root'
})
export class AdditiveservicesService {


  private baseUrl = 'https://localhost:7030/api/Additive'; 
  private additiveid?:number;
  constructor(private http:HttpClient) { }


  addAdditive(additive:Additives):Observable<Additives>{
    return this.http.post<Additives>(this.baseUrl,additive);
  }

  getAllAdditives():Observable<Additives[]>{
    console.log("This return id value")

    return this.http.get<Additives[]>(this.baseUrl);
    // console.log(this.getAllAdditives)
  }

  updateAdditives(id: number, additiveData: Additives): Observable<Additives> {
    return this.http.put<Additives>(`${this.baseUrl}/${id}`, additiveData);
  }
  
  getAdditivesById(id:number):Observable<Additives>{
    console.log("This return id value")
    return this.http.get<Additives>(`${this.baseUrl}/${this.additiveid}`);
  }


  deleteAdditives(id:number,deletedBy:number):Observable<any>{
     return this.http.delete<Additives>(`${this.baseUrl}/${id}?deletedBy=${deletedBy}`)
  }


  getAdditiveId(id:number){
    this.additiveid=id;
  }
}


