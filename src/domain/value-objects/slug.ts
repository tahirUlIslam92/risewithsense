import { ValueObject } from "@/shared/kernel/value-object";
import { ValidationError } from "@/shared/errors/app-error";

/**
 * Slug Value Object
 * 
 * URL-safe identifier for products and categories.
 * Self-validating, immutable, auto-generated from name.
 * 
 * Properties:
 * - Lowercase only
 * - Alphanumeric + hyphens
 * - No consecutive hyphens
 * - No leading/trailing hyphens
 * - Length: 3-200 characters
 * - Database-indexed for O(log n) lookup
 */

interface SlugProps {
  value: string;
}

export class Slug extends ValueObject<SlugProps> {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 200;
  private static readonly SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  private constructor(props: SlugProps) {
    super(props);
  }

  /**
   * Create Slug from existing string - validates format
   * O(n) where n = string length (regex check)
   */
  public static from(value: string): Slug {
    const normalized = value.toLowerCase().trim();
    return new Slug({ value: normalized });
  }

  /**
   * Create Slug from product name - auto-generates
   * O(n) where n = name length
   * 
   * Algorithm:
   * 1. Lowercase
   * 2. Replace non-alphanumeric with hyphens
   * 3. Collapse consecutive hyphens
   * 4. Remove leading/trailing hyphens
   */
  public static fromName(name: string): Slug {
    let slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")      // Remove special chars
      .replace(/[\s_]+/g, "-")        // Replace spaces with hyphens
      .replace(/-+/g, "-")            // Collapse multiple hyphens
      .replace(/^-+|-+$/g, "");       // Remove leading/trailing hyphens

    // Ensure minimum length
    if (slug.length < Slug.MIN_LENGTH) {
      slug = slug.padEnd(Slug.MIN_LENGTH, "0");
    }

    // Truncate to max length
    if (slug.length > Slug.MAX_LENGTH) {
      slug = slug.substring(0, Slug.MAX_LENGTH).replace(/-+$/, "");
    }

    return new Slug({ value: slug });
  }

  /**
   * Generate unique slug with suffix if needed
   * O(1) - just appends random suffix
   */
  public static fromNameWithSuffix(name: string, suffix: string): Slug {
    const base = Slug.fromName(name);
    const combined = `${base.value}-${suffix}`;
    return Slug.from(combined.substring(0, Slug.MAX_LENGTH));
  }

  /**
   * Get the slug string value
   * O(1)
   */
  get value(): string {
    return this._props.value;
  }

  /**
   * Check if slug matches a pattern
   * O(n) where n = min(slug.length, pattern.length)
   */
  public matches(pattern: string): boolean {
    return this._props.value.includes(pattern.toLowerCase());
  }

  /**
   * Concatenate with another string for sub-slugs
   * O(n) where n = combined length
   */
  public concat(suffix: string): Slug {
    return Slug.from(`${this._props.value}-${suffix}`);
  }

  /**
   * Validation - called on construction
   * O(n) where n = string length
   */
  protected validate(): void {
    const { value } = this._props;

    if (!value || value.trim().length === 0) {
      throw new ValidationError("Slug cannot be empty");
    }

    if (value.length < Slug.MIN_LENGTH) {
      throw new ValidationError(
        `Slug must be at least ${Slug.MIN_LENGTH} characters, got ${value.length}`
      );
    }

    if (value.length > Slug.MAX_LENGTH) {
      throw new ValidationError(
        `Slug must be at most ${Slug.MAX_LENGTH} characters, got ${value.length}`
      );
    }

    if (!Slug.SLUG_REGEX.test(value)) {
      throw new ValidationError(
        `Invalid slug format: "${value}". Use lowercase letters, numbers, and single hyphens only.`
      );
    }

    // No consecutive hyphens
    if (value.includes("--")) {
      throw new ValidationError("Slug cannot contain consecutive hyphens");
    }
  }

  public toString(): string {
    return this._props.value;
  }
}