import config from '../config/environment';

type LogFunction = (...args: any[]) => void;

interface Logger {
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;
  ai: LogFunction;
  location: LogFunction;
  places: LogFunction;
  cache: LogFunction;
  performance: LogFunction;
}

/**
 * Centralized logging utility that respects debug configuration
 */
export const logger: Logger = {
  debug: (...args) => {
    if (config.ENABLE_DEBUG_LOGS) {
      console.log(...args);
    }
  },
  
  info: (...args) => {
    if (config.ENABLE_DEBUG_LOGS) {
      console.info(...args);
    }
  },
  
  warn: (...args) => {
    console.warn(...args);
  },
  
  error: (...args) => {
    console.error(...args);
  },
  
  // Special logging for specific contexts
  ai: (...args) => {
    if (config.ENABLE_DEBUG_LOGS) {
      console.log('🤖', ...args);
    }
  },
  
  location: (...args) => {
    if (config.ENABLE_DEBUG_LOGS) {
      console.log('📍', ...args);
    }
  },
  
  places: (...args) => {
    if (config.ENABLE_DEBUG_LOGS) {
      console.log('🗺️', ...args);
    }
  },
  
  cache: (...args) => {
    if (config.ENABLE_DEBUG_LOGS) {
      console.log('📦', ...args);
    }
  },
  
  performance: (...args) => {
    if (config.ENABLE_DEBUG_LOGS) {
      console.log('⚡', ...args);
    }
  }
};

export default logger;