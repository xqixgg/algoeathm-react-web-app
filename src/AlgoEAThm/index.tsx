import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Instruction from "./Instruction";
import Login from "./Auth";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/ResetPassword";
import SavedRecipes from "./SavedRecipes";
import UserProfile from "./User";

function AlgoEAThm() {
  return (
    <div>
      <div className="d-flex">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="Instruction" element={<Instruction />} />
          <Route path="login" element={<Login />} />
          <Route path="reset-password/*" element={<ResetPassword />} />
          <Route path="forgot-password/*" element={<ForgotPassword />} />
          <Route path="saved-recipes" element={<SavedRecipes />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="user" element={<UserProfile />} />
        </Routes>
      </div>
    </div>
  );
}
export default AlgoEAThm;
