const schoolYearRepository = require("../repositories/schoolYearRepository");

class SchoolYearController {
  async getAllSchoolYear(req, res) {
    try {
      const response = await schoolYearRepository.getAllSchoolYear();
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

  async getSchoolYearById(req, res) {
    try {
      const { id } = req.params;
      const response = await schoolYearRepository.findSchoolYearById(
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

  async deleteSchoolYearById(req, res) {
    try {
      const { id } = req.params;
      const schoolYear = await schoolYearRepository.findSchoolYearById(
        parseInt(id)
      );
      if (!schoolYear) {
        return res.status(404).json({
          status: 404,
          message: `School year with ID ${id} not found`,
        });
      }

      if (schoolYear.status == "Active") {
        return res.status(404).json({
          status: 400,
          message: `School year is active can't be deleted`,
        });
      }

      await schoolYearRepository.deleteSchoolYear(parseInt(id));

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

  async createSchoolYear(req, res) {
    try {
      const { name, createdBy } = req.body;

      if (!name || !createdBy) {
        return res.status(400).json({
          status: 400,
          message: "name and createdBy are required",
        });
      }

      await schoolYearRepository.createSchoolYear({
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

  async updateSchoolYear(req, res) {
    try {
      const { id } = req.params;
      const { name, status } = req.body;

      const existSchoolYear = await schoolYearRepository.findSchoolYearById(
        parseInt(id)
      );
      if (!existSchoolYear) {
        return res.status(404).json({
          status: 400,
          message:
            "school year not found. Unable to update non-existing school year.",
        });
      }

      await schoolYearRepository.updateSchoolYear(id, {
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

module.exports = new SchoolYearController();
