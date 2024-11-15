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
const galeriRoutes = require("./src/routes/galeriRoutes");

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
app.use("/api/galeri", galeriRoutes);

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
