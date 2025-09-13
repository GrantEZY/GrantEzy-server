import {Module} from "@nestjs/common";
import {UserSharedService} from "../../domain/services/shared/user/shared.user.service";
import {SharedOrganizationService} from "../../domain/services/shared/organization/shared.organization.service";
import {Global} from "@nestjs/common";

@Global()
@Module({
    providers: [UserSharedService, SharedOrganizationService],
    exports: [UserSharedService, SharedOrganizationService],
})
export class SharedModule {}
