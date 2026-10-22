import { useId, useState } from 'react';

export default function GaleriaFotografias({ fotos = [], compacta = false, cambiar }) {
  const id = useId();
  const [error, setError] = useState('');
  function agregar(archivos) {
    const lista = Array.from(archivos);
    if (
      lista.length + fotos.length > 6 ||
      lista.some(
        (foto) => !['image/jpeg', 'image/png'].includes(foto.type) || foto.size > 5 * 1024 * 1024,
      )
    ) {
      setError('Selecciona hasta 6 JPG o PNG de máximo 5 MB.');
      return;
    }
    setError('');
    lista.forEach((archivo) => {
      const lector = new FileReader();
      lector.onload = () => {
        cambiar((actuales) =>
          [...actuales, { nombre: archivo.name, imagen: lector.result }].slice(0, 6),
        );
      };
      lector.onerror = () => setError('No pudimos leer la fotografía. Intenta con otra imagen.');
      lector.readAsDataURL(archivo);
    });
  }
  function mover(indice) {
    const nuevas = [...fotos];
    nuevas.unshift(nuevas.splice(indice, 1)[0]);
    cambiar(nuevas);
  }
  return (
    <div className={'hu2-galeria' + (compacta ? ' hu2-galeria-compacta' : '')}>
      <input
        id={id}
        type="file"
        className="hu2-archivo-oculto"
        aria-label="Seleccionar fotografías"
        accept="image/jpeg,image/png"
        multiple
        onChange={(event) => {
          agregar(event.target.files);
          event.target.value = '';
        }}
      />
      {(!compacta || !fotos.length) && (
        <label
          htmlFor={id}
          className="hu2-zona-carga"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            agregar(event.dataTransfer.files);
          }}
        >
          <span className="hu2-subir-icono">↑</span>
          <strong>Arrastra tus fotografías aquí</strong>
          <span>
            o <b>búscalas en tu dispositivo</b>
          </span>
        </label>
      )}
      {!compacta && (
        <div className="hu2-galeria-encabezado">
          <span className="hu2-etiqueta">{fotos.length} de 6 fotografías</span>
          <span>Usa Hacer principal para cambiar la portada</span>
        </div>
      )}
      <div className="hu2-miniaturas">
        {fotos.map((foto, i) => (
          <figure
            className={'hu2-foto' + (i === 0 ? ' hu2-foto-principal' : '')}
            key={foto.nombre + i}
          >
            {foto.imagen ? (
              <img src={foto.imagen} alt={foto.nombre} />
            ) : (
              <div className="hu2-sin-foto" style={{ height: '100%' }}>
                {foto.nombre}
              </div>
            )}
            {i === 0 && <figcaption className="hu2-insignia-principal">Principal</figcaption>}
            <button
              type="button"
              className="hu2-quitar-foto"
              aria-label={'Quitar fotografía ' + (i + 1)}
              onClick={() => {
                cambiar(fotos.filter((_, indice) => indice !== i));
              }}
            >
              ×
            </button>
            {i > 0 && (
              <div className="hu2-foto-herramientas">
                <button type="button" onClick={() => mover(i)}>
                  Hacer principal
                </button>
              </div>
            )}
          </figure>
        ))}
        {fotos.length > 0 && fotos.length < 6 && (
          <label htmlFor={id} className="hu2-agregar-foto">
            <span>+</span>Agregar foto
          </label>
        )}
      </div>
      <p className="hu2-ayuda">{fotos.length} de 6 fotografías. JPG o PNG de hasta 5 MB.</p>
      {error && (
        <p className="hu2-error-campo" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
