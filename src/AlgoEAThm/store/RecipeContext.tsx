import React, { createContext, useReducer, ReactNode, useEffect } from "react";

// Define types for the state
interface RecipeState {
  ingredients: string;
  allergies: string;
  cuisine: string;
  timeLimit: string;
  generatedRecipe: any;
  recipeHistory: any[]; // Add recipe history
}

// Define action types
interface RecipeAction {
  type: string;
  payload?: any;
}

// Load state from localStorage
const loadState = (): RecipeState => {
  try {
    const serializedState = localStorage.getItem('recipeState');
    if (serializedState === null) {
      return {
        ingredients: "",
        allergies: "",
        cuisine: "",
        timeLimit: "",
        generatedRecipe: null,
        recipeHistory: [],
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return {
      ingredients: "",
      allergies: "",
      cuisine: "",
      timeLimit: "",
      generatedRecipe: null,
      recipeHistory: [],
    };
  }
};

// Initial state
const initialState: RecipeState = loadState();

// Reducer function to handle state changes
const recipeReducer = (state: RecipeState, action: RecipeAction): RecipeState => {
  let newState: RecipeState;
  
  switch (action.type) {
    case "SET_INGREDIENTS":
      newState = { ...state, ingredients: action.payload };
      break;
    case "SET_ALLERGIES":
      newState = { ...state, allergies: action.payload };
      break;
    case "SET_CUISINE":
      newState = { ...state, cuisine: action.payload };
      break;
    case "SET_TIME_LIMIT":
      newState = { ...state, timeLimit: action.payload };
      break;
    case "SET_GENERATED_RECIPE":
      newState = {
        ...state,
        generatedRecipe: action.payload,
        recipeHistory: [action.payload, ...state.recipeHistory].slice(0, 5), // Keep last 5 recipes
      };
      break;
    case "CLEAR_RECIPE":
      newState = { ...state, generatedRecipe: null };
      break;
    default:
      newState = state;
  }

  // Save to localStorage after each state change
  try {
    localStorage.setItem('recipeState', JSON.stringify(newState));
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }

  return newState;
};

// Create Context
const RecipeContext = createContext<{
  state: RecipeState;
  dispatch: React.Dispatch<RecipeAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Context Provider Component
interface RecipeProviderProps {
  children: ReactNode;
}

export const RecipeProvider: React.FC<RecipeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  return (
    <RecipeContext.Provider value={{ state, dispatch }}>
      {children}
    </RecipeContext.Provider>
  );
};

// Custom Hook to use Recipe Context
export const useRecipe = () => {
  const context = React.useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe must be used within a RecipeProvider");
  }
  return context;
};
