import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { AddCompoundingService } from '../../services/add-compounding.service';
import { ToastrService } from 'ngx-toastr';
import { ComponentService } from '../../services/component.service';
import { MaterialService } from '../../services/material.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-compounding',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    CommonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-compounding.component.html',
  styleUrls: ['./add-compounding.component.css']
})
export class AddCompoundingComponent {
  compoundForm: FormGroup;
  componentOptions: any[] = [];
  repetitionCount = 0;
maxRepetition: number = 230;

  today = new Date();

  get components() {
    return (this.compoundForm.get('components') as FormArray).controls;
  }

  constructor(
    private fb: FormBuilder,
    private compoundingService: AddCompoundingService,
    private toastr: ToastrService,
    private componentService: ComponentService,
    private materialService: MaterialService,


  ) {
    this.loadComponents();
    this.compoundForm = this.fb.group({
      recipeNumber: [{ value: '7', disabled: true }],
      parameterSet: [{ value: '001', disabled: true }],
      date: [null, ''],
      note: [''],
      temperature: [],
      duration: [],
      residualMoisture: [],
      notMeasured: [false],
      speedFeeder1: [],
      speedFeeder2: [],
      screwStandard: [false],
      screwModified: [false],
      degassingStandard: [false],
      degassingVacuum: [false],
      degassingNone: [false],
      degassingFET: [false],
      screwSpeed: [],
      torque: [],
      pressure: [],
      totalOutput: [],
      granulator: [],
      bulkDensity: [],
      coolingSection: [],
      tempBath1: [],
      tempBath2: [],
      tempBath3: [],
      meltPump: [false],
      underwaterPelletizer: [false],
      nozzlePlate: [false],
      productionNote: [''],
      premix: [false],
      PremixNote: [''],
      temp1: [],
      temp2: [],
      temp3: [],
      temp4: [],
      temp5: [],
      temp6: [],
      temp7: [],
      temp8: [],
      temp9: [],
      temp10: [],
      temp11: [],
      temp12: [],
      upload_Screwconfig: [''],
      pretreatmentNone: [false],
      pretreatmentDrying: [false],
      components: this.fb.array([]),
    });

    this.addComponent();
  }

  // ADDED: Load component options from API
  loadComponents() {
    this.componentService.getAllComponents().subscribe({
      next: (data) => {
        this.componentOptions = data;

      },
      error: (err) => {
        console.error('Failed to load components', err);
      }
    });
  }



  addComponent() {
    const componentGroup = this.fb.group({
      name: [""],
      share: [0],
      MF: [false],
      SecondF: [false],
      SF: [false],
      A: [false],
      B: [false],
      C: [false],
      D: [false],
      E: [false],
      F: [false]
    });

    (this.compoundForm.get('components') as FormArray).push(componentGroup);
  }

  removeComponent(index: number) {
    (this.compoundForm.get('components') as FormArray).removeAt(index);
  }

  getTotalShare(): number {
    return (this.compoundForm.get('components') as FormArray).value
      .reduce((acc: number, curr: any) => acc + (+curr.share || 0), 0);
  }

  onFileSelected(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (file.type !== 'application/pdf') {
        this.toastr.error('Only PDF files are allowed.', 'Invalid File', { timeOut: 3000 });
        input.value = '';
        return;
      }

      const currentFilePath = this.compoundForm.get(controlName)?.value;
      if (currentFilePath) {
        this.materialService.updateMaterialFile(file, currentFilePath).subscribe({
          next: (res) => {
            const filePath = `${res.fileName}`;
            this.compoundForm.get(controlName)?.setValue(filePath);
          },
          error: (err) => {
            console.error('File upload failed:', err);
            this.toastr.error('File upload failed.', 'Error', { timeOut: 3000 });
          }
        });
      } else {
        this.materialService.postFileMaterial(file).subscribe({
          next: (res) => {
            const filePath = `${res.fileName}`;
            this.compoundForm.get(controlName)?.setValue(filePath);
          },
          error: (err) => {
            console.error('File upload failed:', err);
            this.toastr.error('File upload failed.', 'Error', { timeOut: 3000 });
          }
        });
      }
    }
  }

 increaseRepetition() {
  if (this.repetitionCount < this.maxRepetition) {
    this.repetitionCount++;
  }
}

