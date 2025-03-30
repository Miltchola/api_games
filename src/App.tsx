import './App.css'
import Header from './components/Header/Header'
import SideBar from './components/SideBar/SideBar'
import GameCard from './components/GameCard/GameCard'

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <SideBar />
        <div className="page-content">
          <h2 className="section-title">New and trending</h2>
          <p className="section-subtitle">Based on player counts and release date</p>
          
          <div className="games-grid">
            <GameCard
              title="Vampire: The Masquerade - Bloodlines"
              subtitle=""
              imageUrl="/path-to-vampire-image.jpg"
              isTrending={true}
              releaseInfo="Oct 31, 2025"
              rating={8}
            />
            
            <GameCard
              title="Hollow Knight"
              subtitle="Silksong"
              imageUrl="/path-to-hollowknight-image.jpg"
              isTrending={true}
              releaseInfo="Coming soon"
              rating={8}
            />
            
            <GameCard
              title="Prince of Persia: The Sands of Time"
              subtitle="Remake"
              imageUrl="/path-to-pop-image.jpg"
              isTrending={true}
              releaseInfo="Dec 31, 2026"
              rating={8}
            />

            <GameCard
              title="The Guardians"
              subtitle="The Game"
              imageUrl="/path-to-vampire-image.jpg"
              isTrending={true}
              releaseInfo="Fev 31, 2040"
              rating={10}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App