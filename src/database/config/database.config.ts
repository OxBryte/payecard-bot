import { ConnectOptions } from "mongoose";

export interface DatabaseConfig {
  uri: string;
  options: ConnectOptions;
  retryAttempts: number;
  retryDelay: number;
}

export const getDatabaseConfig = (mongoUri: string): DatabaseConfig => {
  return {
    uri: mongoUri,
    options: {
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2, // Minimum number of connections in the pool
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000, // Socket timeout
      family: 4, // Use IPv4, skip trying IPv6
      maxIdleTimeMS: 10000, // Close connections that have been idle for 10 seconds
      retryWrites: true, // Automatically retry write operations
      retryReads: true, // Automatically retry read operations
    },
    retryAttempts: 5,
    retryDelay: 5000, // 5 seconds
  };
};
