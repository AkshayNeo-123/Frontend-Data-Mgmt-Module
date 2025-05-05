import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  console.log("See the data ",this.data)
    this.contactForm = this.fb.group({
      contactId:[this.data?.contactId||null],
      contactName: [this.data?.contactName || '', Validators.required],
      contactType: [this.data?.contactType ||null, Validators.required],
      addressLine1: [this.data?.addressLine1 || '', Validators.required],
      addressLine2: [this.data?.addressLine2 || ''],
      city: [this.data?.city || '', Validators.required],
      state: [this.data?.state || '', Validators.required],
      zip: [this.data?.zip || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      phone: [this.data?.phone || '', Validators.required]
    });
  }

  onSubmit(): void {
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
          error: (err) => console.error('Add failed', err),
          // this.toastr.error('Failed to delete contact');

        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
  states = [
    { value: 'CA', viewValue: 'California' },
    { value: 'TX', viewValue: 'Texas' },
    { value: 'NY', viewValue: 'New York' },
    { value: 'FL', viewValue: 'Florida' },
    { value: 'IL', viewValue: 'Illinois' },
    { value: 'WA', viewValue: 'Washington' },
  
    { value: 'ON', viewValue: 'Ontario' },
    { value: 'QC', viewValue: 'Quebec' },
    { value: 'BC', viewValue: 'British Columbia' },
    { value: 'AB', viewValue: 'Alberta' },
    { value: 'MB', viewValue: 'Manitoba' },
  
    { value: 'MH', viewValue: 'Maharashtra' },
    { value: 'DL', viewValue: 'Delhi' },
    { value: 'KA', viewValue: 'Karnataka' },
    { value: 'TN', viewValue: 'Tamil Nadu' },
    { value: 'WB', viewValue: 'West Bengal' },
    { value: 'RJ', viewValue: 'Rajasthan' },
  
    { value: 'NSW', viewValue: 'New South Wales' },
    { value: 'VIC', viewValue: 'Victoria' },
    { value: 'QLD', viewValue: 'Queensland' },
    { value: 'WA-AU', viewValue: 'Western Australia' },
    { value: 'SA', viewValue: 'South Australia' },
  
    { value: 'ENG', viewValue: 'England' },
    { value: 'SCT', viewValue: 'Scotland' },
    { value: 'WLS', viewValue: 'Wales' },
    { value: 'NIR', viewValue: 'Northern Ireland' }
  ];
  
}
