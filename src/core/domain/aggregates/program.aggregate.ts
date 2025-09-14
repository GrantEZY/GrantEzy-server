import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
    ManyToOne,
    OneToOne,
} from "typeorm";
import {Organization} from "../entities/organization.entity";
import {ProgramDetails} from "../value-objects/program.details.object";
import {Duration} from "../value-objects/duration.object";
import {ProgramStatus} from "../constants/status.constants";
import {Money} from "../value-objects/project.metrics.object";
import {TRL} from "../constants/trl.constants";
import {Cycle} from "./cycle.aggregate";
import {slugify} from "../../../shared/helpers/slug.generator";
import {User} from "./user.aggregate";
@Entity({name: "programs"})
export class Program {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    organizationId: string;

    @ManyToOne(() => Organization, {
        onDelete: "SET NULL",
        cascade: false,
        eager: true,
    })
    @JoinColumn({name: "organizationId"})
    organization: Organization;

    @OneToMany(() => Cycle, (cycle) => cycle.program, {
        cascade: false,
    })
    cycles: Cycle[];

    @Column({
        type: "jsonb",
        transformer: {
            to: (value: ProgramDetails) => (value ? value.toJSON() : null),
            from: (value: {
                name: string;
                description: string;
                category: string;
            }) =>
                value
                    ? new ProgramDetails(
                          value.name,
                          value.description,
                          value.category
                      )
                    : null,
        },
    })
    details: ProgramDetails;

    @Column({
        type: "jsonb",
        transformer: {
            to: (value: Duration) => (value ? value.toJSON() : null),
            from: (value: {startDate: Date; endDate: Date | null}) =>
                value ? new Duration(value.startDate, value.endDate) : null,
        },
    })
    duration: Duration;

    @Column({type: "enum", enum: ProgramStatus})
    status: ProgramStatus;

    @Column({
        type: "jsonb",
        transformer: {
            to: (value: Money) => (value ? value.toJSON() : null),
            from: (value: {amount: number; currency: string}) =>
                value ? new Money(value.amount, value.currency) : null,
        },
    })
    budget: Money;

    @Column({type: "enum", enum: TRL})
    minTRL: TRL;

    @Column({type: "enum", enum: TRL})
    maxTRL: TRL;

    @Column({unique: true, nullable: true})
    slug: string;

    @Column({nullable: true})
    managerId: string;

    @OneToOne(() => User, {
        onDelete: "SET NULL",
        cascade: false,
        eager: false,
    })
    @JoinColumn({name: "managerId"})
    manager: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (this.details.name && this.id) {
            this.slug = slugify(this.details.name, this.id);
        }
    }
}
