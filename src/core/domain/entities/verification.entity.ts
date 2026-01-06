import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "verficationTokens"})
export class VerificationTokenEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({select: false})
    token: string;

    @Column({type: "timestamp"})
    validTill: Date;

    @Column({type: "timestamp", nullable: true})
    validatedAt: Date;
}
