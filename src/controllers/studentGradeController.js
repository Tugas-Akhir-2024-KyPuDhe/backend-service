const e = require("express");
const studentGradeRepository = require("../repositories/studentGradeRepository");
class StudentGradeController {
  async insertGradeStudent(req, res) {
    try {
      const {
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
        attitude,
        description,
      } = req.body;

      const existGrade = await studentGradeRepository.findGradeByNISAndClass(
        nis,
        classId
      );

      if (existGrade) {
        await studentGradeRepository.updateGrade(existGrade.id, {
          nis,
          teacherId: parseInt(teacherId),
          classId: parseInt(classId),
          courseCode,
          task: parseInt(task),
          UH: parseInt(UH),
          PTS: parseInt(PTS),
          PAS: parseInt(PAS),
          portofolio,
          proyek,
          attitude,
          description,
        });
      } else {
        await studentGradeRepository.insertGrade({
          nis,
          teacherId: parseInt(teacherId),
          classId: parseInt(classId),
          courseCode,
          task: parseInt(task),
          UH: parseInt(UH),
          PTS: parseInt(PTS),
          PAS: parseInt(PAS),
          portofolio,
          proyek,
          attitude,
          description,
        });
      }

      return res.status(201).json({
        status: 201,
        message: "Grades Student successfully updated",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }
}

module.exports = new StudentGradeController();
