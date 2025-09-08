import {DocumentBuilder} from "@nestjs/swagger";

export const config = new DocumentBuilder()
    .setTitle("GrantEzy API")
    .setDescription("The GrantEzy API description")
    .setVersion("1.0")
    .addTag("GrantEzy")
    .build();
