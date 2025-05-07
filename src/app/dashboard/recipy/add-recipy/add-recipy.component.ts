// import { ProjectService } from './../../../services/project.service';

// import { Component, OnInit, ViewChild } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   Validators,
//   ReactiveFormsModule,
//   FormsModule,
// } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDialogActions, MatDialogRef } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { RecipeService } from '../../../services/recipe.service';
// import { CommonService } from '../../../services/common.service';
// import { MatTableModule, MatTableDataSource } from '@angular/material/table';
// import { ComponentService } from '../../../services/component.service';

// interface ComponentRow {
//   componentId: number | null;
//   wtPercentage: number | null;
//   volPercentage: number | null;
//   density: number | null;
//   type: string;
//   mp: boolean;
//   mf: boolean;
// }

// @Component({
//   selector: 'app-add-recipy',
//   standalone: true,
//   templateUrl: './add-recipy.component.html',
//   styleUrls: ['./add-recipy.component.css'],
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatButtonModule,
//     MatCheckboxModule,
//     MatIconModule,
//     MatCheckboxModule,
//     FormsModule,
//     MatTableModule,
//   ],
// })
// export class AddRecipyComponent implements OnInit {
//   recipeForm: FormGroup;
//   additives: any[] = [];
//   mainPolymers: any[] = [];
//   projects: any[] = [];
//   availableComponents: any[] = [];
//   components = new MatTableDataSource<any>([]);

//   displayedColumns: string[] = [
//     'componentName',
//     'wtPercentage',
//     'volPercentage',
//     'density',
//     'type',
//     'mp',
//     'mf',
//     'actions',
//   ];

//   constructor(
//     private fb: FormBuilder,
//     private recipeService: RecipeService,
//     private dialogRef: MatDialogRef<AddRecipyComponent>,
//     private commonService: CommonService,
//     private componentService: ComponentService,
//     private projectService: ProjectService
//   ) {
//     this.recipeForm = this.fb.group({
//       recipeNumber: ['', Validators.required],
//       productName: ['', Validators.required],
//       comments: [''],
//       projectNumber: [null, Validators.required],

//       mainPolymerId: ['', Validators.required],
//     });
//   }

//   ngOnInit(): void {
//     this.commonService.getAdditives().subscribe({
//       next: (res: any[]) => {
//         this.additives = res;
//       },
//       error: (err: any) => console.error('Failed to load additives:', err),
//     });

//     this.commonService.getMainPolymers().subscribe({
//       next: (res: any[]) => {
//         this.mainPolymers = res;
//       },
//       error: (err: any) => console.error('Failed to load main polymers:', err),
//     });

//     this.componentService.getAllComponents().subscribe({
//       next: (res: any[]) => {
//         this.availableComponents = res.map((item) => item.component);
//       },
//       error: (err: any) =>
//         console.error('Failed to load recipe components:', err),
//     });

//     this.projectService.getAllProjects().subscribe({
//       next: (res: any[]) => {
//         this.projects = res;
//       },
//       error: (err: any) => console.error('Failed to load projects:', err),
//     });
//   }

//   addComponent() {
//     const newComponent: ComponentRow = {
//       componentId: null,
//       wtPercentage: null,
//       volPercentage: null,
//       density: null,
//       type: '',
//       mp: false,
//       mf: false,
//     };

//     const currentData = this.components.data;
//     currentData.push(newComponent);
//     this.components.data = [...currentData];
//   }
//   deleteComponent(index: number): void {
//     const currentData = this.components.data;
//     currentData.splice(index, 1);
//     this.components.data = currentData;
//   }

//   onSubmit(): void {
//     if (this.recipeForm.valid) {
//       const newRecipe = {
//         ...this.recipeForm.value,
//         components: this.components.data,
//       };
//       console.log(newRecipe);
//       this.recipeService.addRecipe(newRecipe).subscribe({
//         next: () => {
//           alert('Recipe added successfully!');
//           this.dialogRef.close(true);
//         },
//         error: (err: any) => {
//           console.error('Error adding recipe:', err);
//           this.dialogRef.close(false);
//         },
//       });
//     }
//   }

  

//   onCancel(): void {
//     this.dialogRef.close();
//   }
// }


import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';

import { ProjectService } from '../../../services/project.service';
import { RecipeService } from '../../../services/recipe.service';
import { CommonService } from '../../../services/common.service';
import { ComponentService } from '../../../services/component.service';
import { RecipeComponentType } from '../../../models/recipe-component-type.model';

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

  components = new MatTableDataSource<ComponentRow>([]);
  displayedColumns: string[] = [
    'componentName',
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
    private projectService: ProjectService
  ) {
    this.recipeForm = this.fb.group({
      recipeNumber: ['', Validators.required],
      productName: ['', Validators.required],
      comments: [''],
      projectNumber: [null, Validators.required],
      mainPolymerId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDropdownData();
  }

  private loadDropdownData(): void {
    this.commonService.getAdditives().subscribe({
      next: (res) => (this.additives = res),
      error: (err) => console.error('Failed to load additives:', err),
    });

    this.commonService.getMainPolymers().subscribe({
      next: (res) => (this.mainPolymers = res),
      error: (err) => console.error('Failed to load main polymers:', err),
    });

    this.commonService.getRecipeComponentTypes().subscribe({
      next: (res) => (this.componentTypes = res),
      error: (err) => console.error('Failed to load component types:', err),
    });

    this.componentService.getAllComponents().subscribe({
      next: (res) => (this.availableComponents = res.map((item) => item.component)),
      error: (err) => console.error('Failed to load components:', err),
    });

    this.projectService.getAllProjects().subscribe({
      next: (res) => (this.projects = res),
    
      error: (err) => console.error('Failed to load projects:', err),
    });
    console.log(this.projects);
    
  }

  addComponent(): void {
    const newComponent: ComponentRow = {
      componentId: null,
      wtPercentage: null,
      volPercentage: null,
      density: null,
      type: '',
      mp: false,
      mf: false,
    };
    const currentData = this.components.data;
    currentData.push(newComponent);
    this.components.data = [...currentData];
  }

  deleteComponent(index: number): void {
    const currentData = this.components.data;
    currentData.splice(index, 1);
    this.components.data = [...currentData];
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      const newRecipe = {
        ...this.recipeForm.value,
        components: this.components.data,
      };

      this.recipeService.addRecipe(newRecipe).subscribe({
        next: () => {
          alert('Recipe added successfully!');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error adding recipe:', err);
          this.dialogRef.close(false);
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
