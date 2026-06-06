import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBoatById } from '../../services/boatsservice';
import { type Boat } from '../../types/boat';

function BoatDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [boat, setBoat] = useState<Boat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const fetchBoatDetails = async () => {
            if (!id) return;
            
            try {
                const data = await getBoatById(parseInt(id));
                setBoat(data);
            } catch (error) {
                setError('Failed to load boat details');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBoatDetails();
    }, [id]);

    const handleBooking = () => {
        // Navigate to booking page or open booking modal
        navigate(`/book/${boat?.boat_id}`);
    };

 if (loading) {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
        </div>
    );
}

if (error || !boat) {
    return (
        <div className="loading-container">
            <div className="error-message">
                {error || 'Boat not found'}
            </div>
        </div>
    );
}

return (
    <div className="boat-details-page">
        {/* Back Button */}
        <div className="details-back-container">
            <Link to="/boats" className="back-link">
                ← Back to All Boats
            </Link>
        </div>

        {/* Boat Details */}
        <div className="details-main-container">
            <div className="details-card">
                <div className="details-grid">
                    {/* Image Section */}
                    <div className="details-image-container">
                        {boat.imageUrl && !imageError ? (
                            <img
                                src={`http://localhost:3000${boat.imageUrl}`}
                                alt={boat.boat_name}
                                className="details-image"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="details-image-placeholder"></div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="details-content">
                        <h1 className="details-title">
                            {boat.boat_name}
                        </h1>

                        <div className="details-type-badge">
                            <span className="badge">
                                {boat.boat_type}
                            </span>
                        </div>

                        {/* Price */}
                        <div className="details-price">
                            <div className="price-amount">
                                ${boat.price_per_day}
                                <span className="price-unit"> / day</span>
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="details-specs">
                            <h2 className="specs-title">Specifications</h2>
                            <div className="specs-list">
                                <div className="spec-item">
                                    <span className="spec-label">Capacity</span>
                                    <span className="spec-value">{boat.capacity} persons</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Type</span>
                                    <span className="spec-value">{boat.boat_type}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Price</span>
                                    <span className="spec-value">${boat.price_per_day}/day</span>
                                </div>
                            </div>
                        </div>

                        {/* Booking Button */}
                        <button
                            onClick={handleBooking}
                            className="btn btn-primary btn-block btn-lg"
                        >
                            Book This Boat
                        </button>

                        {/* Additional Info */}
                        <div className="details-info">
                            <p>✓ Free cancellation up to 24 hours before booking</p>
                            <p>✓ Best price guarantee</p>
                            <p>✓ 24/7 customer support</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}

export default BoatDetailsPage;