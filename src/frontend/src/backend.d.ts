import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SkillBadge {
    id: BadgeId;
    verified: boolean;
    owner: Principal;
    skillName: string;
    description?: string;
    level?: string;
    issuer: Principal;
    issueTimestamp: Time;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
    email?: string;
    organization?: string;
}
export type BadgeId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllBadges(): Promise<Array<SkillBadge>>;
    getBadgesForUser(user: Principal): Promise<Array<SkillBadge>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    issueBadge(owner: Principal, skillName: string, description: string | null, level: string | null): Promise<BadgeId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    verifyBadge(badgeId: BadgeId): Promise<SkillBadge | null>;
}
