import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Router } from '@angular/router'; // ✅ added RouterModule + Router

import { AddTestComponent } from '../add-test/add-test.component';
import { TestService } from '../../services/test.service';
import { ExportTestDataDto, Test } from '../../models/test';
import { ConfirmDialogComponent } from '../CommonTs/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { PermissionServiceService } from '../../services/permission-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-get-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    RouterModule, // ✅ added RouterModule for routerLink
  ],
  templateUrl: './get-test.component.html',
  styleUrls: ['./get-test.component.css'],
})
export class GetTestComponent implements OnInit,AfterViewInit {
  canAddTest = false;
  canEditTest = false;
  canDeleteTest = false;
  readonly  worksheetData: any[][] = [];
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private testService: TestService,
    private dialog: MatDialog,
    private permissionService: PermissionServiceService
  ) {}

  testList: Test[] = [];

  displayedColumns: string[] = [
    'productName',
    'recipeNumber',
    'mainPolymer',
    'mechanical',
    'general',
    'temperature',
    'flammability',
    'electrical',
    'properties',
    // 'actions',
  ];

  exportdata= new MatTableDataSource<ExportTestDataDto>([]);
  dataSource = new MatTableDataSource<Test>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.canAddTest = this.permissionService.hasPermission('Test List', 'canCreate');
    this.canEditTest = this.permissionService.hasPermission('Test List', 'canEdit');
    this.canDeleteTest = this.permissionService.hasPermission('Test List', 'canDelete');
    if(this.canEditTest||this.canDeleteTest){
      this.displayedColumns.push('actions');
    } 
    this.getdata();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }
  getdata() {
    this.testService.getAllTest().subscribe({
      next: (data: Test[]) => {
        this.testList = data;
        this.dataSource.data = this.testList;
        console.log(this.testList);
        // console.log('data'+this.dataSource);
       
        
      },
      error: (err) => {
        console.error('Error fetching test data:', err);
      },
    });
  }

  goToAddPage() {
    this.router.navigate(['/add-test']);
  }

  editTest(test: any) {
    this.router.navigate(['/addtest', test.testId]);
  }
  // export(){
  //   this.testService.ExportData().subscribe({
  //     next: (data: ExportTestDataDto[]) => {
  //       // this.exportdata = data;
  //       this.exportdata.data = data;
  //       console.log(this.exportdata.data);

  //       const exportArray = this.exportdata.data.map(item => ({
  //     'Test ID': item.testId,
  //     'Recipe Number': item.test?.recipeNumber ?? '',
  //     'Recipe Name': item.test?.recipeName ?? '',
  //     'Main Polymer Name': item.test?.mainPplymerName ?? '',
  //     'Comment': item.test?.comment ?? '',
  //     'Created By': item.test?.createdBy ?? '',
  //     'Created Date': item.test?.createdDate ? new Date(item.test.createdDate).toLocaleDateString() : '',
  //     'Is Publish': item.test?.isPublish ?? '',

  //     // Mechanical Properties
  //     'Tensile Modulus DAM': item.mechanicalProperty?.tensileModulus_DAM ?? '',
  //     'Stress At Yield Conditioned': item.mechanicalProperty?.stressAtYield_Conditioned ?? '',
  //     'Flexural Strength DAM': item.mechanicalProperty?.flexuralStrength_DAM ?? '',

  //     // Temperature Properties
  //     'Temp HDT B': item.temperatureProperty?.tempHdtB ?? '',

  //     // Electrical Properties
  //     'Volume Resistivity 1': item.electricalProperty?.volumeResistivity1 ?? '',

  //     // General Properties
  //     'Molding Shrinkage Flow': item.generalProperty?.moldingShrinkageFlow ?? '',

  //     // Additional Flags
  //     'Fluid Injection': item.properties?.fluidInjection ?? ''
  //   }));

  //   // Create worksheet and workbook
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportArray, { header: Object.keys(exportArray[0]) });
  //   const workbook: XLSX.WorkBook = {
  //     Sheets: { 'Exported Data': worksheet },
  //     SheetNames: ['Exported Data']
  //   };

  //   // Write workbook and trigger download
  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   const blob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   saveAs(blob, 'TestExport.xlsx');
  // }

       
        
  //     },
  //     error: (err) => {
  //       console.error('Error fetching test data:', err);
  //     },
  //   });
  // }

  

  // deleteTest(name: string) {
  //   console.log('Delete:', name);
  // }
  export() {
  this.testService.ExportData().subscribe({
    next: (data: ExportTestDataDto[]) => {
      this.exportdata.data = data;
      console.log(this.exportdata.data);

      // const exportArray = this.exportdata.data.map(item => ({
      //   'Test ID': item.testId,
      //   'Recipe Number': item.test?.recipeNumber ?? '',
      //   'Recipe Name': item.test?.recipeName ?? '',
      //   'Main Polymer Name': item.test?.mainPplymerName ?? '',
      //   'Comment': item.test?.comment ?? '',
      //   'Created By': item.test?.createdBy ?? '',
      //   'Created Date': item.test?.createdDate ? new Date(item.test.createdDate).toLocaleDateString() : '',
      //   'Is Publish': item.test?.isPublish ?? '',

      //   'Tensile Modulus DAM': item.mechanicalProperty?.tensileModulus_DAM ?? '',
      //   'Stress At Yield Conditioned': item.mechanicalProperty?.stressAtYield_Conditioned ?? '',
      //   'Flexural Strength DAM': item.mechanicalProperty?.flexuralStrength_DAM ?? '',

      //   'Temp HDT B': item.temperatureProperty?.tempHdtB ?? '',

      //   'Volume Resistivity 1': item.electricalProperty?.volumeResistivity1 ?? '',

      //   'Molding Shrinkage Flow': item.generalProperty?.moldingShrinkageFlow ?? '',

      //   'Fluid Injection': item.properties?.fluidInjection ?? ''
      // }));

      // if (!exportArray.length) {
      //   console.warn('No data to export');
      //   return;
      // }

      // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportArray, { header: Object.keys(exportArray[0]) });
      // const workbook: XLSX.WorkBook = {
      //   Sheets: { 'Exported Data': worksheet },
      //   SheetNames: ['Exported Data']
      // };

      // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      // const blob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      // saveAs(blob, 'TestExport.xlsx');

       this.worksheetData.push([
    'Recipe Number',
    'Recipe Name',
    'Main Polymer',
    'Comments',
    'Temperature Properties', '', '', '','', 
    'Mechanical Properties', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','','', '','', '', '','',// spans 3 mechanical props
    'Flammability Properties', '', '','','',
    'General Properties', '', '','', '', '',
    'Electrical Properties', '', '','',
    'Properties', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','', '', '','',
  ]);

   this.worksheetData.push([
  // Test info
  // 'Test ID',
  // 'Recipe Number',
  // 'Recipe Name',
  // 'Main Polymer Name',
  // 'Comment',
  // 'Created By',
  // 'Created Date',
  // 'Is Publish',
  '', '','','',

  // TemperaturePropertyDto
  'TempHdtA',
  'TempHdtB',
  'MeltingTemp',
  'CoefficientsParallel',
  'CoefficientsTransverse',

  // MechanicalPropertyDto
  'TensileModulus_DAM',
  'TensileModulus_Conditioned',
  'TensileModulus_Conditioned_Mm_Min',
  'StressAtYield_DAM',
  'StressAtYield_Conditioned',
  'StressAtYield_Conditioned_Mm_Min',
  'StrainAtYield_DAM',
  'StrainAtYield_Conditioned',
  'StrainAtYield_Conditioned_Mm_Min',
  'StrainAtBreak_DAM',
  'StrainAtBreak_Conditioned',
  'StrainAtBreak_Conditioned_Mm_Min',
  'FlexuralModulus_DAM',
  'FlexuralModulus_Conditioned',
  'FlexuralModulus_Conditioned_Mm_Min',
  'FlexuralStrength_DAM',
  'FlexuralStrength_Conditioned',
  'FlexuralStrength_Conditioned_Mm_Min',
  'FlexuralStrainBreak_DAM',
  'FlexuralStrainBreak_Conditioned',
  'CharpyImpact_DAM',
  'CharpyImpact_Conditioned',
  'CharpyNotchedImpact23',
  'CharpyNotchedImpactMinus30',
  'IzodNotchedImpact_DAM',
  'IzodNotchedImpact_Conditioned',
  'ShoreDHardness_DAM',
  'ShoreDHardness_Conditioned',

  // FlammabilityPropertyDto
  'BurningRateWallThickness',
  'GWFI',
  'GWFT',
  'BurningRateThickness1',
  'BurningRateThickness2',

  // GeneralPropertyDto
  'Density',
  'HumidityAbsorption',
  'MoldingShrinkageFlow',
  'MoldingShrinkageTransverse',
  'MFR',
  'MVR',

  // ElectricalPropertyDto
  'VolumeResistivity1',
  'VolumeResistivity2',
  'SurfaceResistivity',
  'ComparativeTracking',

  // PropertiesDto (Flags)
  'Sustainable',
  'FlameRetardant',
  'HeatStabilized130',
  'HeatStabilized160',
  'HeatStabilized230',
  'HydrolysisStabilized',
  'LaserTransparent',
  'LaserMarkable',
  'LowWarpage',
  'ReducedDensity',
  'ReducedMoisture',
  'ElectricallyNeutral',
  'UVStabilized',
  'SurfaceModified',
  'AdhesionModified',
  'TribologicalModified',
  'EasyFlow',
  'Nucleated',
  'ProcessImproved',
  'FluidInjection',
  'RecycledContent',
  'AdditiveManufacturing'
]);



this.exportdata.data.forEach(item => {
  this.worksheetData.push([
    this.getValue(item.test?.recipeNumber),
    this.getValue(item.test?.recipeName),
    this.getValue(item.test?.mainPplymerName),
    this.getValue(item.test?.comment),
   

    this.getValue(item.temperatureProperty?.tempHdtA),
    this.getValue(item.temperatureProperty?.tempHdtB),
    this.getValue(item.temperatureProperty?.meltingTemp),
    this.getValue(item.temperatureProperty?.coefficientsParallel),
    this.getValue(item.temperatureProperty?.coefficientsTransverse),

    this.getValue(item.mechanicalProperty?.tensileModulus_DAM),
    this.getValue(item.mechanicalProperty?.tensileModulus_Conditioned),
    this.getValue(item.mechanicalProperty?.tensileModulus_Conditioned_Mm_Min),
    this.getValue(item.mechanicalProperty?.stressAtYield_DAM),
    this.getValue(item.mechanicalProperty?.stressAtYield_Conditioned),
    this.getValue(item.mechanicalProperty?.stressAtYield_Conditioned_Mm_Min),
    this.getValue(item.mechanicalProperty?.strainAtYield_DAM),
    this.getValue(item.mechanicalProperty?.strainAtYield_Conditioned),
    this.getValue(item.mechanicalProperty?.strainAtYield_Conditioned_Mm_Min),
    this.getValue(item.mechanicalProperty?.strainAtBreak_DAM),
    this.getValue(item.mechanicalProperty?.strainAtBreak_Conditioned),
    this.getValue(item.mechanicalProperty?.strainAtBreak_Conditioned_Mm_Min),
    this.getValue(item.mechanicalProperty?.flexuralModulus_DAM),
    this.getValue(item.mechanicalProperty?.flexuralModulus_Conditioned),
    this.getValue(item.mechanicalProperty?.flexuralModulus_Conditioned_Mm_Min),
    this.getValue(item.mechanicalProperty?.flexuralStrength_DAM),
    this.getValue(item.mechanicalProperty?.flexuralStrength_Conditioned),
    this.getValue(item.mechanicalProperty?.flexuralStrength_Conditioned_Mm_Min),
    this.getValue(item.mechanicalProperty?.flexuralStrainBreak_DAM),
    this.getValue(item.mechanicalProperty?.flexuralStrainBreak_Conditioned),
    this.getValue(item.mechanicalProperty?.charpyImpact_DAM),
    this.getValue(item.mechanicalProperty?.charpyImpact_Conditioned),
    this.getValue(item.mechanicalProperty?.charpyNotchedImpact23),
    this.getValue(item.mechanicalProperty?.charpyNotchedImpactMinus30),
    this.getValue(item.mechanicalProperty?.izodNotchedImpact_DAM),
    this.getValue(item.mechanicalProperty?.izodNotchedImpact_Conditioned),
    this.getValue(item.mechanicalProperty?.shoreDHardness_DAM),
    this.getValue(item.mechanicalProperty?.shoreDHardness_Conditioned),

    this.getValue(item.flammabilityProperty?.burningRateWallThickness),
    this.getValue(item.flammabilityProperty?.gwfi),
    this.getValue(item.flammabilityProperty?.gwft),
    this.getValue(item.flammabilityProperty?.burningRateThickness1),
    this.getValue(item.flammabilityProperty?.burningRateThickness2),

    this.getValue(item.generalProperty?.density),
    this.getValue(item.generalProperty?.humidityAbsorption),
    this.getValue(item.generalProperty?.moldingShrinkageFlow),
    this.getValue(item.generalProperty?.moldingShrinkageTransverse),
    this.getValue(item.generalProperty?.mfr),
    this.getValue(item.generalProperty?.mvr),

    this.getValue(item.electricalProperty?.volumeResistivity1),
    this.getValue(item.electricalProperty?.volumeResistivity2),
    this.getValue(item.electricalProperty?.surfaceResistivity),
    this.getValue(item.electricalProperty?.comparativeTracking),

    this.getValue(item.properties?.sustainable),
    this.getValue(item.properties?.flameRetardant),
    this.getValue(item.properties?.heatStabilized130),
    this.getValue(item.properties?.heatStabilized160),
    this.getValue(item.properties?.heatStabilized230),
    this.getValue(item.properties?.hydrolysisStabilized),
    this.getValue(item.properties?.laserTransparent),
    this.getValue(item.properties?.laserMarkable),
    this.getValue(item.properties?.lowWarpage),
    this.getValue(item.properties?.reducedDensity),
    this.getValue(item.properties?.reducedMoisture),
    this.getValue(item.properties?.electricallyNeutral),
    this.getValue(item.properties?.uvStabilized),
    this.getValue(item.properties?.surfaceModified),
    this.getValue(item.properties?.adhesionModified),
    this.getValue(item.properties?.tribologicalModified),
    this.getValue(item.properties?.easyFlow),
    this.getValue(item.properties?.nucleated),
    this.getValue(item.properties?.processImproved),
    this.getValue(item.properties?.fluidInjection),
    this.getValue(item.properties?.recycledContent),
    this.getValue(item.properties?.additiveManufacturing)
  ]);
});


const worksheet = XLSX.utils.aoa_to_sheet(this.worksheetData);
worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Recipe Number
    { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Recipe Name
    { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Main Polymer
    { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, // Main Polymer
    { s: { r: 0, c: 4 }, e: { r: 0, c: 8 } }, // Temperature Properties
    { s: { r: 0, c: 9 }, e: { r: 0, c: 36 } }, // Mechanical Properties
    { s: { r: 0, c: 37 }, e: { r: 0, c: 41 } }, 
    { s: { r: 0, c: 42 }, e: { r: 0, c: 47 } }, 
    { s: { r: 0, c:  48}, e: { r: 0, c: 51 } }, 
    { s: { r: 0, c:  52}, e: { r: 0, c: 73 } },  
 


  ];
  const centerStyle = {
  alignment: {
    horizontal: "center",
    // vertical: "center",
  },
  font: {
    bold: true,
  }
};

// Apply styles to merged headers
worksheet['A1'].s = centerStyle; // Recipe Number
worksheet['B1'].s = centerStyle; // Recipe Name
worksheet['C1'].s = centerStyle; // Main Polymer
worksheet['D1'].s = centerStyle; // Comments
worksheet['E1'].s = centerStyle; // Temperature Properties
worksheet['J1'].s = centerStyle; // Mechanical Properties
worksheet['AL1'].s = centerStyle; // Flammability
worksheet['AQ1'].s = centerStyle; // General
worksheet['AW1'].s = centerStyle; // Electrical
worksheet['BA1'].s = centerStyle; // Properties

const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Report');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'Test_Report_Exact.xlsx');
  this.toastr.success('Downloaded successfully.');

    },
    error: (err) => {
      console.error('Error fetching test data:', err);
    },
  });
}
getValue(value: any): string {
  return value === null || value === undefined || value === '' ? '-' : value;
}

  deleteTest(id: any) {
    console.log('testId=' + id);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this Project?',
      },
    });

    const deletedBY = Number(localStorage.getItem('UserId'));

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.testService.deleteTest(id, deletedBY).subscribe({
          next: (data: any) => {
            this.toastr.success('Deleted successfully', 'Success', {
              timeOut: 5000,
            });
            this.getdata();
            if (this.paginator) {
              this.paginator.firstPage();
            }
            // You might want to refresh the list here or remove the deleted item from data source
          },
          error: (err: any) => {
            console.error('Error:', err);
            this.toastr.error('Something went wrong!', 'Error', {
              timeOut: 5000,
            });
          },
        });
      } else {
        this.toastr.info('Deletion cancelled', '', {
          timeOut: 5000,
        });
      }
    });
  }
}
