// import { Result } from "@/shared/result/result";
// import { IProductRepository } from "@/domain/interfaces/product.repository.interface";
// import { IOrderRepository } from "@/domain/interfaces/order.repository.interface";
// import { OrderAggregate } from "@/domain/aggregates/order.aggregate";
// import { OrderValidator } from "@/application/validators/order.validator";
// import { CreateOrderInput } from "@/application/dtos/order.dto";
// import { OrderDTO, toOrderDTO } from "@/application/dtos/order.dto";
// import { AppError, ErrorCode } from "@/shared/errors/app-error";

// /**
//  * Place Order Command (CQRS Write Operation)
//  * 
//  * Orchestrates the order creation process:
//  * 1. Validate input
//  * 2. Create order aggregate (validates products + stock)
//  * 3. Persist order
//  * 4. Update stock
//  * 5. Publish events
//  */

// export class PlaceOrderCommand {
//   constructor(
//     private readonly productRepository: IProductRepository,
//     private readonly orderRepository: IOrderRepository,
//   ) {}

//   /**
//    * Execute the command
//    * O(n) where n = number of order items
//    * 
//    * Uses database transaction for atomicity (stock + order)
//    */
//   async execute(input: unknown): Promise<Result<OrderDTO>> {
//     // 1. Validate input
//     const validationResult = OrderValidator.validateCreate(input);
//     if (validationResult.isFailure()) {
//       return Result.fail(validationResult.getError());
//     }
//     const validInput = validationResult.getValue();

//     try {
//       // 2. Create order aggregate (validates products & stock)
//       const aggregateResult = await OrderAggregate.create(
//         {
//           customerName: validInput.customerName,
//           customerPhone: validInput.customerPhone,
//           customerEmail: validInput.customerEmail,
//           customerCity: validInput.customerCity,
//           customerAddress: validInput.customerAddress,
//           items: validInput.items,
//           notes: validInput.notes,
//         },
//         this.productRepository
//       );

//       if (aggregateResult.isFailure()) {
//         return Result.fail(aggregateResult.getError());
//       }

//       const aggregate = aggregateResult.getValue();
//       const order = aggregate.orderEntity;

//       // 3. Persist order (in production: transaction with stock decrement)
//       await this.orderRepository.save(order);

//       // 4. Decrement stock for each product
//       for (const item of validInput.items) {
//         const product = await this.productRepository.findById(item.productId);
//         if (product) {
//           product.removeStock(item.quantity);
//           await this.productRepository.save(product);
//         }
//       }

//       // 5. Return DTO
//       const dto = toOrderDTO(order);
//       return Result.ok(dto);

//     } catch (error) {
//       return Result.fail(
//         new AppError(
//           ErrorCode.INTERNAL_ERROR,
//           "Failed to place order",
//           { cause: error as Error }
//         )
//       );
//     }
//   }
// }