const classStudentRepository = require("../repositories/classStudentRepository");

class ClassStudentController {
  //   async getAllClass(req, res) {
  //     try {
  //       const response = await classStudentRepository.getAllClass();
  //       res.status(200).json({
  //         status: 200,
  //         message: "Successfully retrieved all class.",
  //         data: response,
  //       });
  //     } catch (error) {
  //       res.status(500).json({
  //         status: 500,
  //         message: "Failed to retrieve class due to internal server error.",
  //         error,
  //       });
  //     }
  //   }

  //   async getClassById(req, res) {
  //     try {
  //       const { id } = req.params;
  //       const response = await classStudentRepository.findClassById(parseInt(id));
  //       if (!response) {
  //         return res.status(404).json({
  //           status: 404,
  //           message:
  //             "Class not found. The provided ID does not match any records.",
  //         });
  //       }

  //       res.status(200).json({
  //         status: 200,
  //         message: "Successfully retrieved the class.",
  //         data: response,
  //       });
  //     } catch (error) {
  //       res.status(400).json({
  //         status: 400,
  //         message: `Failed to retrieve class due to error: ${error.message}`,
  //       });
  //     }
  //   }

  async createClassInvStudent(req, res) {
    try {
      const { capacity, majorCode } = req.body;

      const newClassIds = await classStudentRepository.createClass(parseInt(capacity), majorCode);
      if (newClassIds) {
        await classStudentRepository.insertStudentInClass(parseInt(capacity), majorCode, newClassIds)
      }

      return res
        .status(201)
        .json({ status: 201, message: "Class successfully added and insert student in the class" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 400,
        message: `Failed to create class due to error: ${error.message}`,
      });
    }
  }

  //   async updateClass(req, res) {
  //     try {
  //       const { id } = req.params;
  //       const { name, description, prioritas, status, mediaIdsToDelete } = req.body;
  //       const files = req.files?.["media"] || [];

  //       const existClass = await classStudentRepository.findClassById(parseInt(id));
  //       if (!existClass) {
  //         return res.status(404).json({
  //           status: 400,
  //           message: "Class not found. Unable to update non-existing class.",
  //         });
  //       }

  //       const newMediaData =
  //         files.length > 0
  //           ? files.map((file, index) => ({
  //               url: req.mediaLocations[index].url, // Lokasi file yang disimpan di S3
  //               type: file.mimetype.startsWith("image") ? "image" : "video",
  //             }))
  //           : null;

  //       await classStudentRepository.updateClass(id, {
  //         name,
  //         description,
  //         prioritas,
  //         status,
  //         mediaIdsToDelete,
  //         newMediaData: newMediaData || undefined,
  //       });

  //       return res.status(200).json({
  //         status: 200,
  //         message: "Class successfully updated",
  //       });
  //     } catch (error) {
  //       res.status(400).json({
  //         status: 400,
  //         message: `Failed to update class due to error: ${error.message}`,
  //       });
  //     }
  //   }
}

module.exports = new ClassStudentController();
