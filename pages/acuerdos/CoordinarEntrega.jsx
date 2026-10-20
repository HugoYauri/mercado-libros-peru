import { useState } from 'react';
import { puntosCampus } from '../../assets/js/hu5/acuerdos.js';
import { obtenerAviso } from '../../assets/js/compartido/storage.js';
import { dinero } from '../compartido/Marco.jsx';
import {
  FotoAcuerdo,
  HistorialAcuerdo,
  PersonaAcuerdo,
  referenciaAcuerdo,
  fechaEncuentro,
} from './ComponentesAcuerdo.jsx';

const horasSugeridas = ['08:00', '10:00', '14:00', '16:00'];

// Los campos usan hora local; la función existente de acuerdos guarda la fecha en ISO.
function separarFecha(valor) {
  if (!valor) return { dia: '', hora: '08:00' };
  const fecha = new Date(valor);
  const dia = [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, '0'),
    String(fecha.getDate()).padStart(2, '0'),
  ].join('-');
  const hora = `${String(fecha.getHours()).padStart(2, '0')}:${String(fecha.getMinutes()).padStart(2, '0')}`;
  return { dia, hora };
}

export default function CoordinarEntrega({
  acuerdo,
  oferta,
  correo,
  confirmar,
  volver,
  error,
  guardando,
}) {
  const inicial = separarFecha(acuerdo.fecha);
  const [punto, setPunto] = useState(
    puntosCampus.includes(acuerdo.punto) ? acuerdo.punto : puntosCampus[0],
  );
  const [dia, setDia] = useState(inicial.dia);
  const [hora, setHora] = useState(inicial.hora);
  const aviso = obtenerAviso(acuerdo.avisoId);
  const otraPersona = acuerdo.comprador === correo ? acuerdo.vendedor : acuerdo.comprador;
  const puedoAceptar = acuerdo.fecha && !acuerdo.aprobaciones.includes(correo);
  const hoy = separarFecha(new Date().toISOString()).dia;

  function enviar(event) {
    event.preventDefault();
    confirmar('coordinar', { punto, fecha: `${dia}T${hora}` });
  }

  return (
    <>
      {error && (
        <p
          className="hu5-alerta hu5-alerta-roja"
          role="alert"
        >
          {error}
        </p>
      )}
      <div className="hu5-coordinacion">
        <section
          className={
            'hu5-panel hu5-propuesta' + (puedoAceptar ? ' hu5-propuesta-recibida' : '')
          }
        >
          <p className="hu5-etiqueta">
            {puedoAceptar
              ? 'Propuesta de la contraparte'
              : acuerdo.fecha
                ? 'Propuesta del encuentro'
                : 'Coordinen el encuentro'}
          </p>
          <h2>{acuerdo.punto || 'Elijan un punto dentro del campus'}</h2>
          <p className="hu5-propuesta-fecha">
            {acuerdo.fecha
              ? fechaEncuentro(acuerdo.fecha)
              : 'Todavía no hay una fecha y hora propuestas.'}
          </p>
          <p className="hu5-ayuda">
            Ambas personas deben aprobar el lugar y el horario antes de confirmar la
            entrega.
          </p>
          <div className="hu5-separador" />
          <PersonaAcuerdo
            correo={otraPersona}
            rol={acuerdo.comprador === correo ? 'Vendedor' : 'Comprador'}
            mostrarCarrera
          />
          {puedoAceptar ? (
            <>
              <button
                type="button"
                className="hu5-boton hu5-boton-verde"
                disabled={guardando}
                onClick={() => confirmar('aprobar')}
              >
                Aceptar esta propuesta
              </button>
              <p className="hu5-ayuda hu5-propuesta-nota">
                Al aceptar, ambos podrán confirmar la entrega desde el detalle del
                acuerdo.
              </p>
            </>
          ) : (
            acuerdo.fecha && (
              <p className="hu5-alerta hu5-alerta-azul">
                {acuerdo.aprobaciones.length === 2
                  ? 'Ambas personas aprobaron el encuentro.'
                  : 'Tu propuesta está esperando la respuesta de la otra persona.'}
              </p>
            )
          )}
        </section>

        <section className="hu5-panel hu5-panel-alternativa">
          <h2>
            {acuerdo.fecha ? 'Proponer una alternativa' : 'Proponer punto y horario'}
          </h2>
          <form onSubmit={enviar}>
            <fieldset
              className="hu5-puntos"
              disabled={guardando}
            >
              <legend className="hu5-etiqueta">Punto de encuentro</legend>
              {puntosCampus.map((valor) => (
                <label
                  key={valor}
                  className={'hu5-opcion' + (punto === valor ? ' hu5-opcion-activa' : '')}
                >
                  <input
                    type="radio"
                    name="punto"
                    value={valor}
                    checked={punto === valor}
                    onChange={() => setPunto(valor)}
                    required
                  />
                  <span>{valor}</span>
                </label>
              ))}
            </fieldset>
            <label className="hu5-campo">
              <span className="hu5-etiqueta">Fecha</span>
              <input
                type="date"
                value={dia}
                min={hoy}
                onChange={(event) => setDia(event.target.value)}
                required
                disabled={guardando}
              />
            </label>
            <fieldset
              className="hu5-horas"
              disabled={guardando}
            >
              <legend className="hu5-etiqueta">Hora de encuentro</legend>
              <div>
                {horasSugeridas.map((valor) => (
                  <label key={valor}>
                    <input
                      type="radio"
                      name="hora-sugerida"
                      value={valor}
                      checked={hora === valor}
                      onChange={() => setHora(valor)}
                    />
                    <span>{valor}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <details
              className="hu5-hora-personalizada"
              open={!horasSugeridas.includes(hora)}
            >
              <summary className="hu5-enlace">Elegir otra hora</summary>
              <label className="hu5-campo">
                <span className="hu5-etiqueta">Hora personalizada</span>
                <input
                  type="time"
                  value={hora}
                  onChange={(event) => setHora(event.target.value)}
                  required
                  disabled={guardando}
                />
              </label>
            </details>
            <label className="hu5-campo">
              <span className="hu5-etiqueta">Mensaje (opcional)</span>
              <textarea
                rows={3}
                disabled
                placeholder="Próximamente podrás añadir un mensaje a tu propuesta."
                aria-describedby="hu5-mensaje-pendiente"
              />
              <span
                id="hu5-mensaje-pendiente"
                className="hu5-ayuda"
              >
                Disponible próximamente.
              </span>
            </label>
            <button
              className="hu5-boton hu5-boton-borde"
              disabled={guardando}
            >
              {guardando
                ? 'Guardando…'
                : acuerdo.fecha
                  ? 'Enviar alternativa'
                  : 'Enviar propuesta'}
            </button>
          </form>
        </section>

        <aside className="hu5-columna">
          <section className="hu5-panel hu5-resumen-producto">
            <h2 className="hu5-etiqueta">Acuerdo {referenciaAcuerdo(acuerdo.id)}</h2>
            <div className="hu5-producto-fila">
              <FotoAcuerdo
                aviso={aviso}
                titulo={acuerdo.titulo}
              />
              <div>
                <h3>{acuerdo.titulo}</h3>
                <p className="hu5-precio">{dinero(acuerdo.monto)}</p>
                <p className="hu5-ayuda">monto acordado</p>
              </div>
            </div>
          </section>
          <HistorialAcuerdo
            acuerdo={acuerdo}
            oferta={oferta}
            titulo="Historial de la coordinación"
            compacto
          />
          <section className="hu5-panel hu5-estados-coordinacion">
            <h2 className="hu5-etiqueta">Estados de la coordinación</h2>
            <div>
              <span className="hu5-estado hu5-estado-azul">Esperando respuesta</span>
              <p>La otra persona todavía no aprueba tu propuesta.</p>
            </div>
            <div>
              <span className="hu5-estado hu5-estado-ambar">Propuesta recibida</span>
              <p>Te corresponde responder al punto y horario propuestos.</p>
            </div>
            <div>
              <span className="hu5-estado hu5-estado-verde">Acordado</span>
              <p>Ambas personas aprobaron el encuentro.</p>
            </div>
          </section>
          <p className="hu5-aviso">
            Si propones otro encuentro, la otra persona tendrá que aprobarlo de nuevo.
          </p>
        </aside>
      </div>
      <div className="hu5-volver-fila">
        <button
          type="button"
          className="hu5-enlace"
          onClick={volver}
        >
          ← Volver al detalle del acuerdo
        </button>
      </div>
    </>
  );
}
