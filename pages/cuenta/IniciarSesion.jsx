import { useEffect } from 'react';
import { iniciarIniciarSesion } from '../../assets/js/hu1/IniciarSesion.js';

export default function IniciarSesion() {
  useEffect(() => { iniciarIniciarSesion(); }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFAF7] text-[#2A211C]"><header className="border-b border-[#E8DFD8] bg-white">
    <div className="mx-auto flex max-w-[1920px] flex-wrap items-center gap-6 px-6 py-4 lg:px-10">
      <a href="Landing.html" className="flex items-center gap-3 whitespace-nowrap text-xl font-extrabold"><span className="h-9 w-9 rounded-lg bg-[#C1562E]" />Tablón ULima</a>
      <nav className="flex flex-wrap items-center gap-5 text-sm font-bold lg:ml-5 lg:gap-8" aria-label="Navegación principal">
        <a href="../HU3_Catalogo/Catalogo.html" className="hover:text-[#C1562E]">Catálogo</a><a href="Landing.html#como-funciona" className="hover:text-[#C1562E]">Cómo funciona</a><a href="Landing.html#normas" className="hover:text-[#C1562E]">Normas del tablón</a><a href="mailto:tablon@ulima.edu.pe" className="hover:text-[#C1562E]">Ayuda</a>
      </nav>
      <div className="ml-auto flex items-center gap-4 text-sm font-bold"><span className="hidden rounded-full bg-[#EAF2FA] px-4 py-1 text-xs tracking-[.18em] text-[#3B6FA8] sm:inline">VISITANTE</span><a href="Registro.html" className="rounded-lg bg-[#C1562E] px-5 py-2.5 text-white hover:bg-[#9A4223]">Crear cuenta</a></div>
    </div>
  </header>
  <main className="mx-auto grid w-full max-w-[1920px] flex-1 lg:grid-cols-[42%_58%]">
    <section className="flex flex-col justify-center bg-[#FBEBE3] px-6 py-12 lg:px-16" aria-label="Testimonio">
      <div className="foto-ejemplo flex h-[320px] items-center justify-center rounded-xl font-mono text-sm text-[#7A6A62] lg:h-[360px]">fotografía · patio del campus</div>
      <blockquote className="mt-8 text-2xl font-extrabold leading-9">«Vendí mis libros de Cálculo en tres días y compré los de Física del ciclo siguiente.»</blockquote>
      <p className="mt-2 text-[#7A6A62]">Rosa María Quispe Ríos · Administración</p>
    </section>
    <section className="flex items-center justify-center px-6 py-14 lg:px-16">
      <div className="w-full max-w-[520px]">
        <h1 className="text-4xl font-extrabold">Iniciar sesión</h1>
        <p className="mt-3 text-[#7A6A62]">Usa tu correo institucional @aloe.ulima.edu.pe para ofertar, publicar y coordinar entregas.</p>
        <p id="errorCredenciales" className="mt-5 hidden rounded-lg border border-[#B4322B] bg-[#F9ECE9] p-4 text-sm" role="alert"><strong className="text-[#B4322B]">No pudimos ingresar.</strong> El correo o la contraseña no coinciden. <span id="intentosRestantes" /></p>
        <form id="loginForm" className="mt-6" noValidate>
          <label htmlFor="correo" className="block text-xs font-extrabold tracking-[.16em] text-[#7A6A62]">CORREO INSTITUCIONAL</label>
          <input id="correo" type="email" defaultValue="20201234@aloe.ulima.edu.pe" autoComplete="username" className="mt-1 w-full rounded-lg border border-[#E8DFD8] bg-white px-4 py-2.5 outline-none focus:border-[#C1562E]" />
          <label htmlFor="contrasena" className="mt-4 block text-xs font-extrabold tracking-[.16em] text-[#7A6A62]">CONTRASEÑA</label>
          <div className="relative mt-1"><input id="contrasena" type="password" defaultValue="Ulima2026" autoComplete="current-password" className="w-full rounded-lg border border-[#E8DFD8] bg-white px-4 py-2.5 pr-24 outline-none focus:border-[#C1562E]" /><button id="mostrarContrasena" type="button" className="absolute inset-y-0 right-4 text-sm font-bold text-[#C1562E]">Mostrar</button></div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm"><label className="flex items-center gap-2"><input id="recordarme" type="checkbox" defaultChecked className="h-4 w-4 accent-[#C1562E]" />Recordarme</label><a href="RecuperarContrasena.html" className="font-bold text-[#C1562E] hover:underline">¿Olvidaste tu contraseña?</a></div>
          <button id="ingresar" className="mt-7 w-full rounded-lg bg-[#C1562E] px-5 py-3 font-bold text-white hover:bg-[#9A4223]">Ingresar</button>
        </form>
        <p className="mt-4 text-center text-sm text-[#7A6A62]">¿No tienes cuenta? <a href="Registro.html" className="font-bold text-[#C1562E] hover:underline">Crear cuenta</a></p>
      </div>
    </section>
  </main>
  <footer className="border-t border-[#E8DFD8] bg-white"><div className="mx-auto flex max-w-[1920px] flex-wrap justify-between gap-4 px-6 py-6 text-sm lg:px-20"><p className="text-[#7A6A62]">Universidad de Lima · Campus Monterrico · Av. Javier Prado Este 4600</p><div className="flex flex-wrap gap-6 font-bold text-[#C1562E]"><a href="Landing.html#normas">Normas del tablón</a><a href="mailto:tablon@ulima.edu.pe">Mesa de ayuda</a><a href="mailto:tablon@ulima.edu.pe">tablon@ulima.edu.pe</a></div></div></footer></div>
  );
}
