import {Organization} from "../../../../core/domain/entities/organization.entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import ApiError from "../../../../shared/errors/api.error";
import {OrganizationEntityPort} from "../../../../ports/outputs/repository/organization/organization.entity.port";
import {
    CreateOrganizationDTO,
    UpdateOrganizationDTO,
} from "../../../driving/dtos/shared/shared.organization.dto";

@Injectable()
export class OrganizationEntityRepository implements OrganizationEntityPort {
    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>
    ) {}

    /**
     * Saves an organization entity in the database.
     * @param organization - The organization entity to be saved or updated in the database.
     * @returns The saved or updated organization entity.
     * @throws ApiError if there is an issue during the save operation.
     */
    async save(organization: CreateOrganizationDTO): Promise<Organization> {
        try {
            const newOrganization =
                this.organizationRepository.create(organization);
            return await this.organizationRepository.save(newOrganization);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to save organization",
                "Database Error"
            );
        }
    }

    /**
     * Finds an organization entity by its unique identifier.
     * @param id - The unique identifier of the organization to be retrieved.
     * @returns The organization entity if found, otherwise null.
     */
    async findById(id: string): Promise<Organization | null> {
        try {
            return await this.organizationRepository.findOne({where: {id}});
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to find organization by ID",
                "Database Error"
            );
        }
    }

    /**
     * Deletes an organization entity by its unique identifier.
     * @param id - The unique identifier of the organization to be deleted.
     * @returns void
     * @throws ApiError if there is an issue during the delete operation.
     */
    async deleteOrganization(id: string): Promise<boolean> {
        try {
            const isDeleted = await this.organizationRepository.delete(id);
            if (isDeleted.affected === 0) {
                throw new ApiError(404, "Organization not found", "Not Found");
            }
            return true;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to delete organization by ID",
                "Database Error"
            );
        }
    }

    /**
     * Retrieves all organization entities from the database.
     * @returns An array of all organization entities.
     * @throws ApiError if there is an issue during the retrieval operation.
     */
    async getAllOrganizations(): Promise<Organization[]> {
        try {
            return await this.organizationRepository.find({
                order: {name: "ASC"},
            });
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to retrieve organizations",
                "Database Error"
            );
        }
    }

    /**
     * Finds an organization entity by its name.
     * @param name - The name of the organization to be retrieved.
     * @returns The organization entity if found, otherwise null.
     */
    async findByName(name: string): Promise<Organization | null> {
        try {
            return await this.organizationRepository.findOne({
                where: {name},
            });
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to find organization by name",
                "Database Error"
            );
        }
    }

    /**
     * Updates an organization entity in the database.
     * @param organization - The organization entity with updated data.
     * @returns The updated organization entity.
     * @throws ApiError if there is an issue during the update operation.
     */
    async updateOrganization(
        updateOrganizationDetails: UpdateOrganizationDTO
    ): Promise<Organization> {
        try {
            const {id, name, type} = updateOrganizationDetails;
            const organization = await this.organizationRepository.findOne({
                where: {id},
            });
            if (!organization) {
                throw new ApiError(404, "Organization not found", "Not Found");
            }
            organization.name = name ?? organization.name;
            organization.type = type ?? organization.type;
            return await this.organizationRepository.save(organization);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to update organization by id",
                "Database Error"
            );
        }
    }
}
