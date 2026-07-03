// import { createServerClient } from "@/infrastructure/supabase/client.server";
// import { Result } from "@/shared/result/result";
// import { UnauthorizedError, ForbiddenError } from "@/shared/errors/app-error";
// import { UserRole, User } from "@/domain/entities/user.entity";
// import { Email } from "@/domain/value-objects/email";
// import { cookies } from "next/headers";

// /**
//  * Authentication Guards
//  * 
//  * Pure security functions called at the top of every protected action.
//  * 
//  * Security Pattern: Guard Clause
//  * - If not authenticated → return UnauthorizedError immediately
//  * - If not authorized → return ForbiddenError immediately
//  * - Otherwise → allow execution to continue
//  * 
//  * Time Complexity: O(1) per guard
//  */

// /**
//  * Check if user is authenticated
//  * 
//  * Verifies Supabase session from cookies.
//  * Returns user ID if authenticated.
//  */
// export async function isAuthenticated(): Promise<Result<string>> {
//   try {
//     const cookieStore = cookies();
//     const supabase = createServerClient();

//     const { data: { user }, error } = await supabase.auth.getUser();

//     if (error || !user) {
//       return Result.fail(new UnauthorizedError("Please log in to continue"));
//     }

//     return Result.ok(user.id);
//   } catch (error) {
//     return Result.fail(new UnauthorizedError("Authentication failed"));
//   }
// }

// /**
//  * Check if user is admin (or super admin)
//  * 
//  * Must be called AFTER isAuthenticated.
//  * Fetches user profile from database to check role.
//  */
// export async function isAdmin(): Promise<Result<User>> {
//   const authResult = await isAuthenticated();
//   if (authResult.isFailure()) {
//     return Result.fail(authResult.getError());
//   }

//   try {
//     const supabase = createServerClient();
//     const userId = authResult.getValue();

//     const { data: profile, error } = await supabase
//       .from("admins")
//       .select("*")
//       .eq("id", userId)
//       .single();

//     if (error || !profile) {
//       return Result.fail(new ForbiddenError("Admin access required"));
//     }

//     const user = new User({
//       id: profile.id,
//       email: Email.from(profile.email),
//       name: profile.name,
//       role: profile.role as UserRole,
//       createdAt: new Date(profile.created_at),
//       updatedAt: new Date(profile.updated_at),
//     });

//     if (!user.isAdmin) {
//       return Result.fail(new ForbiddenError("Admin access required"));
//     }

//     return Result.ok(user);
//   } catch (error) {
//     return Result.fail(new ForbiddenError("Admin access required"));
//   }
// }

// /**
//  * Check if user is super admin
//  */
// export async function isSuperAdmin(): Promise<Result<User>> {
//   const adminResult = await isAdmin();
//   if (adminResult.isFailure()) {
//     return Result.fail(adminResult.getError());
//   }

//   const user = adminResult.getValue();
//   if (!user.isSuperAdmin) {
//     return Result.fail(new ForbiddenError("Super admin access required"));
//   }

//   return Result.ok(user);
// }

// /**
//  * Check if user can manage orders
//  */
// export async function canManageOrders(): Promise<Result<User>> {
//   const adminResult = await isAdmin();
//   if (adminResult.isFailure()) {
//     return Result.fail(adminResult.getError());
//   }

//   const user = adminResult.getValue();
//   if (!user.canManageOrders()) {
//     return Result.fail(new ForbiddenError("Order management access required"));
//   }

//   return Result.ok(user);
// }