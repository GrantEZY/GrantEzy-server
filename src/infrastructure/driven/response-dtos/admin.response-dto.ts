import {User} from "../../../core/domain/aggregates/user.aggregate";
import {OrganisationType} from "../../../core/domain/constants/organization.constants";
import {Organization} from "../../../core/domain/entities/organization.entity";
import {ApiResponse} from "../../../shared/types/response.type";

class GetUsersData {
    users: User[];
    totalNumberOfUsers: number;
}

export class AddUserData {
    user: User;
}
export class GetUserProfileData {
    user: User;
}
export class AddOrganizationData {
    id: string;
    name: string;
    type: OrganisationType;
}

export class GetOrganizationsData {
    organizations: Organization[];
}

export class DeleteOrganizationData {
    success: boolean;
}

export class UpdateOrganizationData {
    id: string;
    name: string;
    type: OrganisationType;
}
export class GetUsersDataResponse extends ApiResponse(GetUsersData) {}
export class AddOrganizationDataResponse extends ApiResponse(
    AddOrganizationData
) {}

export class GetOrganizationsDataResponse extends ApiResponse(
    GetOrganizationsData
) {}

export class DeleteOrganizationDataResponse extends ApiResponse(
    DeleteOrganizationData
) {}

export class UpdateOrganizationDataResponse extends ApiResponse(
    UpdateOrganizationData
) {}

export class GetUserProfileDataResponse extends ApiResponse(
    GetUserProfileData
) {}
