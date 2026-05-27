import axios from 'axios';
import {  type Boat } from '../types/boat';

const API_URL = 'http://localhost:3000/boats'

export const getAllBoats = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getBoatById = async (id: number)  => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
}

export const createBoat = async (formData: FormData): Promise<Boat> => {
    const response = await axios.post(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateBoat = async (id: number, formData: FormData): Promise<Boat> => {
    const response = await axios.patch(`${API_URL}/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteBoat = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};