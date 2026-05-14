import { Controller, Patch, Param, Body,ParseIntPipe, UseGuards, Get, Post, Delete } from '@nestjs/common';
import { boatsService } from './boats.service';
import { UpdateBoatDto } from './dto/updateboat.dto';
import { CreateBoatDto } from './dto/createboat.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from 'src/auth/auth.enums';

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
    addBoat( @Body() createBoatDto: CreateBoatDto){
        return this.boatsService.createBoat
    }

    
    //update boat details
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id') 
    async extractBoatId(
            @Param('id', ParseIntPipe) id: number, //  Captures the ID from the URL path
            @Body() updateBoatDto: UpdateBoatDto,  //  Captures the incoming updates from the body
        ) 
        {
            return this.boatsService.updateBoat(id, updateBoatDto);
    
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async deleteBoat (@Param('id', ParseIntPipe) id: number,) {
        return this.boatsService.deleteBoat(id)

    }

    
}
