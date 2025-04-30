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

  getAllContacts(): Observable<ContactDTO[]> {
    return this.http.get<ContactDTO[]>(`${this.baseUrl}/GetAll`);
  }

  addContacts(contact: ContactDTO): Observable<ContactDTO> {
    return this.http.post<Contact>(`${this.baseUrl}`, contact);
}

updateContact(contact: any) {
  return this.http.put(`/api/contacts/${contact.contactId}`, contact);
}

getContact(id:number):Observable<ContactDTO>

{
  console.log(`Fetching contact with ID: ${id}`);
  return this.http.get<ContactDTO>(`${this.baseUrl}/${this.contactid}`);
}

deleteContact(id: number): Observable<any> {
  return this.http.delete<ContactDTO>(`${this.baseUrl}?id=${id}`);
}



getcontactid(id:number){
  this.contactid=id;
}
}


