import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { AddPRoject, Project } from '../../models/project.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-addproject',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    CommonModule
    
  ],
  providers: [
    MatDatepickerModule
  ],
  templateUrl: './addproject.component.html',
  styleUrls: ['./addproject.component.css']
})
export class AddprojectComponent {
  projectForm: FormGroup;

  projectTypes = [
    { value: 1, viewValue: 'Pre Development' },
    { value: 2, viewValue: 'Application Development' },
    { value: 3, viewValue: 'Service' }
  ];

  areas = [
    { value: 1, viewValue: 'Rotomolding' },
    { value: 2, viewValue: 'Injection Molding' },
    { value: 3, viewValue: 'Blow Molding' }
    
  ];

  priorities = [
    { value: 1, viewValue: 'High' },
    { value: 2, viewValue: 'Medium' },
    { value: 3, viewValue: 'Low' }
  ];

  constructor(
    private fb: FormBuilder,
    private projectservice:ProjectService,
    private dialogRef: MatDialogRef<AddprojectComponent>,
    private route:Router
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      projectType: [null, Validators.required],
      area: [null, Validators.required],
      priority: [null, Validators.required],
      projectDescription: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null]  // Optional
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
  
      if (!user) {
        console.error('No user found in localStorage!');
        return;
      }
  
      const newProject: AddPRoject = {
        ...this.projectForm.value,
        createdBy: user.userId,
        createdDate: new Date().toISOString()
      };
  
      this.projectservice.AddProject(newProject).subscribe({
        next: (response) => {
          console.log('Project added successfully', response);
          this.dialogRef.close(true);
      
          // Force reload by navigating to a dummy route and then to the same route
          // this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          //   this.route.navigate(['/GetAllProject']);
          // });
        },
        error: (error) => {
          console.error('Error adding project:', error);
        }
      });
    } else {
      this.projectForm.markAllAsTouched(); 
    }
  }

  

  onCancel(): void {
    this.dialogRef.close();
  }
}
