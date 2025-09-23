import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({name: "documents"})
export class Document {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column({nullable: true, type: "text"})
    description: string | null;

    @Column()
    fileName: string;

    @Column({type: "bigint"})
    fileSize: number;

    @Column()
    mimeType: string;

    @Column()
    storageUrl: string;

    @Column({type: "int"})
    version: number;

    @Column({
        type: "jsonb",
        nullable: true,
        transformer: {
            to: (
                value: Record<string, string> | null
            ): Record<string, string> | null =>
                value
                    ? Object.fromEntries(
                          Object.entries(value).map(([k, v]) => [k, v])
                      )
                    : null,

            from: (
                value: Record<string, string> | null
            ): Record<string, string> | null =>
                value
                    ? Object.fromEntries(
                          Object.entries(value).map(([k, v]) => [k, v ?? ""])
                      )
                    : null,
        },
    })
    metaData: Record<string, string> | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
