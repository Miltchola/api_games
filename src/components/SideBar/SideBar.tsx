import "./SideBar.css";

import letra from '../../assets/Icons/letra a.png'
import fire from '../../assets/Icons/fire.png';
import trophy from '../../assets/Icons/trophy.png';
import poop from '../../assets/Icons/poop.png'

import user from '../../assets/Icons/user.png'
import home from '../../assets/Icons/home.png'
import book from '../../assets/Icons/book.png';
import wishlist from '../../assets/Icons/wishlist.png'

interface SideBarProps {
  isVisible: boolean;
  setSortBy: (sortBy: 'ratingPositive' | 'ratingNegative' | 'name' | 'isTrending' | 'id') => void;
}

const SideBar: React.FC<SideBarProps> = ({ isVisible, setSortBy }) => {
  return (
    <div className={`sidebar ${isVisible ? 'visible' : ''}`}>

      <div className="top">
        <h3 className="top-text">Trending Games</h3>
      </div>

      <div className="sections">
        <button className="sections_button" onClick={() => setSortBy('id')}>
            <img className="section-icon" src={home} alt="" />
            <h6 className="section-text">Home</h6>
        </button>
      </div>
      
      <div className="top">
        <h3 className="top-text">User</h3>
      </div>

      <div className="sections">

        <button className="sections_button">
            <img className="section-icon" src={user} alt="" />
            <h6 className="section-text">User account</h6>
        </button>

        <button className="sections_button">
            <img className="section-icon" src={wishlist} alt="" />
            <h6 className="section-text">Wishlist</h6>
        </button>

        <button className="sections_button">
          <img className="section-icon" src={book} alt="" />
          <h6 className="section-text">My Library</h6>
        </button>

      </div>

      <div className="top">
        <h3 className="top-text">Sort By</h3>
      </div>

      <div className="sections">

        <button className="sections_button" onClick={() => setSortBy('name')}>
          <img className="section-icon" src={letra} alt="" />
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
          <img className="section-icon" src={poop} alt="" />
          <h6 className="section-text">Worst Rating</h6>
        </button>
      </div>
    </div>
  );
};

export default SideBar;