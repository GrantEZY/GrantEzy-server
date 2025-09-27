/* eslint-disable @typescript-eslint/naming-convention */

import {ApplicationDocumentsDTO} from "../../../infrastructure/driving/dtos/applicant.dto";
import {DocumentObject} from "./document.object";

export class ApplicationDocumentsObject {
    readonly endorsementLetter: DocumentObject;
    readonly plagiarismUndertaking: DocumentObject;
    readonly ageProof: DocumentObject;
    readonly aadhar: DocumentObject;
    readonly piCertificate: DocumentObject;
    readonly coPiCertificate: DocumentObject;
    readonly otherDocuments: DocumentObject[] | null;

    constructor(
        endorsementLetter: DocumentObject,
        plagiarismUndertaking: DocumentObject,
        ageProof: DocumentObject,
        aadhar: DocumentObject,
        piCertificate: DocumentObject,
        coPiCertificate: DocumentObject,
        otherDocuments: DocumentObject[] | null = null
    ) {
        this.endorsementLetter = endorsementLetter;
        this.plagiarismUndertaking = plagiarismUndertaking;
        this.ageProof = ageProof;
        this.aadhar = aadhar;
        this.piCertificate = piCertificate;
        this.coPiCertificate = coPiCertificate;
        this.otherDocuments = otherDocuments;
    }

    toJSON() {
        return {
            endorsementLetter: this.endorsementLetter.toJSON(),
            plagiarismUndertaking: this.plagiarismUndertaking.toJSON(),
            ageProof: this.ageProof.toJSON(),
            aadhar: this.aadhar.toJSON(),
            piCertificate: this.piCertificate.toJSON(),
            coPiCertificate: this.coPiCertificate.toJSON(),
            otherDocuments:
                this.otherDocuments?.map((document) => document.toJSON()) ??
                null,
        };
    }
}

export const ApplicationDocumentObjectBuilder = (
    documentDetails: ApplicationDocumentsDTO
): ApplicationDocumentsObject => {
    const {
        piCertificate,
        coPiCertificate,
        aadhar,
        ageProof,
        endorsementLetter,
        otherDocuments,
        plagiarismUndertaking,
    } = documentDetails;

    const piCertificateDocument = new DocumentObject(
        piCertificate.title,
        piCertificate.description ?? null,
        piCertificate.fileName,
        piCertificate.fileSize,
        piCertificate.mimeType,
        piCertificate.storageUrl,
        piCertificate.metaData
    );

    const copiCertificateDocument = new DocumentObject(
        coPiCertificate.title,
        coPiCertificate.description ?? null,
        coPiCertificate.fileName,
        coPiCertificate.fileSize,
        coPiCertificate.mimeType,
        coPiCertificate.storageUrl,
        coPiCertificate.metaData
    );

    const aadharDocument = new DocumentObject(
        aadhar.title,
        aadhar.description ?? null,
        aadhar.fileName,
        aadhar.fileSize,
        aadhar.mimeType,
        aadhar.storageUrl,
        aadhar.metaData
    );

    const ageProofDocument = new DocumentObject(
        ageProof.title,
        ageProof.description ?? null,
        ageProof.fileName,
        ageProof.fileSize,
        ageProof.mimeType,
        ageProof.storageUrl,
        ageProof.metaData
    );

    const endorsementLetterDocument = new DocumentObject(
        endorsementLetter.title,
        endorsementLetter.description ?? null,
        endorsementLetter.fileName,
        endorsementLetter.fileSize,
        endorsementLetter.mimeType,
        endorsementLetter.storageUrl,
        endorsementLetter.metaData
    );

    const plagarismUndertakingDocument = new DocumentObject(
        plagiarismUndertaking.title,
        plagiarismUndertaking.description ?? null,
        plagiarismUndertaking.fileName,
        plagiarismUndertaking.fileSize,
        plagiarismUndertaking.mimeType,
        plagiarismUndertaking.storageUrl,
        plagiarismUndertaking.metaData
    );

    const otherDocumentsDocument = otherDocuments
        ? // eslint-disable-next-line
          otherDocuments.map(
              (otherDocument) =>
                  new DocumentObject(
                      otherDocument.title,
                      otherDocument.description ?? null,
                      otherDocument.fileName,
                      otherDocument.fileSize,
                      otherDocument.mimeType,
                      otherDocument.storageUrl,
                      otherDocument.metaData
                  )
          )
        : null;

    const applicationDocuments = new ApplicationDocumentsObject(
        endorsementLetterDocument,
        plagarismUndertakingDocument,
        ageProofDocument,
        aadharDocument,
        piCertificateDocument,
        copiCertificateDocument,
        otherDocumentsDocument
    );

    return applicationDocuments;
};
