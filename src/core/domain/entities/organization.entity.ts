import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
} from "typeorm";
import {OrganisationType} from "../constants/organization.constants";
import {slugify} from "../../../shared/helpers/slug.generator";

@Entity("organizations")
export class Organization {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", length: 60, unique: true})
    name: string;

    @Column({type: "enum", enum: OrganisationType})
    type: OrganisationType;

    @Column({unique: true, nullable: true})
    slug: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (this.name && this.id) {
            this.slug = slugify(this.name, this.id);
        }
    }
}
