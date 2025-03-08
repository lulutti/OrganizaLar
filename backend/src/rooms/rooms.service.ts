import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
  ) {}
  async create(createRoomDto: CreateRoomDto) {
    const room = this.roomsRepository.create(createRoomDto);

    return await this.roomsRepository.save(room);
  }

  async findAllByUser(userId: string): Promise<Room[]> {
    const rooms = await this.roomsRepository.find({
      where: { user: { id: userId } },
    });
    return rooms;
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomsRepository.findOne({ where: { id } });

    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.findOne(id);

    room.name = updateRoomDto.name || room.name;
    room.description = updateRoomDto.description || room.description;
    return await this.roomsRepository.save(room);
  }

  async remove(id: string) {
    const room = await this.findOne(id);

    await this.roomsRepository.remove(room);
    return { message: 'Room deleted successfully' };
  }
}
