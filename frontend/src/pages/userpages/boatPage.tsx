import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBoatById } from '../../services/boatsservice';
import { type Boat, type Review } from '../../types/boat';
import RatingStars from '../../components/RatingStars';
import { getBoatReviews } from '../../services/reviewsservice';
import ReviewItem from '../../components/ReviewItem';

function BoatDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [boat, setBoat] = useState<Boat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageError, setImageError] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews]  = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) return;
            
            setLoadingReviews(true);
            try {
                const data = await getBoatReviews(parseInt(id), currentPage, 5);
                setReviews(data.reviews);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Failed to load reviews:', error);
            } finally {
                setLoadingReviews(false);
            }
        };

        fetchReviews();
    }, [id, currentPage]);

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth'})
    }

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
                        {boat.imageURl && !imageError ? (
                            <img
                                src={`http://localhost:3000${boat.imageURl}`}
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

                        <div className="details-rating-section">
                            <RatingStars 
                                rating={boat.averageRating} 
                                size="large" 
                                showValue={true}
                                totalReviews={boat.totalReviews}
                            />
                        </div>

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
            {/* Reviews Section */}
                <div className="reviews-section">
                    <div className="reviews-header">
                        <h2 className="reviews-title">
                            Customer Reviews
                            {boat.totalReviews > 0 && (
                                <span className="reviews-count">({boat.totalReviews})</span>
                            )}
                        </h2>
                    </div>

                    {loadingReviews ? (
                        <div className="reviews-loading">
                            <div className="spinner-small"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="no-reviews">
                            <p>No reviews yet. Be the first to review this boat!</p>
                        </div>
                    ) : (
                        <>
                            <div className="reviews-list">
                                {reviews.map((review) => (
                                    <ReviewItem key={review.review_id} review={review} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="pagination-btn"
                                    >
                                        Previous
                                    </button>
                                    <span className="pagination-info">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="pagination-btn"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
        </div>
    </div>
);
}

export default BoatDetailsPage;