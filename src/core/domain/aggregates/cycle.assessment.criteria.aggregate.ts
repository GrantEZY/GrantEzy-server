/* eslint-disable  */

import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import {Cycle} from "./cycle.aggregate";
import {DocumentObject} from "../value-objects/document.object";

@Entity({name: "cycle_assessment_criteria"})
export class CycleAssessmentCriteriaAggregate {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    cycleId: string;

    @ManyToOne(() => Cycle, {
        onDelete: "CASCADE",
        eager: false,
    })
    @JoinColumn({name: "cycleId"})
    cycle: Cycle;

    @Column({type: "text"})
    reviewBrief: string;

    @Column({
        type: "jsonb",
        nullable: true,
        transformer: {
            to: (value: DocumentObject) => (value ? value.toJSON() : null),
            from: (value: any) =>
                value
                    ? new DocumentObject(
                          value.title,
                          value.description,
                          value.fileName,
                          value.fileSize,
                          value.mimeType,
                          value.storageUrl,
                          value.metaData
                      )
                    : null,
        },
    })
    templateSubmissionFile: DocumentObject | null;

    @CreateDateColumn()
    createdAt: Date;

    @Column({unique: true, nullable: true})
    slug: string;

    @UpdateDateColumn()
    updatedAt: Date;
}
