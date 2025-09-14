/**
 * This file contains the lifecycle statuses of users , program , project , cycle , grant-application
 */

export enum UserStatus {
    ACTIVE = "ACTIVE",
    IN_ACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
}

export enum ProgramStatus {
    ACTIVE = "ACTIVE",
    IN_ACTIVE = "INACTIVE",
    ARCHIVED = "ARCHIVED",
}

export enum ProjectStatus {
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    TERMINATED = "TERMINATED",
    SUSPENDED = "SUSPENDED",
}

export enum GrantApplicationStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    IN_REVIEW = "IN_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED",
    DELETED = "DELETED",
    ARCHIVED = "ARCHIVED",
}

export enum CycleStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    ARCHIVED = "ARCHIVED",
}

export enum ReviewStatus {
    UNASSIGNED = "UNASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
}
