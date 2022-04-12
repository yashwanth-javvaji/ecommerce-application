// NestJS
import { Body, Controller, Delete, Get, Param, Patch, Post, Request, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

// Common
import { hasRoles, Public, Role, RolesGuard } from "@yj-major-project/common";

// Other Dependencies
import { ObjectId } from 'mongoose';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 } from 'uuid';

// Custom
// DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// Guards
import { IsCurrentUser } from './guards/is-current-user.guard';
// Schemas
import { User } from './schemas/user.schema';
// Services
import { UsersService } from './users.service';


export const storage = {
  storage: diskStorage({
    destination: './uploads/profile-images',
    filename: (req, file, cb) => {
      const filename: string = v4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    }
  })
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: ObjectId): Promise<User | undefined> {
    return await this.usersService.findById(id);
  }

  @UseGuards(IsCurrentUser)
  @Patch(':id')
  async update(@Param('id') id: ObjectId, @Body() updateUserDto: UpdateUserDto): Promise<User | undefined> {
    return await this.usersService.update(id, updateUserDto);
  }

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: ObjectId) {
    return await this.usersService.remove(id);
  }

  @UseGuards(IsCurrentUser)
  @Post(':id/upload-profile-image')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadProfileImage(@Param('id') id: ObjectId, @UploadedFile() file, @Request() req) {
    return await this.usersService.update(id, { profileImage: file.filename })
  }

  @Public()
  @Get('profile-images/:filename')
  findProfileImage(@Param('filename') filename, @Response() res) {
    return res.sendFile(path.join(process.cwd(), 'uploads/profile-images/' + filename));
  }
}
