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
    'wtPercentage',
    'volPercentage',
    'density',
    'type',
    'mp',
    'mf',
    'actions',
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRecipyComponent>,
    private recipeService: RecipeService,
    private commonService: CommonService,
    private componentService: ComponentService,
    @Inject(MAT_DIALOG_DATA) public data: Recipe,
    private projectService: ProjectService
  ) {
    this.recipeForm = this.fb.group({
      // recipeNumber: ['', Validators.required],
      productName: ['', Validators.required],
      comments: [''],
      projectId: [null, Validators.required],
      mainPolymerId: ['', Validators.required],
      additiveId: ['', Validators.required],
      components: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadDropdownData();
    this.addComponent(); // Start with one row by default
     if (this.data) {
    this.recipeForm.patchValue(this.data);
  }
  }

  loadDropdownData(): void {
    this.projectService
      .getAllProjects()
      .subscribe((res) => (this.projects = res));
    this.commonService
      .getAdditives()
      .subscribe((res) => (this.additives = res));
    this.commonService
      .getMainPolymers()
      .subscribe((res) => (this.mainPolymers = res));
    this.componentService
      .getAllComponents()
      .subscribe((res) => (this.availableComponents = res));
    this.commonService
      .getRecipeComponentTypes()
      .subscribe((res) => (this.componentTypes = res));
  }

  get components(): FormArray {
    return this.recipeForm.get('components') as FormArray;
  }

  addComponent(): void {
    const componentGroup = this.fb.group({
      componentId: [null, Validators.required],
      wtPercentage: [null],
      volPercentage: [null],
      density: [null],
      type: [''],
      mp: [false],
      mf: [false],
    });

    this.components.push(componentGroup);
  }

  deleteComponent(index: number): void {
    this.components.removeAt(index);
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      const formValue = this.recipeForm.value;

      const payload = {
        recipe: {
          productName: formValue.productName,
          comments: formValue.comments,
          projectId: formValue.projectId,
          additiveId: formValue.additiveId,
          mainPolymerId: formValue.mainPolymerId,
        },
        component: formValue.components.map((c: any) => ({
          componentId: c.componentId,
          wtPercent: c.wtPercentage,
          valPercent: c.volPercentage,
          density: c.density,
          mp: c.mp,
          mf: c.mf,
          typeId: +c.type,
        })),
      };

      this.recipeService.addRecipe(payload).subscribe({
        next: (createdRecipe) => {
          this.dialogRef.close(createdRecipe); 
        },
        error: (err) => console.error('Error adding recipe', err),
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}


