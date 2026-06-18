/**
 * Base Entity Class
 * 
 * Entities are objects with a distinct identity that persists through time.
 * Two entities are equal if their IDs are equal, not their properties.
 * 
 * Design Pattern: Identity Pattern
 * Time Complexity: O(1) all operations
 * Space Complexity: O(1) fixed size
 * 
 * @template T - The type of the entity's ID (typically string or number)
 */

export abstract class Entity<T> {
  protected readonly _id: T;

  constructor(id: T) {
    if (id === null || id === undefined) {
      throw new Error("Entity ID cannot be null or undefined");
    }
    this._id = id;
  }

  /**
   * Get the entity's unique identifier
   * O(1) - property access
   */
  get id(): T {
    return this._id;
  }

  /**
   * Equality check based on identity, not attributes
   * O(1) - single comparison
   * 
   * Two entities are equal if:
   * 1. They are the same reference, OR
   * 2. They are instances of the same class AND have the same ID
   */
  public equals(other: Entity<T>): boolean {
    if (other === this) return true;
    if (!(other instanceof Entity)) return false;
    return this._id === other._id;
  }

  /**
   * Hash code based on ID only (identity-based, not value-based)
   * O(1) - string hashing is O(k) where k = ID length, typically small
   */
  public hashCode(): string {
    return `Entity<${this.constructor.name}>:${String(this._id)}`;
  }

  /**
   * Human-readable representation
   * O(1)
   */
  public toString(): string {
    return `${this.constructor.name}[id=${String(this._id)}]`;
  }
}