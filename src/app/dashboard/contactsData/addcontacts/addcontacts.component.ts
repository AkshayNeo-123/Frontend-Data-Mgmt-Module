import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../../services/contacts.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

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
    MatDialogModule
  ]
})
export class AddcontactsComponent implements OnInit {
  contactForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactsService,
    private dialogRef: MatDialogRef<AddcontactsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;

    this.contactForm = this.fb.group({
      contactName: [this.data?.contactName || '', Validators.required],
      contactType: [this.data?.contactType || 1, Validators.required],
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
        // Update contact
        this.contactService.updateContact({ ...contactPayload, contactId: this.data.contactId }).subscribe({
          next: () => {
            console.log('Contact updated');
            this.dialogRef.close(true);
          },
          error: (err) => console.error('Update failed', err)
        });
      } else {
        this.contactService.addContacts(contactPayload).subscribe({
          next: () => {
            console.log('Contact added');
            this.dialogRef.close(true);
          },
          error: (err) => console.error('Add failed', err)
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
