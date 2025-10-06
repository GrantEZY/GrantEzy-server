/* eslint-disable @typescript-eslint/naming-convention */

export class DocumentObject {
    readonly title: string;
    readonly description: string | null;
    readonly fileName: string;
    readonly fileSize: string; // e.g. "2MB", or you could make this a number in bytes
    readonly mimeType: string; // e.g. "application/pdf"
    readonly storageUrl: string; // location in S3, GCP, etc.
    readonly metaData: Record<string, string> | null;

    constructor(
        title: string,
        description: string | null,
        fileName: string,
        fileSize: string,
        mimeType: string,
        storageUrl: string,
        metaData: Record<string, string> | null = null
    ) {
        this.title = title;
        this.description = description;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.mimeType = mimeType;
        this.storageUrl = storageUrl;
        this.metaData = metaData;
    }

    toJSON() {
        return {
            title: this.title,
            description: this.description,
            fileName: this.fileName,
            fileSize: this.fileSize,
            mimeType: this.mimeType,
            storageUrl: this.storageUrl,
            metaData: this.metaData,
        };
    }
}
