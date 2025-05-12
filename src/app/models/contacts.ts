export interface Contact {
    contactId: number;
    contactName: string;
    contactType: number;
    addressLine1: string;
    addressLine2?: string;
    
    cityId: number;
    cities:Cities;
    stateId: number;
    states:States;
    zip: number;
    email: string;
    phone?: string;
    isDelete?:boolean;
     createdBy? :number;
 modifiedBy? :number;
createdDate? :Date;
modifiedDate? :Date;
}

export interface States{
    stateId?:number;
    stateName:string;

}

export interface Cities{
    cityId?:number;
    cityName:string;
    stateId:number;
    // states:States;
}
export enum ContactTyps{
    Manufacturer=1,
    Supplier,
    Both
}

export interface Additives{
    id?: number;
    additiveName: string;
    createdBy?: number;
    createdDate?: Date;
    modifiedBy?: number;
    modifiedDate?: Date ;
    }
   
export interface MainPolymer{
            id?:number;
            polymerName:string;
            createdBy?: number;
            createdDate?: Date;
            modifiedBy?: number;
            modifiedDate?: Date ;
        }

       