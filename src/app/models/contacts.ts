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
     createdBy :number;
 updatedBy :number;
createdDate :Date;
updatedDate :Date;
}

export interface ContactDTO{
    contactId: number;

    contactName: string;
    contactType: ContactTyps;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: number;
    email: string;
    phone?: string;
    // createdBy :number;
    // createdDate :Date;


}

export enum ContactTyps{
    Manufacturer=1,
    Supplier,
    Both
}

export interface Additives{
    id: number;
    additiveName: string;
    createdBy: number | null;
    createdDate: Date;
    modifiedBy: number | null;
    modifiedDate: Date ;
    }

    export interface AddAdditives{
        id: number;
        additiveName: string;
        // createdBy: number | null;
        // createdDate: Date;
        // modifiedBy: string | null;
        // modifiedDate: string | null;
        }

        export interface UpdateAdditive{

            id: number;
            additiveName: string;
            
            // modifiedBy: number | null;
            // modifiedDate: Date;

        }


        export interface MainPolymer{
            id:number;
            polymerName:string;
        }