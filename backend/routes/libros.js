const express = require("express");

const router = express.Router();

const {
  obtenerLibros,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
} = require("../controllers/librosController");

router.get("/", obtenerLibros);

router.post("/", crearLibro);

router.put("/:id", actualizarLibro);

router.delete("/:id", eliminarLibro);

module.exports = router;