import { createRoot } from 'react-dom/client';
import './assets/js/compartido/storage.js';
import './assets/css/base.css';
import App from './App.jsx';
import { limpiarDireccionAnterior } from './assets/js/compartido/rutas.js';
import { prepararDemostracion } from './datos/demostracion.js';

limpiarDireccionAnterior();
prepararDemostracion();

createRoot(document.getElementById('root')).render(<App />);
