import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import AlgoEAThm from "./AlgoEAThm";
import { RecipeProvider } from "./AlgoEAThm/store/RecipeContext";


function App() {
  return (
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
  );
}
export default App;