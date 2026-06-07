export interface Boat {
    boat_id: number;
    boat_name: string;
    boat_type: string;
    capacity: number;
    price_per_day: number;
    imageURl: string | null;
    averageRating: number | null;
    totalReviews: number;
    created_at?: string;
    updated_at?: string;   
}

export interface BoatCardProps {
    boat: Boat;
}

export interface BoatDetailsProps {
    boat: Boat;
}

export interface Review {
    review_id: number;
    booking_id: number;
    rating: number;
    comment: string;
    created_at: string;
    user_name: string;
}

export interface ReviewsResponse {
    reviews: Review[];
    total: number;
    page: number;
    totalPages: number;
}