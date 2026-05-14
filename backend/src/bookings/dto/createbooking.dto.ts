import { IsString, IsInt, IsDate ,IsNotEmpty, MinDate} from "class-validator";
import { Type } from 'class-transformer';


export class CreateBookingDto{

    @IsInt()
    @IsNotEmpty()
    boat_id!: number;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    @MinDate(new Date())
    start_date!: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    @MinDate(new Date())
    end_date!: Date;

    
}