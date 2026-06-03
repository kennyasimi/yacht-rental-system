import axios from 'axios';

const API_URL = 'http://localhost:3000/users'

export const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
};

export const getUserProfile = async (
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


export const changePassword = async (
    password_data: {
    old_password: string;
    new_password: string;
    password_confirm: string;
  },
  token: string
) => {
    const response = await axios.patch(`${API_URL}/me/password`,
        password_data,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        
    )
    return response;
}

export const updateUserProfile = async(
    profile_data: Partial <{
      email: string;
      first_name: string;
      last_name: string;
      phone: string;
    }> = {},
    token: string
) =>  {
    const response = await axios.patch(`${API_URL}/me`,
        profile_data,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    ) 

    return response;
}

export const deleteAccount = async(password: string, token: string) => {
        const response = await axios.delete(`${API_URL}/me`, {
            headers: {
                Authorization: `Bearer: ${token}`
                },
                data: {password,},
            },
        )
    return response
}