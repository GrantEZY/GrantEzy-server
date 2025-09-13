import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import {OrganisationType} from "../constants/organization.constants";

@Entity("organizations")
export class Organization {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", length: 60, unique: true})
    name: string;

    @Column({type: "enum", enum: OrganisationType})
    type: OrganisationType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
