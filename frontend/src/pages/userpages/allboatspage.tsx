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
        <div className="loading-container">
            <div className="spinner"></div>
        </div>
    );
}

if (error) {
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
        <div className="boats-page">
            {/* Hero Section */}
            <div className="boats-hero">
                <div className="container">
                    <h1 className="boats-hero-title">Our Boat Fleet</h1>
                    <p className="boats-hero-subtitle">
                        Discover our collection of premium boats for your next adventure
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="boats-content">
                <div className="container">
                    <div className="filters-section">
                        <div className="filters-grid">
                            {/* Search Input */}
                            <div className="filter-group">
                                <label className="filter-label">
                                    Search Boats
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search by boat name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="filter-input"
                                />
                            </div>

                            {/* Filter by Type */}
                            <div className="filter-group">
                                <label className="filter-label">
                                    Filter by Type
                                </label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">All Types</option>
                                    {boatTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="results-count">
                            Found {filteredBoats.length} boat{filteredBoats.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Boats Grid */}
                    {filteredBoats.length === 0 ? (
                        <div className="empty-state">
                            <h3 className="empty-state-title">No boats found</h3>
                            <p className="empty-state-text">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    ) : (
                        <div className="boats-grid">
                            {filteredBoats.map((boat) => (
                                <BoatCard key={boat.boat_id} boat={boat} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </MainLayout>
);
}

export default BoatsPage;



