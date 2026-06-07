// services/reviewsservice.ts
import axios from 'axios';
import { type ReviewsResponse } from '../types/boat'


const API_URL = 'http://localhost:3000/reviews';

export const createReview = async (bookingId: number, data: { booking_id: number; rating: number; comment: string }, token: string) => {
    const response = await axios.post(`${API_URL}/booking/${bookingId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateReview = async (reviewId: number, data: { rating: number; comment: string }, token: string) => {
    const response = await axios.put(`${API_URL}/${reviewId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteReview = async (reviewId: number, token: string) => {
    const response = await axios.delete(`${API_URL}/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getUserReviewForBooking = async (bookingId: number, token: string) => {
    try {
        const response = await axios.get(`${API_URL}/booking/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return null; // No review found
    }
};

export const getUserReviews = async (token: string) => {
    const response = await axios.get(`${API_URL}/my-reviews`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getBoatReviews = async (boatId: number, page: number = 1, limit: number = 10): Promise<ReviewsResponse> => {
    const response = await axios.get(`${API_URL}/boat/${boatId}`, {
        params: { page, limit }
    });
    return response.data;
};

export const getBoatRating = async (boatId: number) => {
    const response = await axios.get(`${API_URL}/boat/${boatId}/rating`);
    return response.data;
};