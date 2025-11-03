/* eslint-disable  */

import {DocumentObject} from "../value-objects/document.object";
import {
    Entity,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
} from "typeorm";
import {CycleAssessmentCriteriaAggregate} from "./cycle.assessment.criteria.aggregate";
import {Project} from "./project.aggregate";

@Entity({name: "cycle_assessment"})
export class CycleAssessmentAggregate {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    criteriaId: string;

    @ManyToOne(() => CycleAssessmentCriteriaAggregate, {
        onDelete: "CASCADE",
        eager: false,
    })
    @JoinColumn({name: "criteriaId"})
    criteria: CycleAssessmentCriteriaAggregate;

    @Column()
    projectId: string;

    @ManyToOne(() => Project, {
        onDelete: "CASCADE",
        eager: false,
    })
    @JoinColumn({name: "projectId"})
    project: Project;

    @Column({type: "text", nullable: true})
    reviewBrief: string | null;

    @Column({
        type: "jsonb",
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
    reviewDocument: DocumentObject;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
