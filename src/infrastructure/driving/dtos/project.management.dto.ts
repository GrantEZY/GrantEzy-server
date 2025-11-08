import {
    ValidateNested,
    IsUUID,
    IsDate,
    IsInt,
    IsPositive,
    Min,
    IsString,
    IsOptional,
} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {QuotedBudgetDTO} from "./applicant.dto";
import {Type} from "class-transformer";
import {DocumentObjectDTO} from "./applicant.dto";
export class ProjectMetricsDurationDTO {
    @ApiProperty({type: Date, example: "2025-01-01T00:00:00Z"})
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @ApiProperty({type: Date, example: "2025-12-31T23:59:59Z"})
    @IsDate()
    @Type(() => Date)
    endDate: Date;
}

export class CreateProjectDTO {
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
    allocatedBudget: QuotedBudgetDTO;

    @ApiProperty({
        description: "Duration for the project",
        example: {
            startDate: new Date(),
            endDate: new Date(),
        },
    })
    @ValidateNested()
    @Type(() => ProjectMetricsDurationDTO)
    plannedDuration: ProjectMetricsDurationDTO;
}

export class GetCycleProjectsDTO {
    @ApiProperty({
        description: "slug of the cycle",
        example: "4b7d1f330f2e4b7a91e35f58f3c9d4ab",
    })
    @IsString()
    cycleSlug: string;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    @ApiProperty({
        description: "Page Number for pagination",
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: "Number Of Results per page for pagination",
        example: 1,
    })
    @IsInt()
    @Min(1)
    @Type(() => Number)
    numberOfResults: number;
}

export class GetProjectDetailsDTO {
    @ApiProperty({
        description: "slug of the cycle",
        example: "4b7d1f330f2e4b7a91e35f58f3c9d4ab",
    })
    @IsUUID()
    cycleSlug: string;

    @ApiProperty({
        description: "slug of the application",
        example: "4b7d1f330f2e4b7a91e35f58f3c9d4ab",
    })
    @IsUUID()
    applicationSlug: string;
}

export class CreateCycleProjectsEvalCriteriaDTO {
    @ApiProperty({
        description: "Id of the cycle",
        example: "4b7d1f330-f2e4b7-a91e3-5f58f3-c9d4ab",
    })
    @IsUUID()
    cycleId: string;

    @ApiProperty({
        description: "name for the cycle review",
        example: "Cycle Monsoon Review",
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: "Brief Review Of Whats Expected",
    })
    @IsString()
    briefReview: string;

    @ApiProperty({type: DocumentObjectDTO, description: "Template File"})
    @IsOptional()
    @ValidateNested()
    @Type(() => DocumentObjectDTO)
    templateFile?: DocumentObjectDTO;
}
