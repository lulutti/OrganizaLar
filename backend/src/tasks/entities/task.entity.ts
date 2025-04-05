import { Contributor } from 'src/contributors/entities/contributor.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  last_time_done: Date;

  @Column({ default: false })
  planned: boolean;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @ManyToOne(() => Contributor, (contributor) => contributor.assigned_tasks, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_assigned' })
  assigned_to: Contributor;

  @ManyToOne(() => Room, (room) => room.tasks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_room' })
  room: Room;
}
