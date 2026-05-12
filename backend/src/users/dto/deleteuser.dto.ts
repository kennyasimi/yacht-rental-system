import {
  IsString,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class DeleteUserDto{
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;

}