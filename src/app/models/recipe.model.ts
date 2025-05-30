// export interface Recipe {
//   receipeId: number;
//   productName?: string;
//   projectId?: number;
//   additiveId?: string;
//   additiveName?: string;
//   mainPolymerId?:number;
//   polymerName?: string;
//   composition?: string;
//   projectName?: string;
//   components?: ComponentRow[]; 
//   comments?: string;
// }

// export interface ComponentRow {
//   componentId: number | null;
//   wtPercentage: number | null;
//   volPercentage: number | null;
//   density: number | null;
//   type: string;
//   mp: boolean;
//   mf: boolean;
// }


export interface Recipe {
  receipeId: number;
  productName?: string;
  projectId?: number;
  additiveId?: string;
  additiveName?: string;
  mainPolymerId?: number;
  polymerName?: string;
  composition?: string;
  projectName?:string;
  components?: ComponentRow[];

  comment:string;
}

export interface RecipeAndProject{
  recipeId?:number;
  productName?:string;
  projectNumber?:string,
  description?:string
 
}



export interface CommonTest {

  recipeNumber?: number

  mechanicalPropertyDto?: MechanicalProperty;
  electricalPropertyDto?: ElectricalProperty;
  generalPropertyDto?: GeneralProperty;
  temperaturePropertyDto?: TemperatureProperty;
  flammabilityPropertyDto?: FlammabilityProperty;
  propertiesDto?: Properties;
}

export interface FlammabilityProperty {
 
  burningRateWallThickness?: number;
  gwfi?: number;
  gwft?: number;
  burningRateThickness1?: number;
  burningRateThickness2?: number;
}

export interface ElectricalProperty {
 
  volumeResistivity1?: number;
  volumeResistivity2?: number;
  surfaceResistivity?: number;
  comparativeTracking?: number;

}

export interface GeneralProperty {
  
  density?: number;
  humidityAbsorption?: number;
  moldingShrinkageFlow?: number;
  moldingShrinkageTransverse?: number;
  mfr?: number;
  mvr?: number;
}

export interface Properties {
  
  sustainable?: boolean;
  flameRetardant?: boolean;
  heatStabilized130?: boolean;
  heatStabilized160?: boolean;
  heatStabilized230?: boolean;
  hydrolysisStabilized?: boolean;
  laserTransparent?: boolean;
  laserMarkable?: boolean;
  lowWarpage?: boolean;
  reducedDensity?: boolean;
  reducedMoisture?: boolean;
  electricallyNeutral?: boolean;
  uvStabilized?: boolean;
  surfaceModified?: boolean;
  adhesionModified?: boolean;
  tribologicalModified?: boolean;
  easyFlow?: boolean;
  nucleated?: boolean;
  processImproved?: boolean;
  fluidInjection?: boolean;
  recycledContent?: boolean;
  additiveManufacturing?: boolean;
}

export interface MechanicalProperty {
 

  tensileModulus_DAM?: number;
  tensileModulus_Conditioned?: number;
  tensileModulus_Conditioned_Mm_Min?: number;

  stressAtYield_DAM?: number;
  stressAtYield_Conditioned?: number;
  stressAtYield_Conditioned_Mm_Min?: number;

  strainAtYield_DAM?: number;
  strainAtYield_Conditioned?: number;
  strainAtYield_Conditioned_Mm_Min?: number;

  strainAtBreak_DAM?: number;
  strainAtBreak_Conditioned?: number;
  strainAtBreak_Conditioned_Mm_Min?: number;

  flexuralModulus_DAM?: number;
  flexuralModulus_Conditioned?: number;
  flexuralModulus_Conditioned_Mm_Min?: number;

  flexuralStrength_DAM?: number;
  flexuralStrength_Conditioned?: number;
  flexuralStrength_Conditioned_Mm_Min?: number;

  flexuralStrainBreak_DAM?: number;
  flexuralStrainBreak_Conditioned?: number;

  charpyImpact_DAM?: number;
  charpyImpact_Conditioned?: number;
  charpyNotchedImpact23?: number;
  charpyNotchedImpactMinus30?: number;

  izodNotchedImpact_DAM?: number;
  izodNotchedImpact_Conditioned?: number;

  shoreDHardness_DAM?: number;
  shoreDHardness_Conditioned?: number;

}

export interface TemperatureProperty {
 

  tempHdtA?: number;
  tempHdtB?: number;
  meltingTemp?: number;

  coefficientsParallel?: number;
  coefficientsTransverse?: number;

}


export interface ComponentRow {
  componentId: number | null;
  wtPercentage: number | null;
  volPercentage: number | null;
  density: number | null;
  type: string;
  mp: boolean;
  mf: boolean;
  createdBy?: number | null;
}


export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}