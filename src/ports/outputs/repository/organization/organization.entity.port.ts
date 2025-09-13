import {
    CreateOrganizationDTO,
    UpdateOrganizationDTO,
} from "../../../../infrastructure/driving/dtos/shared/shared.organization.dto";
import {Organization} from "../../../../core/domain/entities/organization.entity";

export interface OrganizationEntityPort {
    save(organizationDetails: CreateOrganizationDTO): Promise<Organization>;
    findById(id: string): Promise<Organization | null>;
    findByName(name: string): Promise<Organization | null>;
    getAllOrganizations(): Promise<Organization[]>;
    updateOrganization(
        UpdateOrganizationDetails: UpdateOrganizationDTO
    ): Promise<Organization>;
    deleteOrganization(id: string): Promise<boolean>;
}

export const ORGANIZATION_ENTITY_PORT = Symbol("OrganizationEntityPort");
