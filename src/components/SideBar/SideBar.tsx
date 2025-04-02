/* import React from "react"; */
import "./SideBar.css";
import star from '../../assets/icons/star.png';
import fire from '../../assets/icons/fire.png';
import podium from '../../assets/icons/podium.png';
import trophy from '../../assets/icons/trophy.png';
import speed from '../../assets/icons/speed.png';

interface SideBarProps {
    isVisible: boolean;
}


const SideBar: React.FC<SideBarProps> = ({ isVisible }) => {

    return (
    <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
        <div className="top">
            <h3 className="top-text">Home</h3>
            <h3 className="top-text">Reviews</h3>
            <h3 className="top-text">New Releases</h3>
        </div>


        <div className="sections">
            <div className="sections_button">
                <img className="section-icon" src={star} alt="" />
                <h6 className="section-text">Last 30 days</h6>
            </div>

            <div className="sections_button">
                <img className="section-icon" src={fire} alt="" />
                <h6 className="section-text">This week</h6>
            </div>

            <div className="sections_button">
                <img className="section-icon" src={speed} alt="" />
                <h6 className="section-text">Next week</h6>
            </div>

        </div>

        <div className="top">
            <h3 className="top-text">Top</h3>
        </div>

        <div className="sections">
            <div className="sections_button">
                <img className="section-icon" src={trophy} alt="" />
                <h6 className="section-text">Best of the Year</h6>
            </div>

            <div className="sections_button">
                <img className="section-icon" src={podium} alt="" />
                <h6 className="section-text">Popular in 2024</h6>
            </div>

            <div className="sections_button">
                <img className="section-icon" src={speed} alt="" />
                <h6 className="section-text">All time top 250</h6>
            </div>

        </div>
    </div>
    );
}

export default SideBar