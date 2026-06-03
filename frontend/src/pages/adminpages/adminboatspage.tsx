import { useEffect, useState } from 'react';
import { getAllBoats } from '../../services/boatsservice';
import AdminBoatCard from '../../components/cards/adminboatcard';
import { type Boat } from '../../types/boat';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/publiclayout';

function AdminBoatsPage() {
    const [boats, setBoats] = useState<Boat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBoats = async () => {
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

    useEffect(() => {
        fetchBoats();
    }, []);

    const filteredBoats = boats.filter(boat =>
        boat.boat_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50">
                {/* Admin Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-300">Manage your boat fleet</p>
                            </div>
                            <Link
                                to="/admin/boats/new"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                + Add New Boat
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8">
                    {/* Search Bar */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <input
                            type="text"
                            placeholder="Search boats by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="mt-2 text-gray-600">
                            Total Boats: {filteredBoats.length}
                        </div>
                    </div>

                    {/* Boats Grid */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {filteredBoats.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg">
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No boats found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by adding a new boat.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBoats.map((boat) => (
                                <AdminBoatCard
                                    key={boat.boat_id}
                                    boat={boat}
                                    onBoatUpdated={fetchBoats}
                                    onBoatDeleted={fetchBoats}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

export default AdminBoatsPage;