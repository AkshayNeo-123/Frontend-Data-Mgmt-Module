import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cities, Contact, States } from '../models/contacts';
import { APP_CONSTANTS } from './Constants';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private baseUrl = `${APP_CONSTANTS.apiUrls.loadApiUrl}/Contact`; 
  private apiUrl=`${APP_CONSTANTS.apiUrls.loadApiUrl}/States`;


   contactid?:number;
  constructor(private http: HttpClient) {}

  getAllContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.baseUrl}/GetAll`);
  }

  addContacts(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${this.baseUrl}`, contact);
}

updateContact(id:number,contact: Contact):Observable<Contact> {
  return this.http.put<Contact>(`${this.baseUrl}?id=${id}`, contact);
}


GetAllStates():Observable<States[]>{
  return this.http.get<States[]>(`${this.apiUrl}/states`);
  
  
}
getCitiesByState(stateId: number):Observable<Cities[]> {
  return this.http.get<Cities[]>(`${APP_CONSTANTS.apiUrls.loadApiUrl}/States/cities?id=${stateId}`);
}
getContact(id:number):Observable<Contact>

{
  console.log(`Fetching contact with ID: ${id}`);
  return this.http.get<Contact>(`${this.baseUrl}/${this.contactid}`);
}

deleteContact(id: number,deletedBy:number): Observable<any> {
  return this.http.delete<Contact>(`${this.baseUrl}?id=${id}&deletedBy=${deletedBy}`);
}

addCity(cityName: string, stateId: number): Observable<any> {
  const url = `${APP_CONSTANTS.apiUrls.loadApiUrl}/States/addCities?cityName=${cityName}&stateId=${stateId}`;
  return this.http.post<any>(url, { cityName, stateId });
}



getcontactid(id:number){
  this.contactid=id;
}
}


