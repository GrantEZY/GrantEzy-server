import {
    PrimaryGeneratedColumn,
    Entity,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    JoinColumn,
} from "typeorm";

import {ProjectReviewRecommendation} from "../constants/recommendation.constants";

import {ReviewStatus} from "../constants/status.constants";

import {User} from "./user.aggregate";

import {CycleAssessmentAggregate} from "./cycle.assessment.aggregate";

@Entity({name: "projectReviews"})
export class ProjectReviewAggregate {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "enum",
        enum: ReviewStatus,
        default: ReviewStatus.UNASSIGNED,
    })
    status: ReviewStatus;

    @Column({
        type: "enum",
        enum: ProjectReviewRecommendation,
        nullable: true,
        default: null,
    })
    recommendation: ProjectReviewRecommendation | null;

    @Column({type: "text", nullable: true})
    reviewAnalysis: string;

    @Column({type: "uuid", nullable: true, default: null})
    @Index()
    @Column({type: "uuid"})
    reviewerId: string;

    @ManyToOne(() => User, {eager: true})
    @JoinColumn({name: "reviewerId"})
    reviewer: User;

    @Index()
    @Column({type: "uuid"})
    submissionId: string;

    @ManyToOne(() => CycleAssessmentAggregate, {
        eager: false,
    })
    @JoinColumn({name: "submissionId"})
    reviewSubmission: CycleAssessmentAggregate;

    @Column({unique: true, nullable: true})
    slug: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
