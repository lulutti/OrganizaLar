import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ContributorsService } from './contributors.service';
import { Contributor } from './entities/contributor.entity';
import { CreateContributorDto } from './dto/create-contributor.dto';
import { UpdateContributorDto } from './dto/update-contributor.dto';

@Controller('contributors')
export class ContributorsController {
  constructor(private readonly contributorsService: ContributorsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateContributorDto): Promise<Contributor> {
    return this.contributorsService.create(dto);
  }

  @Get()
  findAll(): Promise<Contributor[]> {
    return this.contributorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Contributor> {
    return this.contributorsService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContributorDto,
  ): Promise<Contributor> {
    return this.contributorsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.contributorsService.remove(id);
  }
}
