import './App.css'
import Header from './components/Header/Header'
import SideBar from './components/SideBar/SideBar'

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <SideBar />
        <div className="page-content">
          {/* Seu conteúdo principal aqui */}
        </div>
      </div>
    </div>
  )
}

export default App