import { IsString, IsOptional, IsInt, IsPositive } from "class-validator";
import { Type } from "class-transformer";
export class CreateBoatDto {
    
    @IsString()
    boat_name!: string;

    @IsString()
    boat_type!: string;

    @Type(() => Number)
    @IsInt()
    @IsPositive()
    capacity!: number;

    @Type(() => Number)
    @IsInt()
    @IsPositive()
    price_per_day!: number;
}