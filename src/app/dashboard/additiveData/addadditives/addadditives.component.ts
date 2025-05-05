import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { Additives } from '../../../models/contacts';
import { AdditiveservicesService } from '../../../services/additiveservices.service';

@Component({
  selector: 'app-add-additives',
  standalone: true,
  templateUrl: './addadditives.component.html',
  styleUrls: ['./addadditives.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class AddAdditiveComponent implements OnInit {
  additiveForm!: FormGroup;
    isEditMode:boolean=false;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddAdditiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private additiveService: AdditiveservicesService,
    private toastr: ToastrService
  ) {}
  

  

  ngOnInit(): void {
    console.log('Data passed to dialog:', this.data);
    this.isEditMode = !!this.data;
  console.log("See the data ",this.data)
    this.additiveForm = this.fb.group({
      id:[this.data?.id||null],
      additiveName: [this.data?.additiveName || '', Validators.required],
       });
  }
  onSubmit(): void {
    
    if (this.additiveForm.invalid) {
      this.toastr.error(
        'Please fill all required fields.',
        'Error',
        { timeOut: 5000 }
      );
      return; 
    }
    if (this.additiveForm.valid) {
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (!user) {
        this.toastr.error('User not found. Please log in again.', 'Error');
        return;
      }

      
      const contactPayload = {
        ...this.additiveForm.value,
        createdBy: user.userId,
        createdDate: new Date().toISOString(),
      };

      if (this.isEditMode) {
        console.log(this.data.id,contactPayload)
        console.log('Updating contact with ID:', this.data.id);
        this.additiveService.updateAdditives(this.data.id, contactPayload).subscribe({
          next: () => {
            // alert('Contact updated');
            this.dialogRef.close(true);
          },
          error: (err) => console.error('Update failed', err)
        });
      } else {
        console.log('Adding new contact');
        this.additiveService.addAdditive(contactPayload).subscribe({
          next: () => {
            // alert('Added added');
            this.dialogRef.close(true);
          },
          error: (err) => console.error('Add failed', err)
        });
      }
    }
  }
  

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
