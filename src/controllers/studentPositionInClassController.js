const studentPositionInClassRepository = require("../repositories/StudentPositionInClassRepository");
const classRepository = require("../repositories/classStudentRepository");
const studentRepository = require("../repositories/studentRepository");

class studentPositionInClassController {
  async addStudentPosition(req, res) {
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

  async getPosisitionByClassId(req, res) {
    try {
      const { id } = req.params;
      const response = await studentPositionInClassRepository.findPositionByClassId(parseInt(id));
      if (!response) {
        return res.status(404).json({
          status: 404,
          message:
            "Position not found. The provided ID does not match any records.",
        });
      }

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved the Position.",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to retrieve Position due to error: ${error.message}`,
      });
    }
  }

  async deleteStudentPosition(req, res) {
    try {
      const { id } = req.params;
      const existPosition =
        await studentPositionInClassRepository.findPositionById(parseInt(id));
      if (!existPosition) {
        return res.status(404).json({
          status: 404,
          message: "Position not found. Cannot delete a non-existing position.",
        });
      }

      await studentPositionInClassRepository.deletePositionById(parseInt(id));
      res
        .status(200)
        .json({ status: 200, message: "Position deleted successfully." });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to delete position due to error: ${error.message}`,
      });
    }
  }
}

module.exports = new studentPositionInClassController();
