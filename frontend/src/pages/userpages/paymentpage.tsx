import { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import { getBookingById } from '../../services/bookingservice';
import { processPayment } from '../../services/paymentservice';
import MainLayout from '../../components/publiclayout';

function PaymentPage() {
    const { id: rawbookingId } = useParams<{ id: string }>();
    //const location = useLocation();
    const navigate = useNavigate();
    const bookingId: number = Number(rawbookingId);
    //const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [booking, setBooking] = useState<any>(null);
    const [selectedMethod, setSelectedMethod] = useState('credit_card');
    const [paymentResult, setPaymentResult] = useState<any>(null);

    const token = localStorage.getItem('token')

    useEffect(() => {   
            fetchBookingDetails();
    }, [bookingId]);

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
            booking_id: Number(bookingId),
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
        <div className="loading-container">
            <div className="spinner"></div>
        </div>
    );
}

if (error && !booking) {
    return (
        <div className="loading-container">
            <div className="error-message">
                {error}
            </div>
        </div>
    );
}

return (
    <MainLayout>
        <div className="payment-page">
            <div className="container payment-container">
                {/* Payment Header */}
                <div className="payment-header">
                    <h1 className="payment-title">Complete Your Payment</h1>
                    <p className="payment-subtitle">Secure payment processing</p>
                </div>

                <div className="payment-grid">
                    {/* Booking Summary - Left Side */}
                    <div className="payment-summary">
                        <div className="summary-card">
                            <h2 className="summary-title">Booking Summary</h2>
                            
                            <div className="summary-details">
                                <div className="summary-row">
                                    <span className="summary-label">Booking ID:</span>
                                    <span className="summary-value">#{booking.booking_id}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Start Date:</span>
                                    <span className="summary-value">{formatDate(booking.start_date)}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">End Date:</span>
                                    <span className="summary-value">{formatDate(booking.end_date)}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Duration:</span>
                                    <span className="summary-value">{calculateDays()} days</span>
                                </div>
                                <div className="summary-total">
                                    <div className="summary-row">
                                        <span className="summary-label">Total Amount:</span>
                                        <span className="summary-amount">
                                            ${booking.total_price || 'Calculating...'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form - Right Side */}
                    <div className="payment-form-container">
                        <div className="payment-card">
                            {!paymentResult ? (
                                <>
                                    <h2 className="payment-form-title">Payment Details</h2>

                                    {/* Payment Method Selection */}
                                    <div className="payment-methods">
                                        <label className="payment-methods-label">
                                            Select Payment Method
                                        </label>
                                        <div className="payment-methods-list">
                                            <label className="payment-method-option">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="credit_card"
                                                    checked={selectedMethod === 'credit_card'}
                                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                                    className="payment-radio"
                                                />
                                                <div className="payment-method-info">
                                                    <div className="payment-method-name">Credit / Debit Card</div>
                                                    <div className="payment-method-description">Visa, Mastercard, American Express</div>
                                                </div>
                                            </label>

                                            <label className="payment-method-option">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="paypal"
                                                    checked={selectedMethod === 'paypal'}
                                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                                    className="payment-radio"
                                                />
                                                <div className="payment-method-info">
                                                    <div className="payment-method-name">PayPal</div>
                                                    <div className="payment-method-description">Pay with your PayPal account</div>
                                                </div>
                                            </label>

                                            <label className="payment-method-option">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="bank_transfer"
                                                    checked={selectedMethod === 'bank_transfer'}
                                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                                    className="payment-radio"
                                                />
                                                <div className="payment-method-info">
                                                    <div className="payment-method-name">Bank Transfer</div>
                                                    <div className="payment-method-description">Direct bank transfer</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Credit Card Details */}
                                    {selectedMethod === 'credit_card' && (
                                        <div className="credit-card-form">
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Card Number
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="1234 5678 9012 3456"
                                                    className="form-input"
                                                />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Expiry Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        CVV
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="123"
                                                        className="form-input"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Cardholder Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className="form-input"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* PayPal Notice */}
                                    {selectedMethod === 'paypal' && (
                                        <div className="notice-info">
                                            <p className="notice-text">
                                                You will be redirected to PayPal to complete your payment.
                                            </p>
                                        </div>
                                    )}

                                    {/* Bank Transfer Notice */}
                                    {selectedMethod === 'bank_transfer' && (
                                        <div className="notice-warning">
                                            <p className="notice-text">
                                                Please transfer the total amount to our bank account. 
                                                Your booking will be confirmed once we receive the payment.
                                            </p>
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {error && (
                                        <div className="error-message">
                                            {error}
                                        </div>
                                    )}

                                    {/* Pay Button */}
                                    <button
                                        onClick={handlePayment}
                                        disabled={processing}
                                        className="btn btn-success btn-block btn-pay"
                                    >
                                        {processing ? (
                                            <span className="btn-loading">
                                                <span className="spinner-small"></span>
                                                Processing Payment...
                                            </span>
                                        ) : (
                                            `Pay $${booking?.total_price || '0'}`
                                        )}
                                    </button>
                                </>
                            ) : (
                                /* Payment Processing Result */
                                <div className="payment-result">
                                    {paymentResult.success ? (
                                        <>
                                            <div className="result-icon success">
                                                <svg className="icon-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <h3 className="result-title">Payment Successful!</h3>
                                            <p className="result-message">Redirecting to confirmation page...</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="result-icon error">
                                                <svg className="icon-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            <h3 className="result-title">Payment Failed</h3>
                                            <p className="result-message">{paymentResult.message}</p>
                                            <button
                                                onClick={() => setPaymentResult(null)}
                                                className="btn btn-primary"
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
    </MainLayout>
);
}

export default PaymentPage;