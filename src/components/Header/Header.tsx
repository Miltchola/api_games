import "./Header.css";
import searchIcon from '../../assets/icons/search.png';
import logo from '../../assets/Icons/games.png'

const Header = ({ toggleSidebar, setSearchQuery }: { toggleSidebar: () => void; setSearchQuery: (query: string) => void }) => {
    return (
      <div className="header">
        <div className="left-side">
          <button className="menu-button" onClick={toggleSidebar}>
            <img className="logo" src={logo} alt="Site Logo" />
          </button>
          <img className="logo" src="/assets/games-DX9OXY3m.png" alt="Site Logo" />
          <h1 className="site-title">Hot and Trending</h1>
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
          <h5 className="header-text">LOG IN</h5>
          <h5 className="header-text">SIGN UP</h5>
        </div>
      </div>
    );
  };
  
  export default Header;
