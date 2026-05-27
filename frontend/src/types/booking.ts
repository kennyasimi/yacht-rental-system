export interface Booking {
    booking_id: number;
    user_id: number;
    boat_id: number;
    start_date: string;
    end_date: string;
    total_price: number | null;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    created_at: string;
    boat?: {
        boat_name: string;
        boat_type: string;
        price_per_day: number;
    };
}

export interface CreateBookingDto {
    boat_id: number;
    start_date: string;
    end_date: string;
}

export interface BoatAvailability {
    boatId: number;
    year: number;
    month: number;
    bookedDates: string[];
    availableDates: string[];
}

export interface BookingWithDetails extends Booking {
    boat?: {
        boat_name: string;
        boat_type: string;
        price_per_day: number;
    };
}