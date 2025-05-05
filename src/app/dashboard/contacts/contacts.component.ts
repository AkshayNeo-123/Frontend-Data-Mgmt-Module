import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Contact, ContactTyps } from '../../models/contacts';
import { ContactsService } from '../../services/contacts.service';
import { Router, RouterModule } from '@angular/router';
import { AddcontactsComponent } from '../contactsData/addcontacts/addcontacts.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ConfirmDialogComponent } from '../CommonTs/confirm-dialog.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['contactName', 'contactType', 'actions'];
  dataSource = new MatTableDataSource<Contact>([]);
  allTypes = ContactTyps;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private contactService: ContactsService,
    private dialog: MatDialog,
    private router: Router,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchContacts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'contactType') {
        return this.getContactTypeName(item.contactType).toLowerCase();
      }
      return (item as any)[property];
    };
  }

  getContactTypeName(type: number): string {
    return ContactTyps[type];
  }


  fetchContacts(): void {
    this.contactService.getAllContacts().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log(data);
      },
      error: (err) => {
        console.error('Error fetching contacts', err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
     this.dataSource.filterPredicate = (data, filter: string) => {
      return data.contactName.toLowerCase().includes(filter);
    };
  this.dataSource.filter=filterValue
  }

  
  openAddContactDialog(contact?:Contact) {
    console.log('Data passed to dialog:', contact);
      const dialogRef = this.dialog.open(AddcontactsComponent, {
        width: '80%',  
        maxWidth: '600px',
        disableClose: true,
        data: contact
      });
    
      dialogRef.afterClosed().subscribe(result => {

        if (result) {
                  this.toastr.success('Added successfully','Success');

          this.fetchContacts();  
        }
      });
      
    }

    editContact(contact: any) {
      const dialogRef = this.dialog.open(AddcontactsComponent, {
        width: '80%',
        maxWidth: '600px',
        disableClose: true,
        data: contact
      });
      console.log('Editing contact:', contact);
      dialogRef.afterClosed().subscribe(result => {
        

        if (result) {
                  this.toastr.success('Updated successfully','Success');
               
                
          this.fetchContacts(); 
        }
      });
    }

    deleteContactsDetails(contactId: number) {
       const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                  width: '350px',
                  data: {
                    title: 'Confirm Deletion',
                    message: 'Do you really want to delete this record?'
                  }
                });
            
            dialogRef.afterClosed().subscribe(result => {
              if (result === true) {
          this.dataSource.data = this.dataSource.data.filter(material => material.contactId !== contactId);
    
          console.log('Deleting Contact with ID:', contactId);
          this.contactService.deleteContact(contactId).subscribe(
            (response) => {
              console.log('Contact deleted successfully:', response);
              this.toastr.success('deleted successfully');
            },
            (error) => {
              console.error('Error deleting contact:', error);
              this.toastr.error('Failed to delete contact');
            }
          );
        }
      });
    }
  }