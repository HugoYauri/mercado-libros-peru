import { useState } from 'react';
import { dinero } from '../compartido/Marco.jsx';
import { FotoAcuerdo, PersonaAcuerdo } from './ComponentesAcuerdo.jsx';

export default function CoordinarEntrega({ acuerdo, confirmar, volver }) {
  const puntos = ['Biblioteca central', 'Pabellón A', 'Cafetería central'];
  const horas = ['08:00', '10:00', '14:00', '16:00'];
  const estados = [
    ['azul', 'Esperando respuesta'],
    ['ambar', 'Propuesta recibida'],
    ['verde', 'Acordado'],
  ];
  const [propuesta, setPropuesta] = useState({
    punto: acuerdo.punto || puntos[0],
    dia: '',
    hora: '10:00',
  });
  return (
    <>
      <div className="hu5-coordinacion">
        <section className="hu5-panel hu5-propuesta hu5-propuesta-recibida">
          <p className="hu5-etiqueta">Propuesta del encuentro</p>
          <h2>{acuerdo.punto || 'Elijan un punto dentro del campus'}</h2>
          <p className="hu5-propuesta-fecha">
            {acuerdo.fecha || 'Todavía no hay una fecha y hora propuestas.'}
          </p>
          <p className="hu5-ayuda">Revisa el lugar y el horario antes de aceptar.</p>
          <div className="hu5-separador" />
          <PersonaAcuerdo nombre="María García" iniciales="MG" rol="Vendedor" />
          {acuerdo.punto && (
            <button
              className="hu5-boton hu5-boton-verde"
              onClick={() => confirmar({ ...acuerdo, estado: 'Acordado' })}
            >
              Aceptar esta propuesta
            </button>
          )}
        </section>
        <section className="hu5-panel hu5-panel-alternativa">
          <h2>Proponer punto y horario</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              confirmar({
                ...acuerdo,
                punto: propuesta.punto,
                fecha: propuesta.dia + ' · ' + propuesta.hora,
                estado: 'Propuesta recibida',
              });
            }}
          >
            <fieldset className="hu5-puntos">
              <legend className="hu5-etiqueta">Punto de encuentro</legend>
              {puntos.map((punto) => (
                <label
                  key={punto}
                  className={'hu5-opcion' + (propuesta.punto === punto ? ' hu5-opcion-activa' : '')}
                >
                  <input
                    type="radio"
                    name="punto"
                    checked={propuesta.punto === punto}
                    onChange={() => setPropuesta({ ...propuesta, punto })}
                  />
                  <span>{punto}</span>
                </label>
              ))}
            </fieldset>
            <label className="hu5-campo">
              <span className="hu5-etiqueta">Fecha</span>
              <input
                type="date"
                required
                min={new Date().toISOString().slice(0, 10)}
                value={propuesta.dia}
                onChange={(event) => setPropuesta({ ...propuesta, dia: event.target.value })}
              />
            </label>
            <fieldset className="hu5-horas">
              <legend className="hu5-etiqueta">Hora de encuentro</legend>
              <div>
                {horas.map((hora) => (
                  <label key={hora}>
                    <input
                      type="radio"
                      name="hora"
                      checked={propuesta.hora === hora}
                      onChange={() => setPropuesta({ ...propuesta, hora })}
                    />
                    <span>{hora}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <details className="hu5-hora-personalizada">
              <summary className="hu5-enlace">Elegir otra hora</summary>
              <label className="hu5-campo">
                Hora personalizada
                <input
                  type="time"
                  required
                  value={propuesta.hora}
                  onChange={(event) => setPropuesta({ ...propuesta, hora: event.target.value })}
                />
              </label>
            </details>
            <label className="hu5-campo">
              <span className="hu5-etiqueta">Mensaje (opcional)</span>
              <textarea rows={3} maxLength={300} />
            </label>
            <button className="hu5-boton hu5-boton-borde">Enviar propuesta</button>
          </form>
        </section>
        <aside className="hu5-columna">
          <section className="hu5-panel hu5-resumen-producto">
            <h2 className="hu5-etiqueta">Acuerdo AC-001</h2>
            <div className="hu5-producto-fila">
              <FotoAcuerdo titulo={acuerdo.titulo} />
              <div>
                <h3>{acuerdo.titulo}</h3>
                <p className="hu5-precio">{dinero(acuerdo.monto)}</p>
                <p className="hu5-ayuda">monto acordado</p>
              </div>
            </div>
          </section>
          <section className="hu5-panel hu5-estados-coordinacion">
            <h2 className="hu5-etiqueta">Estados de la coordinación</h2>
            {estados.map(([color, texto]) => (
              <div key={texto}>
                <span className={'hu5-estado hu5-estado-' + color}>{texto}</span>
              </div>
            ))}
          </section>
          <p className="hu5-aviso">Los cambios solo afectan a este ejemplo.</p>
        </aside>
      </div>
      <div className="hu5-volver-fila">
        <button className="hu5-enlace" onClick={volver}>
          ← Volver al detalle del acuerdo
        </button>
      </div>
    </>
  );
}
