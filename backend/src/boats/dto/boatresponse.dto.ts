// dto/boat-response.dto.ts
import { Exclude, Expose } from 'class-transformer';

export class BoatResponseDto {
    @Expose()
    boat_id!: number;

    @Expose()
    boat_name!: string;

    @Expose()
    boat_type!: string;

    @Expose()
    capacity!: number;

    @Expose()
    price_per_day!: number;

    // This field exists in database but will NOT be sent to client
    @Exclude()
    created_at!: Date;

    @Exclude()
    updated_at!: Date;

    @Exclude()
    location_id!: number;

    @Exclude()
    is_available!: boolean;
}