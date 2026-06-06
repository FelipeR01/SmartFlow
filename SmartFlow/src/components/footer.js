/* components/footer.js */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("footer-placeholder");
  if (!container) return;

  const isInPagesFolder = window.location.pathname.includes("/pages/");
  const basePath = isInPagesFolder ? "../" : "./";
  const pagesPath = isInPagesFolder ? "" : "pages/";

  container.innerHTML = `
    <footer class="w-full py-12 px-6 md:px-10 border-t border-zinc-900 bg-zinc-950/40 text-xs">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div class="space-y-3">
          <div class="font-bold text-lg md:text-xl text-white">SmartFlow</div>
          <p class="text-zinc-500 text-[11px] leading-relaxed max-w-md">
            SmartFlow © 2026 - Projeto Global Solution FIAP.<br>
            Desenvolvido por Felipe Rodrigues e Equipe. Todos os direitos reservados.
          </p>
        </div>
        
        <div class="flex flex-col md:items-end gap-4">
          <div class="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] text-zinc-400 uppercase font-semibold">
            <a href="${basePath}index.html" class="hover:text-white transition-colors">Home</a>
            <a href="${basePath}${pagesPath}tecnologia.html" class="hover:text-white transition-colors">Tecnologia</a>
            <a href="${basePath}${pagesPath}simulador.html" class="hover:text-white transition-colors">Simulador</a>
            <a href="${basePath}${pagesPath}impacto.html" class="hover:text-white transition-colors">Impacto ESG</a>
            <a href="${basePath}${pagesPath}contato.html" class="hover:text-white transition-colors">Contato</a>
          </div>
          <span class="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
            SP_GLOBAL_HUB // INTEGRATION 2026
          </span>
        </div>
      </div>
    </footer>
  `;
});
