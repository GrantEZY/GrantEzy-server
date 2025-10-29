import {
    Column,
    Entity,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
} from "typeorm";
import {VerificationTokenEntity} from "../entities/verification.entity";

@Entity({name: "forgotPassword"})
export class ForgotPasswordAggregate {
    @PrimaryColumn({unique: true})
    email: string;

    @OneToOne(() => VerificationTokenEntity, {
        cascade: true,
        eager: true,
    })
    @JoinColumn({name: "verificationId"})
    verification: VerificationTokenEntity;

    @Column({unique: true})
    slug: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
