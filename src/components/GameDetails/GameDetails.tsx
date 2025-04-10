import './GameDetails.css'
 
 import React, { useEffect, useState } from 'react';
 import { useParams } from 'react-router-dom';
 
 import './GameDetails.css';
 import plus from '../../assets/icons/plus.png';
 import love from '../../assets/icons/love.png';
 
 import GameReviews from '../GameReviews/GameReviews';
 
 interface GameDetailsProps {
 @@ -45,56 +42,64 @@
 
   if (loading) return <div>Loading game details...</div>;
   if (error) return <div>Error: {error}</div>;
   if (!game) return <div>Game not found</div>;
 
   return (
     <div className="game-details">
         <div className="game-main">
             <h1 className="game-title">{game?.name}</h1>
             <div className="rating-container">
                 <span className="rating-stars">
                     {'★'.repeat(Math.round(game?.rating ?? 0))}
                     {'☆'.repeat(5 - Math.round(game?.rating ?? 0))}
                 </span>
                 <span className="rating-value">{game?.rating.toFixed(1)}/5</span>
                 <p className="game-release">Released: {game?.released}</p>
             </div>
             <img className="game-image" src={game?.background_image} alt={game?.name} />
       <div className="game-main">
         <h1 className="game-title">{game.name}</h1>
         
         <div className="rating-container">
           <span className="rating-stars">
             {'★'.repeat(Math.round(game.rating))}
             {'☆'.repeat(5 - Math.round(game.rating))}
           </span>
           <span className="rating-value">{game.rating.toFixed(1)}/5</span>
           <p className="game-release">Released: {game.released}</p>
         </div>
 
             <div className="game-buttons">
                 <button className="buttons-my-game">
                     <div className="buttons-my-game-left">
                         <img className="button-img" src={plus} alt="Plus icon" />
                     </div>
                     <div className="buttons-my-game-right">
                         <p className="button-subtext">Add to</p>
                         <h6 className="button-text">My Games</h6>
                     </div>
                 </button>
         <img 
           className="game-image" 
           src={game.background_image} 
           alt={game.name} 
         />
 
                 <button className="buttons-wishlist">
                     <div className="buttons-wishlist-left">
                         <img className="button-img" src={love} alt="Love icon" />
                     </div>
                     <div className="buttons-wishlist-right">
                         <p className="button-subtext">Add to</p>
                         <h6 className="button-text">Wishlist</h6>
                     </div>
                 </button>
         <div className="game-buttons">
           <button className="buttons-my-game">
             <div className="buttons-my-game-left">
               <img className="button-img" src={plus} alt="Plus icon" />
             </div>
             <div className="buttons-my-game-right">
               <p className="button-subtext">Add to</p>
               <h6 className="button-text">My Games</h6>
             </div>
           </button>
 
             <div className="game-info">
                 <h3 className="info-title">About the Game</h3>
                 <p className="game-description">{game?.description}</p>
                 <h3 className="info-title">Release Date: {game?.released}</h3>
           <button className="buttons-wishlist">
             <div className="buttons-wishlist-left">
               <img className="button-img" src={love} alt="Love icon" />
             </div>
             <div className="buttons-wishlist-right">
               <p className="button-subtext">Add to</p>
               <h6 className="button-text">Wishlist</h6>
             </div>
           </button>
         </div>
 
         {/* Reviews Section */}
         <div className="game-reviews">
             <GameReviews gameId={id!} />
         <div className="game-info">
           <h3 className="info-title">About the Game</h3>
           <p className="game-description">
             {game.description.replace(/<[^>]*>/g, '')}
           </p>
           <h3 className="info-title">Release Date: {game.released}</h3>
         </div>
       </div>
 
       <div className="game-reviews">
         <GameReviews gameId={id!} />
       </div>
     </div>
   );
 };
 
 export default GameDetails;
