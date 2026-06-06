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
    <div className="admin-boats-page">
        {/* Admin Header */}
        <div className="admin-header">
            <div className="container">
                <div className="admin-header-content">
                    <div className="admin-header-left">
                        <p className="admin-header-subtitle">Manage your boat fleet</p>
                    </div>
                    <Link
                        to="/admin/boats/new"
                        className="btn btn-success"
                    >
                        + Add New Boat
                    </Link>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="admin-main-content">
            <div className="container">
                {/* Search Bar */}
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Search boats by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <div className="search-results-count">
                        Total Boats: {filteredBoats.length}
                    </div>
                </div>

                {/* Boats Grid */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {filteredBoats.length === 0 ? (
                    <div className="empty-state">
                        <h3 className="empty-state-title">No boats found</h3>
                        <p className="empty-state-text">
                            Get started by adding a new boat.
                        </p>
                    </div>
                ) : (
                    <div className="boats-grid">
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
    </div>
</MainLayout>
    );
}

export default AdminBoatsPage;