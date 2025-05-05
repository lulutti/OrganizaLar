import { CleaningScheduleTask } from 'src/cleaning-schedule/entities/cleaning-schedule-task.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CleaningScheduleStatus {
  IN_PROGRESS = 'in_progress',
  CANCELLED = 'cancelled',
  DONE = 'done',
}

@Entity()
export class CleaningSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title: string;

  @ManyToOne(() => User, (user) => user.cleaningSchedules)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: CleaningScheduleStatus,
    default: CleaningScheduleStatus.IN_PROGRESS,
  })
  status: CleaningScheduleStatus;

  @OneToMany(() => CleaningScheduleTask, (task) => task.cleaningSchedule)
  tasks: CleaningScheduleTask[];
}
