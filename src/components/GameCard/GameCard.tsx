import React from "react";

interface GameCardProps {
    title: string;
    subtitle?: string;
    imageUrl: string;
    isTrending?: boolean;
    releaseInfo?: string;
    rating?: number;
}

const GameCard: React.FC<GameCardProps> = ({ 
    title, 
    subtitle, // se houver
    imageUrl, 
    isTrending = false, // isTreding é pra quando o jogo tá entre os mais populares
    releaseInfo,
    rating // Nota que o jogo tem pelo usuários
  }) => {

    return (
      <div className={`game-card ${isTrending ? 'trending' : ''}`}>

        {/* Imagem */}
        <div className="card-image-container">
          <img src={imageUrl} alt={title} className="card-image" />
          {isTrending && <span className="trending-badge">TRENDING</span>}
        </div>

        {/* Conteúdo principal do Card */}
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          {subtitle && <h4 className="card-subtitle">{subtitle}</h4>}
          {releaseInfo && <p className="release-info">{releaseInfo}</p>}
          {rating && <p className="rating">{rating}</p>}
        </div>

      </div>
    );

  };
  
  export default GameCard;