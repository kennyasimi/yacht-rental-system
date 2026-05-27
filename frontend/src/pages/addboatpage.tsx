import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createBoat } from '../services/boatsservice';

function AddBoatPage() {
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
            
            await createBoat(formDataToSend);
            navigate('/admin/boats');
        } catch (error) {
            console.error('Error creating boat:', error);
            alert('Failed to create boat');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/admin/boats" className="text-blue-600 hover:text-blue-800">
                        ← Back to Admin Dashboard
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4">
                        <h1 className="text-2xl font-bold">Add New Boat</h1>
                        <p className="text-blue-100">Add a new boat to your fleet</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Boat Image
                            </label>
                            <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="h-32 w-32 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="h-32 w-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        JPG, JPEG, PNG, GIF, or WEBP (Max 5MB)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Boat Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Boat Name *
                            </label>
                            <input
                                type="text"
                                name="boat_name"
                                value={formData.boat_name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Sea Ray 350"
                            />
                        </div>

                        {/* Boat Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Boat Type *
                            </label>
                            <input
                                type="text"
                                name="boat_type"
                                value={formData.boat_type}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Luxury Yacht, Speed Boat, Fishing Boat"
                            />
                        </div>

                        {/* Capacity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Capacity (persons) *
                            </label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleInputChange}
                                required
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Price Per Day */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                            >
                                {loading ? 'Creating...' : 'Create Boat'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/boats')}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
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