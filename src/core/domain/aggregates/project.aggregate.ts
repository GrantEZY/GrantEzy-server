import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
    Index,
} from "typeorm";
import {ProjectStatus} from "../constants/status.constants";
import {Money} from "../value-objects/project.metrics.object";
import {Duration} from "../value-objects/duration.object";
import {ProjectProgress} from "../value-objects/project.progress.object";
import {ProjectMetrics} from "../value-objects/project.metrics.object";
import {User} from "./user.aggregate";
import {Cycle} from "./cycle.aggregate";
import {GrantApplication} from "./grantapplication.aggregate";

@Entity({name: "projects"})
export class Project {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "enum", enum: ProjectStatus})
    status: ProjectStatus;

    @Column({
        type: "jsonb",
        transformer: {
            to: (value: Money) => (value ? value.toJSON() : null),
            from: (value: {amount: number; currency: string}) =>
                value ? new Money(value.amount, value.currency) : null,
        },
    })
    allotedBudget: Money;

    @Column({
        type: "jsonb",
        transformer: {
            to: (value: Duration) => (value ? value.toJSON() : null),
            from: (value: {startDate: Date; endDate: Date | null}) =>
                value ? new Duration(value.startDate, value.endDate) : null,
        },
    })
    duration: Duration;

    @Column({
        type: "jsonb",
        transformer: {
            to: (value: ProjectProgress) => (value ? value.toJSON() : null),
            from: (value: {
                currentPhase: string;
                completionRate: number;
                lastUpdated: Date;
                notes: string;
            }) =>
                value
                    ? new ProjectProgress(
                          value.currentPhase,
                          value.completionRate,
                          value.lastUpdated,
                          value.notes
                      )
                    : null,
        },
    })
    progress: ProjectProgress;

    @Column({unique: true, nullable: true})
    slug: string;

    @Column({
        type: "jsonb",
        transformer: {
            to: (value: ProjectMetrics) => (value ? value.toJSON() : null),
            from: (value: {
                plannedBudget: Money;
                actualSpent: Money;
                plannedDuration: number;
                actualDuration: number;
            }) =>
                value
                    ? new ProjectMetrics(
                          value.plannedBudget,
                          value.actualSpent,
                          value.plannedDuration,
                          value.actualDuration
                      )
                    : null,
        },
    })
    metrics: ProjectMetrics;

    @Column({type: "uuid"})
    applicationId: string;

    @OneToOne(
        () => GrantApplication,
        (application: GrantApplication) => application.project,
        {
            onDelete: "CASCADE",
            eager: true,
        }
    )
    @JoinColumn({name: "applicationId"})
    application: GrantApplication | null;

    @Index()
    @Column({type: "uuid"})
    cycleId: string;

    @ManyToOne(() => Cycle, (cycle: Cycle) => cycle.projects, {
        onDelete: "SET NULL",
        cascade: false,
        eager: false,
    })
    @JoinColumn({name: "cycleId"})
    cycle: Cycle | null;

    @Column()
    mentorId: string;

    @OneToOne(() => User, {
        onDelete: "SET NULL",
        cascade: false,
        eager: true,
    })
    @JoinColumn({name: "mentorId"})
    mentor: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
