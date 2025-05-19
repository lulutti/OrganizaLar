import { Module } from '@nestjs/common';
import { ContributorsService } from './contributors.service';
import { ContributorsController } from './contributors.controller';
import { Contributor } from './entities/contributor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Contributor])],
  controllers: [ContributorsController],
  providers: [ContributorsService],
})
export class ContributorsModule {}
