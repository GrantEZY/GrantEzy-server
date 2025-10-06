import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "verficationTokens"})
export class VerificationTokenEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({select: false})
    token: string;

    @Column({type: "date"})
    validTill: Date;

    @Column({type: Date, nullable: true})
    validatedAt: Date;
}
