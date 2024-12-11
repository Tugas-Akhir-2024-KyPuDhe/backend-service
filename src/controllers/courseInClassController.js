const courseInClassRepository = require("../repositories/courseInClassRepository");

class CourseInClassController {
  async deleteCourseInClassById(req, res) {
    try {
      const { id } = req.params;
      const existCourseInClass =
        await courseInClassRepository.findCourseInClassById(parseInt(id));
      if (!existCourseInClass) {
        return res.status(404).json({
          status: 404,
          message:
            "CourseInClass not found. Cannot delete a non-existing courseInClass.",
        });
      }

      await courseInClassRepository.deleteCourseInClass(parseInt(id));
      res
        .status(200)
        .json({ status: 200, message: "CourseInClass deleted successfully." });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to delete courseInClass due to error: ${error.message}`,
      });
    }
  }

  async createCourseInClass(req, res) {
    try {
      const { courseCode, teacherId, classId, day, timeStart, timeEnd } =
        req.body;

      await courseInClassRepository.createCourseInClass({
        courseCode,
        teacherId: parseInt(teacherId),
        classId: parseInt(classId),
        day,
        timeStart,
        timeEnd,
      });

      return res.status(201).json({
        status: 201,
        message: "CourseInClass successfully created",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateCourseInClass(req, res) {
    try {
      const { id } = req.params;
      const { courseCode, teacherId, classId, day, timeStart, timeEnd } =
        req.body;

      const existCourseInClass =
        await courseInClassRepository.findCourseInClassById(parseInt(id));
      if (!existCourseInClass) {
        return res.status(404).json({
          status: 400,
          message:
            "CourseInClass not found. Unable to update non-existing courseInClass.",
        });
      }

      await courseInClassRepository.updateCourseInClass(id, {
        courseCode,
        teacherId: parseInt(teacherId),
        classId: parseInt(classId),
        day,
        timeStart,
        timeEnd,
      });

      return res.status(200).json({
        status: 200,
        message: "CourseInClass successfully updated",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to update courseInClass due to error: ${error.message}`,
      });
    }
  }

  async getCourseInClassByuuid(req, res){
    const { uuid } = req.params;
    try {
      const response = await courseInClassRepository.findCourseInClassByUuid(uuid);
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved detail course.",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve course due to internal server error.",
        error,
      });
    }
  }
}

module.exports = new CourseInClassController();
