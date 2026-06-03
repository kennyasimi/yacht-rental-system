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

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await getUserBookings(token || '');
            setBookings(data);
        } catch (error) {
            setError('Failed to load bookings');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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

    const getStatusBadge = (status: string) => {
        const colors = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
            COMPLETED: 'bg-blue-100 text-blue-800'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
                        <p className="text-gray-600">View and manage your boat rentals</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    filter === 'all' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                All Bookings
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    filter === 'active' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setFilter('completed')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    filter === 'completed' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Past & Completed
                            </button>
                        </div>
                    </div>

                    {/* Bookings List */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {getFilteredBookings().length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Start exploring and book your first boat!
                            </p>
                            <Link
                                to="/boats"
                                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Browse Boats
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {getFilteredBookings().map((booking) => (
                                <div key={booking.booking_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-800">
                                                    Booking #{booking.booking_id}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {booking.boat?.boat_name} - {booking.boat?.boat_type}
                                                </p>
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <label className="text-sm text-gray-600">Start Date</label>
                                                <p className="font-semibold">
                                                    {new Date(booking.start_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600">End Date</label>
                                                <p className="font-semibold">
                                                    {new Date(booking.end_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600">Total Price</label>
                                                <p className="font-semibold text-blue-600">
                                                    ${booking.total_price || 'Calculating...'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex space-x-3">
                                            {booking.status === 'PENDING' && (
                                                <>
                                                    <Link
                                                        to={`/payment/${booking.booking_id}`}
                                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                                    >
                                                        Pay Now
                                                    </Link>
                                                    <button
                                                        onClick={() => handleCancelBooking(booking.booking_id)}
                                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                </>
                                            )}
                                            {booking.status === 'CONFIRMED' && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking.booking_id)}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    Cancel Booking
                                                </button>
                                            )}
                                            {booking.status === 'COMPLETED' && (
                                                <Link
                                                    to={`/reviews/create/${booking.booking_id}`}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Leave a Review
                                                </Link>
                                            )}
                                            <Link
                                                to={`/boats/${booking.boat_id}`}
                                                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
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