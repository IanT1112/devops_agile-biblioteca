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
  Eye,
  X,
} from "lucide-react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/libros";

function App() {
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [libroEditando, setLibroEditando] = useState(null);
  const [libroDetalle, setLibroDetalle] = useState(null);
  const [libroEliminar, setLibroEliminar] = useState(null);

  const [formulario, setFormulario] = useState({
    titulo: "",
    autor: "",
    categoria: "",
    estado: "Disponible",
  });

  const [mensaje, setMensaje] = useState({
  tipo: "",
  texto: "",
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
    setMensaje({
      tipo: "error",
      texto: "Completa todos los campos antes de guardar.",
    });
    return;
  }

  try {
    if (modoEdicion) {
      await axios.put(`${API_URL}/${libroEditando.id}`, formulario);

      setMensaje({
        tipo: "success",
        texto: "Libro actualizado correctamente.",
      });
    } else {
      await axios.post(API_URL, formulario);

      setMensaje({
        tipo: "success",
        texto: "Libro registrado correctamente.",
      });
    }

    limpiarFormulario();
    obtenerLibros();
  } catch (error) {
    console.error("Error al guardar libro:", error);

    setMensaje({
      tipo: "error",
      texto: "Ocurrió un error al guardar el libro.",
    });
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

  const confirmarEliminar = (libro) => {
  setLibroEliminar(libro);
};

  const eliminarLibro = async () => {
    try {
      await axios.delete(`${API_URL}/${libroEliminar.id}`);

      setLibroEliminar(null);

      setMensaje({
        tipo: "success",
        texto: "Libro eliminado correctamente.",
      });

      obtenerLibros();
    } catch (error) {
      console.error(error);

      setMensaje({
        tipo: "error",
        texto: "No fue posible eliminar el libro.",
      });
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

          {mensaje.texto && (
            <div className={`message ${mensaje.tipo}`}>
              {mensaje.texto}
            </div>
          )}

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
                      <button className="action-view" onClick={() => setLibroDetalle(libro)}>
                        <Eye size={15} />
                        Ver
                      </button>

                      <button className="action-edit" onClick={() => editarLibro(libro)}>
                        <Pencil size={15} />
                        Editar
                      </button>

                      <button className="action-status" onClick={() => cambiarEstado(libro)}>
                        <RefreshCcw size={15} />
                        {libro.estado === "Disponible" ? "Prestar" : "Devolver"}
                      </button>

                      <button className="action-delete" onClick={() => confirmarEliminar(libro)}>
                        <Trash2 size={15} />
                        Eliminar
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

      {libroDetalle && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h2>Detalle del libro</h2>
                <button onClick={() => setLibroDetalle(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="detail-list">
                <p>
                  <strong>ID:</strong> {libroDetalle.id}
                </p>
                <p>
                  <strong>Título:</strong> {libroDetalle.titulo}
                </p>
                <p>
                  <strong>Autor:</strong> {libroDetalle.autor}
                </p>
                <p>
                  <strong>Categoría:</strong> {libroDetalle.categoria}
                </p>
                <p>
                  <strong>Estado:</strong> {libroDetalle.estado}
                </p>
              </div>

              <button className="primary-button" onClick={() => setLibroDetalle(null)}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {libroEliminar && (
          <div className="modal-overlay">
            <div className="modal-card">

              <div className="modal-header">
                <h2>Eliminar libro</h2>
              </div>

              <p>
                ¿Seguro que deseas eliminar
                <strong> {libroEliminar.titulo}</strong>?
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "25px",
                }}
              >

                <button
                  className="secondary-button"
                  onClick={() => setLibroEliminar(null)}
                >
                  Cancelar
                </button>

                <button
                  className="primary-button"
                  onClick={eliminarLibro}
                >
                  Eliminar
                </button>

              </div>

            </div>
          </div>
        )}

        
    </main>
  );
}

export default App;