import {ApiProperty} from "@nestjs/swagger";
import {IsUUID} from "class-validator";
import {InviteStatus} from "../../../core/domain/constants/invite.constants";

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
