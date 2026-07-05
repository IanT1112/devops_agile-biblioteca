const db = require("../database/database");

// Obtener todos los libros
const obtenerLibros = (req, res) => {
  db.all("SELECT * FROM libros", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        mensaje: "Error al obtener los libros",
        error: err.message,
      });
    }

    res.status(200).json(rows);
  });
};

// Registrar libro
const crearLibro = (req, res) => {
  const { titulo, autor, categoria } = req.body;

  if (!titulo || !autor || !categoria) {
    return res.status(400).json({
      mensaje: "Todos los campos son obligatorios.",
    });
  }

  db.run(
    `INSERT INTO libros (titulo, autor, categoria)
     VALUES (?, ?, ?)`,
    [titulo, autor, categoria],
    function (err) {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al registrar el libro",
          error: err.message,
        });
      }

      res.status(201).json({
        mensaje: "Libro registrado correctamente",
        id: this.lastID,
      });
    }
  );
};

// Actualizar libro
const actualizarLibro = (req, res) => {
  const { titulo, autor, categoria, estado } = req.body;

  db.run(
    `UPDATE libros
     SET titulo=?, autor=?, categoria=?, estado=?
     WHERE id=?`,
    [titulo, autor, categoria, estado, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al actualizar",
          error: err.message,
        });
      }

      res.json({
        mensaje: "Libro actualizado correctamente",
      });
    }
  );
};

// Eliminar libro
const eliminarLibro = (req, res) => {
  db.run(
    `DELETE FROM libros WHERE id=?`,
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al eliminar",
          error: err.message,
        });
      }

      res.json({
        mensaje: "Libro eliminado correctamente",
      });
    }
  );
};

module.exports = {
  obtenerLibros,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
};