import mongoose from "mongoose";
import { logger } from "../config";
import { getDatabaseConfig } from "./config/database.config";

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;
  private connectionAttempts: number = 0;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private setupEventListeners(): void {
    mongoose.connection.on("connected", () => {
      this.isConnected = true;
      logger.info("✅ MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      this.isConnected = false;
      logger.error({ err }, "❌ MongoDB connection error");
    });

    mongoose.connection.on("disconnected", () => {
      this.isConnected = false;
      logger.warn("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      this.isConnected = true;
      logger.info("🔄 MongoDB reconnected");
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  public async connect(mongoUri: string): Promise<void> {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      logger.info("Database already connected");
      return;
    }

    const config = getDatabaseConfig(mongoUri);

    try {
      await mongoose.connect(config.uri, config.options);
      this.connectionAttempts = 0;
    } catch (error) {
      this.connectionAttempts++;
      logger.error(
        { error, attempt: this.connectionAttempts },
        `Failed to connect to MongoDB (Attempt ${this.connectionAttempts}/${config.retryAttempts})`
      );

      if (this.connectionAttempts < config.retryAttempts) {
        logger.info(
          `Retrying connection in ${config.retryDelay / 1000} seconds...`
        );
        await this.delay(config.retryDelay);
        return this.connect(mongoUri);
      } else {
        logger.error(
          `Failed to connect to MongoDB after ${config.retryAttempts} attempts`
        );
        throw new Error("Database connection failed");
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info("🔌 MongoDB disconnected gracefully");
    }
  }

  public getConnectionState(): number {
    return mongoose.connection.readyState;
  }

  public isDbConnected(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const dbConnection = DatabaseConnection.getInstance();
