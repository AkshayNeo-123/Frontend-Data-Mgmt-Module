import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AllMainPolymersComponent } from '../all-main-polymers/all-main-polymers.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MainpolymerserviceService } from '../../../services/mainpolymerservice.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-addmainpolymer',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './addmainpolymer.component.html',
  styleUrls: ['./addmainpolymer.component.css']  
})
export class AddmainpolymerComponent {

  mainPolymerForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddmainpolymerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private polymerService: MainpolymerserviceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    console.log('Data passed to dialog:', this.data);
    this.isEditMode = !!this.data;  
    console.log("See the data:", this.data);

    this.mainPolymerForm = this.fb.group({
      id: [this.data?.id || null],  
      polymerName: [this.data?.polymerName || '', Validators.required],  
    });

    
  }

  onSubmit(): void {

    if (this. mainPolymerForm.invalid) {
      this.toastr.error(
        'Please fill all required fields.',
        'Error',
        { timeOut: 5000 }
      );
      return; 
    }
    if (this.mainPolymerForm.valid) {
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (!user) {
        this.toastr.error('User not found. Please log in again.', 'Error');
        return;
      }

      const polymerPayload = {
        ...this.mainPolymerForm.value,
        createdBy: user.userId,
        createdDate: new Date().toISOString(),
      };

      if (this.isEditMode) {
        console.log(this.data.id, polymerPayload);
        console.log('Updating Main Polymer with ID:', this.data.id);
        this.polymerService.updateMainPolymer(this.data.id, polymerPayload).subscribe({
          next: () => {
            // this.toastr.success('Main Polymer updated successfully', 'Success');
            this.dialogRef.close(true);  
          },
          error: (err) => {
            console.error('Update failed', err);
            this.toastr.error('Failed to update Main Polymer.', 'Error');
          }
        });
      } else {
        console.log('Adding new Main Polymer');
        this.polymerService.addMainPolymers(polymerPayload).subscribe({
          next: () => {
            // this.toastr.success('Main Polymer added successfully', 'Success');
            this.dialogRef.close(true); 
          },
          error: (err) => {
            console.error('Add failed', err);
            this.toastr.error('Failed to add Main Polymer.', 'Error');
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);  // Close dialog without saving
  }
}
