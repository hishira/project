import { LoggerService, LogContext } from './logger.service';

/**
 * Decorator to automatically log method calls
 */
export function LogMethodCall(context?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const logger = new LoggerService();
      const className = target.constructor.name;
      const methodName = propertyName;
      const logContext: LogContext = {
        module: className,
        action: methodName,
        ...(context && { context })
      };

      logger.logDebug(`Calling method: ${className}.${methodName}`, logContext);

      try {
        const result = method.apply(this, args);

        // Handle both synchronous and asynchronous methods
        if (result instanceof Promise) {
          return result
            .then((res) => {
              logger.logDebug(`Method ${className}.${methodName} completed successfully`, logContext);
              return res;
            })
            .catch((error) => {
              logger.logError(`Method ${className}.${methodName} failed`, error, logContext);
              throw error;
            });
        } else {
          logger.logDebug(`Method ${className}.${methodName} completed successfully`, logContext);
          return result;
        }
      } catch (error) {
        logger.logError(`Method ${className}.${methodName} failed`, error as Error, logContext);
        throw error;
      }
    };
  };
}

/**
 * Decorator to log user actions
 */
export function LogUserAction(actionName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const logger = new LoggerService();
      const className = target.constructor.name;
      const methodName = propertyName;
      const action = actionName || `${className}.${methodName}`;

      // Try to extract user ID from various sources
      let userId: string | undefined;
      
      // Look for user in request object (first argument is often request)
      if (args[0] && args[0].user) {
        userId = args[0].user.id || args[0].user.sub;
      }
      
      // Look for user ID in method arguments
      if (!userId) {
        const userIdArg = args.find(arg => 
          typeof arg === 'object' && arg && (arg.userId || arg.id)
        );
        userId = userIdArg?.userId || userIdArg?.id;
      }

      if (userId) {
        logger.logUserAction(action, userId, {
          module: className,
          method: methodName
        });
      }

      return method.apply(this, args);
    };
  };
}

/**
 * Decorator to log performance of methods
 */
export function LogPerformance(operationName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const logger = new LoggerService();
      const className = target.constructor.name;
      const methodName = propertyName;
      const operation = operationName || `${className}.${methodName}`;
      const startTime = Date.now();

      try {
        const result = method.apply(this, args);

        // Handle both synchronous and asynchronous methods
        if (result instanceof Promise) {
          return result.finally(() => {
            const duration = Date.now() - startTime;
            logger.logPerformance(operation, duration, {
              module: className,
              method: methodName
            });
          });
        } else {
          const duration = Date.now() - startTime;
          logger.logPerformance(operation, duration, {
            module: className,
            method: methodName
          });
          return result;
        }
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.logPerformance(`${operation} (failed)`, duration, {
          module: className,
          method: methodName,
          error: true
        });
        throw error;
      }
    };
  };
}
