import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  FormsModule,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TestService } from '../../services/test.service';
import { Router } from '@angular/router';
import { RecipeDataforTest } from '../../models/test';
import { MatOption } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatIcon } from '@angular/material/icon';
import { ConfirmDialogComponent } from '../CommonTs/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatOption,
    MatSelectModule,
    MatIcon,
    ConfirmDialogComponent,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './add-test.component.html',
  styleUrls: ['./add-test.component.css'],
})
export class AddTestComponent implements OnInit {
  sharedForm: FormGroup;
  mechanicalForm: FormGroup;
  temperatureForm: FormGroup;
  flammabilityForm: FormGroup;
  generalForm: FormGroup;
  electricalForm: FormGroup;
  propertiesForm: FormGroup;
  testIdForUpdate!: number;
  recipeData: RecipeDataforTest[] = [];
  isUpdateMode = false;
  testId: number | null = null;
  filteredRecipeData: any[] = [];     // filtered list for display
recipeSearchTerm: string = '';      // input search text
selectedRecipeId: number | null = null;  // currently selected recipe


  constructor(
    private _formBuilder: FormBuilder,
    private testService: TestService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location
  ) {
    // Common fields shown outside stepper
    this.sharedForm = this._formBuilder.group({
      productName: ['', Validators.required],
      recipeNumber: [{ value: '', disabled: true }],
      comment: [''],
      isPublish: [false],
      createdBy: [0],
      createdDate: ['']
    });

    this.mechanicalForm = this._formBuilder.group({
      tensileModulus_DAM: [null],
      tensileModulus_Conditioned: [null],
      tensileModulus_Conditioned_Mm_Min: [null],
      stressAtYield_DAM: [null],
      stressAtYield_Conditioned: [null],
      stressAtYield_Conditioned_Mm_Min: [null],
      strainAtYield_DAM: [null],
      strainAtYield_Conditioned: [null],
      strainAtYield_Conditioned_Mm_Min: [null],
      strainAtBreak_DAM: [null],
      strainAtBreak_Conditioned: [null],
      strainAtBreak_Conditioned_Mm_Min: [null],
      flexuralModulus_DAM: [null],
      flexuralModulus_Conditioned: [null],
      flexuralModulus_Conditioned_Mm_Min: [null],
      charpyNotchedImpact23: [null],
      charpyNotchedImpactMinus30: [null],
      flexuralStrength_DAM: [null],
      flexuralStrength_Conditioned: [null],
      flexuralStrength_Conditioned_Mm_Min: [null],
      flexuralStrainBreak_DAM: [null],
      flexuralStrainBreak_Conditioned: [null],
      charpyImpact_DAM: [null],
      charpyImpact_Conditioned: [null],
      izodNotchedImpact_DAM: [null],
      izodNotchedImpact_Conditioned: [null],
      shoreDHardness_DAM: [null],
      shoreDHardness_Conditioned: [null]
    });


    this.temperatureForm = this._formBuilder.group({
      tempHdtA: [null],
      tempHdtB: [null],
      meltingTemp: [null],
      coefficientsParallel: [null],
      coefficientsTransverse: [null],

    });

    this.flammabilityForm = this._formBuilder.group({
      burningRateWallThickness: [null],
      gwfi: [null],
      gwft: [null],
      burningRateThickness1: [null],
      burningRateThickness2: [null],
    })

    this.generalForm = this._formBuilder.group({
      density: [null],
      humidityAbsorption: [null],
      moldingShrinkageFlow: [null],
      moldingShrinkageTransverse: [null],
      mfr: [null],
      mvr: [null],
    });

    this.electricalForm = this._formBuilder.group({
      volumeResistivity1: [null],
      volumeResistivity2: [null],
      surfaceResistivity: [null],
      comparativeTracking: [null],
    });

    this.propertiesForm = this._formBuilder.group({
      sustainable: [false],
      flameRetardant: [false],
      heatStabilized130: [false],
      heatStabilized160: [false],
      heatStabilized230: [false],
      hydrolysisStabilized: [false],
      laserTransparent: [false],
      laserMarkable: [false],
      lowWarpage: [false],
      reducedDensity: [false],
      reducedMoisture: [false],
      electricallyNeutral: [false],
      uvStabilized: [false],
      surfaceModified: [false],
      adhesionModified: [false],
      tribologicalModified: [false],
      easyFlow: [false],
      nucleated: [false],
      processImproved: [false],
      fluidInjection: [false],
      recycledContent: [false],
      additiveManufacturing: [false]
    });
  }


