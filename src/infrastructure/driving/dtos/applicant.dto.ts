import {ApiProperty} from "@nestjs/swagger";
import {
    IsString,
    IsUUID,
    ValidateNested,
    IsArray,
    IsNumber,
    IsDateString,
    IsEnum,
    IsEmail,
    IsBoolean,
    IsOptional,
    IsObject,
    IsInt,
} from "class-validator";
import {Type} from "class-transformer";
import {MoneyDTO} from "./pm.dto";
import {RevenueType} from "../../../core/domain/constants/revenue.constants";
import {Impact} from "../../../core/domain/constants/risk.constants";

export class ProjectBasicInfoDTO {
    @ApiProperty({
        example: "AI-powered Healthcare Assistant",
        description: "The title of the project",
    })
    @IsString()
    title: string;

    @ApiProperty({
        example: "An AI system that helps doctors with faster diagnostics.",
        description: "A brief summary of the project",
    })
    @IsString()
    summary: string;

    @ApiProperty({
        example: "Healthcare diagnostics are slow and error-prone.",
        description: "The problem that the project addresses",
    })
    @IsString()
    problem: string;

    @ApiProperty({
        example: "Use AI algorithms to assist in diagnosis and reduce errors.",
        description: "The proposed solution to the problem",
    })
    @IsString()
    solution: string;

    @ApiProperty({
        example:
            "First system integrating AI and IoT for real-time diagnostics.",
        description: "What makes this project innovative",
    })
    @IsString()
    innovation: string;
}

export class TechnicalSpecDTO {
    @ApiProperty({
        example: "A scalable cloud-based AI system",
        description: "Detailed description of the technical specifications",
    })
    @IsString()
    description: string;

    @ApiProperty({
        example: ["Node.js", "Python", "TensorFlow"],
        description: "List of technologies used in the project",
    })
    @IsArray()
    @IsString({each: true})
    techStack: string[];

    @ApiProperty({
        example: "https://github.com/example/prototype",
        description: "Link or reference to the prototype (if available)",
    })
    @IsString()
    prototype: string;
}

export class MarketInfoDTO {
    @ApiProperty({
        example: "500M users worldwide",
        description: "Total Addressable Market size",
    })
    @IsString()
    totalAddressableMarket: string;

    @ApiProperty({
        example: "200M users in APAC region",
        description: "Serviceable Market size",
    })
    @IsString()
    serviceableMarket: string;

    @ApiProperty({
        example: "50M users initially",
        description: "Obtainable Market size",
    })
    @IsString()
    obtainableMarket: string;

    @ApiProperty({
        example: "Competitor X and Y dominate the market",
        description: "Competitor analysis information",
    })
    @IsString()
    competitorAnalysis: string;
}

export class RevenueStreamDTO {
    @ApiProperty({
        description: "Type of revenue stream",
        enum: RevenueType,
        example: RevenueType.SUBSCRIPTION,
    })
    type: RevenueType;

    @ApiProperty({
        description: "Description of the revenue stream",
        example: "Monthly subscription fee",
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: "Percentage contribution of this stream",
        example: 70,
    })
    @IsNumber()
    percentage: number;
}

export class RevenueModelDTO {
    @ApiProperty({
        description: "Primary revenue stream",
        type: () => RevenueStreamDTO,
    })
    @ValidateNested()
    @Type(() => RevenueStreamDTO)
    primaryStream: RevenueStreamDTO;

    @ApiProperty({
        description: "Secondary revenue streams",
        type: () => RevenueStreamDTO,
        isArray: true,
    })
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => RevenueStreamDTO)
    secondaryStreams: RevenueStreamDTO[];

    @ApiProperty({
        description: "Pricing strategy",
        example: "Freemium with premium upgrades",
    })
    @IsString()
    pricing: string;

    @ApiProperty({
        description: "Unit economics details",
        example: "LTV > CAC, payback period of 6 months",
    })
    @IsString()
    unitEconomics: string;
}

export class RiskDTO {
    @ApiProperty({
        description: "Description of the risk",
        example:
            "Dependency on a single cloud provider may cause vendor lock-in",
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: "Impact level of the risk",
        enum: Impact,
        example: Impact.HIGH,
    })
    @IsEnum(Impact)
    impact: Impact;

