const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/authRepository");

class AuthController {
  async registerStudent(req, res) {
    const {
      password,
      name,
      birthPlace,
      address,
      phone,
      email,
      gender,
      nis,
      nisn,
      startYear,
    } = req.body;

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
            email,
            gender,
            nis,
            nisn,
            phone,
            startYear: new Date(startYear),
          },
        },
      });

      res
        .status(201)
        .json({ message: "Student registered successfully", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  async registerStaff(req, res) {
    const {
      password,
      name,
      birthPlace,
      address,
      phone,
      email,
      gender,
      nip,
      type,
      startDate,
      role,
    } = req.body;

    try {
      const existingUser = await authRepository.findUserByUsername(nip);
      if (existingUser) {
        return res.status(400).json({ message: "NIP already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await authRepository.createUser({
        username: nip,
        password: hashedPassword,
        roles: { create: { name: role } },
        staff: {
          create: {
            name,
            birthPlace,
            address,
            phone,
            email,
            gender,
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
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }

      let name;
      if (user.staff && user.staff.length > 0) {
        name = user.staff[0].name;
      } else if (user.students && user.students.length > 0) {
        name = user.students[0].name;
      } else {
        name = null;
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          name: name,
          roles: user.roles[0].name,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      const userToSend = {
        name: name,
        role: user.roles[0].name,
      };

      res.status(200).json({
        status: 200,
        message: "Login successful",
        token,
        user: userToSend,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", error });
    }
  }

  async getUser(req, res) {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(400).json({ message: "No token provided" });
      }

      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid token" });
        }

        const { username } = decoded;
        const user = await authRepository.findUserByUsername(username);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const userRole = user.roles.length > 0 ? user.roles[0].name : null;

        const userData = {
          role: userRole,
          details: null,
        };

        if (
          userRole === "STAFF" ||
          (userRole === "TEACHER" && user.staff.length > 0)
        ) {
          userData.details = user.staff;
        } else if (userRole === "STUDENT" && user.students.length > 0) {
          userData.details = user.students;
        }

        res.status(200).json({
          status: 200,
          message: "Login successful",
          user: userData,
        });
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUsers(req, res) {
    try {
      let tipeUser = req.query.tipe || "staff"; 
      tipeUser = tipeUser.toLowerCase()

      if (tipeUser !== "staff" && tipeUser !== "student") {
       return res.status(404).json({
          status: 404,
          message: "User type not found",
        });
      }

      const users = await authRepository.getAllUser(tipeUser);

      res.status(200).json({
        status: 200,
        message: "User retrieved successfully",
        data: users,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    const { password, birthPlace, address, phone, email } = req.body;
    let id = null;
console.log("asd");
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json({ status: 401, message: "Invalid token" });
        }
        id = decoded.id;
      });

      const existingUser = await authRepository.findUserById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      let updateData = {};

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
      if (existingUser.staff.length > 0) {
        updateData.staff = {
          update: {
            where: { id: existingUser.staff[0].id }, // pastikan ID atau NIP tersedia
            data: {
              birthPlace,
              address,
              phone,
              email,
            },
          },
        };
      } else if (existingUser.students.length > 0) {
        updateData.students = {
          update: {
            where: { id: existingUser.students[0].id }, // pastikan ID ini valid
            data: {
              birthPlace,
              address,
              phone,
              email,
            },
          },
        };
      }
      await authRepository.updateUser(id, updateData);

      res
        .status(200)
        .json({ status: 200, message: "User updated successfully" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", error });
    }
  }

  async verifyToken(req, res) {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(400).json({ message: "No token provided" });
      }
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid token" });
        }
        res.status(200).json({ status: 200, valid: true, user: decoded });
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
