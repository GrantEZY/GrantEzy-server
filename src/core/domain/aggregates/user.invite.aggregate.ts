import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    JoinColumn,
    UpdateDateColumn,
    OneToOne,
    ManyToOne,
    Index,
} from "typeorm";
import {Notification} from "../entities/notification.entity";
import {InviteAs, InviteStatus} from "../constants/invite.constants";
import {GrantApplication} from "./grantapplication.aggregate";

@Entity({name: "userInvites"})
export class UserInvite {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "enum", enum: InviteAs})
    inviteAs: InviteAs;

    @Column({type: "enum", enum: InviteStatus})
    status: InviteStatus;

    @Index()
    @Column({type: "varchar"})
    email: string;

    @Column({type: "uuid", nullable: true})
    notificationId: string | null;

    @OneToOne(() => Notification, {eager: true})
    @JoinColumn({name: "notificationId"})
    notification: Notification | null;

    @Index()
    @Column({type: "uuid"})
    applicationId: string;

    @ManyToOne(() => GrantApplication, {
        onDelete: "SET NULL",
        eager: false,
    })
    @JoinColumn({name: "applicationId"})
    application: GrantApplication | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
