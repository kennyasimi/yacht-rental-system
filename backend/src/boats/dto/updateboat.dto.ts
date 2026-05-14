import { IsString, IsOptional, IsInt, IsPositive } from "class-validator";

export class UpdateBoatDto {
    @IsOptional()
    @IsString()
    new_boat_name!: string;

    @IsOptional()
    @IsString()
    new_boat_type!: string;

    @IsOptional()
    @IsInt()
    @IsPositive()
    new_price_per_day!: number;
}