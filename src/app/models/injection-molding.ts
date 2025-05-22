export class InjectionMolding {

}
export interface AddInjectionMoulding {
    projectId: string[];
    parameterSet: number;
    recipeId: number;
    repetition: string;
    additive: string;
    reference: boolean;
  
    pretreatmentNone: boolean;
    pretreatmentDryTest: boolean;
    dryingTemperature: string;
    dryingTime: string;
    residualMoisture: string;
    processingMoisture: string;
    notMeasured: boolean;
  
    plasticizingVolume: string;
    decompressionVolume: string;
    holdingPressure: string;
    switchingPoint: string;
    screwSpeed: string;
    injectionSpeed: string;
    injectionPressure: string;
  
    temperatureZone: string;
    meltTemperature: string;
    nozzleTemperature: string;
    mouldTemperature: string;
    createdBy:number;

  }
  export interface UpdateInjectionMoulding {
    projectId: string[];
    parameterSet: number;
    recipeId: number;
    repetition: string;
    additive: string;
    reference: boolean;
  
    pretreatmentNone: boolean;
    pretreatmentDryTest: boolean;
    dryingTemperature: string;
    dryingTime: string;
    residualMoisture: string;
    processingMoisture: string;
    notMeasured: boolean;
  
    plasticizingVolume: string;
    decompressionVolume: string;
    holdingPressure: string;
    switchingPoint: string;
    screwSpeed: string;
    injectionSpeed: string;
    injectionPressure: string;
  
    temperatureZone: string;
    meltTemperature: string;
    nozzleTemperature: string;
    mouldTemperature: string;
    modifiedBy:number;

  }
  
