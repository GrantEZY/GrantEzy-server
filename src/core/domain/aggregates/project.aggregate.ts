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
        nullable: true,
        transformer: {
            to: (value: Money) => (value ? value.toJSON() : null),
            from: (value: {amount: number; currency: string}) =>
                value ? new Money(value.amount, value.currency) : null,
        },
    })
    allotedBudget: Money | null;

    @Column({
        type: "jsonb",
        nullable: true,
        transformer: {
            to: (value: Duration) => (value ? value.toJSON() : null),
            from: (value: {startDate: Date; endDate: Date | null}) =>
                value ? new Duration(value.startDate, value.endDate) : null,
        },
    })
    duration: Duration | null;

    @Column({
        type: "jsonb",
        nullable: true,
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
    progress: ProjectProgress | null;

    @Column({unique: true, nullable: true})
    slug: string | null;

    @Column({
        type: "jsonb",
        nullable: true,
        transformer: {
            to: (value: ProjectMetrics) => (value ? value.toJSON() : null),
            from: (value: {
                plannedBudget: {amount: number; currency: string};
                actualSpent: {amount: number; currency: string};
                plannedDuration: number;
                actualDuration: number;
            }) =>
                value
                    ? new ProjectMetrics(
                          new Money(
                              value.plannedBudget.amount,
                              value.plannedBudget.currency
                          ),
                          new Money(
                              value.actualSpent.amount,
                              value.actualSpent.currency
                          ),
                          value.plannedDuration,
                          value.actualDuration
                      )
                    : null,
        },
    })
    metrics: ProjectMetrics | null;

    // --- Relations ---

    @Column({type: "uuid"})
    applicationId: string;

    @OneToOne(() => GrantApplication, {
        onDelete: "CASCADE",
        eager: false,
    })
    @JoinColumn({name: "applicationId"})
    application: GrantApplication | null;

    @Index()
    @Column({type: "uuid", nullable: true})
    cycleId: string | null;

    @ManyToOne(() => Cycle, (cycle: Cycle) => cycle.projects, {
        onDelete: "SET NULL",
        cascade: false,
        eager: false,
    })
    @JoinColumn({name: "cycleId"})
    cycle: Cycle | null;

    @Column({type: "uuid", nullable: true})
    mentorId: string | null;

    @OneToOne(() => User, {
        onDelete: "SET NULL",
        cascade: false,
        eager: true,
    })
    @JoinColumn({name: "mentorId"})
    mentor: User | null;

    // --- Timestamps ---

    @CreateDateColumn({type: "timestamp with time zone"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamp with time zone"})
    updatedAt: Date;
}
