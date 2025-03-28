import { Firestore } from "firebase/firestore";
import { Auth } from "firebase/auth";

declare module "../../firebase" {
  export const db: Firestore;
  export const auth: Auth;
  export const usersCollection: any;
  export const userRecipesCollection: any;
  const app: any;
  export default app;
}

// Recipe data structure
export interface SavedRecipe {
  id: string;
  userId: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  allergies: string;
  cuisine: string;
  timeLimit: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

// User data structure
export interface UserData {
  email: string;
  username: string;
  savedRecipes: string[]; // Array of recipe IDs
}
