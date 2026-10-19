import NuevoAviso from './NuevoAviso.jsx';

export default function FotografiasAviso() {
  return (
    <NuevoAviso
      soloFotos
      panelFotografias={
        <>
          <section className="hu2-panel">
            <h2 className="hu2-etiqueta">Orden de las fotografías</h2>
            <div
              className="hu2-ejemplo-orden"
              aria-hidden="true"
            >
              <span className="hu2-sin-foto" />
              <span className="hu2-indicador-orden" />
              <span className="hu2-sin-foto" />
            </div>
            <p className="hu2-ayuda">
              Arrastra las miniaturas para cambiar su posición. También puedes usar los
              botones de cada fotografía.
            </p>
          </section>
          <section className="hu2-panel hu2-consejos-fotos">
            <h2 className="hu2-etiqueta">Antes de guardar</h2>
            <p className="hu2-aviso">
              <strong>Portada.</strong> La primera fotografía será la imagen principal del
              aviso.
            </p>
            <p className="hu2-aviso">
              <strong>Formato y tamaño.</strong> Puedes elegir hasta 6 imágenes JPG o PNG
              de un máximo de 5 MB cada una.
            </p>
            <p className="hu2-ayuda">
              Revisa el orden y guarda tus cambios antes de salir.
            </p>
          </section>
        </>
      }
    />
  );
}
