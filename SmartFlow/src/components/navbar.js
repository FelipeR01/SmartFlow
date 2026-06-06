/* components/navbar.js */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("navbar-placeholder");
  if (!container) return;

  // Detecta se a página está na pasta /pages/ ou no diretório raiz
  const isInPagesFolder = window.location.pathname.includes("/pages/");
  const basePath = isInPagesFolder ? "../" : "./";
  const pagesPath = isInPagesFolder ? "" : "pages/";

  container.innerHTML = `
    <nav class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-10 h-16 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <a href="${basePath}index.html" class="flex items-center gap-2 cursor-pointer font-bold tracking-tight text-white text-xl md:text-2xl font-sans">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
        SmartFlow
      </a>
      
      <div class="hidden md:flex items-center gap-8 font-sans font-medium text-xs uppercase tracking-wider">
        <a href="${basePath}index.html" class="nav-link text-zinc-400 hover:text-white transition-all" id="link-home">Home</a>
        <a href="${basePath}${pagesPath}tecnologia.html" class="nav-link text-zinc-400 hover:text-white transition-all" id="link-tecnologia">Tecnologia</a>
        <a href="${basePath}${pagesPath}simulador.html" class="nav-link text-zinc-400 hover:text-white transition-all" id="link-simulador">Simulador</a>
        <a href="${basePath}${pagesPath}impacto.html" class="nav-link text-zinc-400 hover:text-white transition-all" id="link-impacto">Impacto ESG</a>
        <a href="${basePath}${pagesPath}contato.html" class="nav-link text-zinc-400 hover:text-white transition-all" id="link-contato">Contato</a>
      </div>
      
      <a href="${basePath}${pagesPath}contato.html" class="bg-white text-black hover:bg-zinc-200 px-5 py-2 font-semibold text-xs uppercase tracking-wider transition-all duration-200 rounded-sm active:scale-95">
        Get Started
      </a>
    </nav>

    <!-- Menu Mobile Integrado -->
    <div class="md:hidden fixed bottom-0 left-0 w-full h-16 z-50 bg-black/90 backdrop-blur-md border-t border-zinc-800 flex justify-around items-center px-4">
      <a href="${basePath}index.html" class="mobile-nav-link text-zinc-400 flex flex-col items-center gap-1 text-[10px] uppercase font-bold" id="mob-home">
        <span class="material-symbols-outlined text-lg">home</span>Home
      </a>
      <a href="${basePath}${pagesPath}tecnologia.html" class="mobile-nav-link text-zinc-400 flex flex-col items-center gap-1 text-[10px] uppercase font-bold" id="mob-tecnologia">
        <span class="material-symbols-outlined text-lg">layers</span>Tecno
      </a>
      <a href="${basePath}${pagesPath}simulador.html" class="mobile-nav-link text-zinc-400 flex flex-col items-center gap-1 text-[10px] uppercase font-bold" id="mob-simulador">
        <span class="material-symbols-outlined text-lg">monitoring</span>Simula
      </a>
      <a href="${basePath}${pagesPath}impacto.html" class="mobile-nav-link text-zinc-400 flex flex-col items-center gap-1 text-[10px] uppercase font-bold" id="mob-impacto">
        <span class="material-symbols-outlined text-lg">eco</span>Impacto
      </a>
      <a href="${basePath}${pagesPath}contato.html" class="mobile-nav-link text-zinc-400 flex flex-col items-center gap-1 text-[10px] uppercase font-bold" id="mob-contato">
        <span class="material-symbols-outlined text-lg">mail</span>Contato
      </a>
    </div>
  `;

  // Define a classe ativa baseada no nome do arquivo atual
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const pageName = currentPage.replace(".html", "");

  const activeLink = document.getElementById(`link-${pageName}`);
  const activeMobLink = document.getElementById(`mob-${pageName}`);

  if (activeLink) {
    activeLink.className = "nav-link text-white border-b-2 border-white pb-1";
  }
  if (activeMobLink) {
    activeMobLink.className = "mobile-nav-link text-emerald-400 flex flex-col items-center gap-1 text-[10px] uppercase font-bold";
  }
});