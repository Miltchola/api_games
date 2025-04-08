import { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';
import GameList from './components/GameList/GameList';
import GameDetails from './components/GameDetails/GameDetails';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'ratingPositive' | 'ratingNegative' | 'name' | 'isTrending' | 'id'>('id');
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <Router>
      <div className="app-container">
        <Header toggleSidebar={toggleSidebar} setSearchQuery={setSearchQuery} />
        <div className="main-content">
          <SideBar isVisible={sidebarVisible} setSortBy={setSortBy} />
          <div className="page-content">
            <Routes>

              <Route
                path="/"
                element={
                  <>
                    <h2 className="section-title">New and trending</h2>
                    <p className="section-subtitle">Based on player counts and release date</p>
                    <GameList sortBy={sortBy} searchQuery={searchQuery} />
                  </>
                }
              />
              {/* Atualiza o page-content da página ao clicar em um Card */}
              <Route path="/game/:id" element={<GameDetails />} />

            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;