/* Movimento com função: as barras do gráfico crescem quando entram na tela e o diagrama animado
   recomeça quando é visto. Nada disso roda para quem pediu "reduzir movimento" no sistema. */
(function () {
  "use strict";

  const reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduzir || !("IntersectionObserver" in window)) { return; }

  function animarMedidor(medidor) {
    const alvo = Number(medidor.getAttribute("value"));
    if (!alvo) { return; }
    const duracao = 900;
    const inicio = performance.now();
    medidor.value = 0;
    function passo(agora) {
      const t = Math.min(1, (agora - inicio) / duracao);
      medidor.value = alvo * (1 - Math.pow(1 - t, 4));
      if (t < 1) { requestAnimationFrame(passo); } else { medidor.value = alvo; }
    }
    requestAnimationFrame(passo);
  }

  function observar(seletor, aoVer, limite) {
    const itens = document.querySelectorAll(seletor);
    if (!itens.length) { return; }
    const obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        aoVer(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: limite });
    itens.forEach(function (el) { obs.observe(el); });
  }

  // Entrada dos blocos ao rolar. O estado "escondido" só existe se este script rodar (classe "mov"),
  // então sem JavaScript tudo continua visível.
  function preparar() {
    document.documentElement.classList.add("mov");
    const grupos = [
      [".secao h2, .secao-titulo", "mov-titulo"],
      [".foto-secao, .galeria li, .diagrama", "mov-foto"],
      [".passos li, .lista-ods li, .fases li, .lista-cartoes li", "mov-item"],
      [".dado-frase, .painel, .resumo, .comparativo, .aviso-dados, .grafico, .lista-fontes", "mov-bloco"]
    ];
    grupos.forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (el, i) {
        if (el.closest(".heroi, .cabecalho-pagina")) { return; }
        el.classList.add(g[1]);
        el.classList.add("mov-d" + (i % 4));
        observarUm(el);
      });
    });
  }
  const vistos = "IntersectionObserver" in window ? new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) { return; }
      e.target.classList.add("revelado");
      vistos.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }) : null;
  function observarUm(el) { if (vistos) { vistos.observe(el); } }

  // Título palavra por palavra: cada palavra vira um <span> (o texto lido pelo leitor de tela não muda)
  function dividirTitulo(h) {
    let n = 0;
    function passar(no) {
      Array.from(no.childNodes).forEach(function (filho) {
        if (filho.nodeType === 3) {
          const partes = filho.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          partes.forEach(function (p) {
            if (!p) { return; }
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            const s = document.createElement("span");
            s.className = "palavra mov-p" + Math.min(n, 11);
            s.textContent = p;
            n += 1;
            frag.appendChild(s);
          });
          no.replaceChild(frag, filho);
        } else if (filho.nodeType === 1) {
          passar(filho);
        }
      });
    }
    passar(h);
  }

  // Botões magnéticos e brilho que segue o ponteiro (só com mouse)
  function ponteiro() {
    if (!window.matchMedia("(pointer: fine)").matches) { return; }
    document.querySelectorAll(".botao").forEach(function (b) {
      let quadro = 0;
      b.addEventListener("pointermove", function (e) {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.28;
        cancelAnimationFrame(quadro);
        quadro = requestAnimationFrame(function () { b.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)"; });
      });
      b.addEventListener("pointerleave", function () {
        cancelAnimationFrame(quadro);
        b.style.transform = "";
      });
    });
    document.querySelectorAll(".heroi .calculadora, .painel, .resumo").forEach(function (p) {
      const luz = document.createElement("span");
      luz.className = "brilho";
      luz.setAttribute("aria-hidden", "true");
      p.insertBefore(luz, p.firstChild);
      p.addEventListener("pointermove", function (e) {
        const r = p.getBoundingClientRect();
        p.style.setProperty("--mx", (e.clientX - r.left) + "px");
        p.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  function iniciar() {
    document.querySelectorAll(".heroi h1, .cabecalho-pagina h1").forEach(dividirTitulo);
    ponteiro();
    preparar();
    // Gráfico do Impacto: cada linha cresce ao aparecer
    observar(".grafico-linha", function (linha) {
      linha.querySelectorAll("meter").forEach(animarMedidor);
    }, 0.3);
    // Diagrama (SVG): recarrega a imagem para a animação começar na hora em que a pessoa vê
    observar('img[src*="diagrama-solucao.svg"]', function (img) {
      img.src = img.getAttribute("src").split("?")[0] + "?v=" + Date.now();
    }, 0.4);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
