import {Notification} from "../entities/notification.entity";
import {
    Entity,
    Column,
    PrimaryColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
    Index,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import {User} from "./user.aggregate";

@Entity({name: "userNotifications"})
export class UserNotifications {
    @PrimaryColumn({type: "uuid"})
    notificationId: string;

    @OneToOne(() => Notification, {cascade: true, eager: true})
    @JoinColumn({name: "notificationId"})
    userNotification: Notification;

    @Index()
    @Column()
    senderId: string;

    @ManyToOne(() => User, {cascade: true, eager: true})
    @JoinColumn({name: "senderId"})
    sender: User;

    @Index()
    @Column()
    receiverId: string;

    @ManyToOne(() => User, {cascade: true, eager: true})
    @JoinColumn({name: "receiverId"})
    receiver: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
