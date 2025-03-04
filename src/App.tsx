import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import AlgoEAThm from "./AlgoEAThm/Home";

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