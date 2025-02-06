import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Entity } from "typeorm";
import { IEvent, Event } from "./event.entity";
import { IUser, User } from "./user.entity";

@Entity()
export class WaitList {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.waitlists)
  @JoinColumn({ name: "userId" })
  user: IUser;

  @ManyToOne(() => Event, (event) => event.waitlists)
  @JoinColumn({ name: "eventId" })
  event: IEvent;

  @Column()
  order: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

}