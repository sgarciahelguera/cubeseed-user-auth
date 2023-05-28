import { Sequelize, Dialect } from 'sequelize'

const port: string = process.env.PORT;
const dbName: string = process.env.DB_NAME;
const dbUser: string = process.env.DB_USER;
const dbHost: string = process.env.DB_HOST;
const dbDriver: Dialect = 'postgres';
const dbPassword: string = process.env.DB_PASSWORD;

export const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDriver,
});
