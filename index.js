const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const configSchoolRoutes = require("./routes/configSchoolRoutes");
const jurusanRoutes = require("./routes/jurusanRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/config-school", configSchoolRoutes);
app.use("/api/jurusan", jurusanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
