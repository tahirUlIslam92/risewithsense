// import { Entity } from "@/shared/kernel/entity";
// import { Slug } from "@/domain/value-objects/slug";
// import { Money } from "@/domain/value-objects/money";
// import { ProductStatus } from "@/domain/enums/product-status.enum";
// import { WatchType, Gender } from "@/shared/types";
// import { ValidationError, BusinessRuleViolationError } from "@/shared/errors/app-error";

// /**
//  * Product Entity
//  * 
//  * Core domain entity representing a watch product.
//  * Encapsulates all product-related business rules.
//  * 
//  * Invariants:
//  * 1. Price must be greater than cost price
//  * 2. Stock cannot be negative
//  * 3. Name must be 3-200 characters
//  * 4. Published products must have at least one image
//  * 5. Slug must be unique (enforced by repository)
//  */

// interface ProductProps {
//   id: string;
//   name: string;
//   slug: Slug;
//   brand: string;
//   type: WatchType;
//   price: Money;
//   costPrice: Money;
//   stock: number;
//   description: string;
//   images: string[];
//   status: ProductStatus;
//   featured: boolean;
//   gender: Gender | null;
//   caseSize: string | null;
//   waterResistance: string | null;
//   categoryId: string | null;
//   categoryName?: string | null;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export class Product extends Entity<string> {
//   private props: ProductProps;

//   constructor(props: ProductProps) {
//     super(props.id);
//     this.props = props;
//     this.validateInvariants();
//   }

//   // ============================================
//   // GETTERS
//   // ============================================

//   get name(): string { return this.props.name; }
//   get slug(): string { return this.props.slug.value; }
//   get brand(): string { return this.props.brand; }
//   get type(): WatchType { return this.props.type; }
//   get price(): Money { return this.props.price; }
//   get costPrice(): Money { return this.props.costPrice; }
//   get stock(): number { return this.props.stock; }
//   get description(): string { return this.props.description; }
//   get images(): string[] { return [...this.props.images]; }
//   get status(): ProductStatus { return this.props.status; }
//   get featured(): boolean { return this.props.featured; }
//   get gender(): Gender | null { return this.props.gender; }
//   get caseSize(): string | null { return this.props.caseSize; }
//   get waterResistance(): string | null { return this.props.waterResistance; }
//   get categoryId(): string | null { return this.props.categoryId; }
//   get categoryName(): string | null { return this.props.categoryName ?? null; }
//   get createdAt(): Date { return this.props.createdAt; }
//   get updatedAt(): Date { return this.props.updatedAt; }

//   // Computed properties
//   get isPublished(): boolean { return this.props.status === ProductStatus.PUBLISHED; }
//   get isDraft(): boolean { return this.props.status === ProductStatus.DRAFT; }
//   get isArchived(): boolean { return this.props.status === ProductStatus.ARCHIVED; }
  
//   get profitMargin(): number {
//     if (this.props.price.isZero()) return 0;
//     return ((this.props.price.amount - this.props.costPrice.amount) / this.props.price.amount) * 100;
//   }

//   get primaryImage(): string | null {
//     return this.props.images[0] ?? null;
//   }

//   // ============================================
//   // DOMAIN BEHAVIORS
//   // ============================================

//   /**
//    * Check if product can fulfill an order
//    * O(1)
//    */
//   public isInStock(): boolean {
//     return this.props.stock > 0;
//   }

//   public hasEnoughStock(quantity: number): boolean {
//     return this.props.stock >= quantity;
//   }

//   /**
//    * Update price with validation
//    * O(1)
//    */
//   public updatePrice(newPrice: Money): void {
//     if (newPrice.currency !== Money.PKR) {
//       throw new BusinessRuleViolationError("Prices must be in PKR");
//     }
//     if (newPrice.lessThanOrEqual(this.props.costPrice)) {
//       throw new BusinessRuleViolationError(
//         `Selling price (${newPrice.formatPKR()}) must be greater than cost price (${this.props.costPrice.formatPKR()})`
//       );
//     }
//     this.props.price = newPrice;
//     this.props.updatedAt = new Date();
//   }