  ngOnInit(): void {
    this.loadRecipeData();

    //checking if we're in update mode
    // this.route.params.subscribe(params => {
    //   if (params['id']) {
    //     this.isUpdateMode = true;
    //     this.testId = +params['id'];
    //     this.loadTestData(this.testId);
    //   }
    // });

   const state = this.location.getState() as { testIdUpdate?: number };

  if (state?.testIdUpdate) {
    this.isUpdateMode = true;
    this.testId = +state.testIdUpdate;
    this.loadTestData(this.testId);
  } else {
    this.isUpdateMode = false;
    // handle create mode
  }

    // this.testIdForUpdate = history.state.testIdUpdate;
    // if(this.testIdForUpdate!=0){
    //   this.isUpdateMode = true;
    //     // this.testId = +params['id'];
    //     this.loadTestData(this.testIdForUpdate);
    // }
    // // this.testIdForUpdate=0

  } 

  loadTestData(testId: number): void {
    this.testService.getTestById(testId).subscribe({
      next: (testData) => {
        this.patchFormsWithData(testData);
      },
      error: (err) => {
        console.error('Error loading test data:', err);
        this.toastr.error('Failed to load test data');
      }
    });
  }

  patchFormsWithData(data: any): void {
    // Patch shared form
    this.sharedForm.patchValue({
      productName: data.test.recipeNumber, 
      recipeNumber: data.test.recipeNumber,
      comment: data.test.comment,
      isPublish: data.test.isPublish,
      createdBy: data.test.createdBy,
      createdDate: data.test.createdDate
    });

    // Patch mechanical properties if they exist
    if (data.mechanicalProperty) {
      this.mechanicalForm.patchValue(data.mechanicalProperty);
    }

    // Patch temperature properties if they exist
    if (data.temperatureProperty) {
      this.temperatureForm.patchValue(data.temperatureProperty);
    }

    // Patch flammability properties if they exist
    if (data.flammabilityProperty) {
      this.flammabilityForm.patchValue(data.flammabilityProperty);
    }

    // Patch general properties if they exist
    if (data.generalProperty) {
      this.generalForm.patchValue(data.generalProperty);
    }

    // Patch electrical properties if they exist
    if (data.electricalProperty) {
      this.electricalForm.patchValue(data.electricalProperty);
    }

    // Patch properties if they exist
    if (data.properties) {
      this.propertiesForm.patchValue(data.properties);
    }
  }

  goBack() {
    this.router.navigate(['/gettest']);
  }

  resetAllForms() {
    this.sharedForm.reset();
    this.mechanicalForm.reset();
    this.temperatureForm.reset();
    this.flammabilityForm.reset();
    this.generalForm.reset();
    this.electricalForm.reset();
    this.propertiesForm.reset();    
  }

  handleAddToTechnicalSheet(): void {
    console.log("buttopn click for Technical Data Sheet ")
    this.sharedForm.patchValue({ isPublish: true });
    console.log('isPublish value now:', this.sharedForm.get('isPublish')?.value);

    this.toastr.success('Added to Technical Data Sheet successfully');
  }

  handleToggleTechnicalSheet(): void {
  const isPublished = this.sharedForm.get('isPublish')?.value;

  this.sharedForm.patchValue({ isPublish: !isPublished }); // toggle value

  if (!isPublished) {
    this.toastr.success('Added to Technical Data Sheet successfully');
  } else {
    this.toastr.warning('Removed from Technical Data Sheet');
  }

  console.log('isPublish is now:', this.sharedForm.get('isPublish')?.value);
}


