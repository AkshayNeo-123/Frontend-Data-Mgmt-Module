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
