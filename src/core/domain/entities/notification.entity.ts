import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from "typeorm";
import {
    NotificationType,
    NotificationChannel,
    NotificationStatus,
} from "../constants/notification.constants";
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

    @Column({type: "jsonb"})
    metadata: Record<string, string>;

    @Column({type: Date})
    sentAt: Date;

    @Column({type: Date})
    readAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
