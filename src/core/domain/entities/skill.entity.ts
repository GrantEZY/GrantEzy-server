import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("skills")
export class Skill {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", length: 60})
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
