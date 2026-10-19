import { useId, useRef, useState } from 'react';

// Solo presenta y ordena la selección. El formulario conserva la validación y el guardado.
export default function GaleriaFotografias({
  urls,
  imagen,
  cargando,
  deshabilitada,
  compacta = false,
  error,
  agregar,
  quitar,
  quitarPortada,
  mover,
}) {
  const entrada = useRef(null);
  const ayudaId = useId();
  const [arrastrandoArchivos, setArrastrandoArchivos] = useState(false);
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
  const cantidad = urls.length + (imagen ? 1 : 0);
  const bloqueada = deshabilitada || cargando;

  function seleccionar(event) {
    agregar(Array.from(event.target.files || []));
    event.target.value = '';
  }

  function soltarArchivos(event) {
    event.preventDefault();
    setArrastrandoArchivos(false);
    if (!bloqueada && origen === null) {
      agregar(Array.from(event.dataTransfer.files));
    }
  }

  function terminarArrastre() {
    setOrigen(null);
    setDestino(null);
  }

  return (
    <div className={compacta ? 'hu2-galeria hu2-galeria-compacta' : 'hu2-galeria'}>
      <input
        ref={entrada}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        aria-label="Seleccionar fotografías"
        aria-describedby={ayudaId}
        disabled={bloqueada}
        className="hu2-archivo-oculto"
        onChange={seleccionar}
      />
      {(!compacta || cantidad === 0) && (
        <button
          type="button"
          className={
            'hu2-zona-carga' +
            (arrastrandoArchivos ? ' hu2-arrastrando' : '') +
            (error ? ' hu2-zona-error' : '')
          }
          disabled={bloqueada}
          onClick={() => entrada.current.click()}
          onDragOver={(event) => {
            event.preventDefault();
            if (!bloqueada) setArrastrandoArchivos(true);
          }}
          onDragLeave={() => setArrastrandoArchivos(false)}
          onDrop={soltarArchivos}
        >
          {!compacta && (
            <span
              className="hu2-subir-icono"
              aria-hidden="true"
            >
              ↑
            </span>
          )}
          <strong>Arrastra tus fotografías aquí</strong>
          <span>
            o <b>búscalas en tu dispositivo</b>
          </span>
        </button>
      )}
      {!compacta && (
        <div className="hu2-galeria-encabezado">
          <span className="hu2-etiqueta">{cantidad} de 6 fotografías</span>
          <span>Arrastra las miniaturas para reordenar</span>
        </div>
      )}
      {cargando && <p role="status">Cargando fotografías…</p>}
      <div className="hu2-miniaturas">
        {urls.map((url, indice) => (
          <figure
            key={url}
            className={
              'hu2-foto' +
              (indice === 0 ? ' hu2-foto-principal' : '') +
              (destino === indice && origen !== indice ? ' hu2-foto-destino' : '') +
              (origen === indice ? ' hu2-foto-arrastrada' : '')
            }
            draggable={!bloqueada}
            onDragStart={(event) => {
              setOrigen(indice);
              event.dataTransfer.effectAllowed = 'move';
              event.dataTransfer.setData('text/plain', String(indice));
            }}
            onDragOver={(event) => {
              if (origen !== null) {
                event.preventDefault();
                setDestino(indice);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (!bloqueada && origen !== null) mover(origen, indice);
              terminarArrastre();
            }}
            onDragEnd={terminarArrastre}
          >
            <img
              src={url}
              alt={'Fotografía ' + (indice + 1)}
              draggable="false"
            />
            {indice === 0 && (
              <figcaption className="hu2-insignia-principal">Principal</figcaption>
            )}
            <button
              type="button"
              className="hu2-quitar-foto"
              disabled={bloqueada}
              onClick={() => quitar(indice)}
              aria-label={'Quitar fotografía ' + (indice + 1)}
            >
              ×
            </button>
            {indice > 0 && (
              <div className="hu2-foto-herramientas">
                <button
                  type="button"
                  disabled={bloqueada}
                  onClick={() => mover(indice, 0)}
                >
                  Hacer principal
                </button>
                <button
                  type="button"
                  disabled={bloqueada}
                  onClick={() => mover(indice, indice - 1)}
                  aria-label={'Mover antes la fotografía ' + (indice + 1)}
                >
                  ←
                </button>
              </div>
            )}
          </figure>
        ))}
        {imagen && (
          <figure
            className={'hu2-foto' + (urls.length === 0 ? ' hu2-foto-principal' : '')}
          >
            <img
              src={imagen}
              alt="Imagen de ejemplo del aviso"
            />
            <figcaption className="hu2-insignia-principal">
              {urls.length === 0 ? 'Principal' : 'De ejemplo'}
            </figcaption>
            <button
              type="button"
              className="hu2-quitar-foto"
              disabled={bloqueada}
              onClick={quitarPortada}
              aria-label="Quitar imagen de ejemplo"
            >
              ×
            </button>
          </figure>
        )}
        {cantidad > 0 && cantidad < 6 && (
          <button
            type="button"
            className="hu2-agregar-foto"
            disabled={bloqueada}
            onClick={() => entrada.current.click()}
          >
            <span aria-hidden="true">+</span>
            {compacta ? 'Agregar foto' : 'Agregar'}
          </button>
        )}
      </div>
      <p
        id={ayudaId}
        className="hu2-ayuda"
      >
        {compacta
          ? `${cantidad} de 6 fotografías. Arrastra las miniaturas para reordenarlas.`
          : 'JPG o PNG de hasta 5 MB cada una. La primera fotografía será la portada.'}
      </p>
      {error && (
        <p
          className="hu2-error-campo"
          role="alert"
        >
          {error}
        </p>
      )}
      {cantidad === 6 && (
        <p
          className="hu2-aviso"
          role="status"
        >
          <strong>Límite alcanzado.</strong> Elimina una fotografía para agregar otra.
        </p>
      )}
    </div>
  );
}
