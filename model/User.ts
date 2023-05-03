import {
    DataTypes, Model, InferAttributes, InferCreationAttributes,
    CreationOptional, NonAttribute, Association,
    BelongsToManyCreateAssociationMixin,
    BelongsToManyAddAssociationMixin
} from 'sequelize'
import { sequelizeConnection } from '../databaseConfig'
import { Role } from './Role'

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare email: string;
    declare password: string;
    declare roles?: NonAttribute<Role[]>;
    declare approved: boolean;

    declare static associations: {
        roles: Association<User, Role>;
    };

    declare createRole: BelongsToManyCreateAssociationMixin<Role>;
    declare addRole: BelongsToManyAddAssociationMixin<Role, 'user_role'>;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(320),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        approved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    },
    {
        tableName: 'users',
        timestamps: true,
        sequelize: sequelizeConnection
    }
);

User.belongsToMany(Role, { through: 'user_role', as: 'roles' });
Role.belongsToMany(User, { through: 'user_role', as: 'users' });