  // onSubmit() {
  //   const adduserId = localStorage.getItem('UserId');

  //   if (this.sharedForm.invalid) {
  //     if (this.sharedForm.get('productName')?.hasError('required')) {
  //       this.toastr.error('Please select a Recipe Name.', 'Validation Error');
  //     }
  //     return;
  //   }

  //   const isFormEmpty = (form: FormGroup): boolean => {
  //     return Object.values(form.value).every(
  //       (value) => value === null || value === '' || value === false
  //     );
  //   };

  //   this.sharedForm.patchValue({
  //     createdBy: adduserId ? parseInt(adduserId, 10) : 0,
  //     createdDate: new Date().toISOString()
  //   });

  //   const requestBody = {
  //     test: this.sharedForm.getRawValue(),
  //     mechanicalProperty: isFormEmpty(this.mechanicalForm) ? {} : this.mechanicalForm.value,
  //     temperatureProperty: isFormEmpty(this.temperatureForm) ? {} : this.temperatureForm.value,
  //     flammabilityProperty: isFormEmpty(this.flammabilityForm) ? {} : this.flammabilityForm.value,
  //     generalProperty: isFormEmpty(this.generalForm) ? {} : this.generalForm.value,
  //     electricalProperty: isFormEmpty(this.electricalForm) ? {} : this.electricalForm.value,
  //     properties: isFormEmpty(this.propertiesForm) ? {} : this.propertiesForm.value
  //   };

  //   const isPublish = this.sharedForm.get('isPublish')?.value;

  //   if (!isPublish) {
  //     // Show confirmation dialog if isPublish is false
  //     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //       width: '400px',
  //       data: {
  //         title: 'Confirmation',
  //         message: 'Do you want to add data in technical sheet?',
  //       },
  //     });

  //     dialogRef.afterClosed().subscribe((result) => {
  //       if (result) {
  //         // User confirmed: set isPublish to true and submit
  //         this.sharedForm.patchValue({
  //           isPublish: true,
  //           createdBy: adduserId ? parseInt(adduserId, 10) : 0,
  //           createdDate: new Date().toISOString(),
  //         });

  //         const requestBody = this.buildRequestBody(isFormEmpty);
  //         this.submitForm(requestBody);
  //         this.toastr.success('Added in technical sheet');
  //       }
  //     });
  //     return; // Wait for dialog response, do not continue
  //   }

  //   // If isPublish is true, submit form directly
  //   this.sharedForm.patchValue({
  //     createdBy: adduserId ? parseInt(adduserId, 10) : 0,
  //     createdDate: new Date().toISOString(),
  //   });

  //   const requestBody = this.buildRequestBody(isFormEmpty);
  //   this.submitForm(requestBody);
  // }

