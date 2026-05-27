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
            className="group cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden bg-gray-200">
                {boat.imageUrl && !imageError ? (
                    <img
                        src={`http://localhost:3000${boat.imageUrl}`}
                        alt={boat.boat_name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                        <svg className="w-20 h-20 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                )}
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    ${boat.price_per_day}/day
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {boat.boat_name}
                </h3>
                
                <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 0 1 .586 1.414V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                    </svg>
                    <span className="text-gray-600 text-sm">{boat.boat_type}</span>
                </div>

                <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-gray-600 text-sm">Capacity: {boat.capacity} persons</span>
                </div>

                {/* View Details Button */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                    <button className="text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors flex items-center">
                        View Details
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BoatCard;