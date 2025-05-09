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
  componentOptions: any[] = [];
  repetitionCount = 0;

  get components() {
    return (this.compoundForm.get('components') as FormArray).controls;
  }

  constructor(
    private fb: FormBuilder,
    private compoundingService: AddCompoundingService,
    private toastr: ToastrService,
    private componentService: ComponentService ,
    private materialService: MaterialService,
    

  ) {
    this.loadComponents(); 
    this.compoundForm = this.fb.group({
      recipeNumber: [{value:'7',disabled:true}],
      parameterSet: [{value:'001',disabled:true}],
      date: [],
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
      meltPump: [],
      underwaterPelletizer: [],
      nozzlePlate: [],
      productionNote: [],
      premix: [false],
      PremixNote: [''],
      temp1: [ ],
      temp2: [ ],
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
      upload_Screwconfig:[''],
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

  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const file = input.files[0];
  //     console.log('Selected file:', file.name);
  //   }
  // }

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
    this.repetitionCount++;
  }

  decreaseRepetition() {
    if (this.repetitionCount > 0) {
      this.repetitionCount--;
    }
  }

  onSubmit() {
    if (this.compoundForm.invalid) {
      this.compoundForm.markAllAsTouched();
      return;
    }
  
    const formValue = this.compoundForm.value;
  
    const validComponentIds = this.componentOptions.map(c => c.id);
    const filteredComponents = [];
  
    for (const comp of formValue.components) {
      const {
        name, share, MF, SecondF, SF,
        A, B, C, D, E, F
      } = comp;
  
      const anyCheckboxSelected =
      share|| MF || SecondF || SF || A || B || C || D || E || F;
  
      if (anyCheckboxSelected && (!name || name.trim() === "")) {
        this.toastr.error("Select component name");
        return;
      }
  
      // ✅ 2. If name is selected, it must be valid
      if (name && !validComponentIds.includes(+name)) {
        this.toastr.error(`Invalid component selected: ${name}`);
        return;
      }
  
      // ✅ 3. Only push if name is selected
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
        date: formValue.date,
        notes: formValue.note,
        repetation: this.repetitionCount,
        pretreatment: formValue.pretreatment,
        temperature: formValue.temperature,
        duration: formValue.duration,
        residualM: formValue.residualMoisture,
        notMeasured: formValue.notMeasured,
        pretreatmentNone: formValue.pretreatmentNone,
        pretreatmentDrying: formValue.pretreatmentDrying,
        dryingTime: formValue.dryingTime
      },
      ...(filteredComponents.length > 0 && {
        components: filteredComponents
      }),
      dosageDTO: {
        // include all your dosage fields here
        feederId1: formValue.feeder1,
        feederId2: formValue.feeder2,
        feederId3: formValue.feeder3,
        feederId4: formValue.feeder4,
        feederId5: formValue.feeder5,
        feederId6: formValue.feeder6,
        feederId7: formValue.feeder7,
        feederId8: formValue.feeder8,
        feederId9: formValue.feeder9,
        feederId10: formValue.feeder10,
        feederId11: formValue.feeder11,
        feederId12: formValue.feeder12,
      }
    };
  
    this.compoundingService.addCompoundingData(requestBody).subscribe({
      next: (res) => {
        console.log('API Success:', res);
        // Show success toast
        this.toastr.success('Saved successfully.', 'Success', {
          timeOut: 3000
        });
      },
      error: (err) => {
        console.error('API Error:', err);
        this.toastr.error('Failed to submit the form.', 'Error', { timeOut: 3000 });
      }
    });
  }
  
  
}
