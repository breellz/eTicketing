import { DataSource } from "typeorm";
import * as path from "path";



const databaseUrl = () => {
  switch (process.env.NODE_ENV) {
    case "test":
      return process.env.TEST_DATABASE_URL || "";
    case "development":
      return process.env.DEV_DATABASE_URL || "";
    default:
      return process.env.DEV_DATABASE_URL || "";
  }
}

const datasource = new DataSource({
  type: "postgres",
  url: databaseUrl(),
  ssl: { rejectUnauthorized: false },
  entities: [path.join(__dirname, '../entities/**/*.entity{.ts,.js}')],
  synchronize: false,
  migrations: [
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '../migrations/*.js')
      : path.join(__dirname, '../migrations/*.ts'),
  ],
  migrationsRun: true,
});


export const disconnect = async (datasource: DataSource) => {
  await datasource.destroy();
}

export default datasource