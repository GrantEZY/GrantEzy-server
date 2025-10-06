import {ApiProperty} from "@nestjs/swagger";
import {IsUUID} from "class-validator";
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
    @IsUUID()
    token: string;
}
