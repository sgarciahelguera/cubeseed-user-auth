import { Request, Response } from 'express';
import { User } from '../model/User';
import { Role } from '../model/Role';
import { FindOptions, InferAttributes } from 'sequelize';

export const listUsers = async (req: Request, res: Response) => {
    let findArg: FindOptions<InferAttributes<User, { omit: never; }>> = {
        include: { model: Role, as: 'roles' },
        raw: false,
        nest: false
    };
    if (req.query.email) {
        findArg.where = { email: req.query.email.toString() };
    }
    if (req.query.approved) {
        findArg.where = {
            ...findArg.where,
            approved: (req.query.approved == 'true')
        };
    }
    User.findAll(findArg).then(users => {
        return res.status(200).json({
            users:
                users.map(user => {
                    return {
                        id: user.id,
                        email: user.email,
                        approved: user.approved,
                        roles: user.roles === undefined ? [] : user.roles.map(r => r.name)
                    };
                })
        });
    }).catch(error => {
        return res.status(500).json({ message: "Internal error.", error: error });
    });
}

export const acceptOrRejectUser = async (req: Request, res: Response) => {
    function handle(count: number, approved: boolean) {
        if (count > 0) {
            return res.status(200).json({ message: "User " + approved ? "approved" : "rejected" });
        }
        return res.status(404).json({ message: "User not found." });
    }
    if (req.body.approved) {
        User.update({ approved: req.body.approved }, { where: { id: req.params.id } })
            .then(count => handle(count[0], req.body.approved))
            .catch(error => res.status(500).json({ message: "Internal error", error: error }));
    } else if (typeof (req.body.approved) == 'boolean') {
        User.destroy({ where: { id: req.params.id } })
            .then(count => handle(count, req.body.approved))
            .catch(error => res.status(500).json({ message: "Internal error", error: error }));
    }
}
