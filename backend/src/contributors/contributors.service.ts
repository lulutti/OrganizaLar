import { Injectable } from '@nestjs/common';
import { CreateContributorDto } from './dto/create-contributor.dto';
import { UpdateContributorDto } from './dto/update-contributor.dto';

@Injectable()
export class ContributorsService {
  create(createContributorDto: CreateContributorDto) {
    return 'This action adds a new contributor';
  }

  findAll() {
    return `This action returns all contributors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contributor`;
  }

  update(id: number, updateContributorDto: UpdateContributorDto) {
    return `This action updates a #${id} contributor`;
  }

  remove(id: number) {
    return `This action removes a #${id} contributor`;
  }
}
