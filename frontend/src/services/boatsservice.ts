import axios from 'axios';

const API_URL = 'http://localhost:3000/boats'

export const getAllBoats = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getBoatById = async () => {
    const response = await axios.get('${API_URL}/id');
    return response.data;
}

