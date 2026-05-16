import { IsOptional, IsInt, IsString } from "class-validator"

export class PaymentDto {

    @IsInt()
    booking_id!: number;

    @IsString()
    payment_method!: string;

}