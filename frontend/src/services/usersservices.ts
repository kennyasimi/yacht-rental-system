import axios from 'axios';

const API_URL = 'http://localhost:3000/users'

export const getAllUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getUserProfle = async (
    token: string
) =>{
    const response = await axios.get(`${API_URL}/me`,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data
}

/* export const updateUserProfile = async () => {

} */

export const changePassword = async (
    password_data: {
    old_password: string;
    new_password: string;
    password_confirm: string;
  },
  token: string
) => {
    const response = await axios.patch('${API_URL}/me/password',
        password_data,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        
    )
    return response;
}
