import { Contributor } from 'src/contributors/entities/contributor.entity';
import { Room } from 'src/rooms/entities/room.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/entities/task.entity';
import { CleaningSchedule } from 'src/cleaning-schedule/entities/cleaning-schedule.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  secretQuestion: string;

  @Column()
  secretAnswer: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ default: true })
  isAdmin: boolean;

  @OneToMany(() => Room, (room) => room.userId)
  rooms: Room[];

  @OneToMany(() => Contributor, (contributor) => contributor.userId)
  contributors: Contributor[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => CleaningSchedule, (schedule) => schedule.user)
  cleaningSchedules: CleaningSchedule[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
    this.secretAnswer = await bcrypt.hash(this.secretAnswer, 10);
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  async compareAnswer(secretAnswer: string): Promise<boolean> {
    return bcrypt.compare(secretAnswer, this.secretAnswer);
  }
}
