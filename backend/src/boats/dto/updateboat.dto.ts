import { IsString, IsOptional, IsInt, IsPositive } from "class-validator";
import { Type } from "class-transformer";
export class UpdateBoatDto {
    @IsOptional()
    @IsString()
    new_boat_name!: string;

    @IsOptional()
    @IsString()
    new_boat_type!: string;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @IsPositive()
    new_price_per_day!: number;
}