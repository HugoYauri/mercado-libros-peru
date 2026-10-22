import { useState } from 'react';
import ModalModeracion from './ModalModeracion.jsx';

export default function Usuarios() {
  const ejemplos = [
    { id: 1, nombre: 'Estudiante A', carrera: 'Ingeniería Industrial', bloqueado: false },
    { id: 2, nombre: 'Estudiante B', carrera: 'Administración', bloqueado: false },
  ];
  const [usuarios, setUsuarios] = useState(ejemplos);
  const [texto, setTexto] = useState('');
  const [seleccion, setSeleccion] = useState(null);
  function confirmar(motivo) {
    setUsuarios(
      usuarios.map((usuario) =>
        usuario.id === seleccion.id
          ? { ...usuario, bloqueado: !usuario.bloqueado, motivo }
          : usuario,
      ),
    );
    setSeleccion(null);
  }
  return (
    <>
      <label>
        Buscar usuarios
        <input
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder="Nombre o carrera"
        />
      </label>
      <div className="rejilla-dos">
        {usuarios
          .filter((usuario) =>
            (usuario.nombre + usuario.carrera).toLowerCase().includes(texto.toLowerCase()),
          )
          .map((usuario) => (
            <article className="neg-tarjeta" key={usuario.id}>
              <div className="neg-fila">
                <h2>{usuario.nombre}</h2>
                <span className="neg-estado">{usuario.bloqueado ? 'Bloqueado' : 'Activo'}</span>
              </div>
              <p className="neg-ayuda">{usuario.carrera}</p>
              <p className="my-3">Ficha ilustrativa, sin cuenta ni credenciales.</p>
              {usuario.motivo && (
                <p className="neg-ayuda" role="status">
                  Última acción: {usuario.motivo}
                </p>
              )}
              <button className="neg-secundario mt-4" onClick={() => setSeleccion(usuario)}>
                {usuario.bloqueado ? 'Desbloquear cuenta' : 'Bloquear cuenta'}
              </button>
            </article>
          ))}
      </div>
      {seleccion && (
        <ModalModeracion
          accion={seleccion.bloqueado ? 'Desbloquear cuenta' : 'Bloquear cuenta'}
          cerrar={() => setSeleccion(null)}
          confirmar={confirmar}
        />
      )}
    </>
  );
}
