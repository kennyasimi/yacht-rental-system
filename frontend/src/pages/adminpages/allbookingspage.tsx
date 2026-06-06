import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBookings } from "../../services/bookingservice";
import MainLayout from "../../components/publiclayout";
import '../../styles/style.css';
interface Booking {
  booking_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  user_id: number;
  boat_id: number;
  created_at: string;
  boats?: {
    boat_name: string;
    boat_type: string;
    price_per_day: number;
  };
  users?: {
    name: string;
    email: string;
    phone: string;
  };
}

function AllBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings(token || '');
        setBookings(data);
      } catch (error) {
        setError('Failed to load bookings');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'CONFIRMED': return 'status-confirmed';
      case 'CANCELLED': return 'status-cancelled';
      case 'COMPLETED': return 'status-completed';
      default: return 'status-default';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading bookings...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="error-message">
          {error}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="all-bookings-page">
        <div className="page-header">
          <h1>All Bookings</h1>
          <div className="filter-buttons">
            <button 
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'active' : ''}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('PENDING')}
              className={filter === 'PENDING' ? 'active' : ''}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilter('CONFIRMED')}
              className={filter === 'CONFIRMED' ? 'active' : ''}
            >
              Confirmed
            </button>
            <button 
              onClick={() => setFilter('CANCELLED')}
              className={filter === 'CANCELLED' ? 'active' : ''}
            >
              Cancelled
            </button>
            <button 
              onClick={() => setFilter('COMPLETED')}
              className={filter === 'COMPLETED' ? 'active' : ''}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="bookings-grid">
          {filteredBookings.map((booking) => (
            <div
              key={booking.booking_id}
              onClick={() => navigate(`/admin/bookings/${booking.booking_id}`)}
              className="booking-card"
            >
              <div className="card-header">
                <div>
                  <h3>Booking #{booking.booking_id}</h3>
                  <p className="boat-name">
                    {booking.boats?.boat_name || `Boat ID: ${booking.boat_id}`}
                  </p>
                </div>
                <span className={`status-badge ${getStatusClass(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="card-details">
                <div className="detail-row">
                  <span className="detail-label">Customer:</span>
                  <span className="detail-value">
                    {booking.users?.name || `User #${booking.user_id}`}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">
                    {booking.users?.email || 'N/A'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Dates:</span>
                  <span className="detail-value">
                    {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Price:</span>
                  <span className="detail-value price">
                    ${booking.total_price}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Booked on:</span>
                  <span className="detail-value">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="no-bookings">
            <p>No bookings found</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default AllBookingsPage;