const studentPositionInClassRepository = require("../repositories/StudentPositionInClassRepository");
const classRepository = require("../repositories/classStudentRepository");
const studentRepository = require("../repositories/studentRepository");

class studentPositionInClassController {
  async addPositionStudent(req, res) {
    try {
      const { nis, classId, positionName } = req.body;

      const existStudent = await studentRepository.findStudentByNis(nis);
      if (!existStudent)
        return res.status(404).json({
          status: 404,
          message:
            "Student not found. The provided ID does not match any records.",
        });

      const existClass = await classRepository.findClassById(parseInt(classId));
      if (!existClass)
        return res.status(404).json({
          status: 404,
          message:
            "Class not found. The provided ID does not match any records.",
        });

      const response =
        await studentPositionInClassRepository.createStudentPosition({
          nis,
          classId: parseInt(classId),
          positionName,
        });

      res.status(200).json({
        status: 200,
        message: "Position student successfully added",
        data: response,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = new studentPositionInClassController();
