import axios from 'axios';


const API_URL = 'http://localhost:3000/auth'; //url to auth services in the backend


//for user login
export const loginUser = async (
  email: string,
  password: string,
) => {

  const response = await axios.post(
    `${API_URL}/login`,
    {
      email,
      password,
    },
  );
  

  return response.data;
};

//for new user registration
export const registerUser = async (
  registerData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }
) => {

  const response = await axios.post(
    `${API_URL}/register`,
    registerData,
  );

  return response.data;
};

export const registerAdmin = async(
  adminData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string
  }, token: string
) => {
  const response = await axios.post(
    `${API_URL}/admin/create`,
    adminData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data;
}