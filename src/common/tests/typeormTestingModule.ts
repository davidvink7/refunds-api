import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeOrmSQLITETestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    entities: [],
    dropSchema: true,
    synchronize: true,
    logging: false,
  }),
];

export const TypeOrmMySQLTestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'nf@1pswd',
    database: 'tegra_test',
    synchronize: false,
    entities: [],
  }),
];
