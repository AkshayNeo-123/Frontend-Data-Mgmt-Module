export interface Contact {
    contactId: number;
    contactName: string;
    contactType: number;
    addressLine1: string;
    addressLine2?: string;
    
    city: string;
    state: string;
    zip: number;
    email: string;
    phone?: string;
    isDelete?:boolean;
     createdBy? :number;
 updatedBy? :number;
createdDate? :Date;
updatedDate? :Date;
}


export enum ContactTyps{
    Manufacturer=1,
    Supplier,
    Both
}

export interface Additives{
    id?: number;
    additiveName: string;
    createdBy: number;
    createdDate: Date;
    modifiedBy: number;
    modifiedDate: Date ;
    }
   
export interface MainPolymer{
            id?:number;
            polymerName:string;
        }