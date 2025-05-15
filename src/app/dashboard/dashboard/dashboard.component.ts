import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { RecipeAndProject } from '../../models/recipe.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { GetmaterialsComponent } from '../getmaterials/getmaterials.component';
import { RecipyComponent } from '../recipy/recipy.component';
import { ProjectComponent } from '../project/project.component';
import { MastertableComponent } from '../mastertable/mastertable.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { ManageusersComponent } from '../manageusers/manageusers.component';
import { RolemasterComponent } from '../rolemaster/rolemaster.component';
import { AllMainPolymersComponent } from '../MainPolymerData/all-main-polymers/all-main-polymers.component';
import { AddAdditiveComponent } from '../additiveData/addadditives/addadditives.component';
import { AddInjectionMoldingComponent } from '../add-injection-molding/add-injection-molding.component';
import { AddCompoundingComponent } from '../add-compounding/add-compounding.component';
import { UpdateInjectionMoldingComponent } from '../update-injection-molding/update-injection-molding.component';
import { UpdateCompoundingComponent } from '../update-compounding/update-compounding.component';
import { GetAllAdditivesComponent } from '../get-all-additives/get-all-additives.component';
import { RecipedetailsComponent } from '../recipedetails/recipedetails.component';
import { Router, RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    GetmaterialsComponent,
    RecipyComponent,
    ProjectComponent,
    MastertableComponent,
    ContactsComponent,
    // AddInjectionMoldingComponent,
   
    GetAllAdditivesComponent,
    AllMainPolymersComponent,
    ManageusersComponent,
    RolemasterComponent,
    AllMainPolymersComponent,
    // AddAdditiveComponent,
    GetAllAdditivesComponent,
    // RecipedetailsComponent,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatMomentDateModule,
    RouterModule,
    // AddCompoundingComponent,
    // UpdateInjectionMoldingComponent,
    // UpdateCompoundingComponent,InfiniteScrollModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isSidebarOpen = true;
  selectedSection: string = 'dashboard';

  recipyAndProject: RecipeAndProject[] = [];
  projectFilter: string = '';
  count:number=0;
  paginatedRecipes:RecipeAndProject[]=[];
  pageSize = 6;
currentPage = 0;
currentIndex=0;
itemsPerPage=3;
totalPages:number=0;
  // recipeId?:number;
  // rec: RecipeAndProject ={
  //   //  recipeId:0,
  //    projectNumber:'',
  //    description:''
  // }

  displayedColumns: string[] = ['recipeId','projectNumber', 'description'];
  dataSource: MatTableDataSource<RecipeAndProject> = new MatTableDataSource<RecipeAndProject>();

  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private recipeService: RecipeService,
    private dialog: MatDialog, private router:Router
  ) {}

  ngOnInit(): void {
    this.currentPage
    =1;
    this.loadRecipes();
    
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRecipes(recetPage:boolean=true): void {
    this.recipeService.getRecipeAndProject().subscribe({
      next: (data) => {
        this.recipyAndProject = data;
        this.count = data.length;
        // this.loadNextBatch();
        this.totalPages = Math.ceil(data.length / this.pageSize);
        this.updatePaginatedRecipes();

      },
      error: (err) => console.error('Error fetching recipes', err)
    });
  }


  updatePaginatedRecipes(): void {
    const start = (this.currentPage-1) * this.pageSize;  // 0*3
    const end = start + this.pageSize;    //3+3=6    
    this.paginatedRecipes = this.recipyAndProject.slice(start, end);
  }
  
  goToPage(page: number): void {
    // this.updatePaginatedRecipes();

    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedRecipes();
    }
  }



  // loadNextBatch(): void {
  //   const nextBatch = this.recipyAndProject.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
  //   this.recipyAndProject.push(...nextBatch);
  //   this.currentIndex += this.itemsPerPage;
  // }
  
  // onScroll(): void {
  //   if (this.currentIndex < this.recipyAndProject.length) {
  //     this.loadNextBatch();
  //   }
  // }

openRecipeDetailsDialog(recipeDetails?:RecipeAndProject) {
    console.log('Data passed to dialog:', recipeDetails);
      const dialogRef = this.dialog.open(RecipedetailsComponent, {
        width: '100%',  
        maxWidth: '700px',
        height:'520px',
        // maxHeight:'540px',
        disableClose: true,
        data: recipeDetails
      });
    }
  
  

  applyCustomFilter(): void {
    this.recipeService.getRecipeAndProject(this.projectFilter).subscribe({
      next: (data) => {
        this.recipyAndProject = data;

        console.log(this.recipyAndProject);
        

        this.count = data.length;
        // this.currentPage = page;
        this.totalPages = Math.ceil(data.length / this.pageSize);


       this.updatePaginatedRecipes();
        
        

      },
      error: (err) => console.error('Error filtering recipes', err)
    });
  }

  resetFilter(): void {
    this.projectFilter = '';
    
    //  this.currentPage
    this.loadRecipes();
  }

  // viewDetails(recipe: RecipeAndProject): void {
  //   this.recipeId=recipe.recipeId;
  //   this.loadRecipeDetails;
  // }

  onToggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onSectionChange(section: string): void {
    this.selectedSection = section;
  }

  goToRecipeDetails(recipeId: number): void {
    this.router.navigate(['recipedetails', recipeId]);
  }
}
