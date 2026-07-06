import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Trash2,
  Pencil,
  RefreshCcw,
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:3001/libros";

function App() {
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [libroEditando, setLibroEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    titulo: "",
    autor: "",
    categoria: "",
    estado: "Disponible",
  });

  const obtenerLibros = async () => {
    try {
      const respuesta = await axios.get(API_URL);
      setLibros(respuesta.data);
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  useEffect(() => {
    obtenerLibros();
  }, []);

  const librosFiltrados = useMemo(() => {
    return libros.filter((libro) => {
      const texto = `${libro.titulo} ${libro.autor} ${libro.categoria} ${libro.estado}`.toLowerCase();
      return texto.includes(busqueda.toLowerCase());
    });
  }, [libros, busqueda]);

  const totalLibros = libros.length;
  const disponibles = libros.filter((libro) => libro.estado === "Disponible").length;
  const prestados = libros.filter((libro) => libro.estado === "Prestado").length;

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      titulo: "",
      autor: "",
      categoria: "",
      estado: "Disponible",
    });
    setModoEdicion(false);
    setLibroEditando(null);
  };

  const guardarLibro = async (e) => {
    e.preventDefault();

    if (!formulario.titulo || !formulario.autor || !formulario.categoria) {
      alert("Completa todos los campos.");
      return;
    }

    try {
      if (modoEdicion) {
        await axios.put(`${API_URL}/${libroEditando.id}`, formulario);
      } else {
        await axios.post(API_URL, formulario);
      }

      limpiarFormulario();
      obtenerLibros();
    } catch (error) {
      console.error("Error al guardar libro:", error);
    }
  };

  const editarLibro = (libro) => {
    setModoEdicion(true);
    setLibroEditando(libro);
    setFormulario({
      titulo: libro.titulo,
      autor: libro.autor,
      categoria: libro.categoria,
      estado: libro.estado,
    });
  };

  const eliminarLibro = async (id) => {
    const confirmar = confirm("¿Seguro que deseas eliminar este libro?");
    if (!confirmar) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      obtenerLibros();
    } catch (error) {
      console.error("Error al eliminar libro:", error);
    }
  };

  const cambiarEstado = async (libro) => {
    const nuevoEstado = libro.estado === "Disponible" ? "Prestado" : "Disponible";

    try {
      await axios.put(`${API_URL}/${libro.id}`, {
        ...libro,
        estado: nuevoEstado,
      });

      obtenerLibros();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="eyebrow">Sistema de gestión</p>
          <h1>Biblioteca Virtual</h1>
          <p className="subtitle">
            Administra libros, autores, categorías y préstamos desde una interfaz simple.
          </p>
        </div>

        <div className="admin-badge">
          <BookOpen size={20} />
          Administrador
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon">
            <BookOpen />
          </div>
          <div>
            <span>Total de libros</span>
            <strong>{totalLibros}</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon">
            <CheckCircle />
          </div>
          <div>
            <span>Disponibles</span>
            <strong>{disponibles}</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon">
            <Clock />
          </div>
          <div>
            <span>Prestados</span>
            <strong>{prestados}</strong>
          </div>
        </article>
      </section>

      <section className="content-grid">
        <form className="form-card" onSubmit={guardarLibro}>
          <div className="form-header">
            <h2>{modoEdicion ? "Editar libro" : "Registrar libro"}</h2>
            <Plus size={20} />
          </div>

          <label>
            Título
            <input
              type="text"
              name="titulo"
              value={formulario.titulo}
              onChange={manejarCambio}
              placeholder="Ej: Clean Code"
            />
          </label>

          <label>
            Autor
            <input
              type="text"
              name="autor"
              value={formulario.autor}
              onChange={manejarCambio}
              placeholder="Ej: Robert C. Martin"
            />
          </label>

          <label>
            Categoría
            <input
              type="text"
              name="categoria"
              value={formulario.categoria}
              onChange={manejarCambio}
              placeholder="Ej: Programación"
            />
          </label>

          <label>
            Estado
            <select name="estado" value={formulario.estado} onChange={manejarCambio}>
              <option value="Disponible">Disponible</option>
              <option value="Prestado">Prestado</option>
            </select>
          </label>

          <button type="submit" className="primary-button">
            {modoEdicion ? "Guardar cambios" : "Agregar libro"}
          </button>

          {modoEdicion && (
            <button type="button" className="secondary-button" onClick={limpiarFormulario}>
              Cancelar edición
            </button>
          )}
        </form>

        <section className="table-card">
          <div className="table-header">
            <div>
              <h2>Inventario de libros</h2>
              <p>{librosFiltrados.length} resultado(s)</p>
            </div>

            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar libro..."
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {librosFiltrados.map((libro) => (
                  <tr key={libro.id}>
                    <td>{libro.titulo}</td>
                    <td>{libro.autor}</td>
                    <td>{libro.categoria}</td>
                    <td>
                      <span
                        className={
                          libro.estado === "Disponible"
                            ? "status available"
                            : "status borrowed"
                        }
                      >
                        {libro.estado}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button onClick={() => editarLibro(libro)} title="Editar">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => cambiarEstado(libro)} title="Cambiar estado">
                          <RefreshCcw size={16} />
                        </button>
                        <button onClick={() => eliminarLibro(libro.id)} title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {librosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty">
                      No se encontraron libros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
        </div>
      </section>
    </section>
    <footer className="footer">
      <p>
        Proyecto DevOps - Biblioteca Virtual | Desarrollado por Ian Tapia y Paolo Guerrero
      </p>
    </footer>
  </main>
);
}

export default App;