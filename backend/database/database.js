const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./biblioteca.db", (err) => {
  if (err) {
    console.error("Error al conectar con SQLite:", err.message);
  } else {
    console.log("Base de datos SQLite conectada.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS libros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      categoria TEXT NOT NULL,
      estado TEXT DEFAULT 'Disponible'
    )
  `);
});

module.exports = db;