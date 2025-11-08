import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from "typeorm";

import {Recommendation} from "../constants/recommendation.constants";

import {ReviewStatus} from "../constants/status.constants";

import {GrantApplication} from "./grantapplication.aggregate";
import {User} from "./user.aggregate";
import {Money} from "../value-objects/project.metrics.object";
import {Scores} from "../value-objects/review.scores.object";

@Entity({name: "reviews"})
export class ApplicationReviewAggregate {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "enum",
        enum: ReviewStatus,
        default: ReviewStatus.UNASSIGNED,
    })
    status: ReviewStatus;

    @Column({type: "enum", enum: Recommendation, nullable: true, default: null})
    recommendation: Recommendation | null;

    @Column({
        type: "jsonb",
        transformer: {
            to: (value: Money) => (value ? value.toJSON() : null),
            from: (value: {amount: number; currency: string}) =>
                value ? new Money(value.amount, value.currency) : null,
        },
        nullable: true,
    })
    suggestedBudget: Money;

    @Column({
        type: "jsonb",
        transformer: {
            to: (value: Scores) => (value ? value.toJSON() : null),
            from: (value: Scores) =>
                value
                    ? new Scores(
                          value.technical,
                          value.market,
                          value.financial,
                          value.team,
                          value.innovation
                      )
                    : null,
        },
        nullable: true,
    })
    scores: Scores;

    @Index()
    @Column({type: "uuid"})
    applicationId: string;

    @ManyToOne(() => GrantApplication, (application) => application.reviews, {
        eager: false,
    })
    @JoinColumn({name: "applicationId"})
    application: GrantApplication;

    @Index()
    @Column({type: "uuid"})
    reviewerId: string;

    @ManyToOne(() => User, (user) => user.personId, {eager: true})
    @JoinColumn({name: "reviewerId"})
    reviewer: User;

    @Column({unique: true, nullable: true})
    slug: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
