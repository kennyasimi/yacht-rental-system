import { useEffect, useState } from 'react';
import { type BookingWithDetails } from '../../types/booking';
import { Link } from 'react-router-dom'; 
import { getUserBookings, cancelBooking } from '../../services/bookingservice';
import MainLayout from '../../components/publiclayout';


function MyBookingsPage()  {
    const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const token = localStorage.getItem('token')

    

    const fetchBookings = async () => {
        try{
            const data = await getUserBookings(token || '')
            setBookings(data)
        } catch (error) {
            setError('There are no bookings in this muthafucka');
            console.error(error);
            console.log(error)
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {fetchBookings()}, []);

    const handleCancelBooking = async (bookingId: number) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await cancelBooking(bookingId, token || '' );
                fetchBookings(); // Refresh the list
            } catch (error) {
                alert('Failed to cancel booking');
            }
        }
    };

    /* const getStatusBadge = (status: string) => {
        const colors = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
            COMPLETED: 'bg-blue-100 text-blue-800'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    }; */

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
                        {getFilteredBookings().map((booking) => (
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
                                        {booking.status === 'COMPLETED' && (
                                            <Link
                                                to={`/reviews/create/${booking.booking_id}`}
                                                className="btn btn-primary"
                                            >
                                                Leave a Review
                                            </Link>
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    </MainLayout>
);
}


export default MyBookingsPage;