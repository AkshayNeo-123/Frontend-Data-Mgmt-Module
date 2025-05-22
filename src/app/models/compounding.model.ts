// compounding-data.model.ts
export interface CompoundingDataDTO {
  compoundingId:number;
    receipeId: number;
    parameterSet: number;
    date: Date;
    notes: string;
    repetation: number;
    pretreatment: number;
    temperature: number;
    duration: string;
    residualM: number;
    notMeasured: boolean;
    pretreatmentNone: boolean;
    pretreatmentDrying: boolean;
    
  }
  
  export interface Component {
    componentId: number;
    share: number;
    mf: boolean;
    _2ndF: boolean;
    sf: boolean;
    a: boolean;
    b: boolean;
    c: boolean;
    d: boolean;
    e: boolean;
    f: boolean;
  }
  
  export interface DosageDTO {
    speedSideFeeder1: number;
    speedSideFeeder2: number;
    upload_Screwconfig: string;
    screwSpeed: number;
    torque: number;
    pressure: number;
    totalOutput: number;
    granulator: number;
    bulkDensity: number;
    coolingSection: number;
    notes: string;
    meltPump: number;
    nozzlePlate: number;
    premix: number;
    underwaterPelletizer: number;
    temp1: number;
    temp2: number;
    temp3: number;
    temp4: number;
    temp5: number;
    temp6: number;
    temp7: number;
    temp8: number;
    temp9: number;
    temp10: number;
    temp11: number;
    temp12: number;
    screwConfigStadard: boolean;
    screwConfigModified: boolean;
    deggassingStadard: boolean;
    deggassingVaccuum: boolean;
    deggassingNone: boolean;
    deggassingFET: boolean;
    premixNote: string;
    temperatureWaterBath1: number;
    temperatureWaterBath2: number;
    temperatureWaterBath3: number;
    createdDate: string;
    createdBy: number;
    modifiedBy: number;
    modifiedDate: string;
  }
  
  export interface AddCompoundingRequest {
    compoundingDataDTO: CompoundingDataDTO;
    components: Component[];
    dosageDTO: DosageDTO;
  }
  