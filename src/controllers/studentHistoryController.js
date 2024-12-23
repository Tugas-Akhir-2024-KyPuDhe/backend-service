const studentHistoryRepository = require("../repositories/studentHistoryRepository");

class studentHistoryController {
  async getAllStudentHistory(req, res) {
    try {
      const { id } = req.query;
      const response = await studentHistoryRepository.getAllHistory(parseInt(id));
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

}

module.exports = new studentHistoryController();
