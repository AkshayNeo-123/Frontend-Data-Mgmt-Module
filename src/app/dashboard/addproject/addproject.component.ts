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
import { ToastrService } from 'ngx-toastr';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { catchError, of } from 'rxjs';

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
    { 
      provide: DateAdapter, 
      useClass: MomentDateAdapter, 
      deps: [MAT_DATE_LOCALE] 
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD/MM/YYYY', // Changed from DD-MM-YYYY to MM/DD/YYYY
        },
        display: {
          dateInput: 'DD/MM/YYYY', // Changed from DD-MM-YYYY to MM/DD/YYYY
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
  templateUrl: './addproject.component.html',
  styleUrls: ['./addproject.component.css']
})
export class AddprojectComponent implements OnInit {
  projectForm: FormGroup;
  minStartDate: Date = new Date();
  minEndDate: Date = new Date();
  projectTypes: any[] = [];
  areas: any[] = [];
  priorities: any[] = [];
  status: any[] = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private projectservice: ProjectService,
    private dialogRef: MatDialogRef<AddprojectComponent>,
    private route: Router
  ) {
    this.projectForm = this.fb.group({
      projectCode: [{ value: '', disabled: true }],
      projectName: ['', Validators.required],
      statusId: ['', Validators.required],
      projectTypeId: [''],
      AreaId: [''],
      priorityPriorityId: [''], // Fixed from projectTypeId to priorityPriorityId
      projectDescription: ['', Validators.required],
      startDate: [null],
      endDate: [null] // Optional
    });
  }

  ngOnInit(): void {
    this.loadMasterData();
    this.projectForm.get('startDate')?.valueChanges.subscribe((startDate) => {
      if (startDate) {
        // Ensure we're working with a proper date object 
        const startDateObj = startDate._isAMomentObject ? startDate.toDate() : new Date(startDate);
        this.minEndDate = startDateObj;
        
        const endDate = this.projectForm.get('endDate')?.value;
        if (endDate) {
          const endDateObj = endDate._isAMomentObject ? endDate.toDate() : new Date(endDate);
          if (endDateObj < startDateObj) {
            this.projectForm.get('endDate')?.setValue(null);
          }
        }
      }
    });

    
    // this.projectservice.getLatestProjectCode().subscribe({
    //   next: (code: string) => {
    //     const newCode = this.generateProjectCode(code);
    //     this.projectForm.get('projectCode')?.setValue(newCode);
    //   },
    //   error: () => {
    //     this.projectForm.get('projectCode')?.setValue(this.generateProjectCode(null));
    //   }
    // });
    this.projectservice.getLatestProjectCode()
  .pipe(
    catchError(() => {
      // Return null to continue stream with a fallback value
      return of(null);
    })
  )
  .subscribe((code: string | null) => {
    const newCode = this.generateProjectCode(code);
    this.projectForm.get('projectCode')?.setValue(newCode);
  });
  }

  generateProjectCode(lastCode: string | null): string {
    const prefix = '18-AE';
    let lastNumber = 0;
  
    if (lastCode) {
      const parts = lastCode.split('-');
      if (parts.length === 3) {
        lastNumber = parseInt(parts[2], 10);
      }
    }
  
    const nextNumber = lastNumber + 1;
    const padded = nextNumber.toString().padStart(3, '0');
    return `${prefix}-${padded}`;
  }
  // generateProjectCode(lastCode: string | null): string {
  //   console.log('Last project code received:', lastCode);
  //   const prefix = '18-AE';
  //   let lastNumber = 0;
  
  //   if (lastCode) {
  //     const match = lastCode.match(/^18-AE-(\d{3})$/);
  //     if (match) {
  //       lastNumber = parseInt(match[1], 10);
  //     }
  //   }
  
  //   const nextNumber = lastNumber + 1;
  //   const padded = nextNumber.toString().padStart(3, '0');
  //   return `${prefix}-${padded}`;
  // }

  loadMasterData() {
    // No changes needed here
    this.projectservice.getProjectTypes().subscribe({
      next: (data) => (this.projectTypes = data),
      error: (err) => console.error('Error fetching project types:', err)
    });
  
    this.projectservice.getAreas().subscribe({
      next: (data) => (this.areas = data),
      error: (err) => console.error('Error fetching areas:', err)
    });
    this.projectservice.getPriorities().subscribe({
      next: (data) => (this.priorities = data),
      error: (err) => console.error('Error fetching areas:', err)
    });
    this.projectservice.getStatus().subscribe({
      next: (data) => (this.status = data),
      error: (err) => console.error('Error fetching areas:', err)
    });
  }

  // onReset(): void {
  //   this.projectForm.reset();
  //   this.minEndDate = this.minStartDate = new Date(); // Reset min dates
  // }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
  
      if (!user) {
        console.error('No user found in localStorage!');
        return;
      }
  
      const rawFormValue = this.projectForm.value;
      const cleanedFormValue: any = {};

      // Handle date conversion properly
      for (const key in rawFormValue) {
        if (Object.prototype.hasOwnProperty.call(rawFormValue, key)) {
          const value = rawFormValue[key];
          
          if (key === 'startDate' || key === 'endDate') {
            // Handle moment dates
            if (value && value._isAMomentObject) {
              cleanedFormValue[key] = value.format('YYYY-MM-DD');
            } 
            // Handle Date objects
            else if (value instanceof Date) {
              cleanedFormValue[key] = value.toISOString().split('T')[0];
            }
            // Pass through null values
            else {
              cleanedFormValue[key] = value;
            }
          } else {
            // Handle other form values
            cleanedFormValue[key] = value === '' ? null : value;
          }
        }
      }

      const newProject: AddPRoject = {
        ...cleanedFormValue,
        ProjectNumber: this.projectForm.get('projectCode')?.value,
        createdBy: user.userId,
        createdDate: new Date().toISOString()
      };
  
      console.log(newProject);
  
      this.projectservice.AddProject(newProject).subscribe({
        next: (response) => {
          console.log('Project added successfully', response);
          this.toastr.success('Save successfully');
          this.projectservice.triggerRefresh();
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error adding project:', error);
          this.toastr.error('Something went wrong?');
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