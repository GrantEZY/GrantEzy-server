import {ApiProperty} from "@nestjs/swagger";
import {
    IsUUID,
    ValidateNested,
    IsNumber,
    IsEnum,
    IsPositive,
} from "class-validator";
import {InviteStatus} from "../../../core/domain/constants/invite.constants";
import {Recommendation} from "../../../core/domain/constants/recommendation.constants";
import {MoneyDTO} from "./pm.dto";
import {Type} from "class-transformer";

export class ScoresDTO {
    @ApiProperty({example: 50, description: "Technical Score"})
    @IsNumber()
    @IsPositive()
    technical: number;
    @ApiProperty({example: 50, description: "Market Score"})
    @IsNumber()
    @IsPositive()
    market: number;

    @ApiProperty({example: 50, description: "Financial Score"})
    @IsNumber()
    @IsPositive()
    financial: number;

    @ApiProperty({example: 50, description: "Team Score"})
    @IsNumber()
    @IsPositive()
    team: number;

    @ApiProperty({example: 50, description: "Innovation Score"})
    @IsNumber()
    @IsPositive()
    innovation: number;
}

export class SubmitInviteStatusDTO {
    @ApiProperty({
        description: "token for verification purpose",
        example: "sgfksdjfgnsldkfjgsndlfkgjndkjf",
    })
    @IsUUID()
    token: string;

    @ApiProperty({
        description: "Invite Response Status",
        example: "ACCEPTED",
    })
    status: InviteStatus.ACCEPTED | InviteStatus.REJECTED;
}

export class SubmitReviewDTO {
    @ApiProperty({
        description: "Application Id for which review is being submitted",
        example: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    })
    @IsUUID()
    applicationId: string;

    @ApiProperty({
        description: "Recommendation for the application",
        example: Recommendation.APPROVE,
    })
    @IsEnum(Recommendation)
    recommendation: Recommendation;

    @ApiProperty({type: () => MoneyDTO, description: "Budget details"})
    @ValidateNested()
    @Type(() => MoneyDTO)
    budget: MoneyDTO;

    @ApiProperty({type: () => ScoresDTO, description: "Scores details"})
    @ValidateNested()
    @Type(() => ScoresDTO)
    scores: ScoresDTO;
}

export class UpdateReviewDTO {
    budget?: MoneyDTO;

    recommendation?: Recommendation;

    scores?: ScoresDTO;
}
