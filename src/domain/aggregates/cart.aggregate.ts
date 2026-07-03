// import { AggregateRoot } from "@/shared/kernel/aggregate-root";
// import { Product } from "@/domain/entities/product.entity";
// import { Money } from "@/domain/value-objects/money";
// import { ProductAvailableSpec } from "@/domain/specifications/product-in-stock.spec";
// import { BusinessRuleViolationError } from "@/shared/errors/app-error";

// /**
//  * Cart Aggregate
//  * 
//  * Manages a shopping cart with inventory validation.
//  * Cart is ephemeral - stored in browser localStorage, not database.
//  * 
//  * Data Structure: Array-based cart with O(1) add, O(n) find
//  * Could optimize to HashMap for O(1) find if needed.
//  */

// interface CartItem {
//   product: Product;
//   quantity: number;
// }

// export class CartAggregate extends AggregateRoot<string> {
//   private items: CartItem[] = [];
//   private readonly availableSpec = new ProductAvailableSpec();

//   private constructor(id: string) {
//     super(id);
//   }

//   /**
//    * Create empty cart - O(1)
//    */
//   static create(userId: string): CartAggregate {
//     return new CartAggregate(userId || "anonymous");
//   }

//   /**
//    * Restore cart from saved items - O(n)
//    */
//   static restore(id: string, items: CartItem[]): CartAggregate {
//     const cart = new CartAggregate(id);
//     cart.items = [...items];
//     return cart;
//   }

//   // ============================================
//   // CART OPERATIONS
//   // ============================================

//   /**
//    * Add item to cart - O(n) worst case (find existing)
//    * Can be O(1) if we use Map<ProductId, quantity>
//    */
//   addItem(product: Product, quantity: number = 1): void {
//     // Validate product is available
//     if (!this.availableSpec.isSatisfiedBy(product)) {
//       throw new BusinessRuleViolationError(
//         `Product "${product.name}" is not available`
//       );
//     }

//     // Check max cart size
//     if (this.items.length >= 20 && !this.hasItem(product.id)) {
//       throw new BusinessRuleViolationError("Cart is full (max 20 items)");
//     }

//     // Check stock
//     const existing = this.items.find(i => i.product.id === product.id);
//     const totalQty = (existing?.quantity || 0) + quantity;

//     if (totalQty > product.stock) {
//       throw new BusinessRuleViolationError(
//         `Only ${product.stock} units available`
//       );
//     }

//     if (totalQty > 10) {
//       throw new BusinessRuleViolationError("Maximum 10 units per product");
//     }

//     if (existing) {
//       existing.quantity = totalQty;
//     } else {
//       this.items.push({ product, quantity });
//     }
//   }

//   /**
//    * Update item quantity - O(n)
//    */
//   updateQuantity(productId: string, quantity: number): void {
//     if (quantity <= 0) {
//       this.removeItem(productId);
//       return;
//     }

//     const item = this.items.find(i => i.product.id === productId);
//     if (!item) throw new BusinessRuleViolationError("Item not in cart");

//     if (quantity > item.product.stock) {
//       throw new BusinessRuleViolationError(
//         `Only ${item.product.stock} units available`
//       );
//     }

//     item.quantity = quantity;
//   }

//   /**
//    * Remove item - O(n)
//    */
//   removeItem(productId: string): void {
//     const index = this.items.findIndex(i => i.product.id === productId);
//     if (index === -1) throw new BusinessRuleViolationError("Item not in cart");
//     this.items.splice(index, 1);
//   }

//   /**
//    * Check if product is in cart - O(n)
//    */
//   hasItem(productId: string): boolean {
//     return this.items.some(i => i.product.id === productId);
//   }

//   /**
//    * Clear cart - O(1)
//    */
//   clear(): void {
//     this.items = [];
//   }

//   // ============================================
//   // COMPUTED VALUES
//   // ============================================

//   get itemCount(): number {
//     return this.items.length;
//   }

//   get totalQuantity(): number {
//     return this.items.reduce((sum, i) => sum + i.quantity, 0);
//   }

//   get subtotal(): Money {
//     if (this.items.length === 0) return Money.zero(Money.PKR);
    
//     return this.items
//       .map(i => i.product.price.multiply(i.quantity))
//       .reduce((sum, price) => sum.add(price), Money.zero(Money.PKR));
//   }

//   get isEmpty(): boolean {
//     return this.items.length === 0;
//   }

//   get cartItems(): ReadonlyArray<CartItem> {
//     return [...this.items];
//   }

//   // ============================================
//   // VALIDATION
//   // ============================================

//   /**
//    * Validate cart is ready for checkout - O(n)
//    * Re-checks all products are still available
//    */
//   validateForCheckout(): void {
//     if (this.isEmpty) {
//       throw new BusinessRuleViolationError("Cart is empty");
//     }

//     for (const item of this.items) {
//       if (!this.availableSpec.isSatisfiedBy(item.product)) {
//         throw new BusinessRuleViolationError(
//           `"${item.product.name}" is no longer available`
//         );
//       }

//       if (!item.product.hasEnoughStock(item.quantity)) {
//         throw new BusinessRuleViolationError(
//           `Insufficient stock for "${item.product.name}": ` +
//           `requested ${item.quantity}, available ${item.product.stock}`
//         );
//       }
//     }
//   }

//   /**
//    * Convert to order items format
//    * O(n)
//    */
//   toOrderItems(): Array<{ productId: string; quantity: number }> {
//     return this.items.map(i => ({
//       productId: i.product.id,
//       quantity: i.quantity,
//     }));
//   }

//   public toPrimitives(): Record<string, unknown> {
//     return {
//       id: this.id,
//       items: this.items.map(i => ({
//         productId: i.product.id,
//         productName: i.product.name,
//         slug: i.product.slug,
//         price: i.product.price.amount,
//         image: i.product.primaryImage,
//         quantity: i.quantity,
//         stock: i.product.stock,
//       })),
//       totalItems: this.itemCount,
//       totalQuantity: this.totalQuantity,
//       subtotal: this.subtotal.amount,
//     };
//   }
// }