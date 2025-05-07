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
        academicYear: "desc",
      },
      include: {
        homeRoomTeacher: true,
        CourseInClass: true,
        student: true,
      },
    });
  }

  async findClassById(id) {
    return await prisma.class.findFirst({
      where: { id },
      include: {
        StudentPositionInClass: { include: { student: true } },
        homeRoomTeacher: true,
        CourseInClass: {
          include: {
            courseDetail: {
              include: {
                StudentsGrades: {
                  ...(id != "" && { where: { classId: parseInt(id) } }),
                },
              },
            },
            teacher: true,
          },
        },
        // mainStudent: {
        //   where: { classId: id },
        //   include: {
        //     class: true,
        //     Major: true,
        //   },
        // },
        student: {
          include: {
            class: true,
            Major: true,
            HistoryClass: true,
            StudentsGrades: {
              ...(id != "" && { where: { classId: parseInt(id) } }),
              include: { course: true },
            },
          },
        },
        mainStudent: {
          include: {
            ParentOfStudent: true,
            class: true,
            Major: true,
            HistoryClass: true,
            StudentsGrades: {
              ...(id != "" && { where: { classId: parseInt(id) } }),
              include: { course: true },
            },
          },
        },
        major: true,
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

  async updateStatusClass(id, data) {
    const { status } = data;

    const classStudent = await prisma.class.findUnique({
      where: { id: parseInt(id) },
    });

    if (!classStudent) {
      throw new Error("Class not found");
    }

    return await prisma.class.update({
      where: { id: parseInt(id) },
      data: {
        status,
      },
    });
  }

  // async insertStudentInClass(capacity, majorCode) {
  //   const students = await prisma.student.findMany({
  //     where: { classId: null, majorCode },
  //     orderBy: { id: "asc" },
  //   });

  //   const classes = await prisma.class.findMany({
  //     where: { majorCode: majorCode },
  //     orderBy: { name: "asc" },
  //   });

  //   if (classes.length === 0) {
  //     throw new Error(`No available classes for the major ${majorCode}`);
  //   }

  //   let currentClassIndex = 0;
  //   const studentsWithClass = [];

  //   for (const student of students) {
  //     let currentClass = classes[currentClassIndex];

  //     // Pastikan kelas selalu valid
  //     if (!currentClass) {
  //       throw new Error(
  //         `Class not found for major ${majorCode}. Please check class creation logic.`
  //       );
  //     }

  //     // Periksa jumlah siswa dalam kelas saat ini
  //     const studentCountInClass = await prisma.student.count({
  //       where: { classId: currentClass.id },
  //     });

  //     if (studentCountInClass < currentClass.capacity) {
  //       // Tambahkan siswa ke kelas
  //       const updatedStudent = await prisma.student.update({
  //         where: { id: student.id },
  //         data: { classId: currentClass.id },
  //       });

  //       studentsWithClass.push({
  //         studentId: updatedStudent.id,
  //         studentName: updatedStudent.name,
  //         classId: currentClass.id,
  //         className: currentClass.name,
  //       });
  //     } else {
  //       // Pindah ke kelas berikutnya
  //       currentClassIndex++;
  //       if (currentClassIndex < classes.length) {
  //         currentClass = classes[currentClassIndex];
  //       } else {
  //         // Kelas berikutnya tidak tersedia, siswa diletakkan di kelas terakhir
  //         currentClass = classes[classes.length - 1];
  //       }

  //       // Tambahkan siswa ke kelas baru
  //       const updatedStudent = await prisma.student.update({
  //         where: { id: student.id },
  //         data: { classId: currentClass.id },
  //       });

  //       studentsWithClass.push({
  //         studentId: updatedStudent.id,
  //         studentName: updatedStudent.name,
  //         classId: currentClass.id,
  //         className: currentClass.name,
  //       });
  //     }
  //   }

  //   return studentsWithClass;
  // }

  async insertStudentInClass(classId, collectionNIS) {
    const students = await prisma.student.findMany({
      where: { nis: { in: collectionNIS } },
      orderBy: { id: "asc" },
    });

    if (students.length === 0) {
      throw new Error("No students found with the provided NIS.");
    }

    // Jika classId adalah '00', ubah status siswa menjadi Lulus
    if (classId === "00") {
      // Update history sebelumnya menjadi "Lulus"
      await prisma.historyClass.updateMany({
        where: {
          studentId: { in: students.map((student) => student.id) },
          status: "Aktif",
        },
        data: { status: "Lulus" },
      });

      // Update status siswa menjadi Lulus tanpa mengubah classId
      await prisma.student.updateMany({
        where: {
          id: { in: students.map((student) => student.id) },
        },
        data: {
          status: "Lulus",
        },
      });

      return { message: "Students status updated to Graduated successfully" };
    }

    // Proses normal untuk classId selain '00'
    const classes = await prisma.class.findFirst({
      where: { id: classId },
    });

    if (!classes) {
      throw new Error("Class not found");
    }

    // Update history sebelumnya menjadi "Naik Kelas"
    await prisma.historyClass.updateMany({
      where: {
        studentId: { in: students.map((student) => student.id) },
        status: "Aktif",
      },
      data: { status: "Naik Kelas" },
    });

    // Update classId untuk setiap siswa
    await prisma.student.updateMany({
      where: {
        id: { in: students.map((student) => student.id) },
      },
      data: {
        classId,
        status: "Active",
      },
    });

    // Insert ke StudentsinClass dan dapatkan ID yang baru
    const studentsInClassData = students.map((student) => ({
      name: student.name,
      classId,
      status: student.status || "Active",
      birthPlace: student.birthPlace,
      address: student.address,
      phone: student.phone,
      email: student.email,
      gender: student.gender,
      majorCode: student.majorCode,
      nis: student.nis,
      nisn: student.nisn,
      startYear: student.startYear,
      endYear: student.endYear,
      mediaId: student.mediaId,
    }));

    // Gunakan transaksi Prisma untuk menyimpan StudentsinClass dan mendapatkan data yang baru dimasukkan
    const insertedStudentsInClass = await prisma.$transaction(
      studentsInClassData.map((data) => prisma.studentsinClass.create({ data }))
    );

    // Buat historyClass dengan studentsinClassId yang baru dimasukkan
    const historyRecords = students.map((student, index) => ({
      studentId: student.id,
      oldClassId: student.classId || null,
      currentClassId: classId,
      academicYear: classes.academicYear,
      studentsinClassId: insertedStudentsInClass[index].id,
      status: "Aktif",
    }));

    // Insert ke historyClass
    await prisma.historyClass.createMany({ data: historyRecords });

    return insertedStudentsInClass;
  }
}

module.exports = new ClassStudentRepository();
