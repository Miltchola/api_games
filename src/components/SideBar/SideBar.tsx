import "./SideBar.css";
import star from '../../assets/icons/star.png';
import fire from '../../assets/icons/fire.png';
import podium from '../../assets/icons/podium.png';
import trophy from '../../assets/icons/trophy.png';

interface SideBarProps {
  isVisible: boolean;
  setSortBy: (sortBy: 'ratingPositive' | 'ratingNegative' | 'name' | 'isTrending' | 'id') => void;
}

const SideBar: React.FC<SideBarProps> = ({ isVisible, setSortBy }) => {
  return (
    <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
      <div className="top">
        <h3 className="top-text">Side Bar</h3>
      </div>

      <div className="sections">

        <button className="sections_button" onClick={() => setSortBy('id')}>
            <img className="section-icon" src={star} alt="" />
            <h6 className="section-text">Home</h6>
        </button>

        <button className="sections_button" onClick={() => setSortBy('name')}>
          <img className="section-icon" src={star} alt="" />
          <h6 className="section-text">Name</h6>
        </button>

        <button className="sections_button" onClick={() => setSortBy('isTrending')}>
          <img className="section-icon" src={fire} alt="" />
          <h6 className="section-text">Trending</h6>
        </button>

        <button className="sections_button" onClick={() => setSortBy('ratingPositive')}>
          <img className="section-icon" src={trophy} alt="" />
          <h6 className="section-text">Best Rating</h6>
        </button>

        <button className="sections_button" onClick={() => setSortBy('ratingNegative')}>
          <img className="section-icon" src={podium} alt="" />
          <h6 className="section-text">Worst Rating</h6>
        </button>
      </div>
    </div>
  );
};

export default SideBar;