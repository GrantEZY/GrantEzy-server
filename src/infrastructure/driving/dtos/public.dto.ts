import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class GetProgramCycleDetailsDTO {
    @ApiProperty({
        example: "sdgjksdfgkjsfglksdjfgnsldkfjgnl",
        description: "The slug of the program cycle",
    })
    @IsString()
    slug: string;
}

export class getActiveProgramFilterDTO {
    @ApiProperty({
        example: 1,
        description: "The page number for pagination ",
    })
    @IsString()
    page: number;
    @ApiProperty({
        example: 10,
        description: "The number of results per page for pagination",
    })
    @IsString()
    numberOfResults: number;
}
