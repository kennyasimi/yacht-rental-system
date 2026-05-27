import { Controller, Patch, Param, Body,ParseIntPipe, UseGuards, Get, Post, Delete, UseInterceptors, UploadedFile, Res, HttpStatus, UploadedFiles } from '@nestjs/common';
import { boatsService } from './boats.service';
import { UpdateBoatDto } from './dto/updateboat.dto';
import { CreateBoatDto } from './dto/createboat.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/auth.enums';
import * as fs from 'fs';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('boats')
export class BoatsController {
    constructor(private readonly boatsService: boatsService) {}
   
    //get 1 boat
    @Get(':id')
    async getBoat(@Param('id', ParseIntPipe) id: number,){
        return this.boatsService.getBoatById(id)
    }


    //get all boats
    @Get()
    //@UseGuards(JwtAuthGuard)
    getAllBoats(){
        return this.boatsService.getAllBoats()
    }

    //create new boat
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async addBoat( 
        @Body() createBoatDto: CreateBoatDto,
        @UploadedFile() image: Express.Multer.File                                 
        ){
        return this.boatsService.createBoat(createBoatDto, image)
    }

    
    //update boat details
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id') 
    @UseInterceptors(FileInterceptor('image'))
    async updateBoat(
            @Param('id', ParseIntPipe) id: number, //  Captures the ID from the URL path
            @Body() updateBoatDto: UpdateBoatDto,  //  Captures the incoming updates from the body
            @UploadedFile() image?: Express.Multer.File
        ) {
            return this.boatsService.updateBoat(id, updateBoatDto, image);
    
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async deleteBoat (@Param('id', ParseIntPipe) id: number,) {
        return this.boatsService.deleteBoat(id)

    }

    
}
