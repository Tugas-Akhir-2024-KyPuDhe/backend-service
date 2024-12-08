const { deleteMediaFromCloud } = require("../config/awsClound");
const prisma = require("../config/database");

class CourseInClassRepository {
  async createCourseInClass(data) {
    return prisma.courseInClass.create({
      data: data,
    });
  }

  async updateCourseInClass(id, data) {
    const { courseCode, teacherId, classId, day, timeStart, timeEnd } = data;

    const courseInClass = await prisma.courseInClass.findUnique({
      where: { id: parseInt(id) },
    });

    if (!courseInClass) {
      throw new Error("CourseInClass not found");
    }

    return await prisma.courseInClass.update({
      where: { id: parseInt(id) },
      data: {
        courseCode,
        teacherId,
        classId,
        day,
        timeStart,
        timeEnd,
      },
    });
  }

  async deleteCourseInClass(id) {
    const courseInClass = await prisma.courseInClass.findUnique({
      where: { id },
    });

    if (!courseInClass) {
      throw new Error("CourseInClass not found");
    }

    if (courseInClass.image) {
      await deleteMediaFromCloud(
        courseInClass.image.url.replace(`${process.env.AWS_URL_IMG}/`, "")
      );
      await prisma.media.delete({
        where: { id: courseInClass.imageId },
      });
    }

    return prisma.courseInClass.delete({
      where: { id },
    });
  }
  
  async findCourseInClassById(id) {
    return prisma.courseInClass.findFirst({
      where: { id: id },
    });
  }
}

module.exports = new CourseInClassRepository();
