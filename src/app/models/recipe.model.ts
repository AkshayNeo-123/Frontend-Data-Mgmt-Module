// export interface Recipe {
//   id: number;
//   productName: string;
//   //   comments: string;
//   projectName?: number;
//   //   createdDate: string;
//   //   createdBy: string;
//   //   modifiedDate?: string;
//   //   modifiedBy: string;
//   receipeId: number;  
//   additiveName?: string;
//   polymerName?: string;
//   composition?: string;
// }

export interface Recipe {
  receipeId: number;
  productName: string;
  projectNumber: string;
  additiveName: string;
  polymerName: string;
  composition?: string;
  projectName?:string;
  // comment:string;
}

export interface RecipeAndProject{
  recipeId?:number;
  projectNumber?:string,
  description?:string
  projectName?: string;

}


export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}