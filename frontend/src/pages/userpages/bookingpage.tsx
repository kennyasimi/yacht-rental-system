import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBoatById } from '../../services/boatsservice';
import DateRangePicker from '../../components/daterangepicker';
import { type Boat } from '../../types/boat';
import { createBooking } from '../../services/bookingservice';
import MainLayout from '../../components/publiclayout';
import type { CreateBookingDto } from '../../types/booking';

function BookingPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [boat, setBoat] = useState<Boat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageError, setImageError] = useState(false);
    
    // Date selection state
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const boatId = id;
    // Booking state
    const [creatingBooking, setCreatingBooking] = useState(false);

  

    
    useEffect(() => {
        fetchBoatDetails();
    }, [boatId]);

    const fetchBoatDetails = async () => {
        try {
            const data = await getBoatById(Number(boatId));
            setBoat(data);
        } catch (error) {
            setError('Failed to load boat details');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateDays = (): number => {
        if (!startDate || !endDate) return 0;
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const calculateTotal = (): number => {
        if (!boat) return 0;
        const days = calculateDays();
        return days * boat.price_per_day;
    };

    const handleDateSelect = (start: Date | null, end: Date | null) => {
        setStartDate(start);
        setEndDate(end);
    };

    const handleCreateBooking = async () => {
        if (!startDate || !endDate) {
            setError('Please select both start and end dates');
            return;
        }

        setCreatingBooking(true);
        setError('');

        const token = localStorage.getItem('token');
        const bookingData: CreateBookingDto = {
            boat_id: Number(boatId),
            start_date: (startDate ? new Date(startDate).toISOString() : null) as unknown as Date,
            end_date: (endDate ? new Date(endDate).toISOString() : null) as unknown as Date
        };

        try {
            const booking = await createBooking(token || '', bookingData);
            
            // Navigate to payment page with booking details
            navigate(`/payment/${booking.booking_id}`, {
                state: { booking, boat }
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
        } finally {
            setCreatingBooking(false);
        }
    };

    const formatDate = (date: Date | null): string => {
        if (!date) return 'Not selected';
        return date.toISOString();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (loading) {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
        </div>
    );
}

if (error && !boat) {
    return (
        <div className="loading-container">
            <div className="error-message">
                {error}
            </div>
        </div>
    );
}

if (!boat) return null;

return (
    <MainLayout>
        <div className="booking-page">
            <div className="booking-container">
                {/* Header with Back Button */}
                <div className="booking-back-container">
                    <Link 
                        to={`/boats/${boatId}`}
                        className="booking-back-link"
                    >
                        ← Back to Boat Details
                    </Link>
                </div>

                <div className="booking-grid">
                    {/* Boat Info Card - Left Side */}
                    <div className="booking-boat-card">
                        <div className="booking-boat-image-container">
                            {boat.imageURl && !imageError ? (
                                <img
                                    src={`http://localhost:3000${boat.imageURl}`}
                                    alt={boat.boat_name}
                                    className="booking-boat-image"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="booking-boat-image-placeholder"></div>
                            )}
                        </div>
                        
                        <div className="booking-boat-info">
                            <h1 className="booking-boat-title">
                                {boat.boat_name}
                            </h1>
                            <div className="booking-boat-type">
                                <span className="booking-boat-badge">
                                    {boat.boat_type}
                                </span>
                            </div>
                            
                            <div className="booking-boat-details">
                                <div className="booking-detail-row">
                                    <span className="booking-detail-label">Capacity</span>
                                    <span className="booking-detail-value">{boat.capacity} persons</span>
                                </div>
                                <div className="booking-detail-row">
                                    <span className="booking-detail-label">Price per day</span>
                                    <span className="booking-detail-price">${boat.price_per_day}</span>
                                </div>
                            </div>

                            {/* Price Summary - Shows when dates are selected */}
                            {startDate && endDate && (
                                <div className="booking-price-summary">
                                    <h3 className="booking-summary-title">Price Summary</h3>
                                    <div className="booking-summary-details">
                                        <div className="booking-summary-row">
                                            <span>Daily rate</span>
                                            <span>${boat.price_per_day}</span>
                                        </div>
                                        <div className="booking-summary-row">
                                            <span>Number of days</span>
                                            <span>{calculateDays()} days</span>
                                        </div>
                                        <div className="booking-summary-total">
                                            <div className="booking-summary-row">
                                                <span className="booking-summary-total-label">Total</span>
                                                <span className="booking-summary-total-amount">${calculateTotal()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Date Selection Section - Right Side */}
                    <div className="booking-date-section">
                        <div className="booking-date-card">
                            <h2 className="booking-date-title">Select Your Dates</h2>
                            <p className="booking-date-subtitle">
                                Choose your rental period. Click the button below to open the date picker.
                            </p>

                            {/* Selected Dates Display */}
                            <div className="booking-selected-dates">
                                <div className="booking-selected-grid">
                                    <div>
                                        <label className="booking-selected-label">Start Date</label>
                                        <p className="booking-selected-value">
                                            {formatDate(startDate)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="booking-selected-label">End Date</label>
                                        <p className="booking-selected-value">
                                            {formatDate(endDate)}
                                        </p>
                                    </div>
                                </div>
                                {startDate && endDate && (
                                    <div className="booking-duration">
                                        <div className="booking-duration-row">
                                            <span className="booking-duration-label">Total rental duration:</span>
                                            <span className="booking-duration-value">
                                                {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Button to Open Date Picker */}
                            <button
                                onClick={() => setShowDatePicker(true)}
                                className="btn btn-primary btn-block btn-select-dates"
                            >
                                {startDate && endDate ? 'Change Dates' : 'Select Dates'}
                            </button>

                            {/* Error Message */}
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="booking-actions">
                                <button
                                    onClick={() => {
                                        setStartDate(null);
                                        setEndDate(null);
                                        setError('');
                                    }}
                                    className="btn btn-outline btn-clear"
                                >
                                    Clear Dates
                                </button>
                                <button
                                    onClick={handleCreateBooking}
                                    disabled={!startDate || !endDate || creatingBooking}
                                    className="btn btn-primary btn-proceed"
                                >
                                    {creatingBooking ? (
                                        <span className="btn-loading">
                                            <span className="spinner-small"></span>
                                            Creating Booking...
                                        </span>
                                    ) : (
                                        'Proceed to Payment'
                                    )}
                                </button>
                            </div>

                            {/* Important Notes */}
                            <div className="booking-info-box">
                                <h4 className="booking-info-title">Important Information</h4>
                                <ul className="booking-info-list">
                                    <li> Bookings are pending until payment is completed</li>
                                    <li> Free cancellation up to 24 hours before start date</li>
                                    <li> Payment will be processed after booking confirmation</li>
                                    <li> You can view all your bookings in "My Bookings" page</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Date Range Picker Modal */}
            {showDatePicker && (
                <DateRangePicker
                    boatId={boat.boat_id}
                    onDateSelect={(start, end) => {
                        handleDateSelect(start, end);
                        setShowDatePicker(false);
                    }}
                    onClose={() => setShowDatePicker(false)}
                />
            )}
        </div>
    </MainLayout>
);
}

export default BookingPage;