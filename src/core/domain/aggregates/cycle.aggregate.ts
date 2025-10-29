/* eslint-disable */

import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    OneToMany,
} from "typeorm";
import {Program} from "./program.aggregate";
import {ProgramRound} from "../value-objects/program.round.object";
import {CycleStatus} from "../constants/status.constants";
import {Money} from "../value-objects/project.metrics.object";
import {Duration} from "../value-objects/duration.object";
import {TRLCriteria} from "../value-objects/trlcriteria.object";
import {
    ScoringScheme,
    ScoringCriteria,
} from "../value-objects/scoringscheme.object";
import {TRL} from "../constants/trl.constants";
import {GrantApplication} from "./grantapplication.aggregate";
@Entity({name: "programCycles"})
export class Cycle {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Index()
    @Column({type: "uuid"})
    programId: string;

    @ManyToOne(() => Program, (program: Program) => program.cycles, {
        onDelete: "SET NULL",
        cascade: false,
        eager: true,
    })
    @JoinColumn({name: "programId"})
    program: Program | null;

    @Column({
        type: "jsonb",
        transformer: {
            to: (value: ProgramRound) => (value ? value.toJSON() : null),
            from: (value: {year: number; type: string}) =>
                value ? new ProgramRound(value.year, value.type) : null,
        },
    })
    round: ProgramRound;

    @Column({type: "enum", enum: CycleStatus})
    status: CycleStatus;

    @Column({
        type: "jsonb",
        transformer: {
            to: (value: Money) => (value ? value.toJSON() : null),
            from: (value: {amount: number; currency: string}) =>
                value ? new Money(value.amount, value.currency) : null,
        },
    })
    budget: Money;

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
            to: (value: Record<TRL, TRLCriteria>) =>
                value
                    ? Object.fromEntries(
                          Object.entries(value).map(([key, val]) => [
                              key,
                              val.toJSON(),
                          ])
                      )
                    : null,
            from: (value: Record<string, any>) =>
                value
                    ? Object.fromEntries(
                          Object.entries(value).map(([key, val]) => [
                              key as TRL,
                              new TRLCriteria(
                                  val.requirements,
                                  val.evidence,
                                  val.metrics
                              ),
                          ])
                      )
                    : null,
        },
    })
    trlCriteria: Record<TRL, TRLCriteria>;
    @Column({
        type: "jsonb",
        transformer: {
            to: (value: ScoringScheme) => (value ? value.toJSON() : null),
            from: (value: {
                technical: ScoringCriteria;
                market: ScoringCriteria;
                team: ScoringCriteria;
                financial: ScoringCriteria;
                innovation: ScoringCriteria;
            }) =>
                value
                    ? new ScoringScheme(
                          value.technical,
                          value.market,
                          value.financial,
                          value.team,
                          value.innovation
                      )
                    : null,
        },
    })
    scoringScheme: ScoringScheme;

    @OneToMany(() => GrantApplication, (application) => application.cycle, {
        onDelete: "NO ACTION",
        cascade: false,
        eager: false,
    })
    applications: GrantApplication[];

    @Column({unique: true, nullable: true})
    slug: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
