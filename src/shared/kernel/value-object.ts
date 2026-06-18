/**
 * Base Value Object Class
 * 
 * Value Objects are immutable objects defined by their attributes.
 * Two value objects are equal if all their properties are equal.
 * 
 * Design Pattern: Value Object Pattern (DDD)
 * Time Complexity: O(n) for equality check where n = number of properties
 * Space Complexity: O(1) - immutable, can be shared freely
 * 
 * Key Properties:
 * 1. Immutable - state never changes after creation
 * 2. Equality by value - all properties compared, not identity
 * 3. Self-validating - invalid state impossible to create
 * 4. Replaceable - to change, create a new instance
 * 
 * @template T - The type of properties object
 */

export abstract class ValueObject<T extends Record<string, unknown>> {
  protected readonly _props: T;

  constructor(props: T) {
    this._props = Object.freeze({ ...props }); // Deep-freeze for immutability
    this.validate(); // Self-validating
  }

  /**
   * Get a copy of all properties (defensive copy)
   * O(n) where n = number of properties
   */
  get props(): Readonly<T> {
    return this._props;
  }

  /**
   * Structural equality - compares all properties
   * O(n) where n = number of properties
   * 
   * Uses JSON.stringify for deep comparison.
   * For performance-critical VO with many instances,
   * override with property-by-property comparison.
   */
  public equals(other: ValueObject<T>): boolean {
    if (other === this) return true;
    if (!(other instanceof ValueObject)) return false;
    if (other.constructor !== this.constructor) return false;
    return JSON.stringify(this._props) === JSON.stringify(other._props);
  }

  /**
   * Hash code based on all properties
   * O(n) where n = serialized properties length
   */
  public hashCode(): string {
    return `${this.constructor.name}:${JSON.stringify(this._props)}`;
  }

  public toString(): string {
    return `${this.constructor.name}(${JSON.stringify(this._props)})`;
  }

  /**
   * Cloning creates new instance (immutability preserved)
   * O(n) where n = number of properties
   */
  public clone(): this {
    const Constructor = this.constructor as new (props: T) => this;
    return new Constructor({ ...this._props });
  }

  /**
   * Validation hook - called in constructor
   * Override in subclass to add validation logic
   * Must throw if invalid
   */
  protected abstract validate(): void;
}