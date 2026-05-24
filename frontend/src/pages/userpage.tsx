import React, { useState, useEffect } from 'react';
import { getUserProfle } from '../services/usersservices';

// Define the shape of your form state based on your UpdateUserDto
interface ProfileFormState {
  new_email: string;
  first_name: string;
  last_name: string;
  phone: string;
}


function ProfilePage  ()  {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProfileFormState>({
    new_email: '',
    first_name: '',
    last_name: '',
    phone: '',
  });

  // Fetch existing user data on component load using the token
  useEffect(() => {
    const fetchUserData = async () => {
      // 2. Grab token from localStorage right here
       
      
      try {
        // 3. Replaced `/api/users/${userId}` with your modern secure `/api/users/profile` route
        const token = localStorage.getItem('token');
    
        const data = await getUserProfle(token!);
        
        
        
        setFormData({
          new_email: data.email || '', 
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    
    fetchUserData();
  }, []); // 5. Empty dependency array because we don't depend on a userId prop anymore

  // Handle input changes dynamically for all fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit the entire object to the backend securely
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      // 6. Changed endpoint to match the token-based profile route
      const response = await fetch('/api/users/profile', {
        method: 'PATCH', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 7. Secure the update request with the token
        },
        body: JSON.stringify(formData), // Sends everything; backend handles the rest
      });

      if (response.ok) {
        setIsEditing(false); // 8. Exit editing mode on success
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="new_email"
            value={formData.new_email}
            onChange={handleChange}
            disabled={!isEditing} // Fields remain locked until 'Edit' is clicked
          />
        </div>

        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {/* Conditional button rendering based on editing state */}
        {!isEditing ? (
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit Credentials
          </button>
        ) : (
          <>
            <button type="submit">Save Changes</button>
            {/* Toggles editing mode back off if user clicks Cancel */}
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
