const gradeFormulaRepository = require("../repositories/gradeFormulaRepository");

class GradeFormulaController {
  async createFormula(req, res) {
    try {
      const { name, description, createdBy } = req.body;

      if (!name || !createdBy) {
        return res.status(400).json({
          success: false,
          message: "Nama formula dan createdBy harus diisi",
        });
      }

      const newFormula = await gradeFormulaRepository.createFormula({
        name,
        description: description || "",
        createdBy,
      });

      res.status(201).json({
        success: true,
        message: "Formula berhasil dibuat",
        data: newFormula,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllFormulas(req, res) {
    try {
      const formulas = await gradeFormulaRepository.getAllFormulas();

      res.status(200).json({
        success: true,
        data: formulas,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data formula",
      });
    }
  }

  async getDetailFormula(req, res) {
    try {
      const { id } = req.params;
      const formula = await gradeFormulaRepository.getFormulaById(parseInt(id));
      if (!formula)
        return res.status(404).json({
          status: 404,
          message:
            "Formula not found. The provided ID does not match any records.",
        });

      res.status(200).json({
        success: true,
        data: formula,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data formula",
      });
    }
  }

  async updateFormula(req, res) {
    try {
      const { id } = req.params;
      const { name, description, status } = req.body;

      // Validasi minimal
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Nama formula harus diisi",
        });
      }

      const updatedFormula = await gradeFormulaRepository.updateFormula(
        parseInt(id),
        {
          name,
          description: description || "",
          status: status || 1,
        }
      );

      res.status(200).json({
        success: true,
        message: "Formula berhasil diupdate",
        data: updatedFormula,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteFormula(req, res) {
    try {
      const { id } = req.params;

      const formula = await gradeFormulaRepository.getFormulaById(parseInt(id));
      if (!formula)
        return res.status(404).json({
          status: 404,
          message:
            "Formula not found. The provided ID does not match any records.",
        });

      await gradeFormulaRepository.deleteFormula(parseInt(id));

      res.status(200).json({
        success: true,
        message: "Formula berhasil dihapus",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addComponent(req, res) {
    try {
      const { id } = req.params;
      const { name, description, weight, type, parentId, createdBy } = req.body;

      // Validasi minimal
      if (!name || weight === undefined) {
        return res.status(400).json({
          success: false,
          message: "Nama dan bobot komponen harus diisi",
        });
      }

      const formula = await gradeFormulaRepository.getFormulaById(parseInt(id));
      if (!formula)
        return res.status(404).json({
          status: 404,
          message:
            "Formula not found. The provided ID does not match any records.",
        });

      const component = await gradeFormulaRepository.addComponent({
        name: name,
        weight: weight,
        description: description || "",
        type: type || "main",
        formulaId: parseInt(id),
        parentId: parseInt(parentId) || null,
        createdBy: createdBy,
      });

      res.status(201).json({
        success: true,
        message: "Komponen berhasil ditambahkan",
        data: component,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateComponent(req, res) {
    try {
      const { id } = req.params;
      const { name, description, weight, type, parentId } = req.body;

      // Validasi minimal
      if (!name || weight === undefined) {
        return res.status(400).json({
          success: false,
          message: "Nama dan bobot komponen harus diisi",
        });
      }

      // Cek apakah komponen ada
      const existingComponent = await prisma.gradeComponent.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingComponent) {
        return res.status(404).json({
          success: false,
          message: "Komponen tidak ditemukan",
        });
      }

      // Update komponen
      const updatedComponent = await gradeFormulaRepository.updateComponent(
        parseInt(id),
        {
          name,
          description: description || existingComponent.description,
          weight: weight || existingComponent.weight,
          type: type || existingComponent.type,
          parentId: parseInt(parentId) || existingComponent.parentId,
        }
      );

      res.status(200).json({
        success: true,
        message: "Komponen berhasil diupdate",
        data: updatedComponent,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getComponents(req, res) {
    try {
      const { id } = req.params;
      const components = await gradeFormulaRepository.getFormulaComponents(
        parseInt(id)
      );

      if (!components)
        return res.status(404).json({
          status: 404,
          message:
            "Component Formula not found. The provided ID does not match any records.",
        });

      res.status(200).json({
        success: true,
        data: components,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil komponen formula",
      });
    }
  }
}

module.exports = new GradeFormulaController();
