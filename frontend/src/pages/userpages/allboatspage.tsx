import { useEffect, useState } from 'react';
import { getAllBoats } from '../../services/boatsservice';
import BoatCard from '../../components/cards/boatcard';
import { type Boat } from '../../types/boat';
import MainLayout from '../../components/publiclayout';

function BoatsPage() {
    const [boats, setBoats] = useState<Boat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');

    useEffect(() => {
        const fetchAllBoats = async () => {
            try {
                const data = await getAllBoats();
                setBoats(data);
            } catch (error) {
                setError('Failed to load boats');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllBoats();
    }, []);

    // Get unique boat types for filter
    const boatTypes = [...new Set(boats.map(boat => boat.boat_type))];

    // Filter boats based on search and type
    const filteredBoats = boats.filter(boat => {
        const matchesSearch = boat.boat_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === '' || boat.boat_type === selectedType;
        return matchesSearch && matchesType;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (

        <MainLayout>
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">Our Boat Fleet</h1>
                    <p className="text-xl text-blue-100">
                        Discover our collection of premium boats for your next adventure
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Search Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Boats
                            </label>
                            <input
                                type="text"
                                placeholder="Search by boat name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter by Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Type
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Types</option>
                                {boatTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 text-gray-600">
                        Found {filteredBoats.length} boat{filteredBoats.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Boats Grid */}
                {filteredBoats.length === 0 ? (
                    <div className="text-center py-12">
                        
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No boats found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBoats.map((boat) => (
                            <BoatCard key={boat.boat_id} boat={boat} />
                        ))}
                    </div>
                )}
            </div>
        </div>
        </MainLayout>
    );
}

export default BoatsPage;



