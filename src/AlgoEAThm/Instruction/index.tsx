import { NavLink } from "react-router-dom";
import "./index.css";
import { useRecipe } from "../store/RecipeContext"; // Import global state
import React from "react";

export default function Instruction() {
    const { state } = useRecipe();

    const handleAuth = () => {
        alert("Login/Register logic goes here!");
    };

    const capitalizeFirst = (text: string) => {
        if (!text) return text;
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const handleSave = () => {
        alert("Save logic goes here!");
    };
  return (
    <div className="algoEAThm-container">
        {/* Top Bar */}
        <header className="algoEAThm-topbar">
            <div className="algoEAThm-leftSection">
                <img src="5500.png" alt="AlgoEAThm Logo" className="algoEAThm-logo" />
                <h2 className="algoEAThm-title">AlgoEAThm</h2>
            </div>
            <div className="algoEAThm-rightSection">
            <button onClick={handleAuth} className="algoEAThm-AuthBtn">
                Login/Register
            </button>
        </div>
        </header>

        {/* Main Form Section */}
        <div className="ins-container">
            <nav className="algoEAThm-tabs">
            {/* Use NavLink so we can style the active tab */}
            <NavLink
                to="/AlgoEAThm" end
                className={({ isActive }) =>
                isActive ? "algoEAThm-tab algoEAThm-tab-active" : "algoEAThm-tab"
                }
            >
                Home
            </NavLink>
            <NavLink
                to="/AlgoEAThm/Instruction"
                className={({ isActive }) =>
                isActive ? "algoEAThm-tab algoEAThm-tab-active" : "algoEAThm-tab"
                }
            >
                Instruction
            </NavLink>
            </nav>
            <div className="ins-topbar">
                <h3>Name of the recipe</h3>
            </div>
            <div className="ins-description-box">
                <p className="ins-title">Description</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat accusamus officia ipsam iusto iste repellat consequuntur repellendus rerum molestias quis ipsa, nisi, optio ut harum consectetur sed veritatis, amet odit?</p>
            </div>
            <div className="ins-row">
                <div className="ins-ingredients">
                    <p>Ingredients list</p>
                    <ul>
                    {state.ingredients.length === 0 ? (
                        <li>No ingredients provided</li>
                    ) : (
                        state.ingredients.split(",").map((item, index) => (
                            <li key={index}>{item.trim().charAt(0).toUpperCase() + item.trim().slice(1)}</li>
                        ))
                    )}
                     </ul> 
                    <div className="mt-5">
                        <p className="ins-info">
                            <strong>Allergies:</strong> {capitalizeFirst(state.allergies) || "None"}
                        </p>
                        <p className="ins-info">
                            <strong>Cuisine:</strong> {capitalizeFirst(state.cuisine) || "Not specified"}
                        </p>
                        <p className="ins-info">
                            <strong>Time Limit:</strong>{" "}
                            {state.timeLimit ? `${state.timeLimit} minutes` : "N/A"}
                        </p>
                    </div>
                     
                </div>
                <div className="ins-steps">
                    <p>Instruction</p>
                    <ul>
                        <li>Lorem ipsum dolor sit amet.</li>
                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam, assumenda!</li>
                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit reiciendis, deserunt cum consequuntur voluptas fuga. Dolore excepturi blanditiis nostrum ipsum!</li>
                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit reiciendis, deserunt cum consequuntur voluptas fuga. Dolore excepturi blanditiis nostrum ipsum!</li>
                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit reiciendis, deserunt cum consequuntur voluptas fuga. Dolore excepturi blanditiis nostrum ipsum!</li>
                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit reiciendis, deserunt cum consequuntur voluptas fuga. Dolore excepturi blanditiis nostrum ipsum!</li>
                    </ul>
                </div>

                
            </div>
            <div className="ins-row">
                <button onClick={handleSave} className="algoEAThm-generateBtn">Save to my list</button>
            </div>
            
            
        </div>

    </div>
  )
}
