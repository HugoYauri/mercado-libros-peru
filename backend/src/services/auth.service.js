// Puerto para HU-1. La autenticación real aún no está implementada.
// Implementar hash (scrypt/Argon2id), sesiones revocables y permisos en Express.
// Ningún endpoint privado debe confiar en el usuario demo del navegador.
export const authService = {
  async currentUser() {
    throw new Error("Autenticación de servidor pendiente de HU-1.");
  },
};
