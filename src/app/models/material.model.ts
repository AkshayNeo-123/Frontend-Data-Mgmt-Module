export interface Material {
   materialId: number; 
    materialsType: number;
    designation: string;
    manufacturerId: number;
    quantity: number;
    density: number;
    testMethod: string;
    tdsFilePath: string;
    msdsFilePath: string;
    storageLocation: number;
    description: string;
    MVR_MFR: number;
    AdditiveId:number;
    MainPolymerId:number;
    createdBy: number;
    createdDate: string;
    modifiedBy: number | null;
    modifiedDate: string | null;
    
  }
  