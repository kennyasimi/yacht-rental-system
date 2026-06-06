import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createBoat } from '../../services/boatsservice';

const BOAT_TYPES = [
    { value: 'LUXURY_YACHT', label: 'Luxury Yacht' },
    { value: 'SPEED_BOAT', label: 'Speed Boat' },
    { value: 'FISHING_BOAT', label: 'Fishing Boat' },
    { value: 'SAILBOAT', label: 'Sailboat' },
    { value: 'CATAMARAN', label: 'Catamaran' },
    { value: 'PONTOON', label: 'Pontoon Boat' },
    { value: 'JET_SKI', label: 'Jet Ski' },
    { value: 'HOUSE_BOAT', label: 'House Boat' },
    { value: 'DINGHY', label: 'Dinghy' },
    { value: 'RIB', label: 'RIB (Rigid Inflatable Boat)' },
    { value: 'CRUISER', label: 'Cruiser' },
    { value: 'CABIN_CRUISER', label: 'Cabin Cruiser' },
    { value: 'CENTER_CONSOLE', label: 'Center Console' },
    { value: 'DECK_BOAT', label: 'Deck Boat' },
    { value: 'OTHER', label: 'Other' }
];

function AddBoatPage() {
    const token = localStorage.getItem('token')
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        boat_name: '',
        boat_type: '',
        capacity: 1,
        price_per_day: 0
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' || name === 'price_per_day' ? parseFloat(value) : value
        }));
    };

    const handleBoatTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            boat_type: e.target.value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        // Clear the file input value
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('boat_name', formData.boat_name);
            formDataToSend.append('boat_type', formData.boat_type);
            formDataToSend.append('capacity', formData.capacity.toString());
            formDataToSend.append('price_per_day', formData.price_per_day.toString());
            
            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            }
            
            await createBoat(formDataToSend, token || '');
            navigate('/admin/boats');
        } catch (error) {
            console.error('Error creating boat:', error);
            alert('Failed to create boat');
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="add-boat-page">
        <div className="add-boat-container">
            {/* Header */}
            <div className="add-boat-back-container">
                <Link to="/admin/boats" className="add-boat-back-link">
                    ← Back to Admin Dashboard
                </Link>
            </div>

            {/* Form Card */}
            <div className="add-boat-card">
                <div className="add-boat-card-header">
                    <h1 className="add-boat-card-title">Add New Boat</h1>
                    <p className="add-boat-card-subtitle">Add a new boat to your fleet</p>
                </div>

                <form onSubmit={handleSubmit} className="add-boat-form">
                    {/* Image Upload */}
                    <div className="form-group">
                        <label className="form-label">
                            Boat Image
                        </label>
                        <div className="image-upload-container">
                            <div className="image-preview-wrapper">
                                {previewUrl ? (
                                    <div className="image-preview-relative">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="image-preview"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="image-remove-btn"
                                            title="Remove image"
                                        >
                                            <svg className="image-remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="image-placeholder">
                                        <svg className="image-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="image-upload-controls">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file-input-custom"
                                />
                                <p className="image-upload-hint">
                                    JPG, JPEG, PNG, GIF, or WEBP (Max 5MB)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Boat Name */}
                    <div className="form-group">
                        <label className="form-label">
                            Boat Name *
                        </label>
                        <input
                            type="text"
                            name="boat_name"
                            value={formData.boat_name}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                            placeholder="e.g., Sea Ray 350"
                        />
                    </div>

                    {/* Boat Type */}
                    <div className="form-group">
                        <label className="form-label">
                            Boat Type *
                        </label>
                        <select
                            name="boat_type"
                            value={formData.boat_type}
                            onChange={handleBoatTypeChange}
                            required
                            className="form-select"
                        >
                            <option value="">Select a boat type...</option>
                            {BOAT_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Capacity */}
                    <div className="form-group">
                        <label className="form-label">
                            Capacity (persons) *
                        </label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleInputChange}
                            required
                            min="1"
                            className="form-input"
                        />
                    </div>

                    {/* Price Per Day */}
                    <div className="form-group">
                        <label className="form-label">
                            Price Per Day ($) *
                        </label>
                        <input
                            type="number"
                            name="price_per_day"
                            value={formData.price_per_day}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="form-input"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary btn-create"
                        >
                            {loading ? 'Creating...' : 'Create Boat'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/boats')}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
);
}

export default AddBoatPage;