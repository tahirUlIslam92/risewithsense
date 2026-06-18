/**
 * Application Error Hierarchy
 * 
 * Typed errors for different failure scenarios.
 * Enables precise error handling without instanceof checks.
 * 
 * Design Pattern: Error Taxonomy
 * Time Complexity: O(1) for all constructors
 * Space Complexity: O(1) - fixed message + optional cause
 */

export enum ErrorCode {
  // General
  UNKNOWN = "UNKNOWN",
  
  // Validation (400)
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  INVALID_SLUG = "INVALID_SLUG",
  INVALID_EMAIL = "INVALID_EMAIL",
  INVALID_PRICE = "INVALID_PRICE",
  
  // Authentication (401)
  UNAUTHORIZED = "UNAUTHORIZED",
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  
  // Authorization (403)
  FORBIDDEN = "FORBIDDEN",
  NOT_ADMIN = "NOT_ADMIN",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  
  // Not Found (404)
  NOT_FOUND = "NOT_FOUND",
  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",
  ORDER_NOT_FOUND = "ORDER_NOT_FOUND",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  
  // Conflict (409)
  CONFLICT = "CONFLICT",
  SLUG_ALREADY_EXISTS = "SLUG_ALREADY_EXISTS",
  PRODUCT_ALREADY_EXISTS = "PRODUCT_ALREADY_EXISTS",
  
  // Business Logic (422)
  BUSINESS_RULE_VIOLATION = "BUSINESS_RULE_VIOLATION",
  INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",
  ORDER_ALREADY_SHIPPED = "ORDER_ALREADY_SHIPPED",
  CANNOT_CANCEL_SHIPPED_ORDER = "CANNOT_CANCEL_SHIPPED_ORDER",
  PRICE_BELOW_COST = "PRICE_BELOW_COST",
  
  // Rate Limiting (429)
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  
  // Server Error (500)
  INTERNAL_ERROR = "INTERNAL_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  SUPABASE_ERROR = "SUPABASE_ERROR",
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly cause?: Error;
  public readonly context?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message: string,
    options?: {
      statusCode?: number;
      cause?: Error;
      context?: Record<string, unknown>;
    }
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = options?.statusCode ?? this.defaultStatusCode(code);
    this.cause = options?.cause;
    this.context = options?.context;

    // Maintains proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  private defaultStatusCode(code: ErrorCode): number {
    if (code.startsWith("VALIDATION") || code.startsWith("INVALID_")) return 400;
    if (code.startsWith("UNAUTHORIZED") || code.startsWith("NOT_AUTHENTICATED")) return 401;
    if (code.startsWith("FORBIDDEN") || code.startsWith("NOT_ADMIN")) return 403;
    if (code.startsWith("NOT_FOUND")) return 404;
    if (code.startsWith("CONFLICT") || code.startsWith("ALREADY")) return 409;
    if (code.startsWith("BUSINESS") || code.startsWith("INSUFFICIENT") || code.startsWith("CANNOT")) return 422;
    if (code.startsWith("RATE_LIMIT")) return 429;
    return 500;
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      ...(process.env.NODE_ENV === "development" && { stack: this.stack }),
      ...(this.context && { context: this.context }),
    };
  }
}

// ============================================
// SPECIFIC ERROR CLASSES
// ============================================

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(ErrorCode.VALIDATION_ERROR, message, { statusCode: 400, context });
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string, id: string) {
    super(ErrorCode.NOT_FOUND, `${entity} not found: ${id}`, { statusCode: 404 });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required") {
    super(ErrorCode.UNAUTHORIZED, message, { statusCode: 401 });
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(ErrorCode.FORBIDDEN, message, { statusCode: 403 });
  }
}

export class InsufficientStockError extends AppError {
  constructor(productId: string, requested: number, available: number) {
    super(
      ErrorCode.INSUFFICIENT_STOCK,
      `Insufficient stock for product ${productId}: requested ${requested}, available ${available}`,
      {
        statusCode: 422,
        context: { productId, requested, available },
      }
    );
  }
}

export class BusinessRuleViolationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(ErrorCode.BUSINESS_RULE_VIOLATION, message, { statusCode: 422, context });
  }
}

export class SupabaseError extends AppError {
  constructor(message: string, cause?: Error, context?: Record<string, unknown>) {
    super(ErrorCode.SUPABASE_ERROR, message, { statusCode: 500, cause, context });
  }
}