// import { createOrderSchema, updateOrderStatusSchema } from "@/application/dtos/order.dto";
// import { Result } from "@/shared/result/result";
// import { ValidationError, BusinessRuleViolationError } from "@/shared/errors/app-error";
// import { OrderStatusMachine } from "@/domain/enums/order-status.enum";

// /**
//  * Order Validator
//  * 
//  * Validates order input data.
//  * Also validates order status transitions.
//  */

// export class OrderValidator {
//   /**
//    * Validate create order input - O(n)
//    */
//   static validateCreate(input: unknown): Result<z.infer<typeof createOrderSchema>> {
//     const result = createOrderSchema.safeParse(input);

//     if (!result.success) {
//       const errors = result.error.errors.map(e => 
//         `${e.path.join(".")}: ${e.message}`
//       ).join(", ");
//       return Result.fail(new ValidationError(errors));
//     }

//     const data = result.data;

//     // Validate no duplicate product IDs
//     const productIds = data.items.map(i => i.productId);
//     const uniqueIds = new Set(productIds);
//     if (uniqueIds.size !== productIds.length) {
//       return Result.fail(
//         new ValidationError("Duplicate products in order")
//       );
//     }

//     return Result.ok(data);
//   }

//   /**
//    * Validate status update - O(1)
//    */
//   static validateStatusUpdate(
//     input: unknown,
//     currentStatus: string
//   ): Result<z.infer<typeof updateOrderStatusSchema>> {
//     const result = updateOrderStatusSchema.safeParse(input);

//     if (!result.success) {
//       const errors = result.error.errors.map(e => 
//         `${e.path.join(".")}: ${e.message}`
//       ).join(", ");
//       return Result.fail(new ValidationError(errors));
//     }

//     const data = result.data;

//     // Validate transition
//     if (!OrderStatusMachine.canTransition(
//       currentStatus as any,
//       data.status as any
//     )) {
//       return Result.fail(
//         new BusinessRuleViolationError(
//           `Cannot transition from ${currentStatus} to ${data.status}`
//         )
//       );
//     }

//     return Result.ok(data);
//   }
// }