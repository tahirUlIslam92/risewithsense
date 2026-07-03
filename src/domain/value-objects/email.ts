// import { ValueObject } from "@/shared/kernel/value-object";
// import { ValidationError } from "@/shared/errors/app-error";

// /**
//  * Email Value Object
//  * 
//  * Self-validating email address.
//  * RFC 5322 compliant validation.
//  * Case-insensitive storage (always lowercase).
//  * 
//  * Properties:
//  * - Valid email format
//  * - Normalized to lowercase
//  * - Maximum 254 characters (RFC 5321 limit)
//  * - Stripped of whitespace
//  */

// interface EmailProps {
//   value: string;
// }

// export class Email extends ValueObject<EmailProps> {
//   private static readonly MAX_LENGTH = 254;
//   private static readonly EMAIL_REGEX = 
//     /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

//   private constructor(props: EmailProps) {
//     super(props);
//   }

//   /**
//    * Create Email from string - validates and normalizes
//    * O(n) where n = string length (regex + toLowerCase)
//    */
//   public static from(value: string): Email {
//     const normalized = value.trim().toLowerCase();
//     return new Email({ value: normalized });
//   }

//   /**
//    * Get the email string
//    * O(1)
//    */
//   get value(): string {
//     return this._props.value;
//   }

//   /**
//    * Get the local part (before @)
//    * O(n) where n = email length (split)
//    */
//   get localPart(): string {
//     return this._props.value.split("@")[0];
//   }

//   /**
//    * Get the domain part (after @)
//    * O(n) where n = email length (split)
//    */
//   get domain(): string {
//     return this._props.value.split("@")[1];
//   }

//   /**
//    * Check if email belongs to a specific domain
//    * O(1) - string comparison
//    */
//   public hasDomain(domain: string): boolean {
//     return this.domain === domain.toLowerCase();
//   }

//   /**
//    * Masked version for privacy (e.g., "a***@gmail.com")
//    * O(1) - string slicing
//    */
//   public masked(): string {
//     const [local, domain] = this._props.value.split("@");
//     const maskedLocal = local.charAt(0) + "***";
//     return `${maskedLocal}@${domain}`;
//   }

//   protected validate(): void {
//     const { value } = this._props;

//     if (!value || value.trim().length === 0) {
//       throw new ValidationError("Email cannot be empty");
//     }

//     if (value.length > Email.MAX_LENGTH) {
//       throw new ValidationError(
//         `Email must be at most ${Email.MAX_LENGTH} characters`
//       );
//     }

//     if (!Email.EMAIL_REGEX.test(value)) {
//       throw new ValidationError(`Invalid email format: ${value}`);
//     }

//     // Check for common disposable domains (optional security)
//     const disposableDomains = ["tempmail.com", "guerrillamail.com", "10minutemail.com"];
//     const domain = value.split("@")[1];
//     if (disposableDomains.includes(domain)) {
//       throw new ValidationError("Disposable email addresses are not allowed");
//     }
//   }

//   public toString(): string {
//     return this._props.value;
//   }
// }