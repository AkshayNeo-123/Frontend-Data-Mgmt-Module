import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { UpdateProject } from '../../models/project.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
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
    CommonModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
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
  styleUrls: ['./update-project.component.css'],
})
export class UpdateProjectComponent implements OnInit, AfterViewInit {
  projectForm!: FormGroup;

  // Set minimum dates to tomorrow (today + 1 day)
  minStartDate: Date = new Date();
  minEndDate: Date = new Date();
  minEndDate2: Date | null = null;
  projectTypes: any[] = [];
  areas: any[] = [];
  priorities: any[] = [];
  status: any[] = [];
  IsStartDateEnabled: boolean = false;
  constructor(
    private fb: FormBuilder,
    private projectservice: ProjectService,
    private router: Router,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<UpdateProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngAfterViewInit(): void {}

  // Helper method to get tomorrow's date
  getTomorrowDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Reset time to beginning of the day
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }
  //  noPastDateValidator(): ValidatorFn {

  //   return (control: AbstractControl): ValidationErrors | null => {
  //     if (!control.value) return null;

  //     const selectedDate = new Date(control.value);
  //     selectedDate.setHours(0, 0, 0, 0);

  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);
  //     if(selectedDate > today){
  //       console.log("hahah")
  //       this.IsStartDateEnabled = true;

  //     }

  //     return selectedDate < today ? { pastDate: false } : null;

  //   };
  // }

  noPastDateValidator(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const selectedDate = new Date(control.value);
      selectedDate.setHours(0, 0, 0, 0);

      const compareDate = new Date(minDate);
      compareDate.setHours(0, 0, 0, 0);

      return selectedDate < compareDate ? { pastDate: true } : null;
    };
  }

  endDateAfterStartDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const endDate = new Date(control.value);
      const startDateControl = this.projectForm?.get('startDate');
      if (!startDateControl) return null;

      const startDate = new Date(startDateControl.value);

      if (!control.value || !startDate) return null;

      if (endDate < startDate) {
        return { endBeforeStart: true };
      }

      return null;
    };
  }

  ngOnInit(): void {
    this.loadMasterData();
    const isInvalidDate = (dateStr: string): boolean =>
      !dateStr || dateStr === '0001-01-01T00:00:00';
    this.IsStartDateEnabled = this.data.startDate == null;

    const prefield = this.data.startDate ? new Date(this.data.startDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let minStart = today;
    if (prefield && prefield < today) {
      minStart = prefield;
    }
    this.minStartDate = minStart;

    this.projectForm = this.fb.group({
      projectNumber: [{ value: this.data.projectNumber, disabled: true }],
      projectName: [this.data.projectName, Validators.required],
      projectTypeId: [Number(this.data?.projectTypeId)],
      areaId: [Number(this.data?.areaId)],
      priorityId: [Number(this.data?.priorityId)],
      project_Description: [this.data.project_Description, Validators.required],
      startDate: [
        this.data.startDate == null ? null : new Date(this.data.startDate),
        this.noPastDateValidator(minStart),
        // this.validateDateIsAfterToday(isInvalidDate(this.data.startDate) ? null : new Date(this.data.startDate)),
        //
      ],
      endDate: [
        this.data.endDate == null ? null : new Date(this.data.endDate),
        this.endDateAfterStartDateValidator(),
        // this.validateDateIsAfterToday(isInvalidDate(this.data.endDate) ? null : new Date(this.data.endDate))
      ],

      status: [Number(this.data.statusId), Validators.required],
    });

    this.minEndDate2 = this.projectForm.get('startDate')?.value;
    this.projectForm
      .get('startDate')
      ?.valueChanges.subscribe((newStart: Date) => {
        this.minEndDate2 = newStart;
        this.projectForm.get('endDate')?.updateValueAndValidity();
      });
  }

  loadMasterData() {
    this.projectservice.getProjectTypes().subscribe({
      next: (data) => (this.projectTypes = data),
      error: (err) => console.error('Error fetching project types:', err),
    });

    this.projectservice.getAreas().subscribe({
      next: (data) => (this.areas = data),
      error: (err) => console.error('Error fetching areas:', err),
    });
    this.projectservice.getPriorities().subscribe({
      next: (data) => (this.priorities = data),
      error: (err) => console.error('Error fetching areas:', err),
    });
    this.projectservice.getStatus().subscribe({
      next: (data) => (this.status = data),
      error: (err) => console.error('Error fetching areas:', err),
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (!user) {
        console.error('Unauthorized User!');
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
                cleanedFormValue[key] = new Date(value)
                  .toISOString()
                  .split('T')[0];
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
      const UpdateuserId = localStorage.getItem('UserId');

      const updatedProject: UpdateProject = {
        ...cleanedFormValue,
        statusId: cleanedFormValue.status,
        areaId: cleanedFormValue.areaId === 0 ? null : cleanedFormValue.areaId,
        projectTypeId:
          cleanedFormValue.projectTypeId === 0
            ? null
            : cleanedFormValue.projectTypeId,
        priorityId:
          cleanedFormValue.priorityId === 0
            ? null
            : cleanedFormValue.priorityId,
        // projectTypeId:cleanedFormValue.projectType,
        // priorityId:cleanedFormValue.priority,

        modifiedBy: UpdateuserId,
        modifiedDate: new Date().toISOString(),
      };

      console.log('Final update object:', updatedProject);

      this.projectservice
        .updateProject(this.data.projectId, updatedProject)
        .subscribe({
          next: (response) => {
            console.log('Project updated successfully', response);
            this.toastr.success('Updated successfully!');
            this.projectservice.triggerRefresh();
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating project:', error);
            this.toastr.error('Something Went Wrong!');
          },
        });
    } else {
      this.projectForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
