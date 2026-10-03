import axios from "axios";
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  timeout: 10000,
});
const read = async (path, config) => {
  try {
    return (await http.get(path, config)).data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message ||
        "No pudimos conectar con la API. Verifica que esté disponible.",
      { cause: error },
    );
  }
};
const pending = async () => {
  throw new Error(
    "Esta función aún no tiene un servicio REST. Cambia a la demostración local para revisar su pantalla inicial.",
  );
};
export const apiServices = {
  getSession: () => null,
  loginDemo: pending,
  logout: async () => {},
  getCatalogo: (filtros) => read("/avisos", { params: filtros }),
  getMetadata: () => read("/metadata"),
  getAviso: (id) => read(`/avisos/${encodeURIComponent(id)}`),
  getUsuario: (id) => read(`/usuarios/${encodeURIComponent(id)}`),
  getFavoritos: pending,
  toggleFavorito: pending,
  getMisPublicaciones: pending,
  getOfertas: pending,
  getOferta: pending,
  getAcuerdos: pending,
  getAcuerdo: pending,
  registrar: pending,
  recuperarContrasena: pending,
  publicar: pending,
  enviarOferta: pending,
};
