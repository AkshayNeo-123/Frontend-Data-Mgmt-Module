export interface Material {
   materialId: number; 
   materialName:string;
    // materialsType: MaterialTypeEnum;
    designation: string;
    manufacturerId: number;
    supplierId:number;
    quantity: number;
    density: number;
    testMethod: string;
    tdsFilePath: string;
    msdsFilePath: string;
    storageLocationId ?: number;
    description: string;
    mvrMfrId?: number;
    additiveId:number;
    mainPolymerId:number;
    createdBy: number;
    createdDate: string;
    modifiedBy: number | null;
    modifiedDate: string | null;
    
  }


  