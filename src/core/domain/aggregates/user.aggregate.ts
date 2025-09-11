/* eslint-disable  */

import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    UpdateDateColumn,
    CreateDateColumn,
    PrimaryColumn,
    OneToMany,
    ManyToMany,
} from "typeorm";

import {Person} from "../entities/person.entity";
import {UserStatus} from "../constants/status.constants";
import {Contact} from "../value-objects/contact.object";
import {UserRoles} from "../constants/userRoles.constants";
import {UserCommitmentStatus} from "../constants/commitment.constants";
import {Audit} from "../value-objects/audit.object";
import {Experience} from "../value-objects/experience.object";
import {GrantApplication} from "./grantapplication.aggregate";

@Entity({name: "users"})
export class User {
    @PrimaryColumn({type: "uuid"})
    personId: string;

    @OneToOne(() => Person, {cascade: true, eager: true})
    @JoinColumn({name: "personId"})
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

    @Column({
        type: "jsonb",
        transformer: {
            to: (value: Contact) => (value ? value.toJSON() : null),
            from: (value: any) =>
                value
                    ? new Contact(value.email, value.phone, value.address)
                    : null,
        },
    })
    contact: Contact;

    @Column({
        type: "jsonb",
        nullable: true,
        transformer: {
            to: (value: Audit | null) => (value ? value.toJSON() : null),
            from: (value: any) =>
                value
                    ? new Audit(
                          new Date(value.createdAt),
                          new Date(value.updatedAt)
                      )
                    : null,
        },
    })
    audit: Audit | null;

    @Column({
        type: "jsonb",
        nullable: true,
        transformer: {
            to: (value: Experience[] | null) =>
                value ? value.map((exp) => exp.toJSON()) : null,
            from: (value: any[]) =>
                value
                    ? value.map(
                          (exp) =>
                              new Experience(
                                  exp.company,
                                  exp.position,
                                  new Date(exp.startDate),
                                  exp.description,
                                  exp.endDate
                                      ? new Date(exp.endDate)
                                      : undefined
                              )
                      )
                    : null,
        },
    })
    experiences: Experience[] | null;

    @Column({default: 0})
    tokenVersion: number;

    @OneToMany(() => GrantApplication, (application) => application.applicant, {
        cascade: false,
    })
    myApplications: GrantApplication[];

    @ManyToMany(
        () => GrantApplication,
        (application) => application.teammates,
        {
            cascade: false,
        }
    )
    linkedApplications: GrantApplication[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
