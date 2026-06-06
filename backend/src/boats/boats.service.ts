import { Injectable } from '@nestjs/common';
import { CreateBoatDto } from './dto/createboat.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBoatDto } from './dto/updateboat.dto';
//import { DeleteBoatDto } from './dto/deleteboat.dto';
import * as bcrypt from 'bcrypt';
import { BoatsScalarFieldEnum } from '../generated/internal/prismaNamespace';
import { identity } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import 'multer';

@Injectable()
export class boatsService {
    constructor (
        private prisma: PrismaService
        
    ){}

    //method to get image path for a boat
     private getImagePath(boatId: number): string | null {
        const uploadDir = './uploads/boats';
        const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        for (const ext of extensions) {
            const imagePath = path.join(uploadDir, `boat-${boatId}.${ext}`);
            if (fs.existsSync(imagePath)) {
                return imagePath;
            }
        }
        return null;
    }

    
    
    //method to get image URL for a boat
     private getImageUrl(boatId: number): string | null {
        const imagePath = this.getImagePath(boatId);
        if (imagePath) {
            // Extract just the filename from the path
            const filename = path.basename(imagePath);
            return `/uploads/boats/${filename}`;
        }
        return null;
    }

    // Helper method to delete boat image
    private deleteBoatImage(boatId: number): void {
        const imagePath = this.getImagePath(boatId);
        if (imagePath && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }


    async getBoatById(boatId: number) {
        const boat = await this.prisma.boats.findUnique({
            where: { boat_id: boatId },
        });

        return {
            ...boat,
            imageURl: this.getImageUrl(boatId)
        }
    }

    async getAllBoats() {
        const boats = await this.prisma.boats.findMany()
        
        return boats.map(boat => ({
            ...boat,
            imageUrl: this.getImageUrl(boat.boat_id)
        }));
    }
    

    async createBoat(createBoatDto: CreateBoatDto, imageFile: Express.Multer.File) {
        const { boat_name, boat_type, capacity, price_per_day } = createBoatDto;

        const newBoat = await this.prisma.boats.create({
            data: {
                boat_name,
                boat_type,
                capacity,
                price_per_day,
            },

        });
        // image to permanent location
        if (imageFile && imageFile.path) {
            const oldPath = imageFile.path;
            const ext = path.extname(imageFile.originalname);
            const newPath = path.join('./uploads/boats', `boat-${newBoat.boat_id}${ext}`);
        
        if (fs.existsSync(oldPath)) {
                fs.renameSync(oldPath, newPath);
            }
        }
         return {
            ...newBoat,
            imageUrl: this.getImageUrl(newBoat.boat_id)
        };
    }

    async updateBoat(id: number, updateBoatDto: UpdateBoatDto, imageFile?: Express.Multer.File) {
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
        if (updateBoatDto.new_price_per_day !== undefined) boatUpdateData.price_per_day = Number(updateBoatDto.new_price_per_day);

        const updatedBoat = await this.prisma.boats.update({
            where: { boat_id: id },
            data: boatUpdateData
        })

        if (imageFile && imageFile.path) {
            this.deleteBoatImage(id);
            const ext = path.extname(imageFile.originalname);
            const newPath = path.join('./uploads/boats', `boat-${id}${ext}`);
            
            if (fs.existsSync(imageFile.path)) {
                fs.renameSync(imageFile.path, newPath);
            }
        }
        console.log('Boat updated successfully')

        return {
            ...updatedBoat,
            imageUrl: this.getImageUrl(id)
            
        };

    }

    async deleteBoat(id: number){
        
        const boat = await this.prisma.boats.findUnique({ where: { boat_id: id } });
        if (!boat) {
            throw new NotFoundException(`Boat with ID ${id} not found`);
            }
        this.deleteBoatImage(id);

        return this.prisma.boats.delete({
            where: {boat_id: id}
        });

    }
}
