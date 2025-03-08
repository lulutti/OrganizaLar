import { Contributor } from 'src/contributors/entities/contributor.entity';
import { Room } from 'src/rooms/entities/room.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
    this.secretAnswer = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string): Promise<boolean> {
    console.log(password, this.password);
    return bcrypt.compare(password, this.password);
  }
}
