import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    Unique,
    OneToMany,
} from "typeorm";
import {User} from "./user.aggregate";
import {Cycle} from "./cycle.aggregate";
import {GrantApplicationStatus} from "../constants/status.constants";
import {Money} from "../value-objects/project.metrics.object";
import {TRL} from "../constants/trl.constants";
import {ProjectBasicInfo} from "../value-objects/project.basicinfo.object";
import {TechnicalSpec} from "../value-objects/project.technicalspec";
import {MarketInfo} from "../value-objects/marketinfo.object";
import {
    RevenueModel,
    RevenueStream,
} from "../value-objects/revenue.info.object";
import {Risk} from "../value-objects/risk.object";
import {ProjectMilestone} from "../value-objects/project.status.object";
import {Review} from "./review.aggregate";
import {QuotedBudget} from "../value-objects/quotedbudget.object";
import {BudgetComponent} from "../value-objects/quotedbudget.object";
import {ApplicationDocumentsObject} from "../value-objects/applicationdocuments.object";
import {DocumentObject} from "../value-objects/document.object";

@Entity({name: "grant-applications"})
@Unique(["applicantId", "cycleId"])
export class GrantApplication {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "uuid"})
    applicantId: string;

    @ManyToOne(() => User, (user) => user.myApplications, {
        onDelete: "CASCADE",
        eager: false,
    })
    @JoinColumn({name: "applicantId"})
    applicant: User;

    @ManyToMany(() => User, (user) => user.linkedApplications, {eager: false})
    @JoinTable({
        name: "grant_application_teammates",
        joinColumn: {name: "applicationId", referencedColumnName: "id"},
        inverseJoinColumn: {name: "userId", referencedColumnName: "personId"},
    })
    teammates: User[];

    @Column()
    cycleId: string;

    @ManyToOne(() => Cycle, (cycle) => cycle.applications, {
        onDelete: "CASCADE",
        eager: false,
    })
    @JoinColumn({name: "cycleId"})
    cycle: Cycle;

    @Column({type: "enum", enum: GrantApplicationStatus})
    status: GrantApplicationStatus;

    @Column({
        type: "integer",
    })
    stepNumber: number;

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
    budget: QuotedBudget | null;

    @Column({
        type: "jsonb",
        transformer: {
            to: (value: ProjectBasicInfo) => (value ? value.toJSON() : null),
            from: (value: {
                title: string;
                summary: string;
                problem: string;
                solution: string;
                innovation: string;
            }) =>
                value
                    ? new ProjectBasicInfo(
                          value.title,
                          value.summary,
                          value.problem,
                          value.solution,
                          value.innovation
                      )
                    : null,
        },
    })
    basicDetails: ProjectBasicInfo;

    @Column({
        type: "jsonb",
        nullable: true,
        transformer: {
            to: (value: TechnicalSpec) => (value ? value.toJSON() : null),
            from: (value: {
                description: string;
                techStack: string[];
                prototype: string;
            }) =>
                value
                    ? new TechnicalSpec(
                          value.description,
                          value.techStack,
                          value.prototype
                      )
                    : null,
        },
    })
    technicalSpec: TechnicalSpec | null;

    @Column({
        type: "jsonb",
        nullable: true,
        transformer: {
            to: (value: MarketInfo) => (value ? value.toJSON() : null),
            from: (value: {
                totalAddressableMarket: string;
                serviceableMarket: string;
                obtainableMarket: string;
                competitorAnalysis: string;
            }) =>
                value
                    ? new MarketInfo(
                          value.totalAddressableMarket,
                          value.serviceableMarket,
                          value.obtainableMarket,
                          value.competitorAnalysis
                      )
                    : null,
        },
    })
    marketInfo: MarketInfo | null;

    @Column({
        type: "jsonb",
        nullable: true,
        transformer: {
            to: (value: RevenueModel) => (value ? value.toJSON() : null),
            from: (value: {
                primaryStream: RevenueStream;
                secondaryStreams: RevenueStream[];
                pricing: string;
                unitEconomics: string;
            }) =>
                value
                    ? new RevenueModel(
                          value.primaryStream,
                          value.secondaryStreams,
                          value.pricing,
                          value.unitEconomics
                      )
                    : null,
        },
    })
    revenueInfo: RevenueModel | null;

    @Column({
        type: "jsonb",
        nullable: true,
        transformer: {
            to: (value: Risk[] | null) =>
                value ? value.map((exp) => exp.toJSON()) : null,
            from: (value: Risk[]) =>
                value
                    ? value.map(
                          (risk) =>
                              new Risk(
                                  risk.description,
                                  risk.impact,
                                  risk.mitigation
                              )
                      )
                    : null,
        },
    })
    risks: Risk[] | null;

    @Column({
        type: "jsonb",
        nullable: true,
        transformer: {
            to: (value: ProjectMilestone[] | null) =>
                value ? value.map((exp) => exp.toJSON()) : null,
            from: (value: ProjectMilestone[]) =>
                value
                    ? value.map(
                          (milestone) =>
                              new ProjectMilestone(
                                  milestone.title,
                                  milestone.description,
                                  milestone.deliverables,
                                  milestone.dueDate
                              )
                      )
                    : null,
        },
    })
    milestones: ProjectMilestone[] | null;

    @Column({
        type: "jsonb",
        nullable: true,
        transformer: {
            to: (value: ApplicationDocumentsObject) =>
                value ? value.toJSON() : null,
            from: (value: {
                endorsementLetter: DocumentObject;
                plagiarismUndertaking: DocumentObject;
                ageProof: DocumentObject;
                aadhar: DocumentObject;
                piCertificate: DocumentObject;
                coPiCertificate: DocumentObject;
                otherDocuments: DocumentObject[] | null;
            }) =>
                value
                    ? new ApplicationDocumentsObject(
                          value.endorsementLetter,
                          value.plagiarismUndertaking,
                          value.ageProof,
                          value.aadhar,
                          value.piCertificate,
                          value.coPiCertificate,
                          value.otherDocuments
                      )
                    : null,
        },
    })
    applicationDocuments: ApplicationDocumentsObject | null;

    @OneToMany(() => Review, (review) => review.application, {eager: false})
    reviews: Review[];

    @Column({type: "enum", enum: TRL, nullable: true})
    currentTRL: TRL;

    @Column({type: "enum", enum: TRL, nullable: true})
    targetTRL: TRL;

    @Column({type: "date"})
    submittedAt: Date;

    @Column({unique: true, nullable: true})
    slug: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
