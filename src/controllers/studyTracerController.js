const studyTracerRepository = require("../repositories/studyTracerRepository");

class StudyTracerController {
  async getAllStudyTracer(req, res) {
    try {
      const response = await studyTracerRepository.getAllStudyTracer();
      res.status(200).json({
        status: 200,
        message: "StudyTracers retrieved successfully",
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

  async getStudyTracerById(req, res) {
    try {
      const { id } = req.params;
      const response = await studyTracerRepository.findStudyTracerById(
        parseInt(id)
      );
      if (!response)
        return res.status(404).json({
          status: 404,
          message:
            "StudyTracer not found. The provided ID does not match any records.",
        });

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved the study tracer.",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to retrieve study tracer due to error: ${error.message}`,
      });
    }
  }

  async deleteStudyTracerById(req, res) {
    try {
      const { id } = req.params;
      const existStudyTracer = await studyTracerRepository.findStudyTracerById(
        parseInt(id)
      );
      if (!existStudyTracer) {
        return res.status(404).json({
          status: 404,
          message: `StudyTracer with ID ${id} not found`,
        });
      }

      await studyTracerRepository.deleteStudyTracer(parseInt(id));

      return res.status(200).json({
        status: 200,
        message: `StudyTracer with ID ${id} successfully deleted`,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async createStudyTracer(req, res) {
    try {
      const {
        name,
        ttl,
        gender,
        address,
        addressNow,
        phone,
        email,
        startYear,
        endYear,
        employmentStatus,
        institutionName,
        institutionAddress,
        isSatisfactionMet,
        disSatisfactionFactors,
        studyIssues,
      } = req.body;

      if (
        !name ||
        !gender ||
        !address ||
        !phone ||
        !email ||
        !startYear ||
        !endYear ||
        !employmentStatus
      ) {
        return res.status(400).json({
          status: 400,
          message: "Required fields are missing",
        });
      }

      const newStudyTracer = {
        name,
        ttl: ttl || null,
        gender,
        address,
        addressNow: addressNow || null,
        phone,
        email,
        startYear,
        endYear,
        employmentStatus,
        institutionName: institutionName || null,
        institutionAddress: institutionAddress || null,
        isSatisfactionMet: isSatisfactionMet || null,
        disSatisfactionFactors: disSatisfactionFactors || null,
        studyIssues: studyIssues || null,
      };

      await studyTracerRepository.createStudyTracer(newStudyTracer);

      return res.status(201).json({
        status: 201,
        message: "StudyTracer successfully created",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async updateStudyTracer(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        ttl,
        gender,
        address,
        addressNow,
        phone,
        email,
        startYear,
        endYear,
        employmentStatus,
        institutionName,
        institutionAddress,
        isSatisfactionMet,
        disSatisfactionFactors,
        studyIssues,
        statusApprove,
      } = req.body;

      const existStudyTracer = await studyTracerRepository.findStudyTracerById(
        parseInt(id)
      );
      if (!existStudyTracer) {
        return res.status(404).json({
          status: 404,
          message: `StudyTracer with ID ${id} not found`,
        });
      }

      const updatedStudyTracer = {
        name,
        ttl,
        gender,
        address,
        addressNow,
        phone,
        email,
        startYear,
        endYear,
        employmentStatus,
        institutionName,
        institutionAddress,
        isSatisfactionMet,
        disSatisfactionFactors,
        studyIssues,
        statusApprove
      };

      await studyTracerRepository.updateStudyTracer(
        parseInt(id),
        updatedStudyTracer
      );

      return res.status(200).json({
        status: 200,
        message: `StudyTracer with ID ${id} successfully updated`,
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

module.exports = new StudyTracerController();
