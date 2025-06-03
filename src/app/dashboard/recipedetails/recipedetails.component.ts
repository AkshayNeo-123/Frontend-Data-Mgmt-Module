import { Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { CommonTest, RecipeAndProject } from '../../models/recipe.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RecipeService } from '../../services/recipe.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { MatButtonModule } from '@angular/material/button';
import { AddCompoundingComponent } from '../add-compounding/add-compounding.component';
import { AddCompoundingService } from '../../services/add-compounding.service';
import { InjectionMoldingService } from '../../services/injection-molding.service';
import { AddCompoundingRequest, CompoundingDataDTO} from '../../models/compounding.model';
import { AddInjectionMoulding, InjectionMolding } from '../../models/injection-molding';
import { AddInjectionMoldingComponent } from '../add-injection-molding/add-injection-molding.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-recipedetails',
  standalone:true,
  imports: [CommonModule,MatDialogActions,  MatButtonModule,MatIcon,MatTooltipModule,MatCheckboxModule],
  templateUrl: './recipedetails.component.html',
  styleUrl: './recipedetails.component.css'
})
export class RecipedetailsComponent implements OnInit{


  goBack() {
this.router.navigate(['/dashboard']);
}
  
recipeId!:number;
  
  rec: RecipeAndProject ={
    //  recipeId:0,
    //  projectNumber:'',
    //  description:''
  }
   testData: CommonTest = {
    recipeNumber: 0
    
  };

compoundingData?:  CompoundingDataDTO[] | null = null;
injectionData:AddInjectionMoulding[]|null=null;
  displayedColumns: string[] = ['recipeId','projectNumber', 'description'];
  dataSource: MatTableDataSource<RecipeAndProject> = new MatTableDataSource<RecipeAndProject>();

  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private recipeService: RecipeService,
    private compoundingService:AddCompoundingService,
    private injectionMouldingService:InjectionMoldingService,
    private router:Router,
  ) {
    
  
  }

  ngOnInit(): void {  
    this.recipeId=history.state.id;
       console.log(this.recipeId);
      console.log('Recipe details:', this.rec);

            console.log('Recipe details fetching:', this.compoundingData);
  if (this.recipeId) {
    this.loadRecipeDetails(this.recipeId);
    this.loadCompoundingData(this.recipeId);
    this.loadInjectionData(this.recipeId);
    this.loadTestByRecipe(this.recipeId);
  }
  }
  
  

  loadRecipeDetails(recipeId:number): void {
    
      this.recipeService.getRecipeAndProjectById(recipeId).subscribe({
        next: (data) => {
          this.rec = data;
          console.log("loading the data :",recipeId);

        },
        error: (err) => console.error('Error fetching recipe details', err)
      });
    }
     

    
    loadCompoundingData(recipeId:number):void{
      this.compoundingService.getCompoundingDataByRecipeId(recipeId).subscribe({
        next:(data)=>{
          this.compoundingData=data;
          console.log("loading compounding Data :",this.compoundingData);
        },
                error: (err) => console.error('Error fetching recipe details', err)

      });
    }

    loadInjectionData(recipeId:number):void{

      this.injectionMouldingService.GetInjectionByRecipeId(recipeId).subscribe({
        next:(data)=>{
          this.injectionData=data;
                    console.log("loading injection Data :",this.injectionData);

        },
                error: (err) => console.error('Error fetching recipe details', err)

      })
    }

    loadTestByRecipe(recipeId:number):void{
        console.log('Calling getTestByRecipe with ID:', recipeId); 

      this.recipeService.getTestByRecipe(recipeId).subscribe({
      next:(data)=>{
        this.testData=data;
        console.log("test data is:",this.testData);
      },
      error:(err)=>console.error('Error fetching recipe details', err)
      })

    }

downloadPDF(): void {
  import('html2pdf.js').then(module => {
    const html2pdf = module.default;  

    const element = document.getElementById('pdf-content');
    if (!element) {
      console.error('PDF content container not found!');
      return;
    }

    const options = {
       margin:10,
      
      filename: 'recipeDetails.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all','css', 'legacy'] },
      avoid: ['.no-break'] 
    };

    html2pdf().set(options).from(element).save();
  });
}






    hasAnyProperty(data: any): boolean {
  if (!data) return false;

  return !!(
    data.mechanicalPropertyDto ||
    data.electricalPropertyDto ||
    data.generalPropertyDto ||
    data.temperaturePropertyDto ||
    data.flammabilityPropertyDto||
    data.propertiesDto
  );
}
get hasCompoundingData(): boolean {
  return Array.isArray(this.compoundingData) && this.compoundingData.length > 0;
}
get hasInjectionData():boolean{
  return Array.isArray(this.injectionData)&& this.injectionData?.length>0;
}
}

