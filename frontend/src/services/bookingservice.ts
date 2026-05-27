import axios from 'axios';
import {  type CreateBookingDto, type BoatAvailability, type Booking, type  BookingWithDetails } from '../types/booking';

const API_URL = 'http://localhost:3000/bookings';



export const checkAvailability = async (boatId: number, month?: number, year?: number) => 
    {
        const params = new URLSearchParams();
        if (month) params.append('month', month.toString());
        if (year) params.append('year', year.toString());
        
        const response = await axios.get(`${API_URL}/boat/${boatId}/availability?${params.toString()}`);
        return response.data;
    }

export const createBooking = async(
     token: string,
     bookingData: CreateBookingDto) => {
        const response = await axios.post(`${API_URL}/create`, bookingData, {
            headers:{Authorization: `Bearer ${token}`}
        });
        return response.data;
    }

export const getBookingById = async(bookingId: number, token: String) => {
        const response = await axios.get(`${API_URL}/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}`}
            
        });
        return response.data;
    }

export const cancelBooking = async(bookingId: number, token: string) => {
         const response = await axios.patch(`${API_URL}/${bookingId}/cancel`,  {
            headers: { Authorization: `Bearer ${token}`}
        });
        return response.data;
    }

export const getUserBookings = async(token: string)  => {
        const response = await axios.get(`${API_URL}/all`,{
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data;
    }