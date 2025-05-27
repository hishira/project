import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

const config: DataSourceOptions = {
  type: 'sqlite',
  database: join(process.cwd(), 'database.sqlite'),
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  synchronize: false, // For migrations
  logging: process.env.NODE_ENV === 'development',
};

export default new DataSource(config);
