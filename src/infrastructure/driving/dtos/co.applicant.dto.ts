import {ApiProperty} from "@nestjs/swagger";
import {IsUUID, IsString, IsInt} from "class-validator";
import {Type} from "class-transformer";
import {InviteStatus} from "../../../core/domain/constants/invite.constants";
export class CoApplicantApplicationDTO {
    @ApiProperty({
        description: "UUID of the associated application",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    applicationId: string;
}

export class GetTokenDetailsDTO {
    @ApiProperty({
        description: "token for verification purpose",
        example: "sgfksdjfgnsldkfjgsndlfkgjndkjf",
    })
    token: string;

    @ApiProperty({
        description: "slug for verification purpose",
        example: "sgfksdjfgnsldkfjgsndlfkgjndkjf",
    })
    slug: string;
}

export class SubmitInviteStatusDTO {
    @ApiProperty({
        description: "token for verification purpose",
        example: "sgfksdjfgnsldkfjgsndlfkgjndkjf",
    })
    token: string;

    @ApiProperty({
        description: "slug for verification purpose",
        example: "sgfksdjfgnsldkfjgsndlfkgjndkjf",
    })
    slug: string;

    @ApiProperty({
        description: "Invite Response Status",
        example: "ACCEPTED",
    })
    status: InviteStatus.ACCEPTED | InviteStatus.REJECTED;
}

export class GetUserLinkedProjectsPaginationDTO {
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
