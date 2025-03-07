import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Instruction from "./Instruction";
function AlgoEAThm() {
   return (
         <div>
            <div className="d-flex">
                  <Routes>
                     <Route path="/" element={<Home />} />
                     <Route path="Instruction" element={<Instruction />} />

                  </Routes>
               </div>
            </div>   
   );
}
export default AlgoEAThm;