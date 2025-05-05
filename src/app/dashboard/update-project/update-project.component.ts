import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { UpdateProject } from '../../models/project.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

@Component({
  selector: 'app-update-project',
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
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
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
    },
  ],
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.css']
})
export class UpdateProjectComponent implements OnInit,AfterViewInit {
  projectForm!: FormGroup;

  // Set minimum dates to tomorrow (today + 1 day)
  minStartDate: Date = new Date();
  minEndDate: Date = new Date();
  minEndDate2: Date | null = null;
  projectTypes: any[] = [];
  areas: any[] = [];
  priorities: any[] = [];
  status: any[] = [];
  IsStartDateEnabled:boolean=false;
  constructor(
    private fb: FormBuilder,
    private projectservice: ProjectService,
    private router: Router,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<UpdateProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngAfterViewInit(): void {
   
  }

  // Helper method to get tomorrow's date
  getTomorrowDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Reset time to beginning of the day
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }
   noPastDateValidator(): ValidatorFn {
    
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
  
      const selectedDate = new Date(control.value);
      selectedDate.setHours(0, 0, 0, 0);
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if(selectedDate > today){
        console.log("hahah")
        this.IsStartDateEnabled = true;
        // return selectedDate < today ? { pastDate: false } : null;
       
      }
      // if(selectedDate==null){
      //   this.IsStartDateEnabled = true;
      // }
  
      // return  null;
      return selectedDate < today ? { pastDate: false } : null;

    };
  }
  // ngOnInit(): void {
  //   this.loadMasterData();
  //   const isInvalidDate = (dateStr: string): boolean =>
  //     !dateStr || dateStr === '0001-01-01T00:00:00';
    
  //   // Initialize form
  //   this.projectForm = this.fb.group({
  //     projectNumber: [{ value:this.data.projectNumber, disabled: true }],
  //     projectName: [this.data.projectName, Validators.required],
  //     projectType: [Number(this.data.projectTypeId)],
  //     area: [Number(this.data.areaId)],
  //     priority: [Number(this.data.priorityId)],
  //     project_Description: [this.data.project_Description, Validators.required],
  //     startDate: [
  //       this.validateDateIsAfterToday(isInvalidDate(this.data.startDate) ? null : new Date(this.data.startDate))
  //     ],
  //     endDate: [
  //       this.validateDateIsAfterToday(isInvalidDate(this.data.endDate) ? null : new Date(this.data.endDate))
  //     ],
  //     status: [Number(this.data.statusId), Validators.required]
  //   });
  //   console.log(this.data);

  //   // Listen for startDate changes to update minEndDate accordingly
  //   this.projectForm.get('startDate')?.valueChanges.subscribe((startDate: any) => {
  //     if (startDate) {
  //       // Make sure end date is at least the same as start date
  //       let startDateObj;
        
  //       // Handle both moment and Date objects
  //       if (moment.isMoment(startDate)) {
  //         startDateObj = startDate.toDate();
  //       } else if (startDate instanceof Date) {
  //         startDateObj = startDate;
  //       } else {
  //         startDateObj = new Date(startDate);
  //       }
        
  //       this.minEndDate = startDateObj;
        
  //       const endDate = this.projectForm.get('endDate')?.value;
  //       if (endDate) {
  //         let endDateObj;
  //         if (moment.isMoment(endDate)) {
  //           endDateObj = endDate.toDate();
  //         } else if (endDate instanceof Date) {
  //           endDateObj = endDate;
  //         } else {
  //           endDateObj = new Date(endDate);
  //         }
          
  //         if (endDateObj < startDateObj) {
  //           this.projectForm.get('endDate')?.setValue(null);
  //         }
  //       }
  //     } else {
  //       // If start date is cleared, reset minEndDate to tomorrow
  //       this.minEndDate = this.getTomorrowDate();
  //     }
  //   });
  // }
  ngOnInit(): void {
    this.loadMasterData();
    const isInvalidDate = (dateStr: string): boolean =>
      !dateStr || dateStr === '0001-01-01T00:00:00';
    this.IsStartDateEnabled = this.data.startDate == null;
  
    this.projectForm = this.fb.group({
      projectNumber: [{ value: this.data.projectNumber, disabled: true }],
      projectName: [this.data.projectName, Validators.required],
      projectType: [Number(this.data?.projectTypeId)],
      area: [Number(this.data?.areaId)],
      priority: [Number(this.data?.priorityId)],
      project_Description: [this.data.project_Description, Validators.required],
      startDate: [this.data.startDate == null ? null: new Date(this.data.startDate),this.noPastDateValidator()
        // this.validateDateIsAfterToday(isInvalidDate(this.data.startDate) ? null : new Date(this.data.startDate)),
        // 
      ],
      endDate: [this.data.endDate == null ? null : new Date(this.data.endDate)
        // this.validateDateIsAfterToday(isInvalidDate(this.data.endDate) ? null : new Date(this.data.endDate))
      ],

      status: [Number(this.data.statusId), Validators.required]
      
    });

    // this.projectForm.get('startDate')?.valueChanges.subscribe(() => {
    //   this.projectForm.get('endDate')?.updateValueAndValidity({ onlySelf: true });
    // });

    

  
    console.log(this.data);
    const initialStart = this.projectForm.get('startDate')?.value;
    this.minEndDate2 = initialStart ? new Date(initialStart) : null;
    this.projectForm.get('startDate')?.valueChanges.subscribe((start) => {
      this.minEndDate2 = start ? new Date(start) : null;
    });
    // this.projectForm.get('startDate')?.clearValidators();
    // this.projectForm.get('startDate')?.updateValueAndValidity();

    // this.projectForm.get('startDate')?.valueChanges.subscribe((startDate: any) => {
    //   const parsedStartDate = moment.isMoment(startDate)
    //     ? startDate.toDate()
    //     : startDate instanceof Date
    //     ? startDate
    //     : new Date(startDate);
  
    //   if (!isNaN(parsedStartDate.getTime())) {
    //     this.minEndDate = parsedStartDate;
  
    //     const endDateCtrl = this.projectForm.get('endDate');
    //     const endDateVal = endDateCtrl?.value;
  
    //     if (endDateVal) {
    //       const parsedEndDate = moment.isMoment(endDateVal)
    //         ? endDateVal.toDate()
    //         : endDateVal instanceof Date
    //         ? endDateVal
    //         : new Date(endDateVal);
  
    //       if (parsedEndDate < parsedStartDate) {
    //         endDateCtrl?.setValue(null);
    //       }
    //     }
    //   } else {
    //     this.minEndDate = this.getTomorrowDate();
    //   }
    // });
  }
  

  // endAfterStartValidator() {
  //   return (group: AbstractControl) => {
  //     const start = group.get('startDate')?.value;
  //     const end = group.get('endDate')?.value;
  
  //     if (!start || !end) {
  //       group.get('endDate')?.setErrors(null);
  //       return null;
  //     }
  
  //     const startDate = new Date(start);
  //     const endDate = new Date(end);
  
  //     if (endDate <= startDate) {
  //       group.get('endDate')?.setErrors({ endBeforeStart: true });
  //     } else {
  //       group.get('endDate')?.setErrors(null);
  //     }
  
  //     return null;
  //   };
  // }
  

  // Helper method to validate existing dates against today
  // validateDateIsAfterToday(date: Date | null): Date | null {
  //   if (!date) return null;
    
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
    
  //   return date > today ? date : date;
    
  // }

  loadMasterData() {
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
  //   const isInvalidDate = (dateStr: string): boolean =>
  //     !dateStr || dateStr === '0001-01-01T00:00:00';
  
  //   this.projectForm.reset({
  //     projectName: this.data.projectName,
  //     projectType: [this.data.projectTypeId ? Number(this.data.projectTypeId) : 'null'],
  //     area: [this.data.areaId ? Number(this.data.areaId) : 'null'],
  //     priority: [this.data.priorityId ? Number(this.data.priorityId) : 'null'],
  //     status: [this.data.statusId ? Number(this.data.statusId) : 'null', Validators.required],
  //     startDate: this.validateDateIsAfterToday(isInvalidDate(this.data.startDate) ? null : new Date(this.data.startDate)),
  //     endDate: this.validateDateIsAfterToday(isInvalidDate(this.data.endDate) ? null : new Date(this.data.endDate))
  //   });
  
  //   // Reset minEndDate based on new start date or to tomorrow
  //   const newStartDate = this.projectForm.get('startDate')?.value;
  //   this.minEndDate = newStartDate ? new Date(newStartDate) : this.getTomorrowDate();
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

      for (const key in rawFormValue) {
        if (Object.prototype.hasOwnProperty.call(rawFormValue, key)) {
          const value = rawFormValue[key];
          
          if (key === 'startDate' || key === 'endDate') {
            // Handle date conversion properly
            if (value) {
              // If it's a moment object, extract the date without timezone adjustment
              if (moment.isMoment(value)) {
                cleanedFormValue[key] = value.format('YYYY-MM-DD');
              } else if (value instanceof Date) {
                // If it's a Date object, format directly
                cleanedFormValue[key] = value.toISOString().split('T')[0];
              } else {
                // Handle string dates or other formats
                cleanedFormValue[key] = new Date(value).toISOString().split('T')[0];
              }
            } else {
              cleanedFormValue[key] = null;
            }
          } else {
            // Handle non-date fields
            cleanedFormValue[key] = value === '' ? null : value;
          }
        }
      }

      const updatedProject: UpdateProject = {
        ...cleanedFormValue,
        statusId: cleanedFormValue.status,
        // areaId:cleanedFormValue.area,
        // projectTypeId:cleanedFormValue.projectType,
        // priorityId:cleanedFormValue.priority,
        

        modifiedBy: user.userId,
        modifiedDate: new Date().toISOString()
      };
      
      console.log('Final update object:', updatedProject);

      this.projectservice.updateProject(this.data.projectId, updatedProject).subscribe({
        next: (response) => {
          console.log('Project updated successfully', response);
          this.toastr.success('Updated successfully!');
          this.projectservice.triggerRefresh();
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating project:', error);
          this.toastr.error('Something Went Wrong!');
        }
      });
    } else {
      this.projectForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}