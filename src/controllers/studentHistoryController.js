const studentHistoryRepository = require("../repositories/studentHistoryRepository");

class studentHistoryController {
  async getAllStudentHistory(req, res) {
    try {
      const { id } = req.query;
      const student = await studentHistoryRepository.getStudentById(parseInt(id));
      
      if (!student) {
        return res.status(404).json({
          status: 404,
          message: `Student with ID ${id} not found`,
        });
      }

      const response = await studentHistoryRepository.getAllHistoryStudent(parseInt(id), student.nis);

      if (!response) {
        return res.status(404).json({
          status: 404,
          message: `Student with ID ${id} not found`,
        });
      }
      res.status(200).json({
        status: 200,
        message: "Student History retrieved successfully",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getDetailStudentHistory(req, res) {
    try {
      const { uuid } = req.params;

      const historyExist = await studentHistoryRepository.getHistoryDetail(uuid)
      if (!historyExist) {
        return res.status(404).json({
          status: 404,
          message: `History with ID ${uuid} not found`,
        });
      }

      const siswa = await studentHistoryRepository.getStudentById(historyExist.studentId)
      const response = await studentHistoryRepository.getDetailHistoryStudent(uuid, siswa.nis);
      res.status(200).json({
        status: 200,
        message: "Student History Detail retrieved successfully",
        data: response,
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

module.exports = new studentHistoryController();
