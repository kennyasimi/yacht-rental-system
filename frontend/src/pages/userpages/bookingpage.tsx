import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBoatById } from '../../services/boatsservice';
import DateRangePicker from '../../components/daterangepicker';
import { type Boat } from '../../types/boat';
import { createBooking } from '../../services/bookingservice';

function BookingPage() {
    const { boatId } = useParams<{ boatId: string }>();
    const navigate = useNavigate();
    const [boat, setBoat] = useState<Boat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageError, setImageError] = useState(false);
    
    // Date selection state
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
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
        const bookingData = {
            boat_id: Number(boatId),
            start_date: String(startDate),
            end_date: String(endDate)
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
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error && !boat) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (!boat) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header with Back Button */}
                <div className="mb-6">
                    <Link 
                        to={`/boats/${boatId}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Boat Details
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Boat Info Card - Left Side */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
                            <div className="relative h-48 bg-gray-200">
                                {boat.imageUrl && !imageError ? (
                                    <img
                                        src={`http://localhost:3000${boat.imageUrl}`}
                                        alt={boat.boat_name}
                                        className="w-full h-full object-cover"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                                        <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                    {boat.boat_name}
                                </h1>
                                <div className="flex items-center mb-4">
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                        {boat.boat_type}
                                    </span>
                                </div>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Capacity</span>
                                        <span className="font-semibold">{boat.capacity} persons</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Price per day</span>
                                        <span className="font-semibold text-blue-600">${boat.price_per_day}</span>
                                    </div>
                                </div>

                                {/* Price Summary - Shows when dates are selected */}
                                {startDate && endDate && (
                                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                        <h3 className="font-semibold text-gray-800 mb-3">Price Summary</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>Daily rate</span>
                                                <span>${boat.price_per_day}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Number of days</span>
                                                <span>{calculateDays()} days</span>
                                            </div>
                                            <div className="border-t border-blue-200 pt-2 mt-2">
                                                <div className="flex justify-between font-bold text-lg">
                                                    <span>Total</span>
                                                    <span className="text-blue-600">${calculateTotal()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Date Selection Section - Right Side */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Dates</h2>
                            <p className="text-gray-600 mb-6">
                                Choose your rental period. Click the button below to open the date picker.
                            </p>

                            {/* Selected Dates Display */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600 font-medium">Start Date</label>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {formatDate(startDate)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 font-medium">End Date</label>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {formatDate(endDate)}
                                        </p>
                                    </div>
                                </div>
                                {startDate && endDate && (
                                    <div className="mt-3 pt-3 border-t border-blue-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700">Total rental duration:</span>
                                            <span className="font-bold text-blue-600">
                                                {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Button to Open Date Picker */}
                            <button
                                onClick={() => setShowDatePicker(true)}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-6"
                            >
                                {startDate && endDate ? 'Change Dates' : 'Select Dates'}
                            </button>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-8 flex gap-4">
                                <button
                                    onClick={() => {
                                        setStartDate(null);
                                        setEndDate(null);
                                        setError('');
                                    }}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Clear Dates
                                </button>
                                <button
                                    onClick={handleCreateBooking}
                                    disabled={!startDate || !endDate || creatingBooking}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                                >
                                    {creatingBooking ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Creating Booking...
                                        </span>
                                    ) : (
                                        'Proceed to Payment'
                                    )}
                                </button>
                            </div>

                            {/* Important Notes */}
                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                    <li>✓ Bookings are pending until payment is completed</li>
                                    <li>✓ Free cancellation up to 24 hours before start date</li>
                                    <li>✓ Payment will be processed after booking confirmation</li>
                                    <li>✓ You can view all your bookings in "My Bookings" page</li>
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
    );
}

export default BookingPage;