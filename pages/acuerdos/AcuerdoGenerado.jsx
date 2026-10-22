import Marco, { dinero } from '../compartido/Marco.jsx';
import Enlace from '../compartido/Enlace.jsx';
import { FotoAcuerdo, PersonaAcuerdo } from './ComponentesAcuerdo.jsx';
import '../../assets/css/acuerdos.css';

export default function AcuerdoGenerado() {
  const ejemplos = [
    { titulo: 'Cálculo de una variable — Stewart, 8.ª ed.', monto: 88, codigo: 'AC-001' },
  ];
  const acuerdo = ejemplos[0];
  return (
    <Marco historia="hu5">
      <div className="hu5-generado-contenedor">
        <section className="hu5-generado">
          <div className="hu5-generado-titulo">
            <span className="hu5-exito-icono">✓</span>
            <h1>¡Trato cerrado!</h1>
            <p>
              La oferta con María García fue aceptada. Ahora coordinen un punto y un horario de
              encuentro dentro del campus.
            </p>
          </div>
          <article className="hu5-producto hu5-producto-generado">
            <FotoAcuerdo titulo={acuerdo.titulo} />
            <div>
              <h2>{acuerdo.titulo}</h2>
              <p className="hu5-texto-secundario">Libros de texto · Cálculo I · Muy buen estado</p>
              <div className="hu5-precio-fila">
                <p className="hu5-precio">{dinero(acuerdo.monto)}</p>
                <small>Monto acordado (precio pedido S/ 95.00)</small>
              </div>
            </div>
          </article>
          <div className="hu5-generado-datos">
            <section className="hu5-panel">
              <PersonaAcuerdo nombre="María García" iniciales="MG" rol="Vendedor" />
            </section>
            <section className="hu5-panel">
              <h2 className="hu5-etiqueta">Código del acuerdo</h2>
              <p className="hu5-referencia">{acuerdo.codigo}</p>
              <p className="hu5-texto-secundario">Identificador de ejemplo.</p>
            </section>
            <section className="hu5-panel">
              <h2 className="hu5-etiqueta">Siguiente paso</h2>
              <p className="hu5-nombre">Coordinar el encuentro</p>
              <p className="hu5-texto-secundario">
                Propongan un lugar y una hora que les convengan a ambos.
              </p>
            </section>
          </div>
          <p className="hu5-aviso">
            Ejemplo de acuerdo reservado, independiente de la HU de ofertas.
          </p>
          <div className="hu5-generado-acciones">
            <Enlace className="hu5-boton" href="/acuerdos/1?vista=coordinar">
              Proponer punto y horario
            </Enlace>
            <Enlace className="hu5-boton hu5-boton-borde" href="/acuerdos">
              Ver mis acuerdos
            </Enlace>
          </div>
        </section>
      </div>
    </Marco>
  );
}
