import { useEffect } from 'react';
import { iniciarFotografiasAviso } from '../../assets/js/hu2/fotografias.js';

export default function FotografiasAviso() {
  useEffect(() => { iniciarFotografiasAviso(); }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFAF7] text-[#2A211C]"><header className="border-b border-[#E8DFD8] bg-white">
    <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 py-4 lg:px-10"><a href="../HU1_CuentaAcceso/Landing.html" className="flex items-center gap-3 text-xl font-extrabold"><span className="h-9 w-9 rounded-lg bg-[#C1562E]" />Tablón ULima</a><a href="MisPublicaciones.html" className="font-bold text-[#C1562E]">Mis publicaciones</a></div>
  </header>
  <main className="mx-auto w-full max-w-[1100px] flex-1 px-6 py-10">
    <p className="text-sm text-[#7A6A62]"><a href="MisPublicaciones.html" className="font-bold text-[#C1562E]">Mis
        publicaciones</a> › Fotografías</p>
    <h1 className="mt-2 text-3xl font-extrabold">Fotografías del aviso</h1>
    <p className="mt-2 text-[#7A6A62]">Puedes guardar hasta 6 imágenes JPG o PNG de 5 MB como máximo. La primera será la
      portada.</p>
    <div id="avisoTitulo" className="mt-5 rounded-lg bg-[#FBEBE3] p-4 font-bold" />
    <section className="mt-6 rounded-xl border border-[#E8DFD8] bg-white p-6"><label htmlFor="fotos" className="block text-xs font-extrabold tracking-[.15em] text-[#7A6A62]">AGREGAR FOTOGRAFÍAS</label><input id="fotos" type="file" accept="image/png,image/jpeg" multiple className="mt-3 block w-full rounded-lg border border-[#E8DFD8] p-3" />
      <p id="mensaje" className="mt-3 hidden rounded-lg p-3 text-sm" role="status" />
      <div id="galeria" className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3" />
      <div className="mt-6 flex justify-end gap-3"><a href="NuevoAviso.html" id="volver" className="rounded-lg px-5 py-3 font-bold text-[#C1562E]">Volver</a><button id="guardar" className="rounded-lg bg-[#C1562E] px-6 py-3 font-bold text-white">Guardar fotografías</button></div>
    </section>
  </main>
  <footer className="border-t border-[#E8DFD8] bg-white px-6 py-5 text-center text-sm text-[#7A6A62]">Universidad de Lima
    · Campus Monterrico · Av. Javier Prado Este 4600</footer></div>
  );
}
