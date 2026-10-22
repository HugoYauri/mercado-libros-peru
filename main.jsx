import { createRoot } from 'react-dom/client';
import './assets/css/base.css';
import App from './App.jsx';
import { limpiarDireccionAnterior } from './assets/js/compartido/rutas.js';

limpiarDireccionAnterior();
createRoot(document.getElementById('root')).render(<App />);
