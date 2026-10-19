import { usuarios } from '../assets/js/compartido/sesion.js';
import { avisos, guardarAvisos } from '../assets/js/compartido/storage.js';
import { leerNegociaciones, guardarNegociaciones } from '../assets/js/hu4/ofertas.js';

const rosa = 'rosa.quispe@aloe.ulima.edu.pe';
const diego = 'diego.salazar@aloe.ulima.edu.pe';

export function prepararDemostracion() {
  usuarios();
  if (localStorage.getItem('tablon_demo_completa_v1')) return;
  const titulos = [
    'Álgebra lineal y sus aplicaciones',
    'Programación con Java para principiantes',
    'Estadística aplicada a los negocios',
    'Guía de ejercicios de Física I',
    'Manual de fundamentos de economía',
    'Introducción a bases de datos',
    'Cuaderno de problemas de Cálculo II',
    'Libro de marketing y casos prácticos',
    'Reglas y escuadras para dibujo técnico',
    'Fundamentos de gestión empresarial',
    'Guía de algoritmos y estructuras',
    'Cuaderno de apuntes de Química',
  ];
  const productos = titulos.map((title, indice) => ({
    id: 'demo-producto-' + indice,
    owner: indice % 2 ? diego : rosa,
    title,
    description:
      'Material de ejemplo en buen estado, con anotaciones útiles para repasar los temas del curso.',
    category: indice === 8 ? 'Instrumentos de dibujo' : 'Libros de texto',
    course: ['Matemática', 'Programación', 'Estadística'][indice % 3],
    condition: 'Buen estado',
    price: 40 + indice * 5,
    minimum: 30 + indice * 5,
    acceptsOffers: true,
    status: indice === 10 ? 'Reservado' : indice >= 9 ? 'Vendido' : 'Publicado',
    published: new Date(Date.now() - indice * 86400000).toISOString(),
    imagen: '/imagenes/libro.svg',
  }));
  productos.push({
    ...productos[0],
    id: 'demo-borrador',
    owner: diego,
    title: 'Borrador de un aviso de ejemplo',
    status: 'Borrador',
  });
  const existentes = avisos();
  guardarAvisos([
    ...existentes,
    ...productos.filter((item) => !existentes.some((aviso) => aviso.id === item.id)),
  ]);

  const datos = leerNegociaciones();
  function oferta(id, producto, comprador, estado) {
    return {
      id,
      avisoId: producto.id,
      titulo: producto.title,
      vendedor: producto.owner,
      comprador,
      monto: producto.minimum,
      turno: producto.owner,
      estado,
      historial: [
        {
          id: id + '-mensaje',
          autor: comprador,
          texto: '¿Podemos encontrarnos en la biblioteca?',
          monto: producto.minimum,
          fecha: new Date().toISOString(),
        },
      ],
    };
  }
  const nuevas = [
    oferta('demo-oferta-recibida', productos[0], diego, 'Pendiente'),
    oferta('demo-oferta-enviada', productos[1], rosa, 'Pendiente'),
    oferta('demo-oferta-cerrada', productos[9], rosa, 'Aceptada'),
    oferta('demo-oferta-acuerdo', productos[10], diego, 'Aceptada'),
    oferta('demo-oferta-cerrada-2', productos[11], rosa, 'Aceptada'),
  ];
  datos.ofertas.push(
    ...nuevas.filter((item) => !datos.ofertas.some((vieja) => vieja.id === item.id)),
  );
  const acuerdos = nuevas.slice(2).map((item, indice) => ({
    id: 'demo-acuerdo-' + indice,
    ofertaId: item.id,
    avisoId: item.avisoId,
    titulo: item.titulo,
    comprador: item.comprador,
    vendedor: item.vendedor,
    monto: item.monto,
    estado: indice === 1 ? 'Por coordinar' : 'Cerrado',
    punto: indice === 1 ? '' : 'Biblioteca, ingreso principal',
    fecha: indice === 1 ? '' : new Date(Date.now() - 86400000).toISOString(),
    propuestoPor: item.vendedor,
    aprobaciones: indice === 1 ? [] : [item.comprador, item.vendedor],
    confirmaciones: indice === 1 ? [] : [item.comprador, item.vendedor],
    motivo: '',
  }));
  datos.acuerdos.push(
    ...acuerdos.filter((item) => !datos.acuerdos.some((viejo) => viejo.id === item.id)),
  );
  guardarNegociaciones(datos);

  const resenas = JSON.parse(localStorage.getItem('tablon_calificaciones_v3') || '[]');
  if (!resenas.some((item) => item.id === 'demo-resena'))
    resenas.push({
      id: 'demo-resena',
      acuerdoId: 'demo-acuerdo-2',
      autor: rosa,
      destinatario: diego,
      puntaje: 5,
      comentario: 'El material estaba en buen estado y la entrega fue puntual.',
      fecha: new Date().toISOString(),
    });
  localStorage.setItem('tablon_calificaciones_v3', JSON.stringify(resenas));
  const reportes = JSON.parse(localStorage.getItem('tablon_reportes_v3') || '[]');
  if (!reportes.some((item) => item.id === 'demo-reporte'))
    reportes.push({
      id: 'demo-reporte',
      tipo: 'Aviso',
      objetivo: productos[2].id,
      autor: diego,
      motivo: 'Información incorrecta',
      detalle:
        'La edición indicada no coincide con la descripción del material. Reporte de demostración.',
      estado: 'Pendiente',
      fecha: new Date().toISOString(),
      resolucion: '',
    });
  if (!reportes.some((item) => item.id === 'demo-reporte-usuario'))
    reportes.push({
      id: 'demo-reporte-usuario',
      tipo: 'Usuario',
      objetivo: 'demo@aloe.ulima.edu.pe',
      autor: rosa,
      motivo: 'Incumplimiento de acuerdo',
      detalle:
        'El usuario no asistió al encuentro acordado. Reporte de demostración para moderación.',
      estado: 'Pendiente',
      fecha: new Date().toISOString(),
      resolucion: '',
    });
  localStorage.setItem('tablon_reportes_v3', JSON.stringify(reportes));
  localStorage.setItem('tablon_demo_completa_v1', '1');
}