    @ApiProperty({
        description: "Mitigation strategy for the risk",
        example: "Adopt a multi-cloud strategy to reduce lock-in",
    })
    @IsString()
    mitigation: string;
}

export class DocumentObjectDTO {
    @ApiProperty({
        example: "Endorsement Letter",
        description: "Title of the document",
    })
    @IsString()
    title: string;

    @ApiProperty({
        example: "Letter signed by the head of institution",
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({example: "endorsement_letter.pdf", description: "File name"})
    @IsString()
    fileName: string;

    @ApiProperty({
        example: "2MB",
        description: "Size of the file (string or formatted value)",
    })
    @IsString()
    fileSize: string;

    @ApiProperty({
        example: "application/pdf",
        description: "MIME type of the file",
    })
    @IsString()
    mimeType: string;

    @ApiProperty({
        example: "https://storage.example.com/docs/endorsement_letter.pdf",
        description: "Storage URL",
    })
    @IsString()
    storageUrl: string;

    @ApiProperty({
        example: {issuedBy: "Institute Head", date: "2025-01-01"},
        required: false,
        description: "Additional metadata for the document",
    })
    @IsOptional()
    @IsObject()
    metaData?: Record<string, string>;
}

/**
 * DTO for Project Milestone
 */
export class ProjectMilestoneDTO {
    @ApiProperty({
        description: "Title of the milestone",
        example: "MVP Release",
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: "Detailed description of the milestone",
        example: "Deliver the minimum viable product with core features",
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: "List of deliverables for this milestone",
        example: [
            "Authentication module",
            "User dashboard",
            "Reporting system",
        ],
        type: [String],
    })
    @IsArray()
    @IsString({each: true})
    deliverables: string[];

    @ApiProperty({
        description: "Due date for the milestone",
        example: "2025-12-31T00:00:00.000Z",
    })
    @IsDateString()
    dueDate: Date;
}

export class BudgetComponentDTO {
    @ApiProperty({
        example: "Hiring developers",
        description: "Reason for the budget allocation",
    })
    @IsString()
    BudgetReason: string;

    @ApiProperty({type: () => MoneyDTO, description: "Budget details"})
    @ValidateNested()
    @Type(() => MoneyDTO)
    Budget: MoneyDTO;
}

export class QuotedBudgetDTO {
    @ApiProperty({
        type: [BudgetComponentDTO],
        description: "Manpower budget components",
    })
    @ValidateNested({each: true})
    @Type(() => BudgetComponentDTO)
    ManPower: BudgetComponentDTO[];

    @ApiProperty({
        type: [BudgetComponentDTO],
        description: "Equipment budget components",
    })
    @ValidateNested({each: true})
    @Type(() => BudgetComponentDTO)
    Equipment: BudgetComponentDTO[];

    @ApiProperty({
        type: [BudgetComponentDTO],
        description: "Other costs budget components",
    })
    @ValidateNested({each: true})
    @Type(() => BudgetComponentDTO)
    OtherCosts: BudgetComponentDTO[];

    @ApiProperty({type: BudgetComponentDTO, description: "Consumables budget"})
    @ValidateNested()
    @Type(() => BudgetComponentDTO)
    Consumables: BudgetComponentDTO;

    @ApiProperty({type: BudgetComponentDTO, description: "Travel budget"})
    @ValidateNested()
    @Type(() => BudgetComponentDTO)
    Travel: BudgetComponentDTO;

    @ApiProperty({type: BudgetComponentDTO, description: "Contingency budget"})
    @ValidateNested()
    @Type(() => BudgetComponentDTO)
    Contigency: BudgetComponentDTO;

    @ApiProperty({type: BudgetComponentDTO, description: "Overhead budget"})
    @ValidateNested()
    @Type(() => BudgetComponentDTO)
    Overhead: BudgetComponentDTO;
}

/**
 * Main DTOs for application , step-form
 */
export class CreateApplicationControllerDTO {
    @ApiProperty({
        description: "slug of the associated cycle",
        example: "4b7d1f330f2e4b7a91e35f58f3c9d4ab",
    })
    cycleSlug: string;

    @ApiProperty({
        description: "Basic information about the project",
        type: () => ProjectBasicInfoDTO,
        example: {
            title: "AI-powered Healthcare Assistant",
            summary: "An AI system that helps doctors with faster diagnostics.",
            problem: "Healthcare diagnostics are slow and error-prone.",
            solution:
                "Use AI algorithms to assist in diagnosis and reduce errors.",
            innovation:
                "First system integrating AI and IoT for real-time diagnostics.",
        },
    })
    @ValidateNested()
    @Type(() => ProjectBasicInfoDTO)
    basicInfo: ProjectBasicInfoDTO;
}
export class CreateApplicationRepoDTO {
    @ApiProperty({
        description: "UUID of the associated cycle",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    cycleId: string;

    @ApiProperty({
        description: "UUID of the associated applicant",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    userId: string;

    @ApiProperty({
        description: "Basic information about the project",
        type: () => ProjectBasicInfoDTO,
        example: {
            title: "AI-powered Healthcare Assistant",
            summary: "An AI system that helps doctors with faster diagnostics.",
            problem: "Healthcare diagnostics are slow and error-prone.",
            solution:
                "Use AI algorithms to assist in diagnosis and reduce errors.",
            innovation:
                "First system integrating AI and IoT for real-time diagnostics.",
        },
    })
    @ValidateNested()
    @Type(() => ProjectBasicInfoDTO)
    basicInfo: ProjectBasicInfoDTO;
}

export class AddBudgetDetailsDTO {
    @ApiProperty({
        description: "UUID of the associated application",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    applicationId: string;

    @ApiProperty({
        description: "Quoted budget information",
        type: QuotedBudgetDTO,
        example: {
            ManPower: [
                {
                    BudgetReason: "Hiring developers",
                    Budget: {amount: 200000, currency: "INR"},
                },
            ],
            Equipment: [
                {
                    BudgetReason: "GPU Servers",
                    Budget: {amount: 150000, currency: "INR"},
                },
            ],
            OtherCosts: [],
            Consumables: {
                BudgetReason: "Cloud credits",
                Budget: {amount: 50000, currency: "INR"},
            },
            Travel: {
                BudgetReason: "Conferences",
                Budget: {amount: 20000, currency: "INR"},
            },
            Contigency: {
                BudgetReason: "Unexpected costs",
                Budget: {amount: 30000, currency: "INR"},
            },
            Overhead: {
                BudgetReason: "Admin expenses",
                Budget: {amount: 50000, currency: "INR"},
            },
        },
    })
    @ValidateNested()
    @Type(() => QuotedBudgetDTO)
    budget: QuotedBudgetDTO;
}

export class ApplicationDocumentsDTO {
    @ApiProperty({
        description: "UUID of the associated application",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    applicationId: string;

    @ApiProperty({type: DocumentObjectDTO, description: "Endorsement Letter"})
    @ValidateNested()
    @Type(() => DocumentObjectDTO)
    endorsementLetter: DocumentObjectDTO;

    @ApiProperty({
        type: DocumentObjectDTO,
        description: "Plagiarism Undertaking",
    })
    @ValidateNested()
    @Type(() => DocumentObjectDTO)
    plagiarismUndertaking: DocumentObjectDTO;

    @ApiProperty({type: DocumentObjectDTO, description: "Age Proof"})
    @ValidateNested()
    @Type(() => DocumentObjectDTO)
    ageProof: DocumentObjectDTO;

    @ApiProperty({type: DocumentObjectDTO, description: "Aadhar"})
    @ValidateNested()
    @Type(() => DocumentObjectDTO)
    aadhar: DocumentObjectDTO;

    @ApiProperty({type: DocumentObjectDTO, description: "PI Certificate"})
    @ValidateNested()
    @Type(() => DocumentObjectDTO)
    piCertificate: DocumentObjectDTO;

    @ApiProperty({type: DocumentObjectDTO, description: "Co-PI Certificate"})
    @ValidateNested()
    @Type(() => DocumentObjectDTO)
    coPiCertificate: DocumentObjectDTO;

    @ApiProperty({
        type: [DocumentObjectDTO],
        required: false,
        description: "Any other relevant documents",
    })
    @ValidateNested({each: true})
    @IsOptional()
    @Type(() => DocumentObjectDTO)
    otherDocuments?: DocumentObjectDTO[];
}

export class AddApplicationTechnicalAndMarketInfoDTO {
    @ApiProperty({
        description: "UUID of the associated application",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    applicationId: string;

    @ApiProperty({
        description: "Technical specifications of the project",
        type: TechnicalSpecDTO,
        example: {
            description: "An AI-powered health monitoring device",
            techStack: ["Node.js", "TensorFlow", "React"],
            prototype: "https://github.com/example/prototype",
        },
    })
    @ValidateNested()
    @Type(() => TechnicalSpecDTO)
    technicalSpec: TechnicalSpecDTO;

    @ApiProperty({
        description: "Market information of the project",
        type: MarketInfoDTO,
        example: {
            totalAddressableMarket: "500M users worldwide",
            serviceableMarket: "200M users in APAC region",
            obtainableMarket: "50M users initially",
            competitorAnalysis: "Competitor A has 60% market share",
        },
    })
    @ValidateNested()
    @Type(() => MarketInfoDTO)
    marketInfo: MarketInfoDTO;
}

export class AddApplicationRevenueStreamDTO {
    @ApiProperty({
        description: "UUID of the associated application",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    applicationId: string;

    @ApiProperty({
        description: "Revenue model details",
        type: () => RevenueModelDTO,
    })
    @ValidateNested()
    @Type(() => RevenueModelDTO)
    revenueModel: RevenueModelDTO;
}

export class AddApplicationRisksAndMilestonesDTO {
    @ApiProperty({
        description: "UUID of the associated application",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    applicationId: string;

    @ApiProperty({
        description: "List of risks associated with the application",
        type: [RiskDTO],
        example: [
            {
                description: "Vendor lock-in due to cloud provider dependency",
                impact: "HIGH",
                mitigation: "Use a multi-cloud strategy",
            },
        ],
    })
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => RiskDTO)
    risks: RiskDTO[];

    @ApiProperty({
        description:
            "List of project milestones associated with the application",
        type: [ProjectMilestoneDTO],
        example: [
            {
                title: "MVP Release",
                description: "Deliver the MVP with core features",
                deliverables: ["Auth module", "Dashboard"],
                status: "IN_PROGRESS",
                dueDate: "2025-12-31T00:00:00.000Z",
                completedDate: null,
            },
        ],
    })
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => ProjectMilestoneDTO)
    milestones: ProjectMilestoneDTO[];
}

export class AddApplicationTeammatesDTO {
    @ApiProperty({
        description: "UUID of the associated application",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    applicationId: string;

    @ApiProperty({
        description: "List of teammate email addresses",
        example: ["alice@example.com", "bob@example.com"],
        type: [String],
    })
    @IsArray()
    @IsEmail({}, {each: true})
    emails: string[];

    @ApiProperty({
        description:
            "Flag to indicate if the form is submitted or saved as draft",
        example: false,
    })
    @IsBoolean()
    isSubmitted: boolean;
}

export class DeleteApplicationDTO {
    @ApiProperty({
        description: "UUID of the associated application",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    applicationId: string;
}

export class GetUserCreatedApplicationDTO {
    @ApiProperty({
        description: "UUID of the associated application",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    applicationId: string;
}

export class GetApplicationWithCycleDetailsDTO {
    @ApiProperty({
        description: "slug of the associated cycle",
        example: "4b7d1f330f2e4b7a91e35f58f3c9d4ab",
    })
    @IsString()
    cycleSlug: string;
}

export class GetUserProjectsPaginationDTO {
    @ApiProperty({
        description: "page number for pagination",
        example: "1",
    })
    @Type(() => Number)
    @IsInt()
    page: number;

    @ApiProperty({
        description: "number Of Results in One Page",
        example: "1",
    })
    @Type(() => Number)
    @IsInt()
    numberOfResults: number;
}

export class GetProjectDetailsDTO {
    @ApiProperty({
        description: "slug of the associated application",
        example: "4b7d1f330f2e4b7a91e35f58f3c9d4ab",
    })
    @IsString()
    applicationSlug: string;
}

export class ManageTeammateDTO {
    @ApiProperty({
        description: "UUID of the associated application",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    applicationId: string;

    @ApiProperty({
        description: "teammate email address",
        example: "tylerdurden@gmail.com",
    })
    @IsEmail()
    email: string;
}
