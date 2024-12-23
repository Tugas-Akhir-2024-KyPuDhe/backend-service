const classStudentRepository = require("../repositories/classStudentRepository");

class ClassStudentController {
  async getAllClass(req, res) {
    try {
      const response = await classStudentRepository.getAllClass();
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all class.",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve class due to internal server error.",
        error,
      });
    }
  }
  async getClassById(req, res) {
    try {
      const { id } = req.params;
      const response = await classStudentRepository.findClassById(parseInt(id));
      if (!response)
        return res.status(404).json({
          status: 404,
          message:
            "Class not found. The provided ID does not match any records.",
        });

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved the class.",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to retrieve major due to error: ${error.message}`,
      });
    }
  }

  async insertStudentInClass(req, res) {
    try {
      const { id, collectionNis } = req.body;

      const existClass = await classStudentRepository.findClassById(
        parseInt(id)
      );

      if (!existClass) {
        return res.status(404).json({
          status: 400,
          message: "Class not found. Unable to update non-existing class.",
        });
      }

      await classStudentRepository.insertStudentInClass(
        parseInt(id),
        collectionNis
      );

      return res.status(201).json({
        status: 201,
        message: "insert student in the class successfuly",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 400,
        message: `Failed to create class due to error: ${error.message}`,
      });
    }
  }

  async createClass(req, res) {
    try {
      const { name, description, majorCode, staffId, academicYear, capacity } =
        req.body;

      const checkNameClass =
        await classStudentRepository.findClassByNameAndYear(name, academicYear);

      if (checkNameClass) {
        return res.status(409).json({
          status: 409,
          message:
            "a class with that name and that academic year already exists",
        });
      }

      await classStudentRepository.createClass({
        name,
        description,
        majorCode,
        staffId: parseInt(staffId),
        academicYear,
        capacity: parseInt(capacity),
      });

      return res.status(201).json({
        status: 201,
        message: "Class successfully added ",
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: `Failed to create class due to error: ${error.message}`,
      });
    }
  }

  async updateClass(req, res) {
    try {
      const { id } = req.params;
      const { name, description, majorCode, staffId, academicYear, capacity } =
        req.body;

      const existClass = await classStudentRepository.findClassById(
        parseInt(id)
      );
      if (!existClass) {
        return res.status(404).json({
          status: 400,
          message: "Class not found. Unable to update non-existing class.",
        });
      }
      await classStudentRepository.updateClass(id, {
        name,
        description,
        majorCode,
        staffId: parseInt(staffId),
        academicYear,
        capacity: parseInt(capacity),
      });

      return res.status(200).json({
        status: 200,
        message: "Class successfully updated",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to update class due to error: ${error.message}`,
      });
    }
  }
}

module.exports = new ClassStudentController();
