import {OrganisationType} from "../../../constants/organization.constants";

const SAVED_ORGANIZATION = {
    id: "org-123",
    name: "Test Organization",
    type: OrganisationType.IIIT,
    createdAt: new Date(),
    updatedAt: new Date(),
};

const EXISTING_ORGANIZATIONS = [
    {...SAVED_ORGANIZATION, id: "org-123"},
    {...SAVED_ORGANIZATION, id: "org-456", name: "Another Org"},
    {...SAVED_ORGANIZATION, id: "org-789", name: "Third Org"},
];

export {SAVED_ORGANIZATION, EXISTING_ORGANIZATIONS};
