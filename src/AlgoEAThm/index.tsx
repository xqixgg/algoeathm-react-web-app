import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Instruction from "./Instruction";
import Login from "./Auth";

function AlgoEAThm() {
   return (
         <div>
            <div className="d-flex">
               <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="Instruction" element={<Instruction />} />
                  <Route path="login" element={<Login />} />

               </Routes>
            </div>
         </div>   
   );
}
export default AlgoEAThm;