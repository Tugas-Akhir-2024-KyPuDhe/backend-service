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

  async getCourseInClass(req, res) {
    try {
      const { classId, day } = req.query;

      let response;

      if (classId && day) {
        response =
          await courseInClassRepository.findCourseInClassByClassIdAndDay(
            classId,
            day
          );
        if (response.length === 0) {
          return res.status(404).json({
            status: 404,
            message: `No courses found for ${day} in this class.`,
          });
        }
      } else if (classId) {
        response = await courseInClassRepository.findClassById(
          parseInt(classId)
        );
        if (!response) {
          return res.status(404).json({
            status: 404,
            message: "Course not found.",
          });
        }
      } else {
        return res.status(400).json({
          status: 400,
          message:
            "Invalid parameters. Please provide either uuid or classId and day.",
        });
      }

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved course data.",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve course data due to internal server error.",
        error: error.message,
      });
    }
  }
}

module.exports = new CourseInClassController();
