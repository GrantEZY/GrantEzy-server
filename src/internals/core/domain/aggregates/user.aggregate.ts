import {Entity, Column, PrimaryGeneratedColumn, OneToOne} from "typeorm";

import {Person} from "../entities/person.entity";
import {UserStatus} from "../constants/status.constants";
import {Contact} from "../value-objects/contact.object";
import {UserRoles} from "../constants/userRoles.constants";
import {UserCommitmentStatus} from "../constants/commitment.constants";
import {Audit} from "../value-objects/audit.object";
import {Experience} from "../value-objects/experience.object";

@Entity({name: "users"})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => Person, {cascade: true, eager: true})
    person: Person;

    @Column({type: "enum", enum: UserStatus, default: UserStatus.ACTIVE})
    status: UserStatus;

    @Column({
        type: "simple-array",
        enum: UserRoles,
        default: [UserRoles.NORMAL_USER],
    })
    role: UserRoles[];

    @Column({type: "enum", enum: UserCommitmentStatus})
    commitment: UserCommitmentStatus;

    @Column({type: "jsonb"})
    contact: Contact;

    @Column({type: "jsonb"})
    audit: Audit | null;

    @Column({type: "jsonb", nullable: true})
    experiences: Experience[] | null;
}
