import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsUUID, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

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

export class DeleteApplicationDTO {
    @ApiProperty({
        description: "UUID of the associated application",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    applicationId: string;
}
