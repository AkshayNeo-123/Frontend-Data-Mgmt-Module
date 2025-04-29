import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialService } from '../../services/material.service';
import { Material, MaterialTypeEnum, MvrMfrType, StorageLocation } from '../../models/material.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class AddMaterialComponent {
  materialForm: FormGroup;

  priorities = [
    { value: 1, viewValue: 'High' },
    { value: 2, viewValue: 'Medium' },
    { value: 3, viewValue: 'Low' }
  ];
  

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddMaterialComponent>);
  private materialService = inject(MaterialService);

  constructor() {
    this.materialForm = this.fb.group({
      priority: [null, Validators.required], 
      designation: ['', Validators.required],
      manufacturerId: [null, Validators.required],
      additiveId: [null, Validators.required],
      mainPolymerId: [null, Validators.required],
      quantity: [null, Validators.required],
      density: [null, Validators.required],
      testMethod: ['', Validators.required],
      tdsFilePath: ['', Validators.required],
      msdsFilePath: ['', Validators.required],
      storageLocation: [null, Validators.required],
      description: [''],
      MVR_MFR: [null, Validators.required]
    });
  }


  onSubmit() {
    if (this.materialForm.valid) {
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (!user) return console.error('No user found in localStorage!');

      const newMaterial: Material = {
        ...this.materialForm.value,
        createdBy: user.userId,
        createdDate: new Date().toISOString(),
        modifiedBy: null,
        modifiedDate: null,
        materialId: 0 
      };

      this.materialService.addMaterial(newMaterial).subscribe({
        next: (res) => this.dialogRef.close(true),
        error: (err) => console.error('Error adding material:', err)
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}