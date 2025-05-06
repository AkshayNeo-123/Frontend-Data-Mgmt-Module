import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../../services/contacts.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Console } from 'console';
import { MatRadioModule } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { ContactTyps } from '../../../models/contacts';
import { States } from '../../../models/contacts';
import { Cities } from '../../../models/contacts';



@Component({
  selector: 'app-addcontacts',
  templateUrl: './addcontacts.component.html',
  styleUrls: ['./addcontacts.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule
  ]
})
export class AddcontactsComponent implements OnInit {
  contactForm!: FormGroup;
  isEditMode: boolean = false;
  filteredCities: string[] = [];
  states: any[] = [];
  cities: any[] = [];
  constructor(
    private fb: FormBuilder,
    private contactService: ContactsService,
    private dialogRef: MatDialogRef<AddcontactsComponent>,
        private toastr:ToastrService
    ,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    console.log('Data passed to dialog:', this.data);
    this.isEditMode = !!this.data;
   
    this.loadStates();

    this.contactForm.get('stateId')?.valueChanges.subscribe(stateId => {
      if (stateId) this.loadCitiesByState(stateId);
    });

    if (this.isEditMode && this.data?.stateId) {
      this.loadCitiesByState(this.data.stateId);
    }

    console.log("See the data ", this.data);
    
    this.contactForm = this.fb.group({
      contactId: [this.data?.contactId || null],
  
      contactName: [this.data?.contactName || '', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
  
      contactType: [this.isEditMode ? this.data?.contactType : 1, Validators.required],   
      addressLine1: [this.data?.addressLine1 || '', [Validators.required, Validators.maxLength(50)]],

      addressLine2: [this.data?.addressLine1 || ''],

      stateId: [this.data?.stateId || '', Validators.required],
      cityId: [this.data?.cityId || '', Validators.required],
  
      zip: [this.data?.zip || '', [
        Validators.required,
        Validators.pattern(/^[0-9]{5,6}$/)
      ]],
  
      email: [this.data?.email || '', [
        Validators.required,
        Validators.email
      ]],
  
      phone: [this.data?.phone || '', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]]
    });
  
    // if (this.data?.state) {
    //   this.onStateChange(this.data.state);  
    // }
  }

  loadStates(){
    this.contactService.GetAllStates().subscribe(res => this.states = res);
  }

  loadCitiesByState(stateId: number) {
    this.contactService.getCitiesByState(stateId).subscribe(res => this.cities = res);
  }

  
  allowOnlyNumber(event: KeyboardEvent): void {
    const char = event.key;
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  allowOnlyLetters(event: KeyboardEvent): void {
    // const input = event.target as HTMLInputElement;

    const char = event.key;
    const isLetterOrSpace = /^[a-zA-Z\s]$/.test(char);
    if (!isLetterOrSpace) {
      event.preventDefault();
    }
  }
  

  onSubmit(): void {
    this.contactForm.markAllAsTouched();

     
    if (this.contactForm.invalid) {
      this.toastr.error(
        'Please fill all required fields.',
        'Error',
        { timeOut: 5000 }
      );
      return; 
    }

    if (this.contactForm.valid) {
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (!user) {
        console.error('No user found in localStorage!');
        return;
      }

      const contactPayload = {
        ...this.contactForm.value,
        createdBy: user.userId,
        createdDate: new Date().toISOString(),
      };

      if (this.isEditMode) {
        console.log(this.data.contactId,contactPayload)
        console.log('Updating contact with ID:', this.data.contactId);
        this.contactService.updateContact(this.data.contactId, contactPayload).subscribe({
          next: () => {
            // alert('Contact updated');
            this.dialogRef.close(true);
          },
          error: (err) => console.error('Update failed', err)
        });
      } else {
        console.log('Adding new contact');
        this.contactService.addContacts(contactPayload).subscribe({
          next: () => {
            // alert('Contact added');
            this.dialogRef.close(true);
          },
          error: (error)=>{
            console.error('save error:',error);
          
          // this.toastr.error('Failed to add contact','error',{
            //  timeOut:5000
          // });
        }
        });
      }
    }
  }

     
   onCancel() {
    this.dialogRef.close(false);
  }
  
}
