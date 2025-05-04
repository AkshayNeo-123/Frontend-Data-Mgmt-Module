import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../../services/recipe.service';
import { CommonService } from '../../../services/common.service';
import { MatTableModule } from '@angular/material/table';
import { ComponentService } from '../../../services/component.service'; // NEW import

@Component({
  selector: 'app-add-recipy',
  standalone: true,
  templateUrl: './add-recipy.component.html',
  styleUrls: ['./add-recipy.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogActions,
    MatCheckboxModule,
    FormsModule,
    MatTableModule
  ]
})
export class AddRecipyComponent implements OnInit {
  recipeForm: FormGroup;
  additives: any[] = [];
  mainPolymers: any[] = [];
  components: any[] = [];
  availableComponents: any[] = []; 

  displayedColumns: string[] = [
    'componentName',
    'wtPercentage',
    'volPercentage',
    'density',
    'type',
    'mp',
    'mf',
    'actions'
  ];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private dialogRef: MatDialogRef<AddRecipyComponent>,
    private commonService: CommonService,
    private componentService: ComponentService // NEW
  ) {
    this.recipeForm = this.fb.group({
      recipeNumber: ['', Validators.required],
      productName: ['', Validators.required],
      comments: [''],
      projectNumber: [null, Validators.required],
      mainPolymerId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.commonService.getAdditives().subscribe({
      next: (res: any[]) => {
        this.additives = res;
      },
      error: (err: any) => console.error('Failed to load additives:', err)
    });

    this.commonService.getMainPolymers().subscribe({
      next: (res: any[]) => {
        this.mainPolymers = res;
      },
      error: (err: any) => console.error('Failed to load main polymers:', err)
    });

  this.componentService.getAllComponents().subscribe({
  next: (res: any[]) => {
    this.availableComponents = res.map(item => item.component); // extract `component`
  },
  error: (err: any) => console.error('Failed to load recipe components:', err)
});

  }

  addComponent(): void {
    this.components.push({
      componentName: '',
      wtPercentage: null,
      volPercentage: null,
      density: null,
      type: '',
      mp: false,
      mf: false
    });
  }

  removeComponent(index: number): void {
    this.components.splice(index, 1);
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      const newRecipe = {
        ...this.recipeForm.value,
        components: this.components
      };

      this.recipeService.addRecipe(newRecipe).subscribe({
        next: () => {
          alert('Recipe added successfully!');
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          console.error('Error adding recipe:', err);
          this.dialogRef.close(false);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
