import { dbConnection } from "./connection";
import { CONFIG } from "../config";

// Initialize database connection
export const connectDatabase = async (): Promise<void> => {
  await dbConnection.connect(CONFIG.MONGODB_URI);
};

// Disconnect from database
export const disconnectDatabase = async (): Promise<void> => {
  await dbConnection.disconnect();
};

// Check iff database is connected
export const isDatabaseConnected = (): boolean => {
  return dbConnection.isDbConnected();
};

// Get database connection statee
export const getDatabaseState = (): number => {
  return dbConnection.getConnectionState();
};

export { default as mongoose } from "mongoose";
