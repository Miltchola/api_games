import "./Header.css";

const Header = () => {
    return (
        <div className="header">
            <div className="left-side">
                <img className="logo" src="/path-to-logo.png" alt="Site Logo" />
                <h1 className="site-title">Hot and Trending</h1>
            </div>

            {/* Seção de pesquisa do usuário!! */}
            <div className="middle-side">
                <div className="search-container">
                    {/* Ícone da Lupa de Pesquisa */}
                    <img className="search-icon" src="/path-to-search-icon.png" alt="Search" />
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