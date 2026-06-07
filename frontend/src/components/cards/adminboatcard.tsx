import React, { useState } from 'react';
import { type Boat } from '../../types/boat';
import { updateBoat, deleteBoat } from '../../services/boatsservice';
import RatingStars from '../RatingStars';

interface AdminBoatCardProps {
    boat: Boat;
    onBoatUpdated: () => void;
    onBoatDeleted: () => void;
}

const AdminBoatCard: React.FC<AdminBoatCardProps> = ({ boat, onBoatUpdated, onBoatDeleted }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const token = localStorage.getItem('token')
    // Edit form state
    const [editData, setEditData] = useState({
        new_boat_name: boat.boat_name,
        new_boat_type: boat.boat_type,
        new_price_per_day: boat.price_per_day
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: name === 'new_price_per_day' ? parseInt(value) : value
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

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('new_boat_name', editData.new_boat_name);
            formData.append('new_boat_type', editData.new_boat_type);
            formData.append('new_price_per_day', editData.new_price_per_day.toString());
            
            if (selectedImage) {
                formData.append('image', selectedImage);
            }
            
            await updateBoat(boat.boat_id, formData, token || '');
            setIsEditing(false);
            setSelectedImage(null);
            setPreviewUrl(null);
            onBoatUpdated();
        } catch (error) {
            console.error('Error updating boat:', error);
            alert('Failed to update boat');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteBoat(boat.boat_id, token || '');
            setShowDeleteConfirm(false);
            onBoatDeleted();
        } catch (error) {
            console.error('Error deleting boat:', error);
            alert('Failed to delete boat');
        } finally {
            setLoading(false);
        }
    };

    if (isEditing) {
    return (
        <div className="admin-card edit-mode">
            <div className="admin-card-edit-content">
                <h3 className="admin-card-edit-title">Edit Boat</h3>
                
                {/* Image Preview */}
                {(previewUrl || boat.imageUrl) && (
                    <div className="admin-card-image-preview">
                        <label className="form-label">Boat Image</label>
                        <div className="admin-card-preview-container">
                            <img
                                src={previewUrl || `http://localhost:3000${boat.imageUrl}`}
                                alt="Preview"
                                className="admin-card-preview-image"
                            />
                        </div>
                    </div>
                )}
                
                {/* Edit Form */}
                <div className="admin-card-edit-form">
                    <div className="form-group">
                        <label className="form-label">Boat Name</label>
                        <input
                            type="text"
                            name="new_boat_name"
                            value={editData.new_boat_name}
                            onChange={handleEditChange}
                            className="form-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Boat Type</label>
                        <input
                            type="text"
                            name="new_boat_type"
                            value={editData.new_boat_type}
                            onChange={handleEditChange}
                            className="form-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Price Per Day ($)</label>
                        <input
                            type="number"
                            name="new_price_per_day"
                            value={editData.new_price_per_day}
                            onChange={handleEditChange}
                            step="0.01"
                            className="form-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Change Image (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file-input"
                        />
                    </div>
                    
                    <div className="admin-card-edit-actions">
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="btn btn-primary btn-save"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setSelectedImage(null);
                                setPreviewUrl(null);
                            }}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

return (
    <div className="admin-card">
        {/* Image Section */}
        <div className="admin-card-image">
            {boat.imageUrl && !imageError ? (
                <img
                    src={`http://localhost:3000${boat.imageUrl}`}
                    alt={boat.boat_name}
                    className="admin-card-img"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="admin-card-img-placeholder"></div>
            )}
            
            <div className="admin-card-price-badge">
                ${boat.price_per_day}/day
            </div>
        </div>
        
        {/* Content */}
        <div className="admin-card-content">
            <div className="admin-card-rating">
                <RatingStars 
                    rating={boat.averageRating} 
                    size="small" 
                    showValue={true}
                    totalReviews={boat.totalReviews}
                />
            </div>
            
            <h3 className="admin-card-title">{boat.boat_name}</h3>
            <p className="admin-card-type">Type: {boat.boat_type}</p>
            <p className="admin-card-capacity">Capacity: {boat.capacity} persons</p>
            
            {/* Admin Actions */}
            <div className="admin-card-actions">
                <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-warning btn-block"
                >
                    Edit
                </button>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn btn-danger btn-block"
                >
                    Delete
                </button>
            </div>
        </div>
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
            <div className="modal-overlay">
                <div className="modal-container delete-modal">
                    <h3 className="modal-title">Confirm Delete</h3>
                    <p className="modal-message">
                        Are you sure you want to delete "{boat.boat_name}"? This action cannot be undone.
                    </p>
                    <div className="modal-actions">
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="btn btn-danger"
                        >
                            {loading ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default AdminBoatCard;