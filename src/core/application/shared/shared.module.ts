import {Module} from "@nestjs/common";
import {UserSharedService} from "../../domain/services/shared/user/shared.user.service";
import {Global} from "@nestjs/common";

@Global()
@Module({
    providers: [UserSharedService],
    exports: [UserSharedService],
})
export class SharedModule {}
