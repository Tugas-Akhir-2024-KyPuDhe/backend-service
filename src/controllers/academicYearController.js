const academicYearRepository = require("../repositories/academicYearRepository");

class AcademicYearController {
  async getAllAcademicYear(req, res) {
    try {
      const response = await academicYearRepository.getAllAcademicYear();
      res.status(200).json({
        status: 200,
        message: "School Year retrieved successfully",
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

  async getAcademicYearById(req, res) {
    try {
      const { id } = req.params;
      const response = await academicYearRepository.findAcademicYearById(
        parseInt(id)
      );
      if (!response)
        return res.status(404).json({
          status: 404,
          message:
            "School year not found. The provided ID does not match any records.",
        });

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved the School year.",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to retrieve School year due to error: ${error.message}`,
      });
    }
  }

  async deleteAcademicYearById(req, res) {
    try {
      const { id } = req.params;
      const academicYear = await academicYearRepository.findAcademicYearById(
        parseInt(id)
      );
      if (!academicYear) {
        return res.status(404).json({
          status: 404,
          message: `School year with ID ${id} not found`,
        });
      }

      if (academicYear.status == "Active") {
        return res.status(409).json({
          status: 409,
          message: `School year is active can't be deleted`,
        });
      }

      await academicYearRepository.deleteAcademicYear(parseInt(id));

      return res.status(200).json({
        status: 200,
        message: `School year with ID ${id} successfully deleted`,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async createAcademicYear(req, res) {
    try {
      const { name, createdBy } = req.body;

      if (!name || !createdBy) {
        return res.status(400).json({
          status: 400,
          message: "name and createdBy are required",
        });
      }

      const academicYearExist = await academicYearRepository.findAcademicYearByName(
        name
      );

      if (academicYearExist) {
        return res.status(409).json({
          status: 409,
          message: `School year with name ${name} already available`,
        });
      }

      await academicYearRepository.createAcademicYear({
        name,
        createdBy,
      });

      return res.status(201).json({
        status: 201,
        message: "School Year successfully created",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateAcademicYear(req, res) {
    try {
      const { id } = req.params;
      const { name, status } = req.body;

      const existAcademicYear = await academicYearRepository.findAcademicYearById(
        parseInt(id)
      );
      if (!existAcademicYear) {
        return res.status(404).json({
          status: 400,
          message:
            "school year not found. Unable to update non-existing school year.",
        });
      }

      await academicYearRepository.updateAcademicYear(id, {
        name,
        status,
      });

      return res.status(200).json({
        status: 200,
        message: `School year with ID ${id} successfully updated`,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }
}

module.exports = new AcademicYearController();
