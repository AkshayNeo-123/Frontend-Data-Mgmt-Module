import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { MatDialogRef } from '@angular/material/dialog'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 

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
   
  ]
})
export class AddMaterialComponent {
  materialForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private dialogRef: MatDialogRef<AddMaterialComponent> ,
    // private toastr: ToastrService 
  ) {
    this.materialForm = this.fb.group({
      materialsType: ['', Validators.required],
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
  
      if (!user) {
        console.error('No user found in localStorage!');
        return;
      }
  
      const newMaterial: Material = {
        ...this.materialForm.value, 
        createdBy: user.userId, 
        createdDate: new Date().toISOString(), 
      };
  
      this.materialService.addMaterial(newMaterial).subscribe({
        next: (response) => {
          console.log('Material added successfully', response);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error adding material:', error);
        }
      });
    }
  }
  

  onCancel() {
    this.dialogRef.close(); 
  }
}
