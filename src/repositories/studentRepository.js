const prisma = require("../config/database");

class StudentRepository {
  async findStudentByNis(nis) {
    return await prisma.student.findUnique({
      where: { nis },
      include: {
        user: {
          select: {
            password: true,
            username: true,
            roles: true,
          },
        },
        photo: true,
        ParentOfStudent: true,
        class: true,
        Major: true,
        HistoryClass: {
          orderBy: {
            academicYear: "desc",
          },
          include: {
            currentClass: { include: { StudentsGrades: true } },
            oldClass: true,
          },
        },
      },
    });
  }

  async findStudentById(id) {
    return await prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            password: true,
            username: true,
            roles: true,
          },
        },
        photo: true,
        ParentOfStudent: true,
        class: true,
        Major: true,
        HistoryClass: {
          orderBy: {
            academicYear: "desc",
          },
          include: {
            currentClass: { include: { StudentsGrades: true } },
            oldClass: true,
          },
        },
      },
    });
  }

  async getAllNewStudent(majorCode) {
    const whereClause = {
      classId: null,
      waliKelasId: null,
      ...(majorCode && { Major: { majorCode } }),
    };

    return await prisma.student.findMany({
      where: whereClause,
      include: {
        Major: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async getAllStudents(status, majorCode, grade) {
    const whereClause = {};

    if (status === "New") {
      whereClause.status = status;
    } else if (status === "Active") {
      whereClause.status = status;
    }

    if (grade) {
      whereClause.class = {
        name: {
          startsWith: `${grade}-`, // Contoh: mencari "X" akan mencocokkan "X-RPL-1", "X-RPL-2"
        },
      };
    }

    if (majorCode) {
      whereClause.Major = { majorCode };
    }

    return await prisma.student.findMany({
      where: whereClause,
      include: { Major: true, class: true },
    });
  }

  async updateParentOfStudent(studentId, parentData) {
    const { fatherName, motherName, parentJob, parentAddress, phone } =
      parentData;

    const existingParent = await prisma.parentOfStudent.findFirst({
      where: { student: { some: { id: studentId } } },
    });

    if (existingParent) {
      return await prisma.parentOfStudent.update({
        where: { id: existingParent.id },
        data: {
          fatherName: fatherName || existingParent.fatherName,
          motherName: motherName || existingParent.motherName,
          parentJob: parentJob || existingParent.parentJob,
          parentAddress: parentAddress || existingParent.parentAddress,
          phone: phone || existingParent.phone,
        },
      });
    } else {
      return await prisma.parentOfStudent.create({
        data: {
          fatherName,
          motherName,
          parentJob,
          parentAddress,
          phone,
          student: {
            connect: { id: studentId },
          },
        },
      });
    }
  }

  async findParentStudentByNis(nis) {
    const response = await prisma.student.findUnique({
      where: { nis },
      include: {
        ParentOfStudent: true,
      },
    });

    const parentData = Array.isArray(response.ParentOfStudent)
      ? response.ParentOfStudent[0]
      : response.ParentOfStudent;

    return parentData;
  }

  async updateUserStudent(id, data) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async updateStudent(id, data) {
    return await prisma.student.update({
      where: { id: parseInt(id) },
      data,
    });
  }
}

module.exports = new StudentRepository();
