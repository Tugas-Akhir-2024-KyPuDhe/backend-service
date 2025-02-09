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
        student: {
          where: { classId: id },
          include: {
            class: true,
            Major: true,
          },
        },
        // student: {
        //   include: {
        //     ParentOfStudent: true,
        //     class: true,
        //     Major: true,
        //     HistoryClass: true,
        //     StudentsGrades: {
        //       ...(id != "" && { where: { classId: parseInt(id) } }),
        //       include: { course: true },
        //     },
        //   },
        // },
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

    const classes = await prisma.class.findFirst({
      where: { id: classId },
    })

    // Update history sebelumnya menjadi "Non Aktif"
    await prisma.historyClass.updateMany({
      where: {
        studentId: { in: students.map((student) => student.id) },
        status: "Aktif", // Pastikan hanya yang masih aktif yang diperbarui
      },
      data: { status: "Lulus" },
    });

    // Buat data untuk dimasukkan ke dalam tabel StudentsinClass
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

    // Buat riwayat historyClass
    const historyRecords = students.map((student) => ({
      studentId: student.id,
      oldClassId: student.classId || null,
      currentClassId: classId,
      academicYear: classes.academicYear,
      status: "Aktif",
    }));

    // Gunakan transaksi Prisma agar perubahan bersifat atomik
    await prisma.$transaction([
      prisma.studentsinClass.createMany({ data: studentsInClassData }),
      prisma.historyClass.createMany({ data: historyRecords }),
    ]);

    // Ambil daftar siswa yang telah dimasukkan ke StudentsinClass
    const studentsWithClass = await prisma.studentsinClass.findMany({
      where: { classId },
      orderBy: { id: "asc" },
    });

    return studentsWithClass;
  }
}

module.exports = new ClassStudentRepository();
