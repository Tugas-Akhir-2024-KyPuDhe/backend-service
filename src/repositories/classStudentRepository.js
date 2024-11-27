const prisma = require("../config/database");

class ClassStudentRepository {
  async createClass(data) {
    return prisma.class.create({
      data: data,
    });
  }

  async getAllClass() {
    return prisma.class.findMany({
      orderBy: {
        academicYear: "asc",
      },
      include: {
        homeRoomTeacher: true,
        student: true
      },
    });
  }

  async findClassById(id) {
    return prisma.class.findFirst({
      where: { id },
      include: {
        homeRoomTeacher: true,
        student: true
      },
    });
  }

  async findClassByNameAndYear(name, academicYear) {
    return prisma.class.findFirst({
      where: {
        AND: [{ name }, { academicYear }],
      },
    });
  }

  async updateClass(id, data) {
    const { name, description, majorCode, staffId, academicYear, capacity } =
      data;

    const classStudent = await prisma.class.findUnique({
      where: { id: parseInt(id) },
    });

    if (!classStudent) {
      throw new Error("Class not found");
    }

    return await prisma.class.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        majorCode,
        staffId,
        academicYear,
        capacity,
      },
    });
  }

  // async createClass(capacity, majorCode) {
  //   const majors = await prisma.major.findMany({
  //     where: { majorCode },
  //   });
  //   let createdClasses = [];

  //   for (const major of majors) {
  //     const totalStudents = await prisma.student.count({
  //       where: { majorCode: majorCode },
  //     });

  //     // Hitung total kelas yang dibutuhkan
  //     const totalClasses = Math.floor(totalStudents / capacity);
  //     const remainingStudents = totalStudents % capacity;

  //     // Jika sisa siswa ganjil tetapi dapat masuk ke kelas terakhir, abaikan pembuatan kelas tambahan
  //     const shouldCreateExtraClass = remainingStudents > 0 && remainingStudents > capacity / 2;

  //     // Buat kelas yang dibutuhkan
  //     for (let i = 1; i <= totalClasses + (shouldCreateExtraClass ? 1 : 0); i++) {
  //       const newClass = await prisma.class.create({
  //         data: {
  //           name: `X-${major.majorCode}-${i}`,
  //           majorCode: majorCode,
  //           capacity: capacity,
  //         },
  //       });
  //       createdClasses.push(newClass.id);
  //     }
  //   }

  //   return createdClasses;
  // }

  async insertStudentInClass(capacity, majorCode) {
    const students = await prisma.student.findMany({
      where: { classId: null, majorCode },
      orderBy: { id: "asc" },
    });

    const classes = await prisma.class.findMany({
      where: { majorCode: majorCode },
      orderBy: { name: "asc" },
    });

    if (classes.length === 0) {
      throw new Error(`No available classes for the major ${majorCode}`);
    }

    let currentClassIndex = 0;
    const studentsWithClass = [];

    for (const student of students) {
      let currentClass = classes[currentClassIndex];

      // Pastikan kelas selalu valid
      if (!currentClass) {
        throw new Error(
          `Class not found for major ${majorCode}. Please check class creation logic.`
        );
      }

      // Periksa jumlah siswa dalam kelas saat ini
      const studentCountInClass = await prisma.student.count({
        where: { classId: currentClass.id },
      });

      if (studentCountInClass < currentClass.capacity) {
        // Tambahkan siswa ke kelas
        const updatedStudent = await prisma.student.update({
          where: { id: student.id },
          data: { classId: currentClass.id },
        });

        studentsWithClass.push({
          studentId: updatedStudent.id,
          studentName: updatedStudent.name,
          classId: currentClass.id,
          className: currentClass.name,
        });
      } else {
        // Pindah ke kelas berikutnya
        currentClassIndex++;
        if (currentClassIndex < classes.length) {
          currentClass = classes[currentClassIndex];
        } else {
          // Kelas berikutnya tidak tersedia, siswa diletakkan di kelas terakhir
          currentClass = classes[classes.length - 1];
        }

        // Tambahkan siswa ke kelas baru
        const updatedStudent = await prisma.student.update({
          where: { id: student.id },
          data: { classId: currentClass.id },
        });

        studentsWithClass.push({
          studentId: updatedStudent.id,
          studentName: updatedStudent.name,
          classId: currentClass.id,
          className: currentClass.name,
        });
      }
    }

    return studentsWithClass;
  }
}

module.exports = new ClassStudentRepository();
