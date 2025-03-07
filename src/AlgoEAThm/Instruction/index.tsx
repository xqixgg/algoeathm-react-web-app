import { Link } from "react-router-dom";
import "./index.css";
export default function Instruction() {
  return (
    <div className="algoEAThm-container">
        {/* Top Bar */}
        <header className="algoEAThm-topbar">
            <div className="algoEAThm-leftSection">
                <img src="5500.png" alt="AlgoEAThm Logo" className="algoEAThm-logo" />
                <h2 className="algoEAThm-title">AlgoEAThm</h2>
            </div>
        
        </header>
        {/* Nav back to home */}
        <div className="ins-to-home">
            <Link to="/">Home</Link>
        </div>

        {/* Main Form Section */}
        <div className="ins-container">
            <div className="ins-topbar">topbar</div>
            <div className="ins-description-box">
                <p className="ins-title">Description</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat accusamus officia ipsam iusto iste repellat consequuntur repellendus rerum molestias quis ipsa, nisi, optio ut harum consectetur sed veritatis, amet odit?</p>
            </div>
            <div className="ins-row">
                <div className="ins-ingredients">
                    <p>ingredients list</p>
                    <ul>
                        <li>ingredient 1</li>
                        <li>ingredient 2</li>
                        <li>ingredient 3</li>
                        <li>ingredient 4</li>
                        <li>ingredient 5</li>
                        <li>ingredient 5</li>
                        <li>ingredient 5</li>
                     </ul>   
                    
                </div>
                <div className="ins-steps">
                    <p>instruction</p>
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
            
            
        </div>

    </div>
  )
}
