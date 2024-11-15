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
      },
    });
  }

  async updateParentOfStudent(studentId, parentData) {
    const { fatherName, motherName, parentJob, parentAddress, phone } = parentData;
  
    // Cek apakah ParentOfStudent sudah ada
    const existingParent = await prisma.parentOfStudent.findFirst({
      where: { student: { some: { id: studentId } } },
    });
  
    if (existingParent) {
      // Jika ada, lakukan update
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
      // Jika tidak ada, lakukan create
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
  
  
}

module.exports = new StudentRepository();
