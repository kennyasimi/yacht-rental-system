// components/reviews/ReviewItem.tsx
import React from 'react';
import RatingStars from './RatingStars';
import { type Review } from '../types/boat';

interface ReviewItemProps {
    review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="review-item">
            <div className="review-header">
                <div className="reviewer-info">
                    <div className="reviewer-avatar">
                        {review.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="reviewer-name">{review.user_name}</h4>
                        <div className="review-date">{formatDate(review.created_at)}</div>
                    </div>
                </div>
                <RatingStars rating={review.rating} size="small" showValue={false} />
            </div>
            {review.comment && (
                <div className="review-comment">
                    <p>{review.comment}</p>
                </div>
            )}
        </div>
    );
};

export default ReviewItem;