
'use client';
import { useState } from 'react';

const StarRating = ({ clientId, initialRating, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseOver = (starIndex) => {
    setHoverRating(starIndex);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (starIndex) => {
    const newRating = starIndex;
    setRating(newRating);
    onRatingChange(clientId, newRating);
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <svg
          key={starIndex}
          className={`w-6 h-6 cursor-pointer fill-current ${ 
            (hoverRating || rating) >= starIndex ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onMouseOver={() => handleMouseOver(starIndex)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(starIndex)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
