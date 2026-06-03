import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getBookingById } from '../../services/bookingservice';
import { processPayment } from '../../services/paymentservice';
function PaymentPage() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    
    //const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [booking, setBooking] = useState<any>(null);
    const [selectedMethod, setSelectedMethod] = useState('credit_card');
    const [paymentResult, setPaymentResult] = useState<any>(null);

    const token = localStorage.getItem('token')

    useEffect(() => {
        // Get booking from location state or fetch from API
        if (location.state?.booking) {
            setBooking(location.state.booking);
        } else if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId, location.state]);

    const fetchBookingDetails = async () => {
        try {
            const data = await getBookingById(Number(bookingId), token || '');
            setBooking(data);
        } catch (error) {
            setError('Failed to load booking details');
            console.error(error);
        }
    };

    const handlePayment = async () => {
        const paymentInfo = {
            bookingId: Number(bookingId),
            paymentMethod: String(selectedMethod)
        };
        setProcessing(true);
        setError('');
        

        try {
            const result = await processPayment( paymentInfo, token || '' )

            setPaymentResult(result);

            if (result.success) {
                // Wait 2 seconds then redirect to success page
                setTimeout(() => {
                    navigate(`/payment/success/${bookingId}`, {
                        state: { payment: result.payment, booking }
                    });
                }, 2000);
            } else {
                // Stay on page to show error
                setTimeout(() => {
                    setProcessing(false);
                }, 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateDays = () => {
        if (!booking) return 0;
        const start = new Date(booking.start_date);
        const end = new Date(booking.end_date);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    if (!booking && !error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error && !booking) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Payment Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Complete Your Payment</h1>
                    <p className="text-gray-600 mt-2">Secure payment processing</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Booking Summary - Left Side */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Booking ID:</span>
                                    <span className="font-semibold">#{booking.booking_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Start Date:</span>
                                    <span>{formatDate(booking.start_date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">End Date:</span>
                                    <span>{formatDate(booking.end_date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Duration:</span>
                                    <span>{calculateDays()} days</span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between font-bold">
                                        <span>Total Amount:</span>
                                        <span className="text-blue-600 text-xl">
                                            ${booking.total_price || 'Calculating...'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form - Right Side */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {!paymentResult ? (
                                <>
                                    <h2 className="text-lg font-semibold mb-4">Payment Details</h2>

                                    {/* Payment Method Selection */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Select Payment Method
                                        </label>
                                        <div className="space-y-3">
                                            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="credit_card"
                                                    checked={selectedMethod === 'credit_card'}
                                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                                    className="mr-3"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold">Credit / Debit Card</div>
                                                    <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                                                </div>
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </label>

                                            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="paypal"
                                                    checked={selectedMethod === 'paypal'}
                                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                                    className="mr-3"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold">PayPal</div>
                                                    <div className="text-sm text-gray-500">Pay with your PayPal account</div>
                                                </div>
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </label>

                                            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="bank_transfer"
                                                    checked={selectedMethod === 'bank_transfer'}
                                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                                    className="mr-3"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold">Bank Transfer</div>
                                                    <div className="text-sm text-gray-500">Direct bank transfer</div>
                                                </div>
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                                </svg>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Credit Card Details (shown when credit card selected) */}
                                    {selectedMethod === 'credit_card' && (
                                        <div className="space-y-4 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Card Number
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="1234 5678 9012 3456"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Expiry Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        CVV
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="123"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Cardholder Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* PayPal Notice */}
                                    {selectedMethod === 'paypal' && (
                                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                            <p className="text-sm text-blue-800">
                                                You will be redirected to PayPal to complete your payment.
                                            </p>
                                        </div>
                                    )}

                                    {/* Bank Transfer Notice */}
                                    {selectedMethod === 'bank_transfer' && (
                                        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                                            <p className="text-sm text-yellow-800">
                                                Please transfer the total amount to our bank account. 
                                                Your booking will be confirmed once we receive the payment.
                                            </p>
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                            {error}
                                        </div>
                                    )}

                                    {/* Pay Button */}
                                    <button
                                        onClick={handlePayment}
                                        disabled={processing}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 transition-colors"
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Processing Payment...
                                            </span>
                                        ) : (
                                            `Pay $${booking?.total_price || '0'}`
                                        )}
                                    </button>
                                </>
                            ) : (
                                /* Payment Processing Result */
                                <div className="text-center py-8">
                                    {paymentResult.success ? (
                                        <>
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
                                            <p className="text-gray-600">Redirecting to confirmation page...</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">Payment Failed</h3>
                                            <p className="text-gray-600 mb-4">{paymentResult.message}</p>
                                            <button
                                                onClick={() => setPaymentResult(null)}
                                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                                            >
                                                Try Again
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;