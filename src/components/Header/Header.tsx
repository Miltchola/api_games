import React from "react";

const Header = () => {
    return <div className="Header">
        <div className="left-side">
            <img className="logo" src="" alt="Site Logo" />
        </div>

        <div className="middle-side">
            <input type="text" />
        </div>

        <div className="right-side">
            <h5 className="header-text">LOG IN</h5>

            <h5 className="header-text">SIGN UP</h5>

            <h5 className="header-text">API</h5>

            <h5 className="header-text">...</h5>

        </div>
    </div>
}

export default Header