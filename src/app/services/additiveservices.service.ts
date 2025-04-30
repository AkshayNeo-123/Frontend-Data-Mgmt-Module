import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddAdditives, Additives, UpdateAdditive } from '../models/contacts';

@Injectable({
  providedIn: 'root'
})
export class AdditiveservicesService {


  private baseUrl = 'https://localhost:7030/api/Additive'; 
  private additiveid?:number;
  constructor(private http:HttpClient) { }


  addAdditive(additive:AddAdditives):Observable<AddAdditives>{
    return this.http.post<AddAdditives>(this.baseUrl,additive,{withCredentials:true});
  }

  getAllAdditives():Observable<Additives[]>{
    console.log("This return id value")

    return this.http.get<Additives[]>(this.baseUrl);
  }

  updateAdditives(id: number, additiveData: UpdateAdditive): Observable<UpdateAdditive> {
    return this.http.put<UpdateAdditive>(`${this.baseUrl}/${id}`, additiveData);
  }
  
  getAdditivesById(id:number):Observable<Additives>{
    console.log("This return id value")
    return this.http.get<Additives>(`${this.baseUrl}/${this.additiveid}`);
  }


  deleteAdditives(id:number):Observable<any>{
     return this.http.delete<Additives>(`${this.baseUrl}/${id}`)
  }


  getAdditiveId(id:number){
    this.additiveid=id;
  }
}


