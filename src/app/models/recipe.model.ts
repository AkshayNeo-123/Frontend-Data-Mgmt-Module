export interface Recipe {
  id: number;
  productName: string;
  //   comments: string;
  projectName?: number;
  //   createdDate: string;
  //   createdBy: string;
  //   modifiedDate?: string;
  //   modifiedBy: string;
  additiveName?: string;
  polymerName?: string;
  composition?: string;
  // comment:string;
}

export interface RecipeAndProject{
  recipeId?:number;
  projectNumber?:string,
  description?:string
}
