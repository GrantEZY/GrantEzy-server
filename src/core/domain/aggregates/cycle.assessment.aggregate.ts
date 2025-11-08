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
    OneToMany,
} from "typeorm";
import {CycleAssessmentCriteriaAggregate} from "./cycle.assessment.criteria.aggregate";
import {Project} from "./project.aggregate";
import {ProjectReviewAggregate} from "./project.review.aggregate";

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

    @Column({unique: true, nullable: true})
    slug: string;

    @OneToMany(
        () => ProjectReviewAggregate,
        (review) => review.reviewSubmission,
        {
            eager: false,
        }
    )
    reviews: ProjectReviewAggregate[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
