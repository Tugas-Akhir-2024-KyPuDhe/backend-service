const e = require("express");
const studentGradeRepository = require("../repositories/studentGradeRepository");
const prisma = require("../config/database");
class StudentGradeController {
  async insertGradeStudent(req, res) {
    try {
      const grades = req.body; // Menerima array object
      const results = await Promise.all(
        grades.map(async (grade) => {
          const {
            academicYear,
            nis,
            teacherId,
            classId,
            courseCode,
            task,
            UH,
            PTS,
            PAS,
            portofolio,
            proyek,
            finalGrade,
            attitude,
            description,
          } = grade;

          const existGrade =
            await studentGradeRepository.findGradeByNISClassAndCourse(
              nis,
              classId,
              courseCode
            );

          const studentinClass = await prisma.studentsinClass.findFirst({
            where: {
              nis: nis,
              classId: classId,
            },
          });

          if (!existGrade) {
            return await studentGradeRepository.insertGrade({
              // nis,
              academicYear,
              // teacherId: parseInt(teacherId),
              // classId: parseInt(classId),
              // courseCode,
              task: parseInt(task),
              UH: parseInt(UH),
              PTS: parseInt(PTS),
              PAS: parseInt(PAS),
              portofolio: parseInt(portofolio),
              proyek: parseInt(proyek),
              attitude: parseInt(attitude),
              finalGrade: parseInt(finalGrade),
              description,
              student: {
                connect: { nis: nis, },
              },
              course: {
                connect: { code: courseCode, },
              },
              teacher: {
                connect: { id: parseInt(teacherId), },
              },
              class: {
                connect: { id: parseInt(classId), },
              },
              StudentsinClass: {
                connect: { id: studentinClass.id, }
              }
            });
          } else {
            return await studentGradeRepository.updateGrade(
              parseInt(existGrade.id),
              {
                nis,
                academicYear,
                teacherId: parseInt(teacherId),
                classId: parseInt(classId),
                courseCode,
                task: parseInt(task),
                UH: parseInt(UH),
                PTS: parseInt(PTS),
                PAS: parseInt(PAS),
                portofolio: parseInt(portofolio),
                proyek: parseInt(proyek),
                attitude: parseInt(attitude),
                finalGrade: parseInt(finalGrade),
                description,
              }
            );
          }
        })
      );

      return res.status(201).json({
        status: 201,
        message: "Grades Student successfully updated",
        data: results,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async getGradeStudent(req, res) {
    const { nis } = req.params;
    try {
      const response = await studentGradeRepository.getGradeByNIS(nis);
      if (!response) {
        return res.status(404).json({
          status: 404,
          message:
            "Student not found. The provided NIS does not match any records.",
        });
      }

      // Mengelompokkan nilai berdasarkan kelas
      const groupedData = response.reduce((acc, grade) => {
        const classId = grade.class.id;

        if (!acc[classId]) {
          acc[classId] = {
            ...grade.class,
            teacher: grade.teacher,
            studentsGrades: [],
          };
        }

        acc[classId].studentsGrades.push({
          id: grade.id,
          uuid: grade.uuid,
          academicYear: grade.academicYear,
          nis: grade.nis,
          task: grade.task,
          UH: grade.UH,
          PTS: grade.PTS,
          PAS: grade.PAS,
          portofolio: grade.portofolio,
          proyek: grade.proyek,
          attitude: grade.attitude,
          description: grade.description,
          createdAt: grade.createdAt,
          updatedAt: grade.updatedAt,
          teacher: grade.teacher,
          course: grade.course,
        });

        return acc;
      }, {});

      // Konversi hasil ke dalam array
      const data = Object.values(groupedData);

      res.status(200).json({
        status: 200,
        message: "Grade student retrieved successfully",
        data,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = new StudentGradeController();
