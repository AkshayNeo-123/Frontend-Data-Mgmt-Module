export interface Recipe {
  receipeId: number;
  productName: string;
  projectId: number;
  additiveId: string;
  polymerName: string;
  composition?: string;
  projectName?: string;

}


// export interface RecipeComponent {
//   componentId: number;
//   wtPercent: number;
//   valPercent: number;
//   density: number;
//   mp: boolean;
//   mf: boolean;
//   typeId: number;
// }

// export interface Recipe {
//   receipeId?: number;
//   productName: string;
//   projectId: number;
//   additiveId: string;
//   polymerName: string;
//   composition?: string;
//   projectName?: string;
//   components?: RecipeComponent[]; // <-- added
// }
