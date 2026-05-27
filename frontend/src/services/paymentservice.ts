import axios from 'axios';

const API_URL = 'http://localhost:3000/payments';

export interface ProcessPaymentDto {
    bookingId: number;
    paymentMethod: string;
}

export interface PaymentResult {
    success: boolean;
    message: string;
    payment: {
        payment_id: number;
        booking_id: number;
        amount: number;
        payment_status: string;
        payment_method: string;
        payment_date: string;
        error_message?: string;
    };
}


   

export const getPaymentByBookingId = async(bookingId: number) => {
        const response = await axios.get(`${API_URL}/booking/${bookingId}`);
        return response.data;
    }

export const getAllPayments = async() => {
        const response = await axios.get(`${API_URL}`);
        return response.data;
    }


 export const processPayment = async(dto: ProcessPaymentDto, token: string) => {
        const response = await axios.post(`${API_URL}/me/pay`, dto, {
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data;
    }