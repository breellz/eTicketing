import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Entity } from "typeorm";
import { IUser, User } from "./user.entity";
import { IEvent, Event } from "./event.entity";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: "userId" })
  user: IUser;

  @ManyToOne(() => Event, (event) => event.bookings)
  @JoinColumn({ name: "eventId" })
  event: IEvent;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt: Date;
}

export type IBookings = {
  [T in keyof Booking]: Booking[T];
};