import { useEffect, useState } from 'react';
import { listarFotos } from '../../assets/js/compartido/storage.js';
import { perfilPublico } from '../../assets/js/compartido/sesion.js';
import { reputacion } from '../../assets/js/hu6/reputacion.js';
import { dinero } from '../compartido/Marco.jsx';

// Estas funciones solo preparan textos. Nunca cambian los estados guardados.
export function nombrePersona(correo) {
  const persona = perfilPublico(correo);
  return persona ? `${persona.nombres} ${persona.apellidos}` : correo;
}

export function referenciaAcuerdo(id) {
  if (id.startsWith('demo-acuerdo-')) return id.replace('demo-acuerdo-', 'DEMO-');
  return id.slice(0, 8).toUpperCase();
}

export function fechaEncuentro(valor) {
  const fecha = new Date(valor);
  return (
    fecha.toLocaleDateString('es-PE') +
    ' · ' +
    fecha.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  );
}

export function EstadoAcuerdo({ acuerdo, correo, detallado = false }) {
  let texto = acuerdo.estado;
  let color = 'azul';
  if (acuerdo.estado === 'Por confirmar horario') {
    texto = acuerdo.aprobaciones.includes(correo)
      ? 'Esperando respuesta'
      : 'Propuesta recibida';
    color = acuerdo.aprobaciones.includes(correo) ? 'azul' : 'ambar';
    if (detallado)
      texto += acuerdo.aprobaciones.includes(correo)
        ? ' — propuesta enviada'
        : ' — te toca responder';
  }
  if (acuerdo.estado === 'Coordinado') {
    texto = detallado ? 'Acordado — pendiente de entrega' : 'Acordado';
    color = 'verde';
  }
  if (acuerdo.estado === 'Entrega parcial') {
    texto = 'Entrega en curso';
    color = 'ambar';
  }
  if (acuerdo.estado === 'Cerrado') {
    texto = 'Entregado';
    color = 'verde';
  }
  if (acuerdo.estado === 'Cancelado') color = 'rojo';
  return <span className={`hu5-estado hu5-estado-${color}`}>{texto}</span>;
}

export function FotoAcuerdo({ aviso, titulo }) {
  const [foto, setFoto] = useState(aviso?.imagen || '');
  const id = aviso?.id;
  const imagen = aviso?.imagen || '';

  useEffect(() => {
    let vigente = true;
    let url = '';
    setFoto(imagen);
    if (id) {
      listarFotos(id)
        .then((fotos) => {
          if (vigente && fotos.length) {
            url = URL.createObjectURL(fotos[0]);
            setFoto(url);
          }
        })
        .catch(() => {
          // La ausencia de una foto no impide consultar el acuerdo.
        });
    }
    return () => {
      vigente = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [id, imagen]);

  return foto ? (
    <img
      className="hu5-foto"
      src={foto}
      alt={titulo}
    />
  ) : (
    <div
      className="hu5-foto hu5-foto-ejemplo"
      role="img"
      aria-label={'Sin fotografía de ' + titulo}
    />
  );
}

export function PersonaAcuerdo({
  correo,
  rol,
  propia = false,
  mostrarTelefono = false,
  mostrarCarrera = false,
}) {
  const persona = perfilPublico(correo);
  const valoracion = reputacion(correo);
  const iniciales = persona ? persona.nombres[0] + persona.apellidos[0] : '?';

  return (
    <div className="hu5-persona-bloque">
      {rol && <p className="hu5-etiqueta">{rol}</p>}
      <div className="hu5-persona">
        <span
          className={'hu5-avatar' + (propia ? ' hu5-avatar-propio' : '')}
          aria-hidden="true"
        >
          {iniciales}
        </span>
        <div>
          <p className="hu5-nombre">
            {nombrePersona(correo)}
            {propia ? ' (tú)' : ''}
          </p>
          <p className="hu5-texto-secundario">
            {mostrarCarrera && persona?.carrera ? `${persona.carrera} · ` : ''}
            {valoracion.recibidas.length
              ? `${valoracion.promedio.toFixed(1)} ★`
              : 'Sin calificaciones'}
            {mostrarTelefono && persona?.telefono ? ` · ${persona.telefono}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}

export function HistorialAcuerdo({
  acuerdo,
  oferta,
  titulo = 'Trazabilidad',
  compacto = false,
}) {
  const eventos = oferta?.historial || [];
  return (
    <section className={'hu5-panel' + (compacto ? ' hu5-historial-compacto' : '')}>
      <h2 className={compacto ? 'hu5-etiqueta' : undefined}>{titulo}</h2>
      {eventos.length > 0 ? (
        <ol className="hu5-historial">
          {eventos.map((evento) => (
            <li key={evento.id}>
              <span
                className="hu5-punto-evento"
                aria-hidden="true"
              />
              <div>
                <p>
                  {evento.texto}
                  {evento.monto != null && ` — ${dinero(evento.monto)}`}
                </p>
                <small>
                  {fechaEncuentro(evento.fecha)} · {nombrePersona(evento.autor)}
                </small>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="hu5-ayuda">No hay eventos de negociación disponibles.</p>
      )}
      <div className="hu5-situacion-actual">
        <p className="hu5-etiqueta">Situación actual del encuentro</p>
        <p>
          {acuerdo.punto
            ? `${acuerdo.punto} · ${fechaEncuentro(acuerdo.fecha)}`
            : 'Punto y horario pendientes de coordinar.'}
        </p>
        <p className="hu5-ayuda">
          {acuerdo.aprobaciones.length} de 2 aprobaciones ·{' '}
          {acuerdo.confirmaciones.length} de 2 confirmaciones de entrega
        </p>
      </div>
    </section>
  );
}
