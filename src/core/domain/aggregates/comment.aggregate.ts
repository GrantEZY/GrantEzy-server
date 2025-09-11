import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from "typeorm";
import {User} from "./user.aggregate";
import {CommentTarget} from "../constants/comment.constants";

@Entity({name: "comments"})
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "text"})
    content: string;

    @Column()
    mentorId: string;

    @ManyToOne(() => User, {
        onDelete: "SET NULL",
        cascade: false,
        eager: true,
    })
    @JoinColumn({name: "mentorId"})
    mentor: User;

    @Index()
    @Column({type: "uuid"})
    target: string;

    @Column({type: "enum", enum: CommentTarget})
    targetType: CommentTarget;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
