import { useState } from 'react';
import { usuarioActivo } from '../../assets/js/compartido/sesion.js';
import { obtenerAviso } from '../../assets/js/compartido/storage.js';
import { esParticipante } from '../../assets/js/hu4/ofertas.js';
import { calificaciones, reputacion } from '../../assets/js/hu6/reputacion.js';
import Marco, { dinero, useNegociaciones } from '../compartido/Marco.jsx';
import {
  EstadoAcuerdo,
  FotoAcuerdo,
  nombrePersona,
  referenciaAcuerdo,
  fechaEncuentro,
} from './ComponentesAcuerdo.jsx';
import '../../assets/css/acuerdos.css';

function estaTerminado(acuerdo) {
  return ['Cerrado', 'Cancelado'].includes(acuerdo.estado);
}

function FilaAcuerdo({ acuerdo, correo, pendienteCalificar }) {
  const aviso = obtenerAviso(acuerdo.avisoId);
  const contraparte = acuerdo.comprador === correo ? acuerdo.vendedor : acuerdo.comprador;
  const vendo = acuerdo.vendedor === correo;
  const valoracion = reputacion(contraparte);
  let relacion = vendo ? 'vendes a' : 'compras a';
  if (acuerdo.estado === 'Cerrado') relacion = vendo ? 'vendiste a' : 'compraste a';
  if (acuerdo.estado === 'Cancelado') relacion = vendo ? 'vendías a' : 'comprabas a';
  let encuentro = 'Sin punto de encuentro definido';
  if (acuerdo.fecha) {
    encuentro = `${acuerdo.punto} · ${fechaEncuentro(acuerdo.fecha)}`;
    if (acuerdo.estado === 'Cerrado') encuentro = 'Entregado en ' + encuentro;
    if (acuerdo.estado === 'Por confirmar horario') encuentro = 'Propuesta: ' + encuentro;
  }
  if (acuerdo.estado === 'Cancelado') encuentro = 'Cancelado: ' + acuerdo.motivo;
  let etiqueta = 'Ver detalle';
  let destino = `/acuerdos/${acuerdo.id}`;
  let botonVerde = false;

  if (acuerdo.estado === 'Por coordinar') {
    etiqueta = 'Coordinar';
    destino += '?vista=coordinar';
  } else if (acuerdo.estado === 'Por confirmar horario') {
    etiqueta = acuerdo.aprobaciones.includes(correo) ? 'Ver propuesta' : 'Responder';
    destino += '?vista=coordinar';
  } else if (
    ['Coordinado', 'Entrega parcial'].includes(acuerdo.estado) &&
    !acuerdo.confirmaciones.includes(correo)
  ) {
    etiqueta = 'Confirmar entrega';
    destino += '?vista=entrega';
    botonVerde = true;
  } else if (pendienteCalificar) {
    etiqueta = 'Calificar';
    destino = '/calificaciones';
  }
  let claseBoton = 'hu5-boton';
  if (botonVerde) claseBoton += ' hu5-boton-verde';
  else if (pendienteCalificar) claseBoton += ' hu5-boton-borde';
  else if (estaTerminado(acuerdo)) claseBoton += ' hu5-boton-detalle';

  return (
    <article
      className={
        'hu5-fila-acuerdo' + (estaTerminado(acuerdo) ? ' hu5-fila-terminada' : '')
      }
    >
      <FotoAcuerdo
        aviso={aviso}
        titulo={acuerdo.titulo}
      />
      <div className="hu5-fila-descripcion">
        <h3>{acuerdo.titulo}</h3>
        <p>
          {referenciaAcuerdo(acuerdo.id)} · {relacion} {nombrePersona(contraparte)}
          {valoracion.recibidas.length > 0 && ` · ${valoracion.promedio.toFixed(1)} ★`}
        </p>
        <p className={acuerdo.estado === 'Coordinado' ? 'hu5-encuentro-confirmado' : ''}>
          {encuentro}
        </p>
      </div>
      <div className="hu5-fila-acciones">
        <p className="hu5-precio">{dinero(acuerdo.monto)}</p>
        <EstadoAcuerdo
          acuerdo={acuerdo}
          correo={correo}
        />
        <a
          className={claseBoton}
          href={destino}
        >
          {etiqueta}
        </a>
      </div>
    </article>
  );
}

