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
import {User} from "./user.aggregate";

@Entity({name: "userInvites"})
export class UserInvite {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "enum", enum: InviteAs})
    inviteAs: InviteAs;

    @Column({type: "enum", enum: InviteStatus})
    status: InviteStatus;

    @Index()
    @Column({type: "uuid"})
    personId: string;

    @ManyToOne(() => User, {eager: false})
    @JoinColumn({name: "personId"})
    person: User;

    @Column({type: "uuid"})
    notificationId: string;

    @OneToOne(() => Notification, {eager: true})
    @JoinColumn({name: "notificationId"})
    notification: Notification;

    @Index()
    @Column({type: "uuid"})
    applicationId: string;

    @ManyToOne(() => GrantApplication, {
        onDelete: "SET NULL",
        eager: false,
    })
    @JoinColumn({name: "applicationId"})
    application: GrantApplication;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
