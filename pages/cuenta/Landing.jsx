import { useEffect } from 'react';
import { iniciarLanding } from '../../assets/js/hu1/Landing.js';
import { cabecera, pie } from '../../assets/js/compartido/componentes.js';

export default function Landing() {
  useEffect(() => { iniciarLanding(); }, []);

  return (
    <div className="min-h-screen bg-[#FDFAF7] text-[#2A211C]"><header className="border-b border-[#E8DFD8] bg-white">
    <div className="mx-auto flex max-w-[1920px] flex-wrap items-center gap-6 px-6 py-4 lg:px-10">
      <a href="Landing.html" className="flex items-center gap-3 text-xl font-extrabold whitespace-nowrap">
        <span className="h-9 w-9 rounded-lg bg-[#C1562E]" />{cabecera.nombre}
      </a>
      <nav className="flex flex-wrap items-center gap-5 text-sm font-bold lg:ml-5 lg:gap-8" aria-label="Navegación principal">
        <a href="../HU3_Catalogo/Catalogo.html" className="hover:text-[#C1562E]">Catálogo</a>
        <a href="#como-funciona" className="hover:text-[#C1562E]">Cómo funciona</a>
        <a href="#normas" className="hover:text-[#C1562E]">Normas del tablón</a>
        <a href="mailto:tablon@ulima.edu.pe" className="hover:text-[#C1562E]">Ayuda</a>
      </nav>
      <div className="ml-auto flex items-center gap-4 text-sm font-bold">
        <span className="hidden rounded-full bg-[#EAF2FA] px-4 py-1 text-xs tracking-[.18em] text-[#3B6FA8] sm:inline">VISITANTE</span>
        <a href="IniciarSesion.html" className="text-[#C1562E] hover:underline">Ingresar</a>
        <a href="Registro.html" className="rounded-lg bg-[#C1562E] px-5 py-2.5 text-white hover:bg-[#9A4223]">Crear cuenta</a>
      </div>
    </div>
  </header>
  <main>
    <section className="bg-[#FBEBE3]">
      <div className="mx-auto grid max-w-[1920px] gap-10 px-6 py-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20 lg:px-20 lg:py-12">
        <div>
          <h1 className="max-w-[760px] text-4xl font-extrabold leading-tight md:text-5xl lg:text-[56px]">Lo que a un compañero le sobra,<br className="hidden xl:block" /> a ti te sirve este ciclo</h1>
          <p className="mt-5 max-w-[650px] text-lg leading-7 text-[#7A6A62]">Libros, calculadoras e instrumentos de segunda mano publicados por estudiantes de la Universidad de Lima. Oferta, acuerda y recoge dentro del campus.</p>
          <form id="busquedaForm" className="mt-6 flex max-w-[660px] rounded-lg border border-[#E8DFD8] bg-white p-1.5">
            <label htmlFor="busqueda" className="sr-only">¿Qué estás buscando?</label>
            <input id="busqueda" className="min-w-0 flex-1 px-4 py-2 outline-none" placeholder="¿Qué estás buscando? Ej. Stewart Cálculo" />
            <button className="rounded-lg bg-[#C1562E] px-7 py-2.5 font-bold text-white hover:bg-[#9A4223]">Buscar</button>
          </form>
          <div className="mt-7 flex flex-wrap gap-10">
            <div><strong className="block text-3xl font-extrabold">1,248</strong><span className="text-sm text-[#7A6A62]">avisos activos</span></div>
            <div><strong className="block text-3xl font-extrabold">S/ 62</strong><span className="text-sm text-[#7A6A62]">precio mediano</span></div>
            <div><strong className="block text-3xl font-extrabold">4.8</strong><span className="text-sm text-[#7A6A62]">reputación media</span></div>
          </div>
        </div>
        <div className="foto-ejemplo flex min-h-[300px] items-center justify-center rounded-xl text-center font-mono text-sm text-[#7A6A62] lg:min-h-[340px]">fotografía · estudiantes intercambiando libros</div>
      </div>
    </section>
    <div className="mx-auto max-w-[1920px] px-6 py-8 lg:px-20">
      <section aria-labelledby="tituloCategorias">
        <h2 id="tituloCategorias" className="mb-3 text-xs font-extrabold tracking-[.2em] text-[#7A6A62]">CATEGORÍAS DESTACADAS</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
          <a href="../HU3_Catalogo/Catalogo.html?categoria=Libros%20de%20texto" className="rounded-xl border border-[#E8DFD8] bg-white px-3 py-4 text-center hover:border-[#C1562E]"><span className="mx-auto mb-3 block h-10 w-10 rounded-lg bg-[#FBEBE3]" /><span className="text-sm font-bold">Libros de texto</span></a>
          <a href="../HU3_Catalogo/Catalogo.html?categoria=Calculadoras" className="rounded-xl border border-[#E8DFD8] bg-white px-3 py-4 text-center hover:border-[#C1562E]"><span className="mx-auto mb-3 block h-10 w-10 rounded-lg bg-[#FBEBE3]" /><span className="text-sm font-bold">Calculadoras</span></a>
          <a href="../HU3_Catalogo/Catalogo.html?categoria=Instrumentos%20de%20dibujo" className="rounded-xl border border-[#E8DFD8] bg-white px-3 py-4 text-center hover:border-[#C1562E]"><span className="mx-auto mb-3 block h-10 w-10 rounded-lg bg-[#FBEBE3]" /><span className="text-sm font-bold">Instrumentos de dibujo</span></a>
          <a href="../HU3_Catalogo/Catalogo.html?categoria=Apuntes%20y%20gu%C3%ADas" className="rounded-xl border border-[#E8DFD8] bg-white px-3 py-4 text-center hover:border-[#C1562E]"><span className="mx-auto mb-3 block h-10 w-10 rounded-lg bg-[#FBEBE3]" /><span className="text-sm font-bold">Apuntes y guías</span></a>
          <a href="../HU3_Catalogo/Catalogo.html?categoria=Laptops%20y%20accesorios" className="rounded-xl border border-[#E8DFD8] bg-white px-3 py-4 text-center hover:border-[#C1562E]"><span className="mx-auto mb-3 block h-10 w-10 rounded-lg bg-[#FBEBE3]" /><span className="text-sm font-bold">Laptops y accesorios</span></a>
          <a href="../HU3_Catalogo/Catalogo.html?categoria=Uniformes%20y%20mandiles" className="rounded-xl border border-[#E8DFD8] bg-white px-3 py-4 text-center hover:border-[#C1562E]"><span className="mx-auto mb-3 block h-10 w-10 rounded-lg bg-[#FBEBE3]" /><span className="text-sm font-bold">Uniformes y mandiles</span></a>
          <a href="../HU3_Catalogo/Catalogo.html?categoria=Material%20de%20laboratorio" className="rounded-xl border border-[#E8DFD8] bg-white px-3 py-4 text-center hover:border-[#C1562E]"><span className="mx-auto mb-3 block h-10 w-10 rounded-lg bg-[#FBEBE3]" /><span className="text-sm font-bold">Material de laboratorio</span></a>
        </div>
      </section>
      <section id="avisos" className="mt-5" aria-labelledby="tituloAvisos">
        <div className="mb-3 flex items-center justify-between gap-4"><h2 id="tituloAvisos" className="text-2xl font-extrabold">Avisos recientes</h2><a href="../HU3_Catalogo/Catalogo.html" className="text-sm font-bold text-[#C1562E] hover:underline">Ver todo el catálogo →</a></div>
        <div id="listaAvisos" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <a href="../HU3_Catalogo/DetalleAviso.html?id=av-1" className="flex overflow-hidden rounded-xl border border-[#E8DFD8] bg-white"><div className="foto-ejemplo w-1/3 shrink-0" /><div className="p-3"><h3 className="font-bold">Cálculo de una variable — Stewart</h3><p className="mt-1 text-xl font-extrabold">S/ 95.00</p><p className="text-sm text-[#7A6A62]">Muy buen estado · Cálculo I</p></div></a>
          <a href="../HU3_Catalogo/DetalleAviso.html?id=av-2" className="flex overflow-hidden rounded-xl border border-[#E8DFD8] bg-white"><div className="foto-ejemplo w-1/3 shrink-0" /><div className="p-3"><h3 className="font-bold">Calculadora ClassWiz fx-991</h3><p className="mt-1 text-xl font-extrabold">S/ 120.00</p><p className="text-sm text-[#7A6A62]">Como nuevo · Física II</p></div></a>
          <a href="../HU3_Catalogo/DetalleAviso.html?id=av-3" className="flex overflow-hidden rounded-xl border border-[#E8DFD8] bg-white"><div className="foto-ejemplo w-1/3 shrink-0" /><div className="p-3"><h3 className="font-bold">Escuadras y escalímetro Faber</h3><p className="mt-1 text-xl font-extrabold">S/ 38.00</p><p className="text-sm text-[#7A6A62]">Buen estado · Dibujo Técnico</p></div></a>
          <a href="../HU3_Catalogo/DetalleAviso.html?id=av-4" className="flex overflow-hidden rounded-xl border border-[#E8DFD8] bg-white"><div className="foto-ejemplo w-1/3 shrink-0" /><div className="p-3"><h3 className="font-bold">Apuntes de Contabilidad General</h3><p className="mt-1 text-xl font-extrabold">S/ 25.00</p><p className="text-sm text-[#7A6A62]">Con marcas de uso</p></div></a>
        </div>
        <p id="sinResultados" className="mt-4 hidden rounded-lg border border-[#E8DFD8] bg-white p-5 text-center text-[#7A6A62]">No encontramos avisos recientes con esa búsqueda.</p>
      </section>
      <section id="como-funciona" className="mt-8 grid gap-6 pb-8 md:grid-cols-3">
        <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C1562E] font-bold text-white">1</span><div><h2 className="font-extrabold">Publica tu aviso</h2><p className="text-sm text-[#7A6A62]">Sube fotografías, indica el estado del producto y tu precio pedido.</p></div></div>
        <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C1562E] font-bold text-white">2</span><div><h2 className="font-extrabold">Recibe y negocia ofertas</h2><p className="text-sm text-[#7A6A62]">Acepta, rechaza o contraoferta desde el hilo de negociación.</p></div></div>
        <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C1562E] font-bold text-white">3</span><div><h2 className="font-extrabold">Coordinen la entrega</h2><p className="text-sm text-[#7A6A62]">Elijan punto y horario en el campus y confirmen la entrega.</p></div></div>
      </section>
    </div>
  </main>
  <footer id="normas" className="border-t border-[#E8DFD8] bg-white">
    <div className="mx-auto flex max-w-[1920px] flex-wrap justify-between gap-4 px-6 py-6 text-sm lg:px-20"><p className="text-[#7A6A62]">{pie.direccion}</p><div className="flex flex-wrap gap-6 font-bold text-[#C1562E]"><a href="#normas">Normas del tablón</a><a href={`mailto:${pie.ayuda}`}>Mesa de ayuda</a><a href={`mailto:${pie.ayuda}`}>{pie.ayuda}</a></div></div>
  </footer></div>
  );
}
