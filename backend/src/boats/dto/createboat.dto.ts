import { IsString, IsOptional, IsInt, IsPositive } from "class-validator";

export class CreateBoatDto {
    
    @IsString()
    boat_name!: string;

    @IsString()
    boat_type!: string;

    @IsInt()
    @IsPositive()
    capacity!: number;

    @IsInt()
    @IsPositive()
    price_per_day!: number;
}