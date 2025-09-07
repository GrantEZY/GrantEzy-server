import {Entity, Column, PrimaryColumn} from "typeorm";
const {v4: uuid} = require("uuid"); // eslint-disable-line

@Entity({name: "persons"})
export class Person {
    @PrimaryColumn("uuid")
    id: string;

    @Column({type: "varchar", length: 60})
    firstName: string;

    @Column({type: "varchar", length: 60})
    lastName: string;

    @Column({type: "varchar", nullable: true})
    rt_hash: string | null;

    @Column({type: "varchar"})
    password_hash: string;

    constructor(init?: Partial<Person>) {
        this.id = uuid(); // eslint-disable-line
        this.rt_hash = null;
        Object.assign(this, init);
    }
}
