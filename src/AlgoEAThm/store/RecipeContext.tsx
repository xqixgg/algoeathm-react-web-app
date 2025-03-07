import React, { createContext, useReducer, useContext, ReactNode } from "react";

// Define types for the state
interface RecipeState {
  ingredients: string;
  allergies: string;
  cuisine: string;
  timeLimit: string;
}

// Define action types
type RecipeAction =
  | { type: "SET_INGREDIENTS"; payload: string }
  | { type: "SET_ALLERGIES"; payload: string }
  | { type: "SET_CUISINE"; payload: string }
  | { type: "SET_TIME_LIMIT"; payload: string };

// Initial state
const initialState: RecipeState = {
  ingredients: "",
  allergies: "",
  cuisine: "",
  timeLimit: "",
};

// Reducer function to handle state changes
const recipeReducer = (state: RecipeState, action: RecipeAction): RecipeState => {
  switch (action.type) {
    case "SET_INGREDIENTS":
      return { ...state, ingredients: action.payload };
    case "SET_ALLERGIES":
      return { ...state, allergies: action.payload };
    case "SET_CUISINE":
      return { ...state, cuisine: action.payload };
    case "SET_TIME_LIMIT":
      return { ...state, timeLimit: action.payload };
    default:
      return state;
  }
};

// Create Context
const RecipeContext = createContext<
  { state: RecipeState; dispatch: React.Dispatch<RecipeAction> } | undefined
>(undefined);

// Context Provider Component
export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  return (
    <RecipeContext.Provider value={{ state, dispatch }}>
      {children}
    </RecipeContext.Provider>
  );
};

// Custom Hook to use Recipe Context
export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe must be used within a RecipeProvider");
  }
  return context;
};
