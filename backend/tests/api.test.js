const request = require("supertest");
const express = require("express");
const cors = require("cors");

const librosRoutes = require("../routes/libros");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/libros", librosRoutes);

describe("API Biblioteca Virtual", () => {
  test("GET /libros debe responder correctamente", async () => {
    const response = await request(app).get("/libros");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /libros debe rechazar campos vacíos", async () => {
    const response = await request(app).post("/libros").send({
      titulo: "",
      autor: "",
      categoria: "",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.mensaje).toBe("Todos los campos son obligatorios.");
  });

  test("POST /libros debe registrar un libro", async () => {
    const response = await request(app).post("/libros").send({
      titulo: "DevOps Handbook",
      autor: "Gene Kim",
      categoria: "DevOps",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.mensaje).toBe("Libro registrado correctamente");
    expect(response.body.id).toBeDefined();
  });
});