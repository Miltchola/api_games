import React from 'react';

interface RatingStarsProps {
  rating: number;
  onRate?: (rating: number) => void;
  editable?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, onRate, editable = false }) => {
  const [hovered, setHovered] = React.useState<number | null>(null);

  const handleClick = (value: number) => {
    if (editable && onRate) {
      onRate(value);
    }
  };

  return (
    <span>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: editable ? 'pointer' : 'default',
            color: (hovered ?? rating) >= star ? '#FFD700' : '#ccc',
            fontSize: '2rem',
            transition: 'color 0.2s',
          }}
          onClick={() => handleClick(star)}
          onMouseEnter={() => editable && setHovered(star)}
          onMouseLeave={() => editable && setHovered(null)}
          data-testid={`star-${star}`}
        >
          ★
        </span>
      ))}
    </span>
  );
};

export default RatingStars; 