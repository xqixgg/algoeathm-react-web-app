import { Route, Routes } from "react-router";
import Home from "./Home";
function AlgoEAThm() {
   return (
         <div>
            <div className="d-flex">
                  <Routes>
                     <Route path="/" element={<Home />} />

                  </Routes>
               </div>
            </div>   
   );
}
export default AlgoEAThm;