import { Request, Response } from 'express';
import bcrypt, { hash } from 'bcrypt';
import { User } from '../model/User';
import { Role } from '../model/Role';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

// TODO: check the API dock to ask the Front End to hash it on the client side also 
// (hashing twice is fine, we prevent not only storing plain passwords but also putting them in the network).
export const signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const passwordHash = await hash(password, 10);
    try {
        let userRoles: Role[] = await Role.findAll({
            where: { name: { [Op.or]: req.body.roles }}
        });
        if (userRoles.length != req.body.roles.length) {
            res.status(400).json({ message: "Couldn't find given roles"});
        }
        User.create({
            email: email,
            password: passwordHash,
            approved: false,
        }).then(user => {
            userRoles.forEach(role => user.addRole(role));
            res.status(201).json({message: "User created OK."});
        }).catch(error => {
            res.status(500).json({ message: "Failed to create user", error: error });
        });
    } catch (error){
        res.status(500).json({ message: "Internal error", error: error });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user: User | null = await User.findOne({ where: { email: email, approved: true } });
    if (user != null) {
        const isSame = bcrypt.compareSync(password, user.password);
        if (isSame) {
            let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
                expiresIn: 1 * 24 * 60 * 60 * 1000,
            });
            return res.status(200).send({
                roles: user.roles,
                accessToken: token
            });
        }
    }
    res.status(401).send({"message": "Authentication failed."});
};


