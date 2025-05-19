import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contributor } from './entities/contributor.entity';
import { CreateContributorDto } from './dto/create-contributor.dto';
import { UpdateContributorDto } from './dto/update-contributor.dto';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(Contributor)
    private readonly contributorsRepository: Repository<Contributor>,
  ) {}

  async create(dto: CreateContributorDto): Promise<Contributor> {
    const contributors = this.contributorsRepository.create(dto);
    return this.contributorsRepository.save(contributors);
  }

  async findAll(): Promise<Contributor[]> {
    return this.contributorsRepository.find();
  }

  async findOne(id: string): Promise<Contributor> {
    const contributors = await this.contributorsRepository.findOne({
      where: { id },
    });
    if (!contributors) {
      throw new NotFoundException(`Contributors with id ${id} not found`);
    }
    return contributors;
  }

  async update(id: string, dto: UpdateContributorDto): Promise<Contributor> {
    const contributors = await this.findOne(id);
    Object.assign(contributors, dto);
    return this.contributorsRepository.save(contributors);
  }

  async remove(id: string): Promise<void> {
    const contributors = await this.findOne(id);
    await this.contributorsRepository.remove(contributors);
  }
}
