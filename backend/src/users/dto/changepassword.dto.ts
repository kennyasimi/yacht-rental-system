import {
  IsString,
  MinLength,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class ChangePasswordDto{

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  old_password!: string;


  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  new_password!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password_confirm!: string;
}

