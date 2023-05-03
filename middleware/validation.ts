import { Request, Response, NextFunction } from 'express';
import { User } from '../model/User';
import { Role } from '../model/Role';
import { Op } from 'sequelize';

export const checkUserDoesntExist = async (req: Request, res: Response, next: NextFunction) => {
    User.findOne({
        where: {
            email: req.body.email,
        },
    }).then(user => {
        if (user) {
            return res.status(409).json({ message: "Email already registered." });
        }
        return next();
    }).catch(error => {
        return res.status(500).json({ message: "Failed to query database", error: error });
    });
}

export const checkRolesExist = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.roles) {
        Role.findAndCountAll({ where: { name: { [Op.or]: req.body.roles } } }).then(count => {
            if (count < req.body.roles.length) {
                return res.status(400).json({ message: "Invalid roles"});
            } else {
                return next();
            }
        }).catch(error => {
            return res.status(500).json({ message: "Internal error", error: error })
        });
    } else {
        return next(); // accept creating user without roles.
    }
}
