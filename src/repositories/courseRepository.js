const { deleteMediaFromCloud } = require("../config/awsClound");
const prisma = require("../config/database");

class CourseRepository {
  async createCourse(data) {
    return prisma.course.create({
      data: data,
    });
  }
  async updateCourse(id, data) {
    const { name, code, grade, description, status, imageId } = data;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: { image: true },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    return await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        name,
        code,
        grade,
        description,
        status,
        imageId,
      },
    });
  }

  async deleteCourse(id) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: { image: true },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    if (course.image) {
      await deleteMediaFromCloud(
        course.image.url.replace(`${process.env.AWS_URL_IMG}/`, "")
      );
      await prisma.media.delete({
        where: { id: course.imageId },
      });
    }

    return prisma.course.delete({
      where: { id },
    });
  }

  async getAllCourse(gradeCLass = "", status) {
    let whereCondition = gradeCLass ? { grade: gradeCLass } : {};

    if (status && status !== "Active") {
      whereCondition.status = status;
    }

    return prisma.course.findMany({
      orderBy: {
        grade: "asc",
      },
      where: whereCondition,
      include: {
        image: true,
      },
    });
  }

  async findCourseById(id) {
    return prisma.course.findFirst({
      where: { id: id },
      include: {
        image: true,
      },
    });
  }
}

module.exports = new CourseRepository();
