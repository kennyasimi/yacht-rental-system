import React, { useState } from 'react';
import { type Boat } from '../../types/boat';
import { updateBoat, deleteBoat } from '../../services/boatsservice';

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
            [name]: name === 'new_price_per_day' ? parseFloat(value) : value
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
            
            await updateBoat(boat.boat_id, formData);
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
            await deleteBoat(boat.boat_id);
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
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">Edit Boat</h3>
                    
                    {/* Image Preview */}
                    {(previewUrl || boat.imageUrl) && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Boat Image</label>
                            <div className="relative w-32 h-32">
                                <img
                                    src={previewUrl || `http://localhost:3000${boat.imageUrl}`}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        </div>
                    )}
                    
                    {/* Edit Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Boat Name</label>
                            <input
                                type="text"
                                name="new_boat_name"
                                value={editData.new_boat_name}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Boat Type</label>
                            <input
                                type="text"
                                name="new_boat_type"
                                value={editData.new_boat_type}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Day ($)</label>
                            <input
                                type="number"
                                name="new_price_per_day"
                                value={editData.new_price_per_day}
                                onChange={handleEditChange}
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Change Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full"
                            />
                        </div>
                        
                        <div className="flex space-x-3 pt-4">
                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setSelectedImage(null);
                                    setPreviewUrl(null);
                                }}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden bg-gray-200">
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
                
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${boat.price_per_day}/day
                </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{boat.boat_name}</h3>
                <p className="text-gray-600 text-sm mb-2">Type: {boat.boat_type}</p>
                <p className="text-gray-600 text-sm mb-4">Capacity: {boat.capacity} persons</p>
                
                {/* Admin Actions */}
                <div className="flex space-x-3 pt-3 border-t border-gray-200">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
            
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{boat.boat_name}"? This action cannot be undone.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                            >
                                {loading ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
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