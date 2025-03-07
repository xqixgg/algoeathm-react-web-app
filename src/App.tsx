import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import AlgoEAThm from "./AlgoEAThm";


function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/AlgoEAThm" />} />
          <Route path="/AlgoEAThm/*" element={<AlgoEAThm />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
export default App;