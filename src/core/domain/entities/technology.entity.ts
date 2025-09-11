import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import {TechnologyCategory} from "../constants/technology.constants";

@Entity("technology")
export class Technology {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", length: 60})
    name: string;

    @Column({type: "enum", enum: TechnologyCategory})
    type: TechnologyCategory;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
