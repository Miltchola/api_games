/* import React from "react"; */
import "./SideBar.css";

const SideBar = () => {
    return <div className="sidebar">
        <div className="top">
            <h3 className="top-text">Home</h3>
            <h3 className="top-text">Reviews</h3>
            <h3 className="top-text">New Releases</h3>
        </div>


        <div className="sections">
            <div className="sections_button">
                <img src="" alt="" />
                <h6 className="section-text">Last 30 days</h6>
            </div>

            <div className="sections_button">
                <img src="" alt="" />
                <h6 className="section-text">This week</h6>
            </div>

            <div className="sections_button">
                <img src="" alt="" />
                <h6 className="section-text">Next week</h6>
            </div>

            <div className="sections_button">
                <img src="" alt="" />
                <h6 className="section-text">Release calendar</h6>
            </div>
        </div>
    </div>
}

export default SideBar