const configSchoolRepository = require("../repositories/configSchoolRepository");

class ConfigShoolController {
  async getConfigSchool(req, res) {
    try {
      const responseConfig = await configSchoolRepository.getConfigSchool();
      res.status(200).json({ status: 200, message: "success", data: responseConfig });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal server error", error });
    }
  }

  async getStatistik(req, res) {
    try {
      const student = await configSchoolRepository.countStudent()
      const teacher = await configSchoolRepository.countTeacher()
      const staff = await configSchoolRepository.countStaff()
      const major = await configSchoolRepository.countMajor()
      const data = {
        student,
        teacher,
        staff,
        major,
        alumni: 381,
      }
      res.status(200).json({ status: 200, message: "Successfully retrieved the statistik.", data: data });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal server error", error });
    }
  }

  async updateConfigSchool(req, res) {
    try {
      const {
        name,
        about,
        vision,
        mision,
        address,
        mediaId,
        telp,
        email,
        npsn,
        fb,
        ig,
        tiktok,
      } = req.body;

      await configSchoolRepository.updateConfigSchool({
        name,
        about,
        vision,
        mision,
        address,
        mediaId,
        telp,
        email,
        npsn,
        fb,
        ig,
        tiktok,
      });
      res.json({ message: "update config school successfuly" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
}

module.exports = new ConfigShoolController();
