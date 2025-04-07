import { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';
import GameList from './components/GameList/GameList';

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'ratingPositive' | 'ratingNegative' | 'name' | 'isTrending' | 'id'>('id');

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="app-container">
      <Header toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <SideBar isVisible={sidebarVisible} setSortBy={setSortBy} />
        <div className="page-content">
          <h2 className="section-title">New and trending</h2>
          <p className="section-subtitle">Based on player counts and release date</p>
          <GameList sortBy={sortBy} />
        </div>
      </div>
    </div>
  );
}

export default App;