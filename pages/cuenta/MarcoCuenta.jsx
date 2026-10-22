import Marco from '../compartido/Marco.jsx';
import '../../assets/css/cuenta.css';

export default function MarcoCuenta({ children, privado = false, clase = '' }) {
  return (
    <Marco historia="hu1" publico={!privado} clase={clase}>
      {children}
    </Marco>
  );
}
