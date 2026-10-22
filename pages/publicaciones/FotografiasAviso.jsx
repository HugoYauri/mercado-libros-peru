import { useState } from 'react';
import Marco from '../compartido/Marco.jsx';
import Enlace from '../compartido/Enlace.jsx';
import GaleriaFotografias from './GaleriaFotografias.jsx';
import '../../assets/css/publicaciones.css';

export default function FotografiasAviso() {
  const ejemplos = [
    { nombre: 'Portada', imagen: '' },
    { nombre: 'Página interior', imagen: '' },
    { nombre: 'Contraportada', imagen: '' },
  ];
  const [fotos, setFotos] = useState(ejemplos);
  const [mensaje, setMensaje] = useState('');
  return (
    <Marco
      historia="hu2"
      titulo="Fotografías del aviso"
      descripcion="Máximo 6 imágenes, JPG o PNG de hasta 5 MB cada una."
      migas={
        <>
          <Enlace href="/mis-publicaciones">Mis publicaciones</Enlace>
          <span>› Fotografías</span>
        </>
      }
    >
      {mensaje && (
        <p className="hu2-alerta hu2-alerta-exito" role="status">
          {mensaje}
        </p>
      )}
      <div className="hu2-fotos-distribucion">
        <section className="hu2-panel hu2-editor-fotos">
          <GaleriaFotografias fotos={fotos} cambiar={setFotos} />
          <div className="hu2-fotos-acciones">
            <Enlace className="hu2-enlace" href="/mis-publicaciones">
              Cancelar
            </Enlace>
            <button
              className="hu2-boton"
              onClick={() => setMensaje('Fotografías del ejemplo preparadas.')}
            >
              Guardar fotografías
            </button>
          </div>
        </section>
        <aside className="hu2-columna">
          <section className="hu2-panel">
            <h2 className="hu2-etiqueta">Orden de las fotografías</h2>
            <div className="hu2-ejemplo-orden">
              <span className="hu2-sin-foto" />
              <span className="hu2-indicador-orden" />
              <span className="hu2-sin-foto" />
            </div>
            <p className="hu2-ayuda">Usa Hacer principal para cambiar la fotografía de portada.</p>
          </section>
          <section className="hu2-panel hu2-consejos-fotos">
            <h2 className="hu2-etiqueta">Antes de guardar</h2>
            <p className="hu2-aviso">
              <strong>Portada.</strong> La primera fotografía será la imagen principal.
            </p>
            <p className="hu2-aviso">
              <strong>Formato y tamaño.</strong> Hasta seis JPG o PNG de 5 MB cada una.
            </p>
          </section>
        </aside>
      </div>
    </Marco>
  );
}
