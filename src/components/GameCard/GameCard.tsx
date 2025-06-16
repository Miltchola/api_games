import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameCard.css'; // Arquivo CSS que forneci anteriormente

interface GameCardProps {
    title: string;
    subtitle?: string;
    imageUrl: string;
    isTrending?: boolean;
    releaseInfo?: string;
    rating?: number;
    id: string; // Add id prop
}

const GameCard: React.FC<GameCardProps> = ({ 
    title, 
    subtitle,
    imageUrl, 
    isTrending = false,
    releaseInfo,
    rating,
    id
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    const handleImageLoad = () => {
        setImageLoaded(true);
        setImageError(false);
    };
    React.useEffect(() => {
        if (imageError) {
            console.warn(`Image failed to load: ${imageUrl}`);
        }
    }, [imageError, imageUrl]);
    const handleImageError = () => {
        setImageLoaded(false);
        setImageError(true);
    };

    const handleSeeMore = () => {
        navigate(`/game/${id}`);
    };

    return (
        <div className={`game-card ${isTrending ? 'trending' : ''}`}>
            <div className="card-image-container">
                {!imageError ? (
                    <img 
                        src={imageUrl} 
                        alt={title} 
                        className={`card-image ${imageLoaded ? 'loaded' : ''}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                ) : (
                    <div className="card-image error">
                        {/* SVG fallback incorporado */}
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 100 100" 
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <rect width="100" height="100" fill="#2a2a2a" />
                            <text 
                                x="50" 
                                y="50" 
                                fontFamily="Arial" 
                                fontSize="10" 
                                textAnchor="middle" 
                                fill="white"
                                dy=".3em"
                            >
                                Sem imagem
                            </text>
                        </svg>
                    </div>
                )}
                {isTrending && <span className="trending-badge">TRENDING</span>}
            </div>

            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                {subtitle && <h4 className="card-subtitle">{subtitle}</h4>}
                {releaseInfo && <p className="release-info">{releaseInfo}</p>}
                {typeof rating === 'number' && (
                    <div className="rating-container">
                        <span className="rating-stars">
                            {'★'.repeat(Math.round(rating))}
                            {'☆'.repeat(5 - Math.round(rating))}
                        </span>
                        <span className="rating-value">{rating.toFixed(1)}/5</span>
                    </div>
                )}
                
            </div>
            <button className="card-button" onClick={handleSeeMore}>See more</button>
        </div>
    );
};

export default GameCard;
