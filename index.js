const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const configSchoolRoutes = require("./routes/configSchoolRoutes");
const jurusanRoutes = require("./routes/jurusanRoutes");
const artikelRoutes = require("./routes/artikelRoutes");
const fasilitasRoutes = require("./routes/fasilitasRoutes");
const ekstrakurikulerRoutes = require("./routes/ekstrakurikulerRoutes");
const cors = require("cors");

const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.static('public'))
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/config-school", configSchoolRoutes);
app.use("/api/jurusan", jurusanRoutes);
app.use("/api/artikel", artikelRoutes);
app.use("/api/fasilitas", fasilitasRoutes);
app.use("/api/ekstrakurikuler", ekstrakurikulerRoutes);

//error handler
// app.use((err, req, res, next) => {
//   res.status(err.status || 400);
//   res.json({
//     message: err.message || "An unknown error occurred",
//     error: err,
//   });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
