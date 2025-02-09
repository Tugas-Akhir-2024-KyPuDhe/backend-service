const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./src/routes/authRoutes");
const configSchoolRoutes = require("./src/routes/configSchoolRoutes");
const jurusanRoutes = require("./src/routes/jurusanRoutes");
const artikelRoutes = require("./src/routes/artikelRoutes");
const fasilitasRoutes = require("./src/routes/fasilitasRoutes");
const ekstrakurikulerRoutes = require("./src/routes/ekstrakurikulerRoutes");
const bannerRoutes = require("./src/routes/bannerRoutes");
const userRoutes = require("./src/routes/userRoutes");
const studentRoutes = require("./src/routes/studentRoutes");
const staffRoutes = require("./src/routes/staffRoutes");
const galeriRoutes = require("./src/routes/galeriRoutes");
const classStudentRoutes = require("./src/routes/classStudentRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const courseInClassRoutes = require("./src/routes/courseInClassRoutes");
const studentGradeRoutes = require("./src/routes/studentGradeRoutes");
const studentHistoryRoutes = require("./src/routes/studentHistoryRoutes");
const studentPositionInClassRoutes = require("./src/routes/studentPositionInClassRoutes");
const studentAttendanceRoutes = require("./src/routes/studentAttendanceRoutes");
const studyTracerRoutes = require("./src/routes/studyTracerRoutes");
const academicYearRoutes = require("./src/routes/academicYearRoutes");

const cors = require("cors");

const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/config-school", configSchoolRoutes);
app.use("/api/jurusan", jurusanRoutes);
app.use("/api/artikel", artikelRoutes);
app.use("/api/fasilitas", fasilitasRoutes);
app.use("/api/ekstrakurikuler", ekstrakurikulerRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/galeri", galeriRoutes);
app.use("/api/class", classStudentRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/course-inclass", courseInClassRoutes);
app.use("/api/student-grade", studentGradeRoutes);
app.use("/api/student-history", studentHistoryRoutes);
app.use("/api/student-position-inClass", studentPositionInClassRoutes);
app.use("/api/student-attendance", studentAttendanceRoutes);
app.use("/api/study-tracer", studyTracerRoutes);
app.use("/api/school-year", academicYearRoutes);

//error handler
app.use((err, req, res, next) => {
  res.status(err.status || 400);
  res.json({
    message: err.message || "An unknown error occurred",
    error: err,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
