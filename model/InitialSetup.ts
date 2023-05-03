import { Role } from './Role'
import { User } from './User'
import bcrypt from 'bcrypt';

export default function createInitialEntities() {
    Role.findAll().then(roles => {
        if (roles.length == 0) {
            // TODO: check if I can use bulk creation (careful as it doesn't check by default)
            const admin = Role.create({
                name: "admin",
                description: "System Administrator"
            });

            const farmer = Role.create({
                name: "farmer",
                description: "Farmer / Farm Cluster"
            });

            const buyer = Role.create({
                name: "buyer",
                description: "Buyer (Marketplace User)"
            });

            const investor = Role.create({
                name: "investor",
                description: "Investor"
            });

            const input = Role.create({
                name: "input",
                description: "Input Producer"
            });

            const service = Role.create({
                name: "service",
                description: "Service Producer"
            });

            const processor = Role.create({
                name: "processor",
                description: "Processing and Storage Provider"
            });

            Promise.all([admin, farmer, buyer, investor, input, service, processor]).then((adminRoles) => {
                bcrypt.hash("admin123", 10).then(badPass => {
                    User.create({
                        email: "admin@cubeseed.fake",
                        password: badPass,
                        approved: true
                    }).then(adminUser => adminRoles.forEach(role => adminUser.addRole(role)));
                });
            });
        }
    })

}
