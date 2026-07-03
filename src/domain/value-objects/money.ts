// import { ValueObject } from "@/shared/kernel/value-object";
// import { ValidationError } from "@/shared/errors/app-error";

// /**
//  * Money Value Object
//  * 
//  * Immutable representation of monetary value.
//  * Always carries currency to prevent conversion errors.
//  * 
//  * Design: Whole-value pattern - no floating point arithmetic
//  * All calculations use integer cents internally.
//  * 
//  * Why not just number?
//  * - Prevents currency confusion
//  * - Avoids floating point errors (0.1 + 0.2 !== 0.3)
//  * - Self-validating (no negative money)
//  * - Type-safe operations (cannot add USD to PKR)
//  */

// interface MoneyProps {
//   amountInCents: number; // Store as integer cents to avoid floating point
//   currency: string;
// }

// export class Money extends ValueObject<MoneyProps> {
//   // Major currencies supported
//   static readonly PKR = "PKR";
//   static readonly USD = "USD";
//   static readonly EUR = "EUR";
//   static readonly GBP = "GBP";

//   private constructor(props: MoneyProps) {
//     super(props);
//   }

//   // ============================================
//   // FACTORY METHODS
//   // ============================================

//   /**
//    * Create from major units (e.g., 150.00 for Rs. 150)
//    * O(1)
//    */
//   public static fromAmount(amount: number, currency: string): Money {
//     return new Money({
//       amountInCents: Math.round(amount * 100),
//       currency: currency.toUpperCase(),
//     });
//   }

//   /**
//    * Create from minor units (cents/paisa)
//    * O(1)
//    */
//   public static fromCents(cents: number, currency: string): Money {
//     return new Money({
//       amountInCents: Math.round(cents),
//       currency: currency.toUpperCase(),
//     });
//   }

//   /**
//    * Zero money in specified currency
//    * O(1)
//    */
//   public static zero(currency: string): Money {
//     return new Money({ amountInCents: 0, currency: currency.toUpperCase() });
//   }

//   /**
//    * Pakistani Rupees - convenience factory
//    * O(1)
//    */
//   public static pkr(amount: number): Money {
//     return Money.fromAmount(amount, Money.PKR);
//   }

//   // ============================================
//   // ACCESSORS
//   // ============================================

//   /** Amount in major units (e.g., 150.00) */
//   get amount(): number {
//     return this._props.amountInCents / 100;
//   }

//   /** Amount in minor units (cents/paisa) */
//   get cents(): number {
//     return this._props.amountInCents;
//   }

//   get currency(): string {
//     return this._props.currency;
//   }

//   // ============================================
//   // IMMUTABLE OPERATIONS (return new Money)
//   // ============================================

//   /**
//    * Add money - O(1)
//    * Currency must match
//    */
//   public add(other: Money): Money {
//     this.validateSameCurrency(other);
//     return new Money({
//       amountInCents: this._props.amountInCents + other._props.amountInCents,
//       currency: this._props.currency,
//     });
//   }

//   /**
//    * Subtract money - O(1)
//    * Currency must match. Result clamped to zero if negative.
//    */
//   public subtract(other: Money): Money {
//     this.validateSameCurrency(other);
//     const result = this._props.amountInCents - other._props.amountInCents;
//     return new Money({
//       amountInCents: Math.max(0, result),
//       currency: this._props.currency,
//     });
//   }

//   /**
//    * Multiply by scalar - O(1)
//    * Useful for quantity * unit price
//    */
//   public multiply(factor: number): Money {
//     if (factor < 0) throw new ValidationError("Cannot multiply money by negative factor");
//     return new Money({
//       amountInCents: Math.round(this._props.amountInCents * factor),
//       currency: this._props.currency,
//     });
//   }

//   /**
//    * Calculate percentage (e.g., 10% discount)
//    * O(1)
//    */
//   public percentage(percent: number): Money {
//     return new Money({
//       amountInCents: Math.round((this._props.amountInCents * percent) / 100),
//       currency: this._props.currency,
//     });
//   }

//   /**
//    * Apply discount percentage - O(1)
//    */
//   public discount(percentOff: number): Money {
//     const discountAmount = this.percentage(percentOff);
//     return this.subtract(discountAmount);
//   }

//   // ============================================
//   // COMPARISONS
//   // ============================================

//   public greaterThan(other: Money): boolean {
//     this.validateSameCurrency(other);
//     return this._props.amountInCents > other._props.amountInCents;
//   }

//   public greaterThanOrEqual(other: Money): boolean {
//     this.validateSameCurrency(other);
//     return this._props.amountInCents >= other._props.amountInCents;
//   }

//   public lessThan(other: Money): boolean {
//     this.validateSameCurrency(other);
//     return this._props.amountInCents < other._props.amountInCents;
//   }

//   public lessThanOrEqual(other: Money): boolean {
//     this.validateSameCurrency(other);
//     return this._props.amountInCents <= other._props.amountInCents;
//   }

//   public equals(other: Money): boolean {
//     return this._props.amountInCents === other._props.amountInCents && 
//            this._props.currency === other._props.currency;
//   }

//   public isZero(): boolean {
//     return this._props.amountInCents === 0;
//   }

//   public isPositive(): boolean {
//     return this._props.amountInCents > 0;
//   }

//   // ============================================
//   // FORMATTING
//   // ============================================

//   /**
//    * Format with currency symbol
//    * O(1) - Intl API call
//    */
//   public format(locale: string = "ur-PK"): string {
//     return new Intl.NumberFormat(locale, {
//       style: "currency",
//       currency: this._props.currency,
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(this.amount);
//   }

//   /**
//    * Format Pakistani Rupees - O(1)
//    */
//   public formatPKR(): string {
//     return this.format("ur-PK");
//   }

//   // ============================================
//   // VALIDATION
//   // ============================================

//   private validateSameCurrency(other: Money): void {
//     if (this._props.currency !== other._props.currency) {
//       throw new ValidationError(
//         `Currency mismatch: ${this._props.currency} vs ${other._props.currency}`
//       );
//     }
//   }

//   protected validate(): void {
//     const { amountInCents, currency } = this._props;

//     if (amountInCents < 0) {
//       throw new ValidationError("Money amount cannot be negative");
//     }

//     if (!currency || currency.length !== 3) {
//       throw new ValidationError(`Invalid currency code: ${currency}`);
//     }

//     // Check for potential overflow (max safe integer in JS)
//     if (amountInCents > Number.MAX_SAFE_INTEGER) {
//       throw new ValidationError("Money amount too large");
//     }
//   }

//   public toString(): string {
//     return this.format();
//   }

//   public toJSON(): { amount: number; currency: string } {
//     return { amount: this.amount, currency: this._props.currency };
//   }
// }