// dto/update-review.dto.ts
import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';

export class updateReviewDto {
    @IsInt()
    @Min(1)
    @Max(5)
    rating!: number;

    @IsString()
    @IsOptional()
    comment?: string;
}