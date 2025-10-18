import {
    Entity,
    JoinColumn,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Unique,
    Index,
} from "typeorm";
import {User} from "./user.aggregate";
import {Project} from "./project.aggregate";
import {ProjectUserRoles} from "../constants/userRoles.constants";

@Entity({name: "userProjects"})
@Unique(["userId", "projectId"])
export class UserProjects {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Index()
    @Column({type: "uuid"})
    userId: string;

    @ManyToOne(() => User, {
        cascade: true,
        eager: false,
    })
    @JoinColumn({name: "userId"})
    user: User;

    @Column({type: "enum", enum: ProjectUserRoles})
    userProjectRole: ProjectUserRoles;

    @Index()
    @Column({type: "uuid"})
    projectId: string;

    @ManyToOne(() => Project, {
        cascade: true,
    })
    project: Project;
}
