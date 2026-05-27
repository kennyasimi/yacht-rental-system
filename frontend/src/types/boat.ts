export interface Boat {
    boat_id: number;
    boat_name: string;
    boat_type: string;
    capacity: number;
    price_per_day: number;
    imageUrl: string | null;
    
}

export interface BoatCardProps {
    boat: Boat;
}

export interface BoatDetailsProps {
    boat: Boat;
}