import { useEffect, useState } from 'react';
import { type BookingWithDetails } from '../../types/booking';
import { Link } from 'react-router-dom'; 
import { getUserBookings, cancelBooking } from '../../services/bookingservice';
import { createReview, getUserReviewForBooking, updateReview, deleteReview } from '../../services/reviewsservice';
import MainLayout from '../../components/publiclayout';
import ReviewModal from '../../components/reviewmodal';
// Define the Review type
interface ReviewData {
    review_id: number;
    rating: number;
    comment: string;
    booking_id: number;
    created_at: string;
    updated_at?: string;
}

function MyBookingsPage() {
    const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [existingReview, setExistingReview] = useState<Record<number, ReviewData>>({}); // Fixed: Typed state
    const token = localStorage.getItem('token');

    const fetchBookings = async () => {
        try {
            const data = await getUserBookings(token || '');
            setBookings(data);
            
            // Check for existing reviews on completed bookings
            const reviewsMap: Record<number, ReviewData> = {}; // Fixed: Properly typed
            for (const booking of data) {
                if (booking.status === 'COMPLETED') {
                    const review = await getUserReviewForBooking(booking.booking_id, token || '');
                    if (review) {
                        reviewsMap[booking.booking_id] = review;
                    }
                }
            }
            setExistingReview(reviewsMap); // Fixed: Set the map directly
        } catch (error) {
            setError('Failed to load bookings');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => { fetchBookings(); }, []);

    const handleCancelBooking = async (bookingId: number) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await cancelBooking(bookingId, token || '');
                fetchBookings();
            } catch (error) {
                alert('Failed to cancel booking');
            }
        }
    };

    const handleAddReview = (booking: BookingWithDetails) => {
        setSelectedBooking(booking);
        setShowReviewModal(true);
    };

    const handleEditReview = async (booking: BookingWithDetails) => {
        const review = await getUserReviewForBooking(booking.booking_id, token || '');
        if (review) {
            setSelectedBooking(booking);
            setExistingReview(prev => ({ ...prev, [booking.booking_id]: review })); // Now this works
            setShowReviewModal(true);
        }
    };

    const handleDeleteReview = async (bookingId: number) => {
        if (window.confirm('Are you sure you want to delete your review? This action cannot be undone.')) {
            try {
                const review = existingReview[bookingId]; // Get from state instead of fetching
                if (review) {
                    await deleteReview(review.review_id, token || '');
                    alert('Review deleted successfully!');
                    // Remove the review from state
                    setExistingReview(prev => {
                        const newState = { ...prev };
                        delete newState[bookingId];
                        return newState;
                    });
                    fetchBookings(); // Refresh to update UI
                }
            } catch (error) {
                alert('Failed to delete review');
                console.error(error);
            }
        }
    };

    const handleSubmitReview = async (rating: number, comment: string) => {
        if (!selectedBooking) return;
        
        try {
            const existing = existingReview[selectedBooking.booking_id];
            if (existing) {
                // Update existing review
                await updateReview(existing.review_id, { rating, comment }, token || '');
                alert('Review updated successfully!');
                
                // Update the review in state
                setExistingReview(prev => ({
                    ...prev,
                    [selectedBooking.booking_id]: { ...existing, rating, comment }
                }));
            } else {
                // Create new review
                const newReview = await createReview(selectedBooking.booking_id, { 
                    booking_id: selectedBooking.booking_id, 
                    rating, 
                    comment 
                }, token || '');
                alert('Review submitted successfully! Thank you for your feedback!');
                
                // Add the new review to state
                setExistingReview(prev => ({
                    ...prev,
                    [selectedBooking.booking_id]: newReview
                }));
            }
            
            // Reset state and refresh
            setShowReviewModal(false);
            setSelectedBooking(null);
            fetchBookings();
        } catch (error) {
            console.error('Error submitting review:', error);
            throw error;
        }
    };

    const getFilteredBookings = () => {
        const now = new Date();
        if (filter === 'active') {
            return bookings.filter(booking => 
                new Date(booking.end_date) >= now && 
                booking.status !== 'CANCELLED' &&
                booking.status !== 'COMPLETED'
            );
        } else if (filter === 'completed') {
            return bookings.filter(booking => 
                new Date(booking.end_date) < now || 
                booking.status === 'COMPLETED' ||
                booking.status === 'CANCELLED'
            );
        }
        return bookings;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="my-bookings-page">
                <div className="container">
                    {/* Header */}
                    <div className="bookings-header">
                        <h1 className="bookings-title">My Bookings</h1>
                        <p className="bookings-subtitle">View and manage your boat rentals</p>
                    </div>

                    {/* Filters */}
                    <div className="filters-container">
                        <div className="filters-buttons">
                            <button
                                onClick={() => setFilter('all')}
                                className={`filter-btn ${filter === 'all' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
                            >
                                All Bookings
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={`filter-btn ${filter === 'active' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setFilter('completed')}
                                className={`filter-btn ${filter === 'completed' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
                            >
                                Past & Completed
                            </button>
                        </div>
                    </div>

                    {/* Bookings List */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {getFilteredBookings().length === 0 ? (
                        <div className="empty-state">
                            <h3 className="empty-state-title">No bookings found</h3>
                            <p className="empty-state-text">
                                Start exploring and book your first boat!
                            </p>
                            <Link to="/boats" className="btn btn-primary">
                                Browse Boats
                            </Link>
                        </div>
                    ) : (
                        <div className="bookings-list">
                            {getFilteredBookings().map((booking) => {
                                const hasReview = existingReview[booking.booking_id];
                                const isCompleted = booking.status === 'COMPLETED';
                                
                                return (
                                    <div key={booking.booking_id} className="booking-card">
                                        <div className="booking-card-content">
                                            <div className="booking-header">
                                                <div className="booking-info">
                                                    <h3 className="booking-id">
                                                        Booking #{booking.booking_id}
                                                    </h3>
                                                    <p className="booking-boat-name">
                                                        {booking.boat?.boat_name} - {booking.boat?.boat_type}
                                                    </p>
                                                </div>
                                                <div className="booking-status">
                                                    <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="booking-details-grid">
                                                <div className="booking-detail">
                                                    <label className="detail-label">Start Date</label>
                                                    <p className="detail-value">
                                                        {new Date(booking.start_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="booking-detail">
                                                    <label className="detail-label">End Date</label>
                                                    <p className="detail-value">
                                                        {new Date(booking.end_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="booking-detail">
                                                    <label className="detail-label">Total Price</label>
                                                    <p className="detail-value price-value">
                                                        ${booking.total_price || 'Calculating...'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="booking-actions">
                                                {booking.status === 'PENDING' && (
                                                    <>
                                                        <Link
                                                            to={`/payment/${booking.booking_id}`}
                                                            className="btn btn-success"
                                                        >
                                                            Pay Now
                                                        </Link>
                                                        <button
                                                            onClick={() => handleCancelBooking(booking.booking_id)}
                                                            className="btn btn-danger"
                                                        >
                                                            Cancel Booking
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status === 'CONFIRMED' && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking.booking_id)}
                                                        className="btn btn-danger"
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                )}
                                                {isCompleted && !hasReview && (
                                                    <button
                                                        onClick={() => handleAddReview(booking)}
                                                        className="btn btn-primary"
                                                    >
                                                        Write a Review
                                                    </button>
                                                )}
                                                {isCompleted && hasReview && (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditReview(booking)}
                                                            className="btn btn-warning"
                                                        >
                                                            Edit Review
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteReview(booking.booking_id)}
                                                            className="btn btn-danger"
                                                        >
                                                            Delete Review
                                                        </button>
                                                    </>
                                                )}
                                                <Link
                                                    to={`/boats/${booking.boat_id}`}
                                                    className="btn btn-outline"
                                                >
                                                    View Boat
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {selectedBooking && (
                <ReviewModal
                    isOpen={showReviewModal}
                    onClose={() => {
                        setShowReviewModal(false);
                        setSelectedBooking(null);
                    }}
                    onSubmit={handleSubmitReview}
                    initialRating={existingReview[selectedBooking.booking_id]?.rating || 0}
                    initialComment={existingReview[selectedBooking.booking_id]?.comment || ''}
                    title={existingReview[selectedBooking.booking_id] ? `Edit Review for ${selectedBooking.boat?.boat_name}` : `Write a Review for ${selectedBooking.boat?.boat_name}`}
                    isEditing={!!existingReview[selectedBooking.booking_id]}
                />
            )}
        </MainLayout>
    );
}

export default MyBookingsPage;