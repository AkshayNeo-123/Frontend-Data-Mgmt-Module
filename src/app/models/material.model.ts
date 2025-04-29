export interface Material {
   materialId: number; 
    materialsType: MaterialTypeEnum;
    designation: string;
    manufacturerId: number;
    quantity: number;
    density: number;
    testMethod: string;
    tdsFilePath: string;
    msdsFilePath: string;
    storageLocation: StorageLocation;
    description: string;
    MVR_MFR: MvrMfrType;
    AdditiveId:number;
    MainPolymerId:number;
    createdBy: number;
    createdDate: string;
    modifiedBy: number | null;
    modifiedDate: string | null;
    
  }


  export enum MaterialTypeEnum {
    RawMaterial = 1,
    FinishedGood,
    PackagingMaterial,
    Additive,
    Resin,
    Compound,
    Masterbatch,
    Catalyst,
    Stabilizer
  }
  
  export enum MvrMfrType
  {
      _190C_2_16kg = 1,
      _190C_5kg,
      _190C_21_6kg,
      _200C_5kg,
      _220C_10kg,
      _230C_2_16kg,
      _230C_3_8kg,
      _230C_5kg,
      _250C_2_16kg,
      _260C_2_16kg,
      _280C_2_16kg,
      _300C_1_2kg,
      _330C_2_16kg,
      _340C_2_16kg
  }

  export enum StorageLocation
  {
      Warehouse_A = 1,
      Warehouse_B,
      ColdStorage,
      ProductionArea,
      QualityLab,
      OutdoorYard,
      Silo_1,
      Silo_2,
      HazardousStorage
  }
 