import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Marco from '../compartido/Marco.jsx';
import Enlace from '../compartido/Enlace.jsx';
import TarjetaAviso from '../compartido/TarjetaAviso.jsx';
import '../../assets/css/catalogo.css';

export default function Favoritos() {
  const ejemplos = [
    {
      id: 1,
      title: 'Cálculo de una variable — Stewart, 8.ª ed.',
      price: 95,
      course: 'Cálculo I',
      condition: 'Muy buen estado',
      status: 'Publicado',
    },
    {
      id: 2,
      title: 'Calculadora científica ClassWiz fx-991',
      price: 120,
      course: 'Física II',
      condition: 'Como nuevo',
      status: 'Publicado',
    },
    {
      id: 3,
      title: 'Física para ciencias e ingeniería — Serway',
      price: 110,
      course: 'Física II',
      condition: 'Buen estado',
      status: 'Vendido',
    },
  ];
  const [parametros] = useSearchParams();
  const [avisos, setAvisos] = useState(parametros.get('ejemplo') === 'vacio' ? [] : ejemplos);
  return (
    <Marco historia="hu3" titulo="Mis favoritos" descripcion={avisos.length + ' avisos guardados'}>
      {avisos.length ? (
        <div className="hu3-rejilla-productos hu3-rejilla-favoritos">
          {avisos.map((aviso) => (
            <TarjetaAviso key={aviso.id} aviso={aviso} variant="hu3">
              <button
                className="hu3-corazon hu3-corazon-activo"
                aria-label={'Quitar ' + aviso.title}
                onClick={() => setAvisos(avisos.filter((actual) => actual.id !== aviso.id))}
              >
                ♥
              </button>
            </TarjetaAviso>
          ))}
        </div>
      ) : (
        <section className="hu3-favoritos-vacio hu3-favoritos-vacio-total">
          <span className="hu3-vacio-icono">♡</span>
          <h2>Aún no tienes favoritos</h2>
          <p>Guarda los avisos que te interesan para revisarlos después.</p>
          <Enlace className="hu3-boton" href="/catalogo">
            Explorar catálogo
          </Enlace>
        </section>
      )}
    </Marco>
  );
}
