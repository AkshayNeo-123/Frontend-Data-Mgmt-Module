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
import { ContactDTO, ContactTyps } from '../../models/contacts';
import { ContactsService } from '../../services/contacts.service';
import { Router, RouterModule } from '@angular/router';
import { AddcontactsComponent } from '../contactsData/addcontacts/addcontacts.component';

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
  displayedColumns: string[] = [ 'contactName', 'contactType', 'actions'];
  dataSource = new MatTableDataSource<ContactDTO>([]);
  allTypes = ContactTyps;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private contactService: ContactsService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchContacts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchContacts(): void {
    this.contactService.getAllContacts().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Error fetching contacts', err);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openAddContactDialog() {
      const dialogRef = this.dialog.open(AddcontactsComponent, {
        width: '80%',  
        maxWidth: '900px',
        disableClose: true,
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
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
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.fetchContacts(); 
        }
      });
    }

    // openContactDetails(contact: any) {
    //   this.dialog.open(GetcontactsdetailsComponent, {
    //     width: '600px',
    //     data: contact
    //   });
    // }
  deleteContactsDetails(id: number): void {
    if (!confirm('Do you really want to delete this contact?')) return;

    this.contactService.deleteContact(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(c => c.contactId !== id);
        alert('Contact deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting contact', err);
        alert('Failed to delete contact');
      }
    });
  }
}
