import { CleaningSchedule } from 'src/cleaning-schedule/entities/cleaning-schedule.entity';
import { Contributor } from 'src/contributors/entities/contributor.entity';
import { Task } from 'src/tasks/entities/task.entity';
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

  @ManyToOne(() => Contributor, (contributor) => contributor.assigned_tasks, {
    nullable: true,
  })
  @JoinColumn({ name: 'assignedId' })
  assigned_to: Contributor;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;

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
