import { Injectable } from '@nestjs/common';
import { CreateBoatDto } from './dto/createboat.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBoatDto } from './dto/updateboat.dto';
//import { DeleteBoatDto } from './dto/deleteboat.dto';
import * as bcrypt from 'bcrypt';
import { BoatsScalarFieldEnum } from '../generated/internal/prismaNamespace';
import { identity } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class boatsService {
    constructor (
        private prisma: PrismaService
        
    ){}

    async getBoatById(boatId: number) {
        return this.prisma.boats.findUnique({
            where: { boat_id: boatId },
        });
    }

    async getAllBoats() {
        return this.prisma.boats.findMany()

    }
    

    async createBoat(createBoatDto: CreateBoatDto) {
        const { boat_name, boat_type, capacity, price_per_day } = createBoatDto;

        return await this.prisma.boats.create({
            data: {
                boat_name,
                boat_type,
                capacity,
                price_per_day,
            },

        });
    }

    async updateBoat(id: number, updateBoatDto: UpdateBoatDto) {
        const boatUpdateData: Partial<{
            boat_name: string;
            boat_type: string;
            price_per_day: number;
        }> = {}
        
        const boat = await this.prisma.boats.findUnique({ where: { boat_id: id } });
        if (!boat) {
            throw new NotFoundException(`Boat with ID ${id} not found`);
                }
        if (updateBoatDto.new_boat_name) boatUpdateData.boat_name = updateBoatDto.new_boat_name;
        if (updateBoatDto.new_boat_type !== undefined) boatUpdateData.boat_type = updateBoatDto.new_boat_type;
        if (updateBoatDto.new_price_per_day !== undefined) boatUpdateData.price_per_day = updateBoatDto.new_price_per_day;

        return this.prisma.boats.update({
            where: { boat_id: id },
            data: boatUpdateData
        })
    }

    async deleteBoat(id: number){
        
        const boat = await this.prisma.boats.findUnique({ where: { boat_id: id } });
        if (!boat) {
            throw new NotFoundException(`Boat with ID ${id} not found`);
                }
        return this.prisma.boats.delete({
            where: {boat_id: id}
        })

    }
}
