import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
} from "typeorm";
import {
    NotificationType,
    NotificationChannel,
    NotificationStatus,
} from "../constants/notification.constants";
import {User} from "./user.aggregate";
@Entity({name: "notifications"})
export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "enum", enum: NotificationType})
    type: NotificationType;

    @Column({type: "enum", enum: NotificationChannel})
    channel: NotificationChannel;

    @Column()
    title: string;

    @Column()
    message: string;

    @Column()
    status: NotificationStatus;

    @Column({type: "jsonb", nullable: true})
    metadata: Record<string, string>;

    @Column()
    mentorId: string;

    @ManyToOne(() => User, {
        onDelete: "SET NULL",
        cascade: false,
        eager: true,
    })
    @JoinColumn({name: "mentorId"})
    mentor: User;

    @Column()
    receiverId: string;

    @ManyToOne(() => User, {
        onDelete: "SET NULL",
        cascade: false,
        eager: true,
    })
    @JoinColumn({name: "receiverId"})
    receiver: User;

    @Column({type: Date})
    sentAt: Date;

    @Column({type: Date})
    readAt: Date;
}
