import { Component, Inject, NgModule, ViewChild } from '@angular/core';
import { RecipeAndProject } from '../../models/recipe.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RecipeService } from '../../services/recipe.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-recipedetails',
  standalone:true,
  imports: [CommonModule,MatDialogActions,  MatButtonModule,],
  templateUrl: './recipedetails.component.html',
  styleUrl: './recipedetails.component.css'
})
export class RecipedetailsComponent {


  isSidebarOpen = true;
  selectedSection: string = 'dashboard';
  paginatedRecipes: RecipeAndProject[] = [];
  
  rec: RecipeAndProject ={
     recipeId:0,
     projectNumber:'',
     description:''
  }

  displayedColumns: string[] = ['recipeId','projectNumber', 'description'];
  dataSource: MatTableDataSource<RecipeAndProject> = new MatTableDataSource<RecipeAndProject>();

  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private recipeService: RecipeService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: RecipeAndProject,
    private dialogRef: MatDialogRef<RecipedetailsComponent>

  ) {this.rec = data; 
    console.log('Data received in dialog:', this.rec);}

  ngOnInit(): void {  
    // const id=Number(this.route.snapshot.paramMap.get('id'))
   
    //       if (id) {
      console.log('Recipe details:', this.rec);
      // } 
  }

  
  

  loadRecipeDetails(recipeId:number): void {
    
      this.recipeService.getRecipeAndProjectById(recipeId).subscribe({
        next: (data) => {
          this.rec = data;
          console.log("loading the data :",this.rec);

        },
        error: (err) => console.error('Error fetching recipe details', err)
      });
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



    onCancel(): void {
      this.dialogRef.close(false);
    }
    

}

