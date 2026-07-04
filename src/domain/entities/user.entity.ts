// import { Entity } from "@/shared/kernel/entity";
// import { Email } from "@/domain/value-objects/email";
// import { ValidationError } from "@/shared/errors/app-error";

// /**
//  * User Entity
//  * 
//  * Represents an admin user who can manage the store.
//  * Customer users are not stored - orders use phone number only.
//  */

// export enum UserRole {
//   SUPER_ADMIN = "super_admin",
//   ADMIN = "admin",
//   MANAGER = "manager",
// }

// interface UserProps {
//   id: string;
//   email: Email;
//   name: string;
//   role: UserRole;
//   avatarUrl?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export class User extends Entity<string> {
//   private props: UserProps;

//   constructor(props: UserProps) {
//     super(props.id);
//     this.props = props;
//     this.validateInvariants();
//   }

//   get email(): Email { return this.props.email; }
//   get name(): string { return this.props.name; }
//   get role(): UserRole { return this.props.role; }
//   get avatarUrl(): string | undefined { return this.props.avatarUrl; }
//   get createdAt(): Date { return this.props.createdAt; }
//   get updatedAt(): Date { return this.props.updatedAt; }

//   // Role checks
//   get isSuperAdmin(): boolean { return this.props.role === UserRole.SUPER_ADMIN; }
//   get isAdmin(): boolean { return this.props.role === UserRole.ADMIN || this.isSuperAdmin; }
//   get isManager(): boolean { return this.props.role === UserRole.MANAGER || this.isAdmin; }

//   public canManageProducts(): boolean { return this.isAdmin; }
//   public canManageOrders(): boolean { return this.isManager; }
//   public canManageUsers(): boolean { return this.isSuperAdmin; }

//   public updateName(name: string): void {
//     if (!name || name.length < 2) {
//       throw new ValidationError("Name must be at least 2 characters");
//     }
//     this.props.name = name;
//     this.props.updatedAt = new Date();
//   }

//   public updateRole(newRole: UserRole): void {
//     this.props.role = newRole;
//     this.props.updatedAt = new Date();
//   }

//   private validateInvariants(): void {
//     if (!this.props.name || this.props.name.length < 2) {
//       throw new ValidationError("Name required");
//     }
//   }

//   public toPrimitives(): Record<string, unknown> {
//     return {
//       id: this.props.id,
//       email: this.props.email.value,
//       name: this.props.name,
//       role: this.props.role,
//       avatarUrl: this.props.avatarUrl,
//       createdAt: this.props.createdAt,
//       updatedAt: this.props.updatedAt,
//     };
//   }
// }