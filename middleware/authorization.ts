import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../model/User';
import { Role } from '../model/Role';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    let token: string = typeof req.headers['x-access-token'] == 'string' ? req.headers['x-access-token'] : '';

    if (!token) {
        return res.status(403).json({ message: "No token found" });
    }

    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized." });
        } else if (typeof decoded == 'undefined') {
            return res.status(500).json({ message: "Failed to decode token" });
        }
        if (typeof decoded == "string") {
            return res.status(500).json({ message: "Failed to decode token, got: " + decoded });
        } else {
            User.findOne({ where: { id: decoded.id }, include: { model: Role, as: 'roles' }, raw: false, nest: false }).then(user => {
                if (user != null) {
                    res.locals.user = {
                        email: user.email,
                        roles: user.roles === undefined ? [] : user.roles.map(role => {
                            return role.name
                        })
                    }
                    return next();
                } else {
                    return res.status(401).json({ message: "Unauthorized" });
                }
            }).catch(error => {
                return res.status(500).json({ message: "Failed to decode token, error: " + error });
            });
        }
    });
}

export const verifyRoles = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            for (let i = 0; i < res.locals.user.roles.length; i++) {
                if (roles.includes(res.locals.user.roles[i])) {
                    return next();
                }
            }
            return res.status(403).json({ message: "Admin role required!" });
        } catch (error) {
            return res.status(500).json({ message: "Internal error", error: error });
        }
    }
}
