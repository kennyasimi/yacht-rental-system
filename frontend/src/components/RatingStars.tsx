// components/common/RatingStars.tsx
import React from 'react';

interface RatingStarsProps {
    rating: number | null;
    size?: 'small' | 'medium' | 'large';
    showValue?: boolean;
    totalReviews?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ 
    rating, 
    size = 'medium', 
    showValue = true,
    totalReviews 
}) => {
    if (!rating) {
        return (
            <div className={`rating-stars ${size}`}>
                <div className="stars-placeholder">No reviews yet</div>
            </div>
        );
    }

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const starSizes = {
        small: 'w-3 h-3',
        medium: 'w-4 h-4',
        large: 'w-5 h-5'
    };

    const starSizeClass = starSizes[size];

    return (
        <div className={`rating-stars ${size}`}>
            <div className="stars-container">
                {/* Full stars */}
                {[...Array(fullStars)].map((_, i) => (
                    <svg key={`full-${i}`} className={`star star-full ${starSizeClass}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                
                {/* Half star */}
                {hasHalfStar && (
                    <svg className={`star star-half ${starSizeClass}`} fill="currentColor" viewBox="0 0 20 20">
                        <defs>
                            <linearGradient id="halfGradient">
                                <stop offset="50%" stopColor="currentColor"/>
                                <stop offset="50%" stopColor="#D1D5DB"/>
                            </linearGradient>
                        </defs>
                        <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                )}
                
                {/* Empty stars */}
                {[...Array(emptyStars)].map((_, i) => (
                    <svg key={`empty-${i}`} className={`star star-empty ${starSizeClass}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            {showValue && (
                <span className="rating-value">
                    {rating.toFixed(1)}
                    {totalReviews !== undefined && (
                        <span className="rating-count"> ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
                    )}
                </span>
            )}
        </div>
    );
};

export default RatingStars;