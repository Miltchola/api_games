import { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';
import GameList from './components/GameList/GameList';
import GameDetails from './components/GameDetails/GameDetails';
import Login from './components/Login/Login'; // ajuste o caminho se necessário
import Register from './components/Login/Register'; // Adicione este import
import { AuthProvider } from './components/User/AuthContext';
import UserAccount from './components/User/UserAccount';
import ProtectedRoute from './components/User/ProtectedRoute';
import { WishlistProvider } from './components/Wishlist/WishlistContext.tsx';
import WishlistPage from './components/Wishlist/WishlistPage.tsx';
import { LibraryProvider } from './components/Library/LibraryContext';
import LibraryPage from './components/Library/LibraryPage.tsx';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'ratingPositive' | 'ratingNegative' | 'name' | 'isTrending' | 'id'>('id');
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <AuthProvider>
      <WishlistProvider>
        <LibraryProvider>
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
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Register />} /> {/* Adicione esta linha */}
                    <Route
                      path="/account"
                      element={
                        <ProtectedRoute>
                          <UserAccount />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/library" element={<LibraryPage />} />

                  </Routes>
                </div>
              </div>
            </div>
          </Router>
        </LibraryProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;