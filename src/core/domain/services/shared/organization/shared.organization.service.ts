import {
    OrganizationEntityPort,
    ORGANIZATION_ENTITY_PORT,
} from "../../../../../ports/outputs/repository/organization/organization.entity.port";
import {Inject, Injectable} from "@nestjs/common";
import ApiError from "../../../../../shared/errors/api.error";
import {
    CreateOrganizationDTO,
    UpdateOrganizationDTO,
} from "../../../../../infrastructure/driving/dtos/shared/shared.organization.dto";
import {Organization} from "../../../../../core/domain/entities/organization.entity";

@Injectable()
export class SharedOrganizationService {
    constructor(
        @Inject(ORGANIZATION_ENTITY_PORT)
        private readonly organizationEntityRepository: OrganizationEntityPort
    ) {}
    async createOrganization(
        organizationDetails: CreateOrganizationDTO
    ): Promise<Organization> {
        try {
            const existingOrganization =
                await this.organizationEntityRepository.findByName(
                    organizationDetails.name
                );
            if (existingOrganization) {
                throw new ApiError(
                    400,
                    "Organization with this name already exists",
                    "Bad Request"
                );
            }
            return await this.organizationEntityRepository.save(
                organizationDetails
            );
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to create organization",
                "Database Error"
            );
        }
    }

    async getOrganizationById(id: string): Promise<Organization> {
        try {
            const organization =
                await this.organizationEntityRepository.findById(id);
            if (!organization) {
                throw new ApiError(404, "Organization not found", "Not Found");
            }
            return organization;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to get organization by ID",
                "Database Error"
            );
        }
    }

    async getOrganizationByName(name: string): Promise<Organization> {
        try {
            const organization =
                await this.organizationEntityRepository.findByName(name);
            if (!organization) {
                throw new ApiError(400, "Organization not found", "Not Found");
            }
            return organization;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to get organization by name",
                "Database Error"
            );
        }
    }

    async getAllOrganizations(): Promise<Organization[]> {
        try {
            return await this.organizationEntityRepository.getAllOrganizations();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to get all organizations",
                "Database Error"
            );
        }
    }

    async updateOrganization(
        updateOrganizationDetails: UpdateOrganizationDTO
    ): Promise<Organization> {
        try {
            const organization =
                await this.organizationEntityRepository.updateOrganization(
                    updateOrganizationDetails
                );

            return organization;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to update organization",
                "Database Error"
            );
        }
    }

    async deleteOrganization(id: string): Promise<boolean> {
        try {
            return await this.organizationEntityRepository.deleteOrganization(
                id
            );
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to delete organization",
                "Database Error"
            );
        }
    }
}
