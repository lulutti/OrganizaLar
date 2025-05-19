import { CleaningSchedule } from 'src/cleaning-schedule/entities/cleaning-schedule.entity';
import { Contributor } from 'src/contributors/entities/contributor.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ScheduleTaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Entity()
export class CleaningScheduleTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => CleaningSchedule,
    (cleaningSchedule) => cleaningSchedule.tasks,
  )
  cleaningSchedule: CleaningSchedule;

  @ManyToOne(() => Task, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column({
    type: 'enum',
    enum: ScheduleTaskStatus,
  })
  status: ScheduleTaskStatus;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @ManyToOne(() => Contributor, { nullable: true })
  @JoinColumn({ name: 'assignedContributorId' })
  assignedContributor?: Contributor;

  @Column({ nullable: true })
  assignedContributorId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedUserId' })
  assignedUser?: User;

  @Column({ nullable: true })
  assignedUserId?: string;

  private _previousStatus: ScheduleTaskStatus;

  @BeforeInsert()
  initStatus() {
    this._previousStatus = this.status;
  }

  @BeforeUpdate()
  updateCompletedAt() {
    if (
      this._previousStatus !== this.status &&
      this.status === ScheduleTaskStatus.DONE
    ) {
      this.completedAt = new Date();
    }

    this._previousStatus = this.status;
  }
}
