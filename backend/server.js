const express = require("express");
const cors = require("cors");

const librosRoutes = require("./routes/libros");

const app = express();

const PORT = 3001;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Biblioteca Virtual funcionando");
});

app.use("/libros", librosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});