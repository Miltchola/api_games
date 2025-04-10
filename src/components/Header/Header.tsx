import "./Header.css";
import searchIcon from '../../assets/Icons/search.png';
import logo from '../../assets/Icons/games.png'
import menuButton from '../../assets/Icons/menu.png'
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, setSearchQuery }: { toggleSidebar: () => void; setSearchQuery: (query: string) => void }) => {
    const navigate = useNavigate(); 
    
    return (
      <div className="header">
        <div className="left-side">
          <button className="menu-button" onClick={toggleSidebar}>
            <img className="logo" src={menuButton} alt="Site Logo" />
          </button>
          <img className="logo" src={logo} alt="Site Logo" />
          <h1 className="site-title">Gamer Moment</h1>
        </div>
  
        {/* Search Bar */}
        <div className="middle-side">
          <div className="search-container">
            <img className="search-icon" src={searchIcon} alt="Search" />
            <input
              className="search"
              type="text"
              placeholder="Search for Games"
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            />
          </div>
        </div>
  
        <div className="right-side">
          <button className="header-text" onClick={() => navigate('/login')}>
            LOG IN
          </button>
          <button className="header-text" onClick={() => navigate('/signup')}>
            SIGN UP
          </button>
        </div>
      </div>
    );
};
  
  export default Header;
