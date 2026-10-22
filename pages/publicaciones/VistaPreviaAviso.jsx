import { dinero } from '../compartido/Marco.jsx';

export default function VistaPreviaAviso({ titulo, precio, condicion, curso, foto }) {
  return (
    <section className="hu2-panel hu2-vista-previa" aria-label="Vista previa del aviso">
      <h2 className="hu2-etiqueta">Vista previa de la tarjeta</h2>
      <div className="hu2-tarjeta-previa">
        {foto ? (
          <img src={foto} alt="Fotografía principal del aviso" />
        ) : (
          <div className="hu2-sin-foto">
            <span>sin fotografía</span>
          </div>
        )}
        <div className="hu2-tarjeta-texto">
          <h3>{titulo || 'Título del aviso'}</h3>
          <p className="hu2-precio">{dinero(precio || 0)}</p>
          <div className="hu2-metadatos">
            <span>{condicion}</span>
            {curso && <span>{curso}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
