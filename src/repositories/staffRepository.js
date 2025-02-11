const prisma = require("../config/database");

class StaffRepository {
  async findStaffById(id) {
    return await prisma.staff.findUnique({
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
      },
    });
  }

  async findStaffByNip(nip) {
    return await prisma.staff.findUnique({
      where: { nip },
      include: {
        user: {
          select: {
            password: true,
            username: true,
            roles: true,
          },
        },
        photo: true,
      },
    });
  }

  async getAllStaff(tipe) {
    const queryOptions = {
      orderBy: {
        name: "asc",
      },
      include: {
        user: {
          select: {
            username: true,
            password: true,
            roles: true,
          },
        },
      },
    };

    if (tipe !== "") {
      queryOptions.where = {
        user: {
          roles: {
            some: {
              name: tipe.toUpperCase(),
            },
          },
        },
      };
    }

    return prisma.staff.findMany(queryOptions);
  }

  async updateUserStaff(id, data) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async updateStaff(id, data) {
    return await prisma.staff.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async findCourseInClassById(id) {
    return await prisma.courseInClass.findFirst({
      where: { id },
    });
  }

  async findClassByNip(nip, id) {
    const data = await prisma.staff.findFirst({
      where: { nip },
      select: {
        id: true,
        uuid: true,
        name: true,
        CourseInClass: {
          ...(id != "" && { where: { id: parseInt(id) } }),
          include: {
            courseDetail: true,
            teacher: true,
            class: {
              include: {
                major: true,
                homeRoomTeacher: true,
                student: {
                  include: {
                    HistoryClass: {
                      orderBy: {
                        academicYear: "desc",
                      },
                    },
                    ParentOfStudent: true,
                    class: true,
                    Major: true,
                    photo: true,
                    StudentsGrades: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (data && data.CourseInClass) {
      data.CourseInClass = data.CourseInClass.map((course) => {
        if (course.class && course.class.student) {
          course.class.student = course.class.student.map((student) => {
            student.StudentsGrades = student.StudentsGrades.filter(
              (grade) => grade.courseCode === course.courseCode
            );
            return student;
          });
        }
        return course;
      });
    }

    return data;
  }

  async findClassRoomTeacherByNip(id) {
    const classes = await prisma.class.findMany({
      where: { staffId: id },
      orderBy: { academicYear: "desc" },
      include: {
        major: true,
        _count: {
          select: {
            student: true,
          },
        },
      },
    });

    const result = classes.map((classItem) => {
      const { _count, major, ...rest } = classItem;
      return {
        ...rest,
        major,
        totalStudent: _count.student,
      };
    });

    return result;
  }
}

module.exports = new StaffRepository();
