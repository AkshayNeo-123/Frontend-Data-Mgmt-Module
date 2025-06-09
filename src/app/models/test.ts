export interface Test {
  testId: number;
  recipeNumber: number;
  comment?: string;
  isPublish: boolean;
  recipeName: string;
  mainPolymerName: string;
  flammabilityProperties: boolean;
  property: boolean;
  temperatureProperties: boolean;
  electricalProperties: boolean;
  generalProperties: boolean;
  mechanicalProperty: boolean;
}
export interface RecipeDataforTest{
    receipeId:number;
    productName:string;
}
export interface ExportTestDataDto {
  testId: number;
  test: ExportAddDto;
  mechanicalProperty?: MechanicalPropertyDto;
  temperatureProperty?: TemperaturePropertyDto;
  flammabilityProperty?: FlammabilityPropertyDto;
  generalProperty?: GeneralPropertyDto;
  electricalProperty?: ElectricalPropertyDto;
  properties?: PropertiesDto;
}

export interface ExportAddDto {
  recipeNumber: number;
  comment: string;
  isPublish: boolean;
  createdBy?: number;
  createdDate?: string; // ISO date string
  recipeName: string;
  mainPplymerName: string;
}

export interface MechanicalPropertyDto {
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
export interface TemperaturePropertyDto {
  tempHdtA?: number;
  tempHdtB?: number;
  meltingTemp?: number;
  coefficientsParallel?: number;
  coefficientsTransverse?: number;
}

export interface FlammabilityPropertyDto {
  burningRateWallThickness?: number;
  gwfi?: number;
  gwft?: number;
  burningRateThickness1?: number;
  burningRateThickness2?: number;
}
export interface GeneralPropertyDto {
  density?: number;
  humidityAbsorption?: number;
  moldingShrinkageFlow?: number;
  moldingShrinkageTransverse?: number;
  mfr?: number;
  mvr?: number;
}
export interface ElectricalPropertyDto {
  volumeResistivity1?: number;
  volumeResistivity2?: number;
  surfaceResistivity?: number;
  comparativeTracking?: number;
}
export interface PropertiesDto {
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
  tribologicalModified: boolean;
  easyFlow?: boolean;
  nucleated?: boolean;
  processImproved?: boolean;
  fluidInjection?: boolean;
  recycledContent?: boolean;
  additiveManufacturing?: boolean;
}



