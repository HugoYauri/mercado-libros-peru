export const cabecera = {
  nombre: 'Tablón ULima',
  catalogo: '/HU3_Catalogo/Catalogo.html',
};

export const pie = {
  direccion: 'Universidad de Lima · Campus Monterrico · Av. Javier Prado Este 4600',
  ayuda: 'tablon@ulima.edu.pe',
};

export function buscarDesdeCabecera(event, idCampo = 'buscar') {
  event.preventDefault();
  const texto = document.getElementById(idCampo)?.value.trim() || '';
  window.location.href = `${cabecera.catalogo}?q=${encodeURIComponent(texto)}`;
}

export function mostrarMensaje(elemento, texto, tipo = 'exito') {
  if (!elemento) return;
  elemento.textContent = texto;
  elemento.classList.remove('hidden');
  elemento.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
}
