import { ConnectionOptions } from 'typeorm';

type LoggingOptionsType = {
  serviceName: string;
  folder: string;
  showLogLevel?: boolean;
  loggingTo: {
    cloudwatch: boolean;
    console: boolean;
  };
};

export interface ServerConfig {
  port: number;
  databaseConfig: ConnectionOptions;
  xApiKey: string;
  logging: LoggingOptionsType;
}

export const getConfig = (): ServerConfig => ({
  port: parseInt(process.env.APP_PORT, 10) || 3002,
  databaseConfig: {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: false, // needs to be false for production!
  },
  xApiKey: process.env.X_API_KEY,
  logging: {
    serviceName: process.env.SERVICE_NAME,
    folder: process.env.LOG_FOLDER,
    showLogLevel: process.env.LOG_SHOW_LOG_LEVEL !== 'false',
    loggingTo: {
      cloudwatch: process.env.LOG_TO_CLOUDWATCH === 'true',
      console: process.env.LOG_TO_CONSOLE === 'true',
    },
  },
});
