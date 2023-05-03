import { Sequelize } from 'sequelize'

const dbName = 'api';
const dbUser = 'cubeseed';
const dbHost = '172.17.0.2';
const dbDriver = 'postgres';
const dbPassword = 'cubeseedsecret';

export const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDriver,
});