decreaseRepetition() {
  if (this.repetitionCount > 0) {
    this.repetitionCount--;
  }
}

  onSubmit() {
    const adduserId=localStorage.getItem('UserId');


    if (this.compoundForm.invalid) {
      this.compoundForm.markAllAsTouched();
      return;
    }

    const formValue = this.compoundForm.getRawValue();

    const validComponentIds = this.componentOptions.map(c => c.id);
    const filteredComponents = [];

    for (const comp of formValue.components) {
      const {
        name, share, MF, SecondF, SF,
        A, B, C, D, E, F
      } = comp;

      const anyCheckboxSelected =
        share || MF || SecondF || SF || A || B || C || D || E || F;

      if (anyCheckboxSelected && (!name || name.trim() === "")) {
        this.toastr.error("Select component name");
        return;
      }

      //  If name is selected, it must be valid
      if (name && !validComponentIds.includes(+name)) {
        this.toastr.error(`Invalid component selected: ${name}`);
        return;
      }

      //  Only push if name is selected
      if (name && name.trim() !== "") {
        filteredComponents.push({
          componentId: +name,
          share: +share,
          mf: MF,
          _2ndF: SecondF,
          sf: SF,
          a: A,
          b: B,
          c: C,
          d: D,
          e: E,
          f: F
        });
      }
    }

    const requestBody: any = {
      compoundingDataDTO: {
        receipeId: formValue.recipeNumber,
        parameterSet: formValue.parameterSet,
        date: new Date(formValue.date).toISOString().split('T')[0],
        notes: formValue.note,
        repetation: this.repetitionCount,
        pretreatment: formValue.pretreatment,
        temperature: formValue.temperature,
        duration: formValue.duration,
        residualM: formValue.residualMoisture,
        notMeasured: formValue.notMeasured,
        pretreatmentNone: formValue.pretreatmentNone,
        pretreatmentDrying: formValue.pretreatmentDrying,
        dryingTime: formValue.dryingTime,
         createdBy: adduserId,
      },
      ...(filteredComponents.length > 0 && {
        components: filteredComponents,
        createdBy: adduserId,
      }),
      dosageDTO: {
        speedSideFeeder1: formValue.speedFeeder1,
        speedSideFeeder2: formValue.speedFeeder2,
        upload_Screwconfig: formValue.upload_Screwconfig,
        screwSpeed: formValue.screwSpeed,
        torque: formValue.torque,
        pressure: formValue.pressure,
        totalOutput: formValue.totalOutput,
        granulator: formValue.granulator,
        bulkDensity: formValue.bulkDensity,
        coolingSection: formValue.coolingSection,
        notes: formValue.productionNote,
        meltPump: formValue.meltPump,
        nozzlePlate: formValue.nozzlePlate,
        premix: formValue.premix,
        underwaterPelletizer: formValue.underwaterPelletizer,
        temp1: formValue.temp1,
        temp2: formValue.temp2,
        temp3: formValue.temp3,
        temp4: formValue.temp4,
        temp5: formValue.temp5,
        temp6: formValue.temp6,
        temp7: formValue.temp7,
        temp8: formValue.temp8,
        temp9: formValue.temp9,
        temp10: formValue.temp10,
        temp11: formValue.temp11,
        temp12: formValue.temp12,
        screwConfigStadard: formValue.screwStandard,
        screwConfigModified: formValue.screwModified,
        deggassingStadard: formValue.degassingStandard,
        deggassingVaccuum: formValue.degassingVacuum,
        deggassingNone: formValue.degassingNone,
        deggassingFET: formValue.degassingFET,
        premixNote: formValue.PremixNote,
        temperatureWaterBath1: formValue.tempBath1,
        temperatureWaterBath2: formValue.tempBath2,
        temperatureWaterBath3: formValue.tempBath3,
        createdDate: formValue.createdDate,
        createdBy:adduserId,
        modifiedBy: formValue.modifiedBy,
        modifiedDate: formValue.modifiedDate
      }


    };

    this.compoundingService.addCompoundingData(requestBody).subscribe({
      next: (res) => {
        console.log('API Success:', res);
        this.toastr.success('Saved successfully.', 'Success', {
          timeOut: 3000
        });
        this.compoundForm.reset();
        this.repetitionCount = 0;
        (this.compoundForm.get('components') as FormArray).clear();
        this.addComponent();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.toastr.error('Failed to submit the form.', 'Error', { timeOut: 3000 });
      }
    });
  }


}