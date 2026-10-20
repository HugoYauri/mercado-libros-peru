import { obtenerAviso } from '../../assets/js/compartido/storage.js';
import { usuarioActivo } from '../../assets/js/compartido/sesion.js';
import Marco, { dinero, useNegociaciones } from '../compartido/Marco.jsx';
import {
  FotoAcuerdo,
  PersonaAcuerdo,
  nombrePersona,
  referenciaAcuerdo,
} from './ComponentesAcuerdo.jsx';
import '../../assets/css/acuerdos.css';

export default function AcuerdoGenerado({ acuerdo, volver }) {
  const aviso = obtenerAviso(acuerdo.avisoId);
  const correo = usuarioActivo().correo;
  const { ofertas } = useNegociaciones();
  const oferta = ofertas.find((item) => item.id === acuerdo.ofertaId);
  const aceptacion = oferta?.historial?.find(
    (evento) => evento.texto === 'Propuesta aceptada',
  );
  const contraparte = acuerdo.comprador === correo ? acuerdo.vendedor : acuerdo.comprador;
  const terminado = ['Cerrado', 'Cancelado'].includes(acuerdo.estado);
  let titulo = '¡Trato cerrado!';
  if (acuerdo.estado === 'Cerrado') titulo = 'Entrega completada';
  if (acuerdo.estado === 'Cancelado') titulo = 'Acuerdo cancelado';

  return (
    <Marco
      acuerdos
      sinTitulo
    >
      <div className="hu5-generado-contenedor">
        <section
          className={
            'hu5-generado' +
            (acuerdo.estado === 'Cancelado' ? ' hu5-generado-cancelado' : '')
          }
          aria-labelledby="hu5-trato-titulo"
        >
          <div className="hu5-generado-titulo">
            <span
              className="hu5-exito-icono"
              aria-hidden="true"
            >
              {acuerdo.estado === 'Cancelado' ? '!' : '✓'}
            </span>
            <h1 id="hu5-trato-titulo">{titulo}</h1>
            <p>
              La oferta con {nombrePersona(contraparte)} fue aceptada.{' '}
              {terminado
                ? 'Consulta el detalle para revisar el resultado del acuerdo.'
                : 'Ahora coordinen un punto y un horario de encuentro dentro del campus.'}
            </p>
          </div>
          <article className="hu5-producto hu5-producto-generado">
            <FotoAcuerdo
              aviso={aviso}
              titulo={acuerdo.titulo}
            />
            <div>
              <h2>{acuerdo.titulo}</h2>
              {aviso && (
                <p className="hu5-texto-secundario">
                  {aviso.category} · {aviso.course} · {aviso.condition}
                </p>
              )}
              <div className="hu5-precio-fila">
                <p className="hu5-precio">{dinero(acuerdo.monto)}</p>
                {aviso && (
                  <small>Monto acordado (precio pedido {dinero(aviso.price)})</small>
                )}
              </div>
            </div>
          </article>
          <div className="hu5-generado-datos">
            <section className="hu5-panel">
              <PersonaAcuerdo
                correo={contraparte}
                rol={acuerdo.comprador === correo ? 'Vendedor' : 'Comprador'}
                mostrarCarrera
                mostrarTelefono
              />
            </section>
            <section className="hu5-panel">
              <h2 className="hu5-etiqueta">Código del acuerdo</h2>
              <p
                className="hu5-referencia"
                title={acuerdo.id}
              >
                {referenciaAcuerdo(acuerdo.id)}
              </p>
              <p className="hu5-texto-secundario">
                {aceptacion
                  ? `Generado el ${new Date(aceptacion.fecha).toLocaleDateString('es-PE')}`
                  : 'Identificador para consultar tu acuerdo.'}
              </p>
            </section>
            <section className="hu5-panel">
              <h2 className="hu5-etiqueta">Siguiente paso</h2>
              <p className="hu5-nombre">
                {terminado ? 'Consultar el resultado' : 'Coordinar el encuentro'}
              </p>
              <p className="hu5-texto-secundario">
                {terminado
                  ? 'Revisa el detalle y las acciones disponibles.'
                  : 'Propongan un lugar y una hora que les convengan a ambos.'}
              </p>
            </section>
          </div>
          <p className="hu5-aviso">
            {aviso?.status === 'Reservado'
              ? 'El aviso quedó reservado para este acuerdo. Las otras ofertas pendientes quedaron cerradas.'
              : `Estado actual del acuerdo: ${acuerdo.estado}.`}
          </p>
          <div className="hu5-generado-acciones">
            <a
              className="hu5-boton"
              href={`/acuerdos/${acuerdo.id}${terminado || acuerdo.confirmaciones.length ? '' : '?vista=coordinar'}`}
            >
              {terminado || acuerdo.confirmaciones.length
                ? 'Ver detalle del acuerdo'
                : 'Proponer punto y horario'}
            </a>
            <a
              className="hu5-boton hu5-boton-borde"
              href="/acuerdos"
            >
              Ver mis acuerdos
            </a>
          </div>
        </section>
        <button
          type="button"
          className="hu5-enlace hu5-volver-negociacion"
          onClick={volver}
        >
          Volver a la negociación
        </button>
      </div>
    </Marco>
  );
}
