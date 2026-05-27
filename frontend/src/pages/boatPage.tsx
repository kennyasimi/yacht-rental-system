import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBoatById } from '../services/boatsservice';
import { type Boat } from '../types/boat';

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
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !boat) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || 'Boat not found'}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Button */}
            <div className="container mx-auto px-4 py-6">
                <Link
                    to="/boats"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to All Boats
                </Link>
            </div>

            {/* Boat Details */}
            <div className="container mx-auto px-4 pb-12">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Image Section */}
                        <div className="relative h-96 md:h-full bg-gray-200">
                            {boat.imageUrl && !imageError ? (
                                <img
                                    src={`http://localhost:3000${boat.imageUrl}`}
                                    alt={boat.boat_name}
                                    className="w-full h-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                                    <svg className="w-32 h-32 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="p-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                {boat.boat_name}
                            </h1>

                            <div className="flex items-center mb-4">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                    {boat.boat_type}
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="text-4xl font-bold text-blue-600">
                                    ${boat.price_per_day}
                                    <span className="text-lg text-gray-500 font-normal"> / day</span>
                                </div>
                            </div>

                            {/* Specifications */}
                            <div className="border-t border-b border-gray-200 py-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Capacity</span>
                                        <span className="font-semibold">{boat.capacity} persons</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Type</span>
                                        <span className="font-semibold">{boat.boat_type}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Price</span>
                                        <span className="font-semibold">${boat.price_per_day}/day</span>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Button */}
                            <button
                                onClick={handleBooking}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105"
                            >
                                Book This Boat
                            </button>

                            {/* Additional Info */}
                            <div className="mt-6 text-sm text-gray-500">
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