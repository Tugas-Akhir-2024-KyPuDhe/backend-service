const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/authRepository");

class AuthController {
    async registerStudent(req, res) {
        const { password, name, birthPlace, address, phone, email, nis, nisn, startYear } = req.body;

        try {
            const existingUser = await authRepository.findUserByUsername(nis);
            if (existingUser) {
                return res.status(400).json({ message: "NIS already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await authRepository.createUser({
                username: nis,
                password: hashedPassword,
                roles: { create: { name: "STUDENT" } },
                students: {
                    create: {
                        name,
                        birthPlace,
                        address,
                        nis,
                        nisn,
                        phone,
                        email,
                        startYear: new Date(startYear),
                    },
                },
            });

            res.status(201).json({ message: "Student registered successfully", user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    async registerStaff(req, res) {
        const { password, name, birthPlace, address, phone, email, nip, type, startDate } = req.body;

        try {
            const existingUser = await authRepository.findUserByUsername(nip);
            if (existingUser) {
                return res.status(400).json({ message: "NIP already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await authRepository.createUser({
                username: nip,
                password: hashedPassword,
                roles: { create: { name: "STAFF" } },
                staff: {
                    create: {
                        name,
                        birthPlace,
                        address,
                        phone,
                        email,
                        nip,
                        type,
                        startDate: new Date(startDate),
                    },
                },
            });

            res.status(201).json({ message: "Staff registered successfully", user });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    async login(req, res) {
        const { username, password } = req.body;

        try {
            const user = await authRepository.findUserByUsername(username);
            if (!user) {
                return res.status(400).json({ message: "Invalid username or password" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid username or password" });
            }

            const token = jwt.sign({ id: user.id, username: user.username, roles: user.roles }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });

            res.json({ message: "Login successful", token });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }
}

module.exports = new AuthController();
