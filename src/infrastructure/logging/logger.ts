/**
 * Structured Logger - Production Observability
 * 
 * Google Cloud Logging / Vercel Logs compatible JSON format.
 * 
 * Features:
 * - JSON structured output (parsable by log aggregators)
 * - Request tracing via requestId
 * - Performance timing
 * - Error stack traces (dev only)
 * - Circular reference safe
 * 
 * Integration options:
 * - Vercel: Automatic log capture
 * - Axiom: forwardLogs() for full-text search
 * - Datadog: Forward to Datadog API
 * - Sentry: Error logs forward to Sentry
 */

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

interface LogEntry {
  severity: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  duration?: number;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
  sourceLocation?: {
    file: string;
    line: number;
    function: string;
  };
}

// Circular reference safe JSON stringifier
function safeStringify(obj: unknown, maxDepth: number = 5): string {
  const seen = new WeakSet();
  
  return JSON.stringify(obj, function(this: any, key: string, value: unknown) {
    if (this && typeof this === "object" && key && key.length > 0) {
      const depth = (this.__depth || 0) + 1;
      if (depth > maxDepth) return "[Max Depth]";
      (value as any).__depth = depth;
    }
    
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[Circular]";
      seen.add(value);
    }
    
    return value;
  });
}

function createLogEntry(
  severity: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: Error
): LogEntry {
  const entry: LogEntry = {
    severity,
    message,
    timestamp: new Date().toISOString(),
    ...(context && { context }),
  };

  if (error) {
    entry.error = {
      name: error.name,
      message: error.message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      ...((error as any).code && { code: (error as any).code }),
    };
  }

  // Source location in development
  if (process.env.NODE_ENV === "development") {
    const stack = new Error().stack?.split("\n")[3];
    if (stack) {
      const match = stack.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
      if (match) {
        entry.sourceLocation = {
          function: match[1],
          file: match[2],
          line: parseInt(match[3]),
        };
      }
    }
  }

  return entry;
}

function log(entry: LogEntry): void {
  const output = safeStringify(entry);

  switch (entry.severity) {
    case "debug":
      console.debug(output);
      break;
    case "info":
      console.info(output);
      break;
    case "warn":
      console.warn(output);
      break;
    case "error":
    case "fatal":
      console.error(output);
      break;
  }
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === "development") {
      log(createLogEntry("debug", message, context));
    }
  },

  info: (message: string, context?: Record<string, unknown>) => {
    log(createLogEntry("info", message, context));
  },

  warn: (message: string, context?: Record<string, unknown>) => {
    log(createLogEntry("warn", message, context));
  },

  error: (message: string, error?: Error, context?: Record<string, unknown>) => {
    log(createLogEntry("error", message, context, error));
  },

  fatal: (message: string, error?: Error, context?: Record<string, unknown>) => {
    log(createLogEntry("fatal", message, context, error));
  },

  /**
   * Create a request-scoped logger with request ID
   */
  child: (requestId: string) => ({
    info: (message: string, context?: Record<string, unknown>) =>
      logger.info(message, { ...context, requestId }),
    warn: (message: string, context?: Record<string, unknown>) =>
      logger.warn(message, { ...context, requestId }),
    error: (message: string, error?: Error, context?: Record<string, unknown>) =>
      logger.error(message, error, { ...context, requestId }),
  }),

  /**
   * Time an operation
   */
  time: async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      logger.debug(`${label} completed`, {
        duration: Math.round(performance.now() - start),
      });
    }
  },
};