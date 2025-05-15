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
  projectNumber?:string,
  description?:string
 
}

export interface ComponentRow {
  componentId: number | null;
  wtPercentage: number | null;
  volPercentage: number | null;
  density: number | null;
  type: string;
  mp: boolean;
  mf: boolean;
}


export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}