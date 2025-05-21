import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,  
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormArray,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Inject } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { RecipeService } from '../../../services/recipe.service';
import { CommonService } from '../../../services/common.service';
import { ComponentService } from '../../../services/component.service';
import { RecipeComponentType } from '../../../models/recipe-component-type.model';
import { Recipe } from '../../../models/recipe.model';
import { ToastrService } from 'ngx-toastr';
import { ValidatorFn, AbstractControl } from '@angular/forms';
 
interface ComponentRow {
  componentId: number | null;
  wtPercentage: number | null;
  volPercentage: number | null;
  density: number | null;
  type: string;
  mp: boolean;
  mf: boolean;
}
 
@Component({
  selector: 'app-add-recipy',
  standalone: true,
  templateUrl: './add-recipy.component.html',
  styleUrls: ['./add-recipy.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatTableModule,
  ],
})
export class AddRecipyComponent implements OnInit {
  recipeForm: FormGroup;
  additives: any[] = [];
  mainPolymers: any[] = [];
  projects: any[] = [];
  availableComponents: any[] = [];
  componentTypes: RecipeComponentType[] = [];
  displayedColumns: string[] = [
    'componentId',
    'wtPercent',
    'valPercent',
    'density',
    'typeId',
    'mp',
    'mf',
    'actions',
  ];
  isEdit = false;
 
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRecipyComponent>,
    private recipeService: RecipeService,
    private commonService: CommonService,
    private componentService: ComponentService,
    @Inject(MAT_DIALOG_DATA) public data: { recipe: Recipe },
    private projectService: ProjectService,
    private toastr: ToastrService
  ) {
    this.recipeForm = this.fb.group({
      productName: ['', Validators.required],
      comments: [''],
      projectId: [null, Validators.required],
      mainPolymerId: ['', Validators.required],
      additiveId: ['', Validators.required],
      components: this.fb.array([])
    });
    
  }

  
 
  ngOnInit(): void {
    this.loadDropdownData();
    
    
 
    if (this.data?.recipe) {
      this.isEdit = true;
      const r = this.data.recipe;
      this.commonService.getRecipeDataForUpdate(r.receipeId).subscribe({
        next: (res) =>{ console.log(res);
          this.recipeForm.patchValue({
        productName: res.recipe.productName,
        comments: res.recipe.comments,
        projectId: res.recipe.projectId,
        additiveId: res.recipe.additiveId,
        mainPolymerId: res.recipe.mainPolymerId,
       
      });
      const composition = res.component ?? [];
      if (Array.isArray(composition) && composition.length > 0) {
        composition.forEach((component: any) => this.addComponent(component));
      }
        }
        ,
        error: (err) => {
          console.error('Error loading recipe by ID', err);
          this.toastr.error('Failed to load recipe', 'Error');
        },
      });
 
      // this.recipeForm.patchValue({
      //   productName: r,
      //   comments: r.comment,
      //   projectId: r.projectId,
      //   additiveId: r.additiveId,
      //   mainPolymerId: r.mainPolymerId,
       
      // });
 
     
    }
  }
   
 
  // Custom validator for percentage range
  percentageRangeValidator() {
    return (control: any) => {
      const value = control.value;
      if (value < 0 || value > 100) {
        return { invalidPercentage: true };
      }
      return null;
    };
  }
 
  initForm(): void {
    this.recipeForm = this.fb.group({
      productName: ['', Validators.required],
      comments: [''],
      projectId: [null, Validators.required],
      mainPolymerId: ['', Validators.required],
      additiveId: ['', Validators.required],
      components: this.fb.array([]),
    });
  }
 
  loadDropdownData(): void {
    this.projectService.getAllProjects().subscribe((res) => (this.projects = res));
    this.commonService.getAdditives().subscribe((res) => (this.additives = res));
    this.commonService.getMainPolymers().subscribe((res) => (this.mainPolymers = res));
    this.componentService.getAllComponents().subscribe((res) => (this.availableComponents = res));
    this.commonService.getRecipeComponentTypes().subscribe((res) => (this.componentTypes = res));
  }
 
  get components(): FormArray {
    return this.recipeForm.get('components') as FormArray;
  }
 
  addComponent(component: any = {}): void {
    const userId = localStorage.getItem('UserId');
    const componentGroup = this.fb.group({
      componentId: [component.componentId || null],
      wtPercent: [
        component.wtPercent || null,
        [this.percentageRangeValidator()],
      ],
      valPercent: [
  component.valPercent ?? null,
  [this.percentageRangeValidator()],
],
      density: [component.density || null],
      typeId: [component.typeId || null],
      mp: [component.mp || false],
      mf: [component.mf || false],
      createdBy: [userId]
    });
 
    this.components.push(componentGroup);

  }
 
 
  deleteComponent(index: number): void {
    this.components.removeAt(index);
 
  }
 
  onSubmit(): void {

    if (this.recipeForm.valid) {
      const formValue = this.recipeForm.value;
      // const currentUser = JSON.parse(localStorage.getItem('UserId') || '{}');
    const userId = localStorage.getItem('UserId');
 
      const payload = {
        recipe: {
          productName: this.recipeForm.value.productName,
          comments: this.recipeForm.value.comments,
          projectId: this.recipeForm.value.projectId,
          additiveId: this.recipeForm.value.additiveId,
          mainPolymerId: this.recipeForm.value.mainPolymerId,
          ...(this.isEdit ? { modifiedBy: userId } : { createdBy: userId }),
        },
        component: this.components.value,
      };
 
      if (this.isEdit && this.data.recipe?.receipeId) {
        console.log(payload);
       
        this.recipeService.updateRecipe(this.data.recipe.receipeId, payload).subscribe({
          next: () => {
            console.log('Recipe Updated successfully');
            this.toastr.success('Updated successfully', 'Success');
            this.dialogRef.close(true); // ✅ Triggers reload in parent
          },
          error: (err) => {
            console.error('Error updating recipe', err);
            this.toastr.error('Failed to update recipe', 'Error');
          },
        });
      } else {
        console.log(payload);
        this.recipeService.addRecipe(payload).subscribe({
          next: () => {
            console.log('Recipe added successfully');
            this.toastr.success('Added successfully', 'Success');
            this.dialogRef.close(true); // ✅ Triggers reload in parent
          },
          error: (err) => {
            console.error('Error adding recipe', err);
            this.toastr.error('Failed to add recipe', 'Error');
          },
        });
      }
    } else {
      this.toastr.error('Please fill in all required fields', 'Form Error');
    }
  }
 
  onCancel(): void {
    this.dialogRef.close(false); // Close without saving
  }
}
 
 