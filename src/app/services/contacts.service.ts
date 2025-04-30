import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact, ContactDTO } from '../models/contacts';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private baseUrl = 'https://localhost:7030/api/Contact'; 

   contactid?:number;
  constructor(private http: HttpClient) {}

  getAllContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.baseUrl}/GetAll`);
  }

  addContacts(contact: Contact): Observable<ContactDTO> {
    return this.http.post<Contact>(`${this.baseUrl}`, contact);
}

updateContact(id:number,contact: Contact):Observable<Contact> {
  return this.http.put<Contact>(`${this.baseUrl}?id=${id}`, contact);
}

getContact(id:number):Observable<Contact>

{
  console.log(`Fetching contact with ID: ${id}`);
  return this.http.get<Contact>(`${this.baseUrl}/${this.contactid}`);
}

deleteContact(id: number): Observable<any> {
  return this.http.delete<Contact>(`${this.baseUrl}?id=${id}`);
}



getcontactid(id:number){
  this.contactid=id;
}
}


