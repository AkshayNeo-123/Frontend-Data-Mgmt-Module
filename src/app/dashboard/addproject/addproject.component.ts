import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { AddPRoject } from '../../models/project.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

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
  providers: [ { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  {
    provide: MAT_DATE_FORMATS,
    useValue: {
      parse: {
        dateInput: 'DD-MM-YYYY',
      },
      display: {
        dateInput: 'DD-MM-YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      },
    },
  },],
  
  templateUrl: './addproject.component.html',
  styleUrls: ['./addproject.component.css']
})
export class AddprojectComponent implements OnInit {
  projectForm: FormGroup;
  minStartDate: Date = new Date();
  minEndDate: Date = new Date();
  projectTypes: any[] = [];
areas: any[] = [];

  // projectTypes = [
  //   { value: 1, viewValue: 'Pre Development' },
  //   { value: 2, viewValue: 'Application Development' },
  //   { value: 3, viewValue: 'Service' }
  // ];

  // areas = [
  //   { value: 1, viewValue: 'Rotomolding' },
  //   { value: 2, viewValue: 'Injection Molding' },
  //   { value: 3, viewValue: 'Blow Molding' }
  // ];

  priorities = [
    { value: 1, viewValue: 'High' },
    { value: 2, viewValue: 'Medium' },
    { value: 3, viewValue: 'Low' }
  ];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private projectservice: ProjectService,
    private dialogRef: MatDialogRef<AddprojectComponent>,
    private route: Router
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      projectType: [null],
      area: [null,],
      priority: [null],
      projectDescription: ['', Validators.required],
      startDate: [null],
      endDate: [null] // Optional
    });
  }

  ngOnInit(): void {
    this.loadMasterData();
    this.projectForm.get('startDate')?.valueChanges.subscribe((startDate: Date) => {
      if (startDate) {
        this.minEndDate = new Date(startDate);
        const endDate = this.projectForm.get('endDate')?.value;
        if (endDate && new Date(endDate) < new Date(startDate)) {
          this.projectForm.get('endDate')?.setValue(null);
        }
      }
    });

    
  }
  loadMasterData() {
    this.projectservice.getProjectTypes().subscribe({
      next: (data) => (this.projectTypes = data),
      error: (err) => console.error('Error fetching project types:', err)
    });
  
    this.projectservice.getAreas().subscribe({
      next: (data) => (this.areas = data),
      error: (err) => console.error('Error fetching areas:', err)
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
          this.toastr.success('Project Added successfully');
          this.projectservice.triggerRefresh();
          this.dialogRef.close(true);
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