export default function MisAcuerdos() {
  const { acuerdos } = useNegociaciones();
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const correo = usuarioActivo().correo;
  const propios = acuerdos.filter((acuerdo) => esParticipante(acuerdo, correo));
  const resenas = calificaciones();
  const pendientesCalificar = propios.filter(
    (acuerdo) =>
      acuerdo.estado === 'Cerrado' &&
      !resenas.some(
        (resena) => resena.acuerdoId === acuerdo.id && resena.autor === correo,
      ),
  );
  const enCurso = propios.filter((acuerdo) => !estaTerminado(acuerdo));
  const cerrados = propios.filter(estaTerminado);
  const grupos = [
    { id: 'curso', titulo: 'En curso', acuerdos: enCurso },
    { id: 'cerrados', titulo: 'Cerrados', acuerdos: cerrados },
  ];
  const filtros = [
    ['todos', 'Todos', propios.length],
    ['curso', 'En curso', enCurso.length],
    ['cerrados', 'Cerrados', cerrados.length],
  ];
  const gruposVisibles = grupos.map((grupo) => ({
    ...grupo,
    acuerdos: grupo.acuerdos.filter((acuerdo) => {
      const texto = `${acuerdo.titulo} ${referenciaAcuerdo(acuerdo.id)} ${nombrePersona(acuerdo.comprador)} ${nombrePersona(acuerdo.vendedor)} ${acuerdo.punto} ${acuerdo.estado}`;
      return (
        (filtro === 'todos' || filtro === grupo.id) &&
        texto.toLowerCase().includes(busqueda.trim().toLowerCase())
      );
    }),
  }));
  const hayResultados = gruposVisibles.some((grupo) => grupo.acuerdos.length > 0);

  return (
    <Marco
      acuerdos
      busquedaLocal={{ valor: busqueda, cambiar: setBusqueda }}
      titulo="Mis acuerdos"
      descripcion={`${propios.length} ${propios.length === 1 ? 'acuerdo' : 'acuerdos'} · ${enCurso.length} en curso · ${pendientesCalificar.length} ${pendientesCalificar.length === 1 ? 'pendiente' : 'pendientes'} de calificar`}
      acciones={
        <div
          className="hu5-filtros"
          role="group"
          aria-label="Filtrar acuerdos"
        >
          {filtros.map(([valor, etiqueta, cantidad]) => (
            <button
              type="button"
              key={valor}
              className={'hu5-chip' + (filtro === valor ? ' hu5-chip-activo' : '')}
              aria-pressed={filtro === valor}
              onClick={() => setFiltro(valor)}
            >
              {etiqueta} · {cantidad}
            </button>
          ))}
        </div>
      }
    >
      {hayResultados ? (
        gruposVisibles.map(
          (grupo) =>
            grupo.acuerdos.length > 0 && (
              <section
                className="hu5-grupo-acuerdos"
                key={grupo.id}
                aria-labelledby={'hu5-grupo-' + grupo.id}
              >
                <h2
                  id={'hu5-grupo-' + grupo.id}
                  className="hu5-etiqueta"
                >
                  {grupo.titulo}
                </h2>
                <div className="hu5-lista-acuerdos">
                  {grupo.acuerdos.map((acuerdo) => (
                    <FilaAcuerdo
                      key={acuerdo.id}
                      acuerdo={acuerdo}
                      correo={correo}
                      pendienteCalificar={pendientesCalificar.some(
                        (pendiente) => pendiente.id === acuerdo.id,
                      )}
                    />
                  ))}
                </div>
              </section>
            ),
        )
      ) : (
        <section
          className="hu5-panel hu5-vacio"
          role="status"
        >
          <span
            className="hu5-vacio-icono"
            aria-hidden="true"
          >
            ✓
          </span>
          <h2>
            {propios.length
              ? 'No encontramos acuerdos con esos criterios'
              : 'Todavía no tienes acuerdos'}
          </h2>
          <p className="hu5-ayuda">
            {propios.length
              ? 'Prueba con otro filtro o cambia tu búsqueda.'
              : 'Cuando aceptes una oferta, podrás coordinar aquí la entrega de tu material.'}
          </p>
          {propios.length ? (
            <button
              type="button"
              className="hu5-boton"
              onClick={() => {
                setFiltro('todos');
                setBusqueda('');
              }}
            >
              Limpiar filtros
            </button>
          ) : (
            <a
              href="/ofertas"
              className="hu5-boton"
            >
              Ver ofertas
            </a>
          )}
        </section>
      )}
    </Marco>
  );
}
