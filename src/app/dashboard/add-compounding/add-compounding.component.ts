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
    MatRadioModule
  ],
  templateUrl: './add-compounding.component.html',
  styleUrls: ['./add-compounding.component.css']
})
export class AddCompoundingComponent {
  compoundForm: FormGroup;
  componentOptions: string[] = ['Component A', 'Component B', 'Component C'];
  repetitionCount = 0;

  get components() {
    return (this.compoundForm.get('components') as FormArray).controls;
  }

  constructor(
    private fb: FormBuilder,
    private compoundingService: AddCompoundingService ,
    private toastr: ToastrService,

  ) {
    this.compoundForm = this.fb.group({
      recipeNumber: [7],
      parameterSet: [],
      date: [ ],
      note: [''],
      temperature: [ ],
      duration: [ ],
      residualMoisture: [ ],
      notMeasured: [false],
      speedFeeder1: [ ],
      speedFeeder2: [ ],
      screwStandard: [false], 
      screwModified: [false],
      degassingStandard: [false],
      degassingVacuum: [false],
      degassingNone: [false],
      degassingFET: [false],
      screwSpeed: [ ],
      torque: [ ],
      pressure: [ ],
      totalOutput: [ ],
      granulator: [ ],
      bulkDensity: [ ],
      coolingSection: [ ],
      tempBath1: [ ],
      tempBath2: [ ],
      tempBath3: [ ],
      meltPump: [ ],
      underwaterPelletizer: [ ],
      nozzlePlate:[ ],
      productionNote:[ ],
      premix:[false],
      PremixNote:[''],
      temp1: [100],
      temp2: [200],
      temp3: [200],
      temp4: [200],
      temp5: [200],
      temp6: [100],
      temp7: [200],
      temp8: [200],
      temp9: [230],
      temp10: [230],
      temp11: [230],
      temp12: [230],
      pretreatmentNone: [false],
      pretreatmentDrying: [false],
      components: this.fb.array([]) 
    });

    this.addComponent();
  }

  addComponent() {
    const componentGroup = this.fb.group({
      name: [1],
      share: [0],
      MF: [false],
      SecondF: [false],
      SF: [false],
      A:[false],
      B:[false],
      C:[false],
      D:[false],
      E:[false],
      F:[false]
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file.name);
    }
  }

  increaseRepetition() {
    this.repetitionCount++;
  }

  decreaseRepetition() {
    if (this.repetitionCount > 0) {
      this.repetitionCount--;
    }
  }

  onSubmit() {
    if (this.compoundForm.valid) {
      const formValue = this.compoundForm.value;
  
      const requestBody = {
        compoundingDataDTO: {
          receipeId: formValue.recipeNumber,
          parameterSet: formValue.parameterSet,
          date: formValue.date,
          notes: formValue.note,
          repetation: this.repetitionCount,
          pretreatment: formValue.pretreatment,
          temperature: formValue.temperature,
          duration: formValue.duration,
          residualM: formValue.residualMoisture,
          notMeasured: formValue.notMeasured,
          pretreatmentNone: formValue.pretreatmentNone,
          pretreatmentDrying: formValue.pretreatmentDrying
        },
        components: formValue.components.map((comp: any) => ({
          componentId: 0, 
          share: +comp.share,
          mf: comp.MF,
          _2ndF: comp.SecondF,
          sf: comp.SF,
          a: comp.A,
          b: comp.B,
          c: comp.C,
          d: comp.D,
          e: comp.E,
          f: comp.F
        })),
        dosageDTO: {
          speedSideFeeder1: formValue.speedFeeder1,
          speedSideFeeder2: formValue.speedFeeder2,
          upload_Screwconfig: "string", 
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
          createdDate: new Date().toISOString(),
          createdBy: 0,
          modifiedBy: 0,
          modifiedDate: new Date().toISOString()
        }
      };
  
      console.log(requestBody)
      // Send structured data to API
      this.compoundingService.addCompoundingData(requestBody).subscribe({
        next: (response) => {
          console.log('API response:', response);
        },
        error: (err) => {
          console.error('API error:', err);
        }
      });
  
    } else {
      console.log('Form is invalid');
    }
  }
  
}
