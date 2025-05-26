import { Component, Inject, NgModule, ViewChild } from '@angular/core';
import { RecipeAndProject } from '../../models/recipe.model';
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

@Component({
  selector: 'app-recipedetails',
  standalone:true,
  imports: [CommonModule,MatDialogActions,  MatButtonModule,MatIcon,MatTooltipModule],
  templateUrl: './recipedetails.component.html',
  styleUrl: './recipedetails.component.css'
})
export class RecipedetailsComponent {


  goBack() {
this.router.navigate(['/dashboard']);
}
  
recipeId!:number;
  
  rec: RecipeAndProject ={
    //  recipeId:0,
    //  projectNumber:'',
    //  description:''
  }

compoundingData:  CompoundingDataDTO[] | null = null;
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

    downloadPDF(): void {
      const content = document.getElementById('pdf-content');
    
      if (!content) {
        console.error('PDF content container not found!');
        return;
      }
    
      html2canvas(content,{ scale: 2,scrollY:0 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('recipe-data.pdf');
      });
    }


}

