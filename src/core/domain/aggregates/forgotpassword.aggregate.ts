import {
    Column,
    Entity,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import {VerificationTokenEntity} from "../entities/verification.entity";

@Entity({name: "forgotPassword"})
export class ForgotPasswordAggregate {
    @Column({type: "string", unique: true})
    email: string;

    @OneToOne(() => VerificationTokenEntity, {
        cascade: true,
        eager: true,
    })
    @JoinColumn({name: "verificationId"})
    verification: VerificationTokenEntity;

    @Column({unique: true, nullable: true})
    slug: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