//   /**
//    * Update stock - handles both addition and removal
//    * O(1)
//    */
//   public addStock(quantity: number): void {
//     if (quantity <= 0) throw new ValidationError("Quantity must be positive");
//     this.props.stock += quantity;
//     this.props.updatedAt = new Date();
//   }

//   public removeStock(quantity: number): void {
//     if (quantity <= 0) throw new ValidationError("Quantity must be positive");
//     if (quantity > this.props.stock) {
//       throw new InsufficientStockError(this.props.id, quantity, this.props.stock);
//     }
//     this.props.stock -= quantity;
//     this.props.updatedAt = new Date();
//   }

//   /**
//    * Publish product
//    * Must have at least one image to publish
//    */
//   public publish(): void {
//     if (this.props.images.length === 0) {
//       throw new BusinessRuleViolationError("Cannot publish product without images");
//     }
//     this.props.status = ProductStatus.PUBLISHED;
//     this.props.updatedAt = new Date();
//   }

//   public archive(): void {
//     this.props.status = ProductStatus.ARCHIVED;
//     this.props.updatedAt = new Date();
//   }

//   public markAsFeatured(): void {
//     this.props.featured = true;
//     this.props.updatedAt = new Date();
//   }

//   public unmarkFeatured(): void {
//     this.props.featured = false;
//     this.props.updatedAt = new Date();
//   }

//   public updateDescription(description: string): void {
//     if (description.length < 10) {
//       throw new ValidationError("Description must be at least 10 characters");
//     }
//     this.props.description = description;
//     this.props.updatedAt = new Date();
//   }

//   /**
//    * Add image to product
//    * O(1) - array push
//    */
//   public addImage(url: string): void {
//     if (this.props.images.length >= 10) {
//       throw new BusinessRuleViolationError("Maximum 10 images per product");
//     }
//     this.props.images.push(url);
//     this.props.updatedAt = new Date();
//   }

//   public removeImage(index: number): void {
//     if (index < 0 || index >= this.props.images.length) {
//       throw new ValidationError("Invalid image index");
//     }
//     this.props.images.splice(index, 1);
//     this.props.updatedAt = new Date();
//   }

//   // ============================================
//   // VALIDATION
//   // ============================================

//   private validateInvariants(): void {
//     if (!this.props.name || this.props.name.length < 3) {
//       throw new ValidationError("Product name must be at least 3 characters");
//     }
//     if (this.props.name.length > 200) {
//       throw new ValidationError("Product name must be at most 200 characters");
//     }
//     if (!this.props.brand || this.props.brand.length < 2) {
//       throw new ValidationError("Brand name must be at least 2 characters");
//     }
//     if (this.props.price.lessThanOrEqual(this.props.costPrice)) {
//       throw new BusinessRuleViolationError("Price must be greater than cost price");
//     }
//     if (this.props.stock < 0) {
//       throw new ValidationError("Stock cannot be negative");
//     }
//   }

//   // ============================================
//   // SERIALIZATION
//   // ============================================

//   public toPrimitives(): Record<string, unknown> {
//     return {
//       id: this.props.id,
//       name: this.props.name,
//       slug: this.props.slug.value,
//       brand: this.props.brand,
//       type: this.props.type,
//       price: this.props.price.amount,
//       costPrice: this.props.costPrice.amount,
//       stock: this.props.stock,
//       description: this.props.description,
//       images: this.props.images,
//       status: this.props.status,
//       featured: this.props.featured,
//       gender: this.props.gender,
//       caseSize: this.props.caseSize,
//       waterResistance: this.props.waterResistance,
//       categoryId: this.props.categoryId,
//       categoryName: this.props.categoryName,
//       createdAt: this.props.createdAt,
//       updatedAt: this.props.updatedAt,
//     };
//   }
// }

// // Import needed for error
// import { InsufficientStockError } from "@/shared/errors/app-error";