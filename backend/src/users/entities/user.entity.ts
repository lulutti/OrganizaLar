import { Contributor } from "src/contributors/entities/contributor.entity";
import { Room } from "src/rooms/entities/room.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true  })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ default: false })
    isAdmin: boolean;

    @OneToMany(() => Room, room => room.userId)
    rooms: Room[];

    @OneToMany(() => Contributor, (contributor) => contributor.userId)
    contributors: Contributor[];
}
