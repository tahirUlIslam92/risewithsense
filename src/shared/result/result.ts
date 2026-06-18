/**
 * Result Monad - Railway-Oriented Programming
 * 
 * Encapsulates success or failure without throwing exceptions.
 * Forces callers to handle both cases explicitly.
 * 
 * Design Pattern: Monad / Railway-Oriented Programming
 * Time Complexity: O(1) for all operations
 * Space Complexity: O(1) - stores either value or error, never both
 * 
 * Inspiration: Rust's Result<T,E>, Haskell's Either
 * 
 * Usage:
 *   const result = Result.ok(user);
 *   result.map(u => u.name).orElse("Unknown");
 */

export class Result<T, E = Error> {
  private readonly _isSuccess: boolean;
  private readonly _value?: T;
  private readonly _error?: E;

  private constructor(isSuccess: boolean, value?: T, error?: E) {
    this._isSuccess = isSuccess;
    this._value = value;
    this._error = error;
  }

  // ============================================
  // FACTORY METHODS
  // ============================================

  /** Create a successful result - O(1) */
  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, value, undefined);
  }

  /** Create a failed result - O(1) */
  public static fail<U, E = Error>(error: E): Result<U, E> {
    return new Result<U, E>(false, undefined, error);
  }

  /**
   * Combine multiple results - returns first failure
   * O(n) where n = number of results
   * 
   * Use case: Validate multiple inputs, return first error
   */
  public static combine(results: Result<unknown>[]): Result<unknown> {
    for (const result of results) {
      if (result.isFailure()) return result;
    }
    return Result.ok();
  }

  /**
   * Combine results and collect all errors
   * O(n) where n = number of results
   * 
   * Use case: Validate all inputs, return all errors at once
   */
  public static combineAll(results: Result<unknown>[]): Result<unknown, Error[]> {
    const errors: Error[] = [];
    for (const result of results) {
      if (result.isFailure()) {
        errors.push(result.getError() as Error);
      }
    }
    return errors.length > 0 ? Result.fail(errors) : Result.ok();
  }

  // ============================================
  // TYPE GUARDS
  // ============================================

  public isSuccess(): boolean { return this._isSuccess; }
  public isFailure(): boolean { return !this._isSuccess; }

  // ============================================
  // VALUE EXTRACTION
  // ============================================

  /** Get value - throws if failure. Use after isSuccess() check. */
  public getValue(): T {
    if (!this._isSuccess) {
      throw new Error(`Cannot unwrap failed Result: ${String(this._error)}`);
    }
    return this._value!;
  }

  /** Get error - throws if success. Use after isFailure() check. */
  public getError(): E {
    if (this._isSuccess) {
      throw new Error("Cannot get error from successful Result");
    }
    return this._error!;
  }

  // ============================================
  // FUNCTIONAL TRANSFORMATIONS
  // ============================================

  /**
   * Map: Transform value if success
   * O(1) + O(fn)
   * 
   * Example: result.map(user => user.name)
   */
  public map<U>(fn: (value: T) => U): Result<U, E> {
    return this._isSuccess
      ? Result.ok(fn(this._value!))
      : Result.fail(this._error!);
  }

  /**
   * MapError: Transform error if failure
   * O(1) + O(fn)
   */
  public mapError<F>(fn: (error: E) => F): Result<T, F> {
    return this._isSuccess
      ? Result.ok(this._value!)
      : Result.fail(fn(this._error!));
  }

  /**
   * FlatMap/Bind: Chain operations returning Result
   * O(1) + O(fn)
   * 
   * Example: validateEmail().flatMap(saveToDatabase).flatMap(sendEmail)
   */
  public flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return this._isSuccess ? fn(this._value!) : Result.fail(this._error!);
  }

  /**
   * Fold/Cata: Pattern matching - handle both cases
   * O(1) + O(onSuccess|onFailure)
   */
  public fold<U>(onSuccess: (value: T) => U, onFailure: (error: E) => U): U {
    return this._isSuccess
      ? onSuccess(this._value!)
      : onFailure(this._error!);
  }

  /**
   * Or Else: Provide fallback value
   * O(1)
   */
  public orElse(defaultValue: T): T {
    return this._isSuccess ? this._value! : defaultValue;
  }

  /**
   * Or Else Get: Provide fallback via function
   * O(1) + O(fn)
   */
  public orElseGet(fn: (error: E) => T): T {
    return this._isSuccess ? this._value! : fn(this._error!);
  }

  // ============================================
  // SIDE EFFECTS
  // ============================================

  /**
   * Tap: Execute side effect without changing value
   * O(1) + O(fn)
   * 
   * Useful for logging, metrics, etc.
   */
  public tap(fn: (value: T) => void): Result<T, E> {
    if (this._isSuccess) fn(this._value!);
    return this;
  }

  /**
   * TapError: Execute side effect on error
   * O(1) + O(fn)
   */
  public tapError(fn: (error: E) => void): Result<T, E> {
    if (!this._isSuccess) fn(this._error!);
    return this;
  }

  // ============================================
  // ASYNC SUPPORT
  // ============================================

  /**
   * Async Map: Transform with async function
   * O(1) + O(fn) + Promise overhead
   */
  public async asyncMap<U>(fn: (value: T) => Promise<U>): Promise<Result<U, E>> {
    if (this._isSuccess) {
      try {
        return Result.ok(await fn(this._value!));
      } catch (error) {
        return Result.fail(error as E);
      }
    }
    return Result.fail(this._error!);
  }

  /**
   * Async FlatMap: Chain with async function
   * O(1) + O(fn) + Promise overhead
   */
  public async asyncFlatMap<U>(
    fn: (value: T) => Promise<Result<U, E>>
  ): Promise<Result<U, E>> {
    if (this._isSuccess) {
      try {
        return await fn(this._value!);
      } catch (error) {
        return Result.fail(error as E);
      }
    }
    return Result.fail(this._error!);
  }

  // ============================================
  // SERIALIZATION
  // ============================================

  public toJSON(): { success: boolean; value?: T; error?: E } {
    return this._isSuccess
      ? { success: true, value: this._value }
      : { success: false, error: this._error };
  }

  public toString(): string {
    return this._isSuccess
      ? `Success(${String(this._value)})`
      : `Failure(${String(this._error)})`;
  }
}