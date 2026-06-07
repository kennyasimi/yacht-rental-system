import { IsString, isValidationOptions, IsOptional, IsInt } from "class-validator";

export class createReviewDto{

    @IsInt()
    booking_id! :number
    
    @IsInt()
    rating!: number

    @IsString()
    comment!: string
    
}