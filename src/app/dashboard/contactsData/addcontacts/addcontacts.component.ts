import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../../services/contacts.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
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
  states: any[] = [];
  cities: any[] = [];
  isOtherCitySelected: boolean = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactsService,
    private dialogRef: MatDialogRef<AddcontactsComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    this.initForm();
    this.loadStates();

    this.contactForm.get('stateId')?.valueChanges.subscribe(stateId => {
      this.contactForm.get('cityId')?.reset();
      this.isOtherCitySelected = false;
      this.cities = [];
      this.loadCitiesByState(stateId);
    });

    if (this.isEditMode && this.data?.stateId) {
      this.loadCitiesByState(this.data.stateId);
    }
  }

  private initForm(): void {
    this.contactForm = this.fb.group({
      contactId: [this.data?.contactId || null],
      contactName: [this.data?.contactName || '', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      contactType: [this.data?.contactType || 1, Validators.required],
      addressLine1: [this.data?.addressLine1 || '', [Validators.required, Validators.maxLength(50)]],
      addressLine2: [this.data?.addressLine2 || ''],
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
        Validators.pattern(/^[0-9]\d{9}$/)
      ]],
      newCityName: ['', Validators.required]
    });
  }

  loadStates(): void {
    this.contactService.GetAllStates().subscribe({
      next: (res) => {
        this.states = res;
      },
      error: () => {
        this.toastr.error('Failed to load states', 'Error');
      }
    });
  }

  loadCitiesByState(stateId: number): void {
    this.contactService.getCitiesByState(stateId).subscribe({
      next: (res) => {
        this.cities = res;
        if (this.isEditMode && this.data?.cityId) {
          this.contactForm.patchValue({ cityId: this.data.cityId });
        }
      },
      error: () => {
        this.toastr.error('Failed to load cities', 'Error');
      }
    });
  }

  onCityChange(): void {
    const cityId = this.contactForm.get('cityId')?.value;
    this.isOtherCitySelected = cityId === 'Other';
  
    if (!this.isOtherCitySelected) {
      this.contactForm.patchValue({ newCityName: '' });
    }
  }

  onSubmit(): void {
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      this.toastr.error('Please fill all required fields.', 'Error');
      return;
    }

    const adduserId = localStorage.getItem('UserId');
    const user = adduserId ? JSON.parse(adduserId) : null;

    if (!user) {
      console.error('No user found in localStorage!');
      return;
    }

    if (this.isOtherCitySelected) {
      const newCityName = this.contactForm.get('newCityName')?.value;
      const stateId = this.contactForm.get('stateId')?.value;

      this.contactService.addCity(newCityName, stateId).subscribe({
        next: (newCity) => {
          this.contactForm.patchValue({ cityId: newCity.cityId });

          const contactPayload = {
            ...this.contactForm.value,
            ...(this.isEditMode
              ? { modifiedBy: adduserId, modifiedDate: new Date().toISOString() }
              : { createdBy: adduserId, createdDate: new Date().toISOString(), modifiedDate: new Date().toISOString() }
            )
          };

          this.saveContact(contactPayload);
        },
        error: () => {
          this.toastr.error('Failed to add new city', 'Error');
        }
      });
    } else {
      const contactPayload = {
        ...this.contactForm.value,
        ...(this.isEditMode
          ? { modifiedBy: adduserId, modifiedDate: new Date().toISOString() }
          : { createdBy: adduserId, createdDate: new Date().toISOString(), modifiedDate: new Date().toISOString() }
        )
      };

      this.saveContact(contactPayload);
    }
  }

  saveContact(contactPayload: any): void {
    if (this.isEditMode) {
      this.contactService.updateContact(this.data.contactId, contactPayload).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => {
          this.toastr.error('Failed to update contact', 'Error');
        }
      });
    } else {
      this.contactService.addContacts(contactPayload).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => {
          this.toastr.error('Failed to add contact', 'Error');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  allowOnlyLetters(event: KeyboardEvent): void {
    const char = event.key;
    if (!/^[a-zA-Z\s]$/.test(char)) {
      event.preventDefault();
    }
  }

  allowOnlyNumber(event: KeyboardEvent): void {
    const char = event.key;
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
    }
  }
}
