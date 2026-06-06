import React from 'react';
import { useNavigate } from 'react-router-dom';
import { type Boat } from '../../types/boat';

interface BoatCardProps {
    boat: Boat;
}

const BoatCard: React.FC<BoatCardProps> = ({ boat }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = React.useState(false);

    const handleClick = () => {
        navigate(`/boats/${boat.boat_id}`);
    };

    return (
    <div 
        onClick={handleClick}
        className="boat-card"
    >
        {/* Image Container */}
        <div className="boat-card-image-container">
            {boat.imageUrl && !imageError ? (
                <img
                    src={`http://localhost:3000${boat.imageUrl}`}
                    alt={boat.boat_name}
                    className="boat-card-image"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="boat-card-image-placeholder">
                    <span className="placeholder-text">No Image</span>
                </div>
            )}
            
            {/* Price Badge */}
            <div className="boat-card-price-badge">
                ${boat.price_per_day}/day
            </div>
        </div>
        
        {/* Content */}
        <div className="boat-card-content">
            <h3 className="boat-card-title">
                {boat.boat_name}
            </h3>
            
            <div className="boat-card-info">
                <span className="boat-card-type">{boat.boat_type}</span>
            </div>
            
            <div className="boat-card-capacity">
                <span>Capacity: {boat.capacity} persons</span>
            </div>
            
            {/* View Details Button */}
            <div className="boat-card-footer">
                <button className="boat-card-button">
                    View Details
                    <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
);
};

export default BoatCard;