  onSubmit() {
    const adduserId = localStorage.getItem('UserId');

    if (this.sharedForm.invalid) {
      if (this.sharedForm.get('productName')?.hasError('required')) {
        this.toastr.error('Please select a Recipe Name.', 'Validation Error');
      }
      return;
    }

    const isFormEmpty = (form: FormGroup): boolean => {
      return Object.values(form.value).every(value =>
        value === null || value === '' || value === false
      );
    };

    this.sharedForm.patchValue({
      createdBy: adduserId ? parseInt(adduserId, 10) : 0,
      createdDate: new Date().toISOString()
    });

    const requestBody = {   
      test: this.sharedForm.getRawValue(),
      mechanicalProperty: isFormEmpty(this.mechanicalForm) ? {} : this.mechanicalForm.value,
      temperatureProperty: isFormEmpty(this.temperatureForm) ? {} : this.temperatureForm.value,
      flammabilityProperty: isFormEmpty(this.flammabilityForm) ? {} : this.flammabilityForm.value,
      generalProperty: isFormEmpty(this.generalForm) ? {} : this.generalForm.value,
      electricalProperty: isFormEmpty(this.electricalForm) ? {} : this.electricalForm.value,
      properties: isFormEmpty(this.propertiesForm) ? {} : this.propertiesForm.value
    };
    const requestBodyforupdate = {
      test: this.sharedForm.getRawValue(),
      mechanicalProperty: isFormEmpty(this.mechanicalForm) ? null : this.mechanicalForm.value,
      temperatureProperty: isFormEmpty(this.temperatureForm) ? null : this.temperatureForm.value,
      flammabilityProperty: isFormEmpty(this.flammabilityForm) ? null : this.flammabilityForm.value,
      generalProperty: isFormEmpty(this.generalForm) ? null : this.generalForm.value,
      electricalProperty: isFormEmpty(this.electricalForm) ? null : this.electricalForm.value,
      properties: isFormEmpty(this.propertiesForm) ? null : this.propertiesForm.value
    };

    if (this.isUpdateMode && this.testId) {
      // Update existing test
      console.log("updatyed Data",requestBody);
      
      this.testService.updateTest(this.testId, requestBodyforupdate).subscribe(
        response => {
          this.toastr.success('Test updated successfully');
          this.router.navigate(['/gettest']);
          // this.testIdForUpdate=0
        },
        error => {
          console.error('Error updating test:', error);
          this.toastr.error('Failed to update test');
        }
      );
    } else {
      // Create new test
      this.testService.addTest(requestBody).subscribe(
        response => {
          this.toastr.success('Submitted successfully');
          this.resetAllForms();
          this.router.navigate(['/gettest']);
        },
        error => {
          console.error('Error submitting form:', error);
        }
      );
    }
  }

  private buildRequestBody(isFormEmpty: (form: FormGroup) => boolean) {
    return {
      test: this.sharedForm.getRawValue(),
      mechanicalProperty: isFormEmpty(this.mechanicalForm)
        ? {}
        : this.mechanicalForm.value,
      temperatureProperty: isFormEmpty(this.temperatureForm)
        ? {}
        : this.temperatureForm.value,
      flammabilityProperty: isFormEmpty(this.flammabilityForm)
        ? {}
        : this.flammabilityForm.value,
      generalProperty: isFormEmpty(this.generalForm)
        ? {}
        : this.generalForm.value,
      electricalProperty: isFormEmpty(this.electricalForm)
        ? {}
        : this.electricalForm.value,
      properties: isFormEmpty(this.propertiesForm)
        ? {}
        : this.propertiesForm.value,
    };
  }

  private submitForm(requestBody: any) {
    this.testService.addTest(requestBody).subscribe(
      (response) => {
        this.toastr.success('Submitted successfully');
        this.resetAllForms();
        this.router.navigate(['/gettest']);
      },
      (error) => {
        console.error('Error submitting form:', error);
        this.toastr.error('Failed to submit form');
      }
    );
  }




  loadRecipeData() {
    this.testService.getRecipeDataForTest().subscribe({
      next: (data: RecipeDataforTest[]) => {
        this.recipeData = data;
        console.log(this.recipeData);
        this.filteredRecipeData = [...this.recipeData]; // initially show all

      },
      error: (err) => {
        console.error('Error fetching recipe data:', err);
      }
    })
  }

  onRecipeSelect(event: any) {
    const selectedRecipe = this.recipeData.find(r => r.receipeId === event.value);
    if (selectedRecipe) {
      this.sharedForm.patchValue({
        recipeNumber: selectedRecipe.receipeId
      });
    }
  }

  onCancel() {
    this.resetAllForms();
    this.router.navigate(['/gettest']);
  }
  filterRecipeList() {
  const searchTerm = this.recipeSearchTerm.toLowerCase().trim();
  this.filteredRecipeData = this.recipeData.filter(recipe =>
    recipe.productName.toLowerCase().includes(searchTerm)
  );
}
// onRecipeSelect(event: any) {
//   this.selectedRecipeId = event.value;
//   const selectedRecipe = this.recipeData.find(r => r.receipeId === event.value);
//   console.log('Selected Recipe:', selectedRecipe);
// }
onDropdownOpenChange(opened: boolean) {
  if (!opened) {
    this.recipeSearchTerm = '';
    this.filteredRecipeData = [...this.recipeData]; // reset list
  }
}

}