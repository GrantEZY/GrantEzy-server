import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from "typeorm";
import {ProjectStatus} from "../constants/status.constants";
import {Money} from "../value-objects/project.metrics.object";
import {Duration} from "../value-objects/duration.object";
import {ProjectProgress} from "../value-objects/project.progress.object";
import {ProjectMetrics} from "../value-objects/project.metrics.object";
import {User} from "./user.aggregate";
import {GrantApplication} from "./grantapplication.aggregate";
import {
    QuotedBudget,
    BudgetComponent,
} from "../value-objects/quotedbudget.object";

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
            to: (value: QuotedBudget | null) => (value ? value.toJSON() : null),
            from: (value: {
                ManPower: {
                    BudgetReason: string;
                    Budget: {amount: number; currency: string};
                }[];
                Equipment: {
                    BudgetReason: string;
                    Budget: {amount: number; currency: string};
                }[];
                OtherCosts: {
                    BudgetReason: string;
                    Budget: {amount: number; currency: string};
                }[];
                Consumables: {
                    BudgetReason: string;
                    Budget: {amount: number; currency: string};
                };
                Travel: {
                    BudgetReason: string;
                    Budget: {amount: number; currency: string};
                };
                Contigency: {
                    BudgetReason: string;
                    Budget: {amount: number; currency: string};
                };
                Overhead: {
                    BudgetReason: string;
                    Budget: {amount: number; currency: string};
                };
            }) =>
                value
                    ? new QuotedBudget(
                          value.ManPower?.map(
                              (c) =>
                                  new BudgetComponent(
                                      c.BudgetReason,
                                      new Money(
                                          c.Budget.amount,
                                          c.Budget.currency
                                      )
                                  )
                          ),
                          value.Equipment?.map(
                              (c) =>
                                  new BudgetComponent(
                                      c.BudgetReason,
                                      new Money(
                                          c.Budget.amount,
                                          c.Budget.currency
                                      )
                                  )
                          ),
                          value.OtherCosts?.map(
                              (c) =>
                                  new BudgetComponent(
                                      c.BudgetReason,
                                      new Money(
                                          c.Budget.amount,
                                          c.Budget.currency
                                      )
                                  )
                          ),
                          new BudgetComponent(
                              value.Consumables.BudgetReason,
                              new Money(
                                  value.Consumables.Budget.amount,
                                  value.Consumables.Budget.currency
                              )
                          ),
                          new BudgetComponent(
                              value.Travel.BudgetReason,
                              new Money(
                                  value.Travel.Budget.amount,
                                  value.Travel.Budget.currency
                              )
                          ),
                          new BudgetComponent(
                              value.Contigency.BudgetReason,
                              new Money(
                                  value.Contigency.Budget.amount,
                                  value.Contigency.Budget.currency
                              )
                          ),
                          new BudgetComponent(
                              value.Overhead.BudgetReason,
                              new Money(
                                  value.Overhead.Budget.amount,
                                  value.Overhead.Budget.currency
                              )
                          )
                      )
                    : null,
        },
    })
    allotedBudget: QuotedBudget;

    @Column({
        type: "jsonb",
        nullable: true,
        transformer: {
            to: (value: Duration) => (value ? value.toJSON() : null),
            from: (value: {startDate: Date; endDate: Date | null}) =>
                value ? new Duration(value.startDate, value.endDate) : null,
        },
    })
    duration: Duration;

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

    @Column({unique: true})
    slug: string;

    @Column({
        type: "jsonb",
        nullable: true,
        transformer: {
            to: (value: ProjectMetrics) => (value ? value.toJSON() : null),
            from: (value: {
                plannedBudget: QuotedBudget;
                actualSpent: QuotedBudget | null;
                plannedDuration: Duration;
                actualDuration: Duration | null;
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

    // --- Relations ---

    @Column({type: "uuid"})
    applicationId: string;

    @OneToOne(() => GrantApplication, {
        onDelete: "CASCADE",
        eager: false,
    })
    @JoinColumn({name: "applicationId"})
    application: GrantApplication | null;

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
