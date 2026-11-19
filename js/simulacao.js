/* ==========================================================================
   Simulação de um cruzamento (página Solução).

   Dois semáforos recebem EXATAMENTE os mesmos carros, nos mesmos instantes
   (uma única sequência de chegadas sorteada com semente fixa):
   - Ciclo fixo: 30 s Norte–Sul e 14 s Leste–Oeste, sempre (plano ajustado ao movimento médio).
   - SmartFlow: troca quando o lado verde esvazia ou quando o outro lado
     acumula fila (mínimo de 8 s, máximo de 40 s).

   Modelo SIMPLIFICADO e ilustrativo: uma faixa por sentido, sem conversões;
   1 em 10 veículos é ônibus e pedidos de pedestre seguram o verde do SmartFlow. As taxas de chegada são hipóteses do protótipo.
   ========================================================================== */
(function () {
  "use strict";

  const raiz = document.getElementById("sim");
  if (!raiz) { return; }

  const DT = 0.1;              // passo da simulação, em segundos
  const COMP = 170;            // distância onde os carros surgem
  const CARRO = 12;            // espaço ocupado por carro na fila
  const PARADA = 28;           // meia largura da via (linha de retenção)
  const FLUXO = 1.9;           // um carro liberado a cada 1,9 s
  const PARTIDA = 1.0;         // atraso do primeiro carro ao abrir o verde
  const ENTRE = 2;             // vermelho geral entre fases
  const V_CHEGADA = 40;        // velocidade de aproximação
  const V_SAIDA = 55;
  const TEMPO_LIVRE = COMP / V_CHEGADA;
  const DETECTA = 120;         // alcance da "câmera"
  const FIXO_VERDE = [30, 14];   // plano fixo ajustado ao movimento médio: Norte–Sul / Leste–Oeste
  const MIN_VERDE = 8;
  const MAX_VERDE = 40;
  const PERC_ONIBUS = 0.1;     // 1 em cada 10 veículos é ônibus (ocupa 2 vagas e demora mais para sair)
  const PESO_ONIBUS = 3;       // o SmartFlow conta cada ônibus como 3 veículos na fila (muitos passageiros)
  const PEDIDO_PEDESTRE = 1 / 45; // chance por segundo de alguém pedir para atravessar
  const VERDE_PEDESTRE = 12;   // com pedido de travessia, o SmartFlow segura o verde por pelo menos 12 s
  // Chegadas por segundo em cada acesso: Norte, Sul, Leste, Oeste (nível "moderado")
  const BASE = [0.22, 0.20, 0.08, 0.10];
  const FASE_DE = [0, 0, 1, 1];
  const NIVEIS = [
    { nome: "moderado", m: 1 },
    { nome: "intenso", m: 1.25 },
    { nome: "pico", m: 1.5 }
  ];

  const reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = function (id) { return document.getElementById(id); };

  function semente(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function criar() {
    return { t: 0, fase: 0, tFase: 0, vermelho: 0, prox: 0, trocas: 0, pedPend: false, pedAtivo: false, carros: [[], [], [], []],
      lib: [FLUXO - PARTIDA, FLUXO - PARTIDA, FLUXO - PARTIDA, FLUXO - PARTIDA], soma: 0, n: 0, passaram: 0 };
  }

  let nivel = 1, rng, fixo, smart;
  function reiniciar() {
    rng = semente(2026);
    fixo = criar();
    smart = criar();
  }

  function fila(s, a) { return s.carros[a].filter(function (k) { return !k.liberado; }); }
  function contar(s, fase, alcance) {
    let q = 0;
    for (let a = 0; a < 4; a++) {
      if (FASE_DE[a] !== fase) { continue; }
      fila(s, a).forEach(function (k) { if (k.d <= alcance) { q += k.onibus ? PESO_ONIBUS : 1; } });
    }
    return q;
  }

  function deveTrocar(s, tipo) {
    if (tipo === "fixo") { return s.tFase >= FIXO_VERDE[s.fase]; }
    if (s.tFase < (s.pedPend ? VERDE_PEDESTRE : MIN_VERDE)) { return false; }
    const qVerde = contar(s, s.fase, DETECTA);
    const qOutro = contar(s, 1 - s.fase, DETECTA);
    if (qOutro === 0) { return false; }
    return qVerde === 0 || s.tFase >= MAX_VERDE || (s.tFase >= 14 && qOutro >= 2 * qVerde + 3);
  }

  function passo(s, tipo, chegadas, pedido) {
    s.t += DT;
    for (let a = 0; a < 4; a++) {
      if (chegadas[a]) {
        let d = COMP;
        s.carros[a].forEach(function (k) { if (!k.liberado && k.d + CARRO * k.tam > d) { d = k.d + CARRO * k.tam; } });
        s.carros[a].push({ d: d, t0: s.t, liberado: false, onibus: chegadas[a] === 2, tam: chegadas[a] === 2 ? 2 : 1 });
      }
    }
    if (pedido && tipo === "smart") { s.pedPend = true; }
    // Semáforo
    if (s.vermelho > 0) {
      s.vermelho -= DT;
      if (s.vermelho <= 0) {
        s.vermelho = 0; s.fase = s.prox; s.tFase = 0;
        s.lib = [FLUXO - PARTIDA, FLUXO - PARTIDA, FLUXO - PARTIDA, FLUXO - PARTIDA];
      }
    } else {
      s.tFase += DT;
      if (deveTrocar(s, tipo)) { s.prox = 1 - s.fase; s.vermelho = ENTRE; s.pedPend = false; s.trocas++; }
    }
    // Carros
    for (let a = 0; a < 4; a++) {
      let idx = 0;
      s.carros[a].forEach(function (k) {
        if (k.liberado) { k.d -= V_SAIDA * DT; return; }
        const alvo = idx; idx += CARRO * k.tam;
        if (k.d > alvo) { k.d = Math.max(alvo, k.d - V_CHEGADA * DT); }
      });
      if (s.vermelho === 0 && FASE_DE[a] === s.fase) {
        s.lib[a] += DT;
        if (s.lib[a] >= FLUXO) {
          const cab = s.carros[a].find(function (k) { return !k.liberado; });
          if (cab && cab.d <= 1.5) {
            cab.liberado = true; s.lib[a] = cab.onibus ? -1.1 : 0;
            s.soma += Math.max(0, (s.t - cab.t0) - TEMPO_LIVRE); s.n++; s.passaram++;
          } else { s.lib[a] = FLUXO; }
        }
      }
      s.carros[a] = s.carros[a].filter(function (k) { return !(k.liberado && k.d < -170); });
    }
  }

  function avancar() {
    const m = NIVEIS[nivel].m;
    const ch = [0, 1, 2, 3].map(function (a) {
      if (rng() >= BASE[a] * m * DT) { return 0; }
      return rng() < PERC_ONIBUS ? 2 : 1;
    });
    const pedido = rng() < PEDIDO_PEDESTRE * DT;
    passo(fixo, "fixo", ch, pedido);
    passo(smart, "smart", ch, pedido);
  }

  function emFila(s) { let q = 0; for (let a = 0; a < 4; a++) { q += fila(s, a).length; } return q; }
  // Espera média: quem já passou + quem ainda está esperando (senão a fila escondida melhoraria o número)
  function espera(s) {
    let soma = s.soma, n = s.n;
    for (let a = 0; a < 4; a++) {
      fila(s, a).forEach(function (k) { soma += Math.max(0, (s.t - k.t0) - TEMPO_LIVRE); n++; });
    }
    return n ? soma / n : 0;
  }
  function verdeAtual(s) { return s.vermelho > 0 ? 0 : s.tFase; }

  // ---- Canvas -------------------------------------------------------------
  function criarTela(id) {
    const el = $(id);
    return { el: el, ctx: el.getContext("2d") };
  }
  const telas = { fixo: criarTela("sim-cv-fixo"), smart: criarTela("sim-cv-smart") };
  let cores = {};
  function lerCores() {
    const c = getComputedStyle(raiz);
    const v = function (n, f) { return (c.getPropertyValue(n) || f).trim() || f; };
    cores = {
      fundo: v("--superficie", "#0A0E14"), via: v("--elevada", "#101722"), linha: v("--linha-forte", "#2C3C4E"),
      texto: v("--texto-2", "#9DB0C2"), livre: v("--livre", "#34E3B9"), pare: v("--pare", "#FF8A8A"), ambar: "#F5B642"
    };
  }

  function ajustar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    Object.keys(telas).forEach(function (k) {
      const t = telas[k];
      const w = Math.max(200, Math.round(t.el.clientWidth * dpr));
      if (t.el.width !== w) { t.el.width = w; t.el.height = w; }
    });
  }

  function ponto(a, d) {
    if (a === 0) { return [200 - 14, 200 - PARADA - d]; }
    if (a === 1) { return [200 + 14, 200 + PARADA + d]; }
    if (a === 2) { return [200 + PARADA + d, 200 - 14]; }
    return [200 - PARADA - d, 200 + 14];
  }

  function desenhar(s, tela) {
    const ctx = tela.ctx, esc = tela.el.width / 400;
    ctx.setTransform(esc, 0, 0, esc, 0, 0);
    ctx.fillStyle = cores.fundo; ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = cores.via;
    ctx.fillRect(200 - PARADA, 0, PARADA * 2, 400); ctx.fillRect(0, 200 - PARADA, 400, PARADA * 2);
    ctx.strokeStyle = cores.linha; ctx.lineWidth = 1; ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(200, 0); ctx.lineTo(200, 200 - PARADA); ctx.moveTo(200, 200 + PARADA); ctx.lineTo(200, 400);
    ctx.moveTo(0, 200); ctx.lineTo(200 - PARADA, 200); ctx.moveTo(200 + PARADA, 200); ctx.lineTo(400, 200);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = cores.texto; ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(200 - PARADA, 200 - PARADA); ctx.lineTo(200, 200 - PARADA);
    ctx.moveTo(200, 200 + PARADA); ctx.lineTo(200 + PARADA, 200 + PARADA);
    ctx.moveTo(200 + PARADA, 200 - PARADA); ctx.lineTo(200 + PARADA, 200);
    ctx.moveTo(200 - PARADA, 200); ctx.lineTo(200 - PARADA, 200 + PARADA);
    ctx.stroke();
    // Semáforos
    const sinais = [[165, 168], [235, 232], [232, 165], [168, 235]];
    for (let a = 0; a < 4; a++) {
      const verde = s.vermelho === 0 && FASE_DE[a] === s.fase;
      ctx.fillStyle = verde ? cores.livre : cores.pare;
      ctx.beginPath(); ctx.arc(sinais[a][0], sinais[a][1], 5, 0, Math.PI * 2); ctx.fill();
    }
    // Pedestres atravessando as ruas de quem está no vermelho (só aparecem no SmartFlow, que atende o pedido)
    if (s.pedPend && s.vermelho === 0) {
      ctx.fillStyle = cores.texto;
      const pos = (s.t * 6) % 56;
      const faixas = s.fase === 0
        ? [[200 - PARADA + pos, 200 - PARADA - 5], [200 + PARADA - pos, 200 + PARADA + 5]]
        : [[200 - PARADA - 5, 200 - PARADA + pos], [200 + PARADA + 5, 200 + PARADA - pos]];
      faixas.forEach(function (q) { ctx.beginPath(); ctx.arc(q[0], q[1], 3, 0, Math.PI * 2); ctx.fill(); });
    }
    // Carros
    for (let a = 0; a < 4; a++) {
      const vertical = a < 2;
      s.carros[a].forEach(function (k) {
        if (k.d > COMP + 30) { return; }
        const p = ponto(a, k.d);
        let cor = cores.livre;
        if (!k.liberado) {
          const e = (s.t - k.t0) - TEMPO_LIVRE;
          cor = e < 8 ? cores.livre : (e < 25 ? cores.ambar : cores.pare);
        }
        ctx.fillStyle = cor;
        const comp = k.onibus ? 20 : 10, larg = k.onibus ? 8 : 7;
        const w = vertical ? larg : comp, h = vertical ? comp : larg;
        // o centro do veículo fica meio comprimento atrás da frente
        const recuo = (comp - 10) / 2;
        const dx = a === 2 ? recuo : (a === 3 ? -recuo : 0), dy = a === 0 ? -recuo : (a === 1 ? recuo : 0);
        ctx.fillRect(p[0] + dx - w / 2, p[1] + dy - h / 2, w, h);
        if (k.onibus) { ctx.strokeStyle = cores.texto; ctx.lineWidth = 1; ctx.strokeRect(p[0] + dx - w / 2, p[1] + dy - h / 2, w, h); }
      });
    }
  }

  // ---- Interface ----------------------------------------------------------
  function fmt(n, c) { return n.toLocaleString("pt-BR", { minimumFractionDigits: c || 0, maximumFractionDigits: c || 0 }); }

  function textoFase(s) {
    if (s.vermelho > 0) { return "vermelho geral"; }
    return (s.fase === 0 ? "Norte–Sul" : "Leste–Oeste") + " · " + fmt(s.tFase, 0) + " s";
  }

  function resumo() {
    if (fixo.t < 60) { return "Deixe rodar pelo menos 60 s para comparar os dois semáforos."; }
    const eF = espera(fixo), eS = espera(smart);
    const fF = emFila(fixo), fS = emFila(smart);
    let txt = "Em " + fmt(fixo.t, 0) + " s de simulação com movimento " + NIVEIS[nivel].nome + ": ";
    if (eF > 0.5) {
      const r = Math.round((eF - eS) / eF * 100);
      txt += r >= 0 ? "a espera média foi " + r + "% menor com o SmartFlow" : "a espera média foi " + Math.abs(r) + "% maior com o SmartFlow";
    } else {
      txt += "o movimento está tão leve que os dois semáforos quase não fazem diferença";
    }
    txt += " (" + fmt(eF, 1) + " s contra " + fmt(eS, 1) + " s), e há " + fF + " veículos em fila no ciclo fixo contra " + fS + " no SmartFlow.";
    return txt;
  }

  function metricas() {
    [["fixo", fixo], ["smart", smart]].forEach(function (par) {
      const k = par[0], s = par[1];
      $("sim-fila-" + k).textContent = emFila(s) + " veículos";
      $("sim-esp-" + k).textContent = fmt(espera(s), 1) + " s";
      $("sim-pass-" + k).textContent = s.passaram + " veículos";
      $("sim-fase-" + k).textContent = textoFase(s);
    });
    $("sim-relogio").textContent = fmt(fixo.t, 0) + " s";
    $("sim-resumo").textContent = resumo();
  }

  function render() {
    desenhar(fixo, telas.fixo);
    desenhar(smart, telas.smart);
  }

  // ---- Laço ---------------------------------------------------------------
  let velocidade = 10, pausado = reduzir, visivel = false, rodando = false, ultimo = 0, acc = 0, contador = 0;
  const btnPausa = $("sim-pausa");

  function ativo() { return visivel && !pausado && !document.hidden; }

  function quadro(ts) {
    if (!ativo()) { rodando = false; return; }
    const dt = Math.min(0.1, (ts - ultimo) / 1000); ultimo = ts;
    acc += dt * velocidade;
    while (acc >= DT) { avancar(); acc -= DT; if (++contador % 5 === 0) { metricas(); } }
    render();
    window.requestAnimationFrame(quadro);
  }
  function iniciar() {
    if (rodando || !ativo()) { return; }
    rodando = true; ultimo = performance.now();
    window.requestAnimationFrame(quadro);
  }
  function rotuloPausa() { btnPausa.textContent = pausado ? "Rodar simulação" : "Pausar"; btnPausa.setAttribute("aria-pressed", String(!pausado)); }

  function saltar(seg) {
    const n = Math.round(seg / DT);
    for (let i = 0; i < n; i++) { avancar(); }
    metricas(); render();
  }

  btnPausa.addEventListener("click", function () { pausado = !pausado; rotuloPausa(); iniciar(); });
  $("sim-reiniciar").addEventListener("click", function () { reiniciar(); acc = 0; metricas(); render(); $("sim-status").textContent = "Simulação reiniciada."; });
  $("sim-avancar").addEventListener("click", function () {
    saltar(60);
    $("sim-status").textContent = "Avançou 60 segundos. " + resumo();
  });
  raiz.querySelectorAll("[data-vel]").forEach(function (b) {
    b.addEventListener("click", function () {
      velocidade = Number(b.getAttribute("data-vel"));
      raiz.querySelectorAll("[data-vel]").forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
    });
  });
  const nivelEl = $("sim-nivel");
  function lerNivel() {
    nivel = Number(nivelEl.value) - 1;
    const nome = NIVEIS[nivel].nome;
    $("sim-nivel-texto").textContent = nome.charAt(0).toUpperCase() + nome.slice(1);
    nivelEl.setAttribute("aria-valuetext", nome);
  }
  nivelEl.addEventListener("input", function () {
    lerNivel(); reiniciar(); acc = 0; metricas(); render();
    if (reduzir) { saltar(60); }
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; iniciar(); }, { threshold: 0.15 }).observe(raiz);
  } else { visivel = true; }
  document.addEventListener("visibilitychange", iniciar);
  window.addEventListener("resize", function () { ajustar(); render(); });
  new MutationObserver(function () { lerCores(); render(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema", "data-contraste"] });

  // API usada pelo painel "Leitura do sistema"
  window.smartflowSim = {
    estado: function () {
      return {
        fixo: { fila: emFila(fixo), verde: Math.round(verdeAtual(fixo)), ativo: fixo.vermelho === 0 },
        smart: { fila: emFila(smart), verde: Math.round(verdeAtual(smart)), ativo: smart.vermelho === 0 }
      };
    }
  };

  reiniciar(); lerNivel(); lerCores(); ajustar(); rotuloPausa();
  saltar(60); // já abre com 1 minuto de trânsito, para a fila aparecer logo
})();
