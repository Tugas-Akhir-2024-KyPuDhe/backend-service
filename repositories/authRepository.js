const prisma = require('../config/database');

class AuthRepository {
    async findUserByUsername(username) {
        return await prisma.user.findUnique({
            where: { username },
            include: {
                roles: true,
                staff: {
                    include: {
                        photo: true,
                    },
                },
                students: {
                    include: {
                        photo: true,
                    },
                },
            },
        });
    }
    

    async createUser(data) {
        return await prisma.user.create({
            data,
        });
    }
}

module.exports = new AuthRepository();

