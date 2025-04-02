import "./Header.css";
import searchIcon from '../../assets/icons/search.png';
import menuIcon from '../../assets/icons/menu.png'; // Adicione um ícone de menu

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
    return (
        <div className="header">
            <div className="left-side">
                <button className="menu-button" onClick={toggleSidebar}>
                    <img src={menuIcon} alt="Menu" className="menu-icon" />
                </button>
                <img className="logo" src="/path-to-logo.png" alt="Site Logo" />
                <h1 className="site-title">Hot and Trending</h1>
            </div>

            {/* Barra de pesquisa */}
            <div className="middle-side">
                <div className="search-container">
                    <img className="search-icon" src={searchIcon} alt="Search" />
                    <input className="search" type="text" placeholder="Search for Games" />
                </div>
            </div>

            <div className="right-side">
                <h5 className="header-text">LOG IN</h5>
                <h5 className="header-text">SIGN UP</h5>
                <h5 className="header-text">API</h5>
                <div className="menu-icon">
                    <span>...</span>
                </div>
            </div>
        </div>
    );
};

export default Header;