import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/auth.enums';
import { UpdateUserDto } from './dto/updateuser.dto';
import { DeleteUserDto } from './dto/deleteuser.dto';
import { ChangePasswordDto } from './dto/changepassword.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // CURRENT USER PROFILE
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.getUserById(req.user.userId);
  }

  // UPDATE PROFILE
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(
    @Request() req,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(
      req.user.userId,
      dto,
    );
  }

  // CHANGE PASSWORD
  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  changePassword(
    @Request() req,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      req.user.userId,
      dto,
    );
  }

  // DELETE ACCOUNT
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  deleteAccount(@Request() req, 
                @Body() dto: DeleteUserDto
    ) {
    return this.usersService.deleteUser(req.user.userId, dto);
  }

  // ADMIN VIEW ALL USERS
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}