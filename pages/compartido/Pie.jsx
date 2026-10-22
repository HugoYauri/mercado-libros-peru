import Enlace from './Enlace.jsx';

export default function Pie({ historia, publico = false }) {
  return (
    <footer className={publico ? 'hu1-pie-publico' : 'neg-pie'}>
      <div className={historia + '-pie-interior'}>
        <span>Universidad de Lima · Campus Monterrico · Av. Javier Prado Este 4600</span>
        <div>
          <Enlace href="/#normas">Normas del tablón</Enlace>
          <Enlace href="mailto:tablon@ulima.edu.pe">Mesa de ayuda</Enlace>
          <Enlace href="mailto:tablon@ulima.edu.pe">tablon@ulima.edu.pe</Enlace>
        </div>
      </div>
    </footer>
  );
}
