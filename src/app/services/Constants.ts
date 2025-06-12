import { environment } from "../../environments/environment";

const apiBaseUrl = environment.baseUrl; // Application base url


const apiUrls = {
    userUrl:`${apiBaseUrl}/api/User`,
    roleUrl:`${apiBaseUrl}/api/Role`,
    testUrl:`${apiBaseUrl}/api/Test`,
    recipeUrl:`${apiBaseUrl}/api/Recipe`,
    loadApiUrl:`${apiBaseUrl}/api`,
    projectUrl:`${apiBaseUrl}/api/Projects`

};

export const APP_CONSTANTS = {
  apiBaseUrl,
  apiUrls

};