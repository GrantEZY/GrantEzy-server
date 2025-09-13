import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "persons"})
export class Person {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", length: 60})
    firstName: string;

    @Column({type: "varchar", length: 60})
    lastName: string;

    @Column({type: "varchar", nullable: true, select: false})
    rt_hash: string | null;

    @Column({type: "varchar", select: false})
    password_hash: string;
}
