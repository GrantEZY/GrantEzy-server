import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    JoinColumn,
    UpdateDateColumn,
    ManyToOne,
    Index,
    OneToOne,
} from "typeorm";
import {InviteAs, InviteStatus} from "../constants/invite.constants";
import {GrantApplication} from "./grantapplication.aggregate";
import {VerificationTokenEntity} from "../entities/verification.entity";
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

    @Index()
    @Column({type: "uuid"})
    applicationId: string;

    @ManyToOne(() => GrantApplication, {
        onDelete: "SET NULL",
        eager: false,
    })
    @JoinColumn({name: "applicationId"})
    application: GrantApplication | null;

    @OneToOne(() => VerificationTokenEntity, {
        cascade: true,
        eager: true,
    })
    @JoinColumn({name: "verificationId"})
    verification: VerificationTokenEntity;

    @Column({nullable: true})
    verificationId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
