/* ==========================================================================
   Comportamentos comuns a todas as páginas:
   - menu no celular
   - preferências de leitura (alto contraste e tamanho do texto), lembradas no navegador
   ========================================================================== */

(function () {
  "use strict";

  const raiz = document.documentElement;
  raiz.classList.add("js");

  const CHAVE_CONTRASTE = "smartflow_contraste";
  const CHAVE_FONTE = "smartflow_fonte";
  const CHAVE_TEMA = "smartflow_tema";
  const FONTE_MAXIMA = 3;

  // localStorage pode falhar (modo privado, por exemplo). Por isso tudo passa por aqui.
  function ler(chave) {
    try { return window.localStorage.getItem(chave); } catch (erro) { return null; }
  }
  function gravar(chave, valor) {
    try { window.localStorage.setItem(chave, valor); } catch (erro) { /* sem problema: só não lembra */ }
  }

  function aplicarContraste(ativo) {
    if (ativo) { raiz.setAttribute("data-contraste", "alto"); } else { raiz.removeAttribute("data-contraste"); }
    fundoVideo();
    const botao = document.getElementById("btn-contraste");
    if (botao) { botao.setAttribute("aria-pressed", String(ativo)); }
    const tema = document.getElementById("btn-tema");
    if (tema) {
      tema.disabled = ativo;
      tema.title = ativo ? "O alto contraste usa sempre o fundo escuro. Desligue-o para trocar o tema." : "Alternar entre tema escuro e claro";
    }
  }

  // Tema claro/escuro. Com alto contraste ligado o tema fica travado em escuro.
  function aplicarTema(tema) {
    raiz.setAttribute("data-tema", tema);
    fundoVideo();
    const botao = document.getElementById("btn-tema");
    if (botao) {
      botao.setAttribute("aria-checked", String(tema === "claro"));
    }
  }
  function temaAtual() { return raiz.getAttribute("data-tema") === "claro" ? "claro" : "escuro"; }
  function trocarTema(origem) {
    const destino = temaAtual() === "claro" ? "escuro" : "claro";
    const reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gravar(CHAVE_TEMA, destino);
    if (!document.startViewTransition || reduzir) { aplicarTema(destino); return; }
    // A nova cor se espalha em círculo a partir do botão
    const r = origem.getBoundingClientRect();
    raiz.style.setProperty("--tx", Math.round(r.left + r.width / 2) + "px");
    raiz.style.setProperty("--ty", Math.round(r.top + r.height / 2) + "px");
    raiz.classList.add("trocando-tema");
    const t = document.startViewTransition(function () { aplicarTema(destino); });
    t.finished.then(function () { raiz.classList.remove("trocando-tema"); }, function () { raiz.classList.remove("trocando-tema"); });
  }

  // Vídeo ambiente de fundo: só no tema escuro. Sem movimento (poster parado) para quem pediu "reduzir movimento".
  const BASE = (function () {
    const s = document.currentScript;
    return s && s.src ? s.src.replace(/js\/comum\.js.*$/, "") : "";
  })();
  function fundoVideo() {
    const escuro = raiz.getAttribute("data-tema") !== "claro";
    const altoContraste = raiz.getAttribute("data-contraste") === "alto";
    let v = document.querySelector(".fundo-video");
    if (!escuro || altoContraste || !BASE) { if (v) { v.pause(); v.remove(); } return; }
    const reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!v) {
      v = document.createElement("video");
      v.className = "fundo-video";
      v.setAttribute("aria-hidden", "true");
      v.setAttribute("tabindex", "-1");
      v.muted = true; v.loop = true; v.playsInline = true;
      v.setAttribute("disablepictureinpicture", "");
      v.poster = BASE + "img/fotos/hero-poster.jpg";
      if (!reduzir) { v.autoplay = true; v.preload = "auto"; v.src = BASE + "img/fotos/avenida-aerea.mp4"; } else { v.preload = "none"; }
      document.body.insertBefore(v, document.body.firstChild);
    }
    if (!reduzir) { const p = v.play(); if (p && p.catch) { p.catch(function () {}); } }
  }

  function aplicarFonte(nivel) {
    if (nivel > 0) { raiz.setAttribute("data-fonte", String(nivel)); } else { raiz.removeAttribute("data-fonte"); }
    const menos = document.getElementById("btn-fonte-menos");
    const mais = document.getElementById("btn-fonte-mais");
    if (menos) { menos.disabled = nivel === 0; }
    if (mais) { mais.disabled = nivel === FONTE_MAXIMA; }
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Estado salvo
    let contrasteAtivo = ler(CHAVE_CONTRASTE) === "1";
    let nivelFonte = parseInt(ler(CHAVE_FONTE), 10);
    if (isNaN(nivelFonte) || nivelFonte < 0 || nivelFonte > FONTE_MAXIMA) { nivelFonte = 0; }
    aplicarContraste(contrasteAtivo);
    aplicarTema(temaAtual());
    aplicarFonte(nivelFonte);
    const btnTema = document.getElementById("btn-tema");
    if (btnTema) { btnTema.addEventListener("click", function () { trocarTema(btnTema); }); }

    const btnContraste = document.getElementById("btn-contraste");
    const btnMenos = document.getElementById("btn-fonte-menos");
    const btnMais = document.getElementById("btn-fonte-mais");

    if (btnContraste) {
      btnContraste.addEventListener("click", function () {
        contrasteAtivo = !contrasteAtivo;
        aplicarContraste(contrasteAtivo);
        gravar(CHAVE_CONTRASTE, contrasteAtivo ? "1" : "0");
      });
    }
    if (btnMenos) {
      btnMenos.addEventListener("click", function () {
        nivelFonte = Math.max(0, nivelFonte - 1);
        aplicarFonte(nivelFonte);
        gravar(CHAVE_FONTE, String(nivelFonte));
      });
    }
    if (btnMais) {
      btnMais.addEventListener("click", function () {
        nivelFonte = Math.min(FONTE_MAXIMA, nivelFonte + 1);
        aplicarFonte(nivelFonte);
        gravar(CHAVE_FONTE, String(nivelFonte));
      });
    }

    // Fotos reais: se o arquivo não existir, usa a ilustração de reserva
    document.querySelectorAll("img[data-fallback]").forEach(function (img) {
      function usarReserva() {
        img.src = img.getAttribute("data-fallback");
        img.removeAttribute("data-fallback");
        img.classList.remove("foto");
      }
      function marcar() { img.classList.add("foto"); }
      if (img.complete) {
        if (img.naturalWidth === 0) { usarReserva(); } else { marcar(); }
      } else {
        img.addEventListener("load", function () { if (img.hasAttribute("data-fallback")) { marcar(); } });
        img.addEventListener("error", usarReserva);
      }
    });

    // Vídeo de fundo da página inicial: botão para pausar e respeito a "reduzir movimento"
    const video = document.getElementById("heroi-video");
    const btnVideo = document.getElementById("btn-video");
    if (video && btnVideo) {
      function definirVideo(tocando) {
        if (tocando) {
          const p = video.play();
          if (p && p.catch) { p.catch(function () { tocando = false; }); }
        } else {
          video.pause();
        }
        btnVideo.textContent = tocando ? "Pausar vídeo" : "Tocar vídeo";
        btnVideo.setAttribute("aria-pressed", String(!tocando));
      }
      const reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduzir) { definirVideo(false); }
      btnVideo.addEventListener("click", function () { definirVideo(video.paused); });
    }

    // Menu do celular
    const botaoMenu = document.querySelector(".menu-toggle");
    const lista = document.getElementById("menu-principal");
    if (botaoMenu && lista) {
      botaoMenu.addEventListener("click", function () {
        const aberto = lista.classList.toggle("aberto");
        botaoMenu.setAttribute("aria-expanded", String(aberto));
      });
      // Esc fecha o menu e devolve o foco ao botão
      document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && lista.classList.contains("aberto")) {
          lista.classList.remove("aberto");
          botaoMenu.setAttribute("aria-expanded", "false");
          botaoMenu.focus();
        }
      });
    }
  });
})();
