import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import AlgoEAThm from "./AlgoEAThm";
import { RecipeProvider } from "./AlgoEAThm/store/RecipeContext";
import { AuthProvider } from "./AlgoEAThm/store/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RecipeProvider>
        <HashRouter>
          <div>
            <Routes>
              <Route path="/" element={<Navigate to="/AlgoEAThm" />} />
              <Route path="/AlgoEAThm/*" element={<AlgoEAThm />} />
            </Routes>
          </div>
        </HashRouter>
      </RecipeProvider>
    </AuthProvider>
  );
}
export default App;