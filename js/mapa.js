/* ==========================================================================
   Mapa esquemático dos reportes (página Reportar).
   NÃO é um mapa geográfico: as regiões são desenhadas de forma simbólica e
   fora de escala. Cada reporte salvo no navegador vira um pino na sua região.
   Clicar numa região (ou apertar Enter nela) preenche o campo "Região".
   ========================================================================== */
(function () {
  "use strict";

  const svg = document.getElementById("mapa-svg");
  const resumo = document.getElementById("mapa-resumo");
  const campoRegiao = document.getElementById("regiao");
  if (!svg || !resumo || !campoRegiao || typeof corredores === "undefined") { return; }

  const NS = "http://www.w3.org/2000/svg";
  const CHAVE = "smartflow_reportes";
  // x, y, largura, altura de cada região no desenho
  const REGIOES = {
    Norte:  { x: 120, y: 10,  w: 160, h: 90 },
    Oeste:  { x: 10,  y: 110, w: 120, h: 140 },
    Centro: { x: 140, y: 110, w: 120, h: 140 },
    Leste:  { x: 270, y: 110, w: 120, h: 140 },
    Sul:    { x: 120, y: 260, w: 160, h: 90 }
  };
  // Posição simbólica de cada corredor (mesmo id de dados.js)
  const POS = { 1: [200, 150], 2: [190, 205], 3: [55, 150], 4: [90, 195], 5: [50, 225], 6: [200, 300], 7: [245, 325],
    8: [160, 325], 9: [310, 150], 10: [350, 200], 11: [300, 225], 12: [170, 50], 13: [240, 75] };

  function el(nome, attrs, pai) {
    const e = document.createElementNS(NS, nome);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (pai) { pai.appendChild(e); }
    return e;
  }

  function carregar() {
    try {
      const lista = JSON.parse(window.localStorage.getItem(CHAVE) || "[]");
      return Array.isArray(lista) ? lista : [];
    } catch (erro) { return []; }
  }

  // Deslocamento fixo para cada reporte, para pinos da mesma região não ficarem empilhados
  function deslocamento(id, limite) {
    let h = 0;
    String(id).split("").forEach(function (ch) { h = (h * 31 + ch.charCodeAt(0)) % 997; });
    return ((h % 100) / 100 - 0.5) * 2 * limite;
  }

  function escolher(regiao) {
    campoRegiao.value = regiao;
    campoRegiao.dispatchEvent(new Event("change", { bubbles: true }));
    campoRegiao.focus();
  }

  // Parte fixa do desenho (regiões e corredores)
  Object.keys(REGIOES).forEach(function (nome) {
    const r = REGIOES[nome];
    const g = el("g", { "class": "mapa-regiao", tabindex: "0", role: "button", "aria-label": "Escolher a região " + nome + " no formulário" }, svg);
    el("rect", { x: r.x, y: r.y, width: r.w, height: r.h, rx: 14, "class": "mapa-bloco" }, g);
    const t = el("text", { x: r.x + r.w / 2, y: r.y + 18, "text-anchor": "middle", "class": "mapa-nome" }, g);
    t.textContent = nome;
    g.addEventListener("click", function () { escolher(nome); });
    g.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); escolher(nome); }
    });
  });
  corredores.forEach(function (c) {
    const p = POS[c.id];
    if (!p) { return; }
    const ponto = el("circle", { cx: p[0], cy: p[1], r: 3.5, "class": "mapa-corredor" }, svg);
    const titulo = el("title", {}, ponto);
    titulo.textContent = c.nome;
  });
  const camada = el("g", { "aria-hidden": "true" }, svg);

  function desenhar() {
    const lista = carregar();
    camada.innerHTML = "";
    const contagem = { Norte: 0, Oeste: 0, Centro: 0, Leste: 0, Sul: 0 };
    lista.forEach(function (rep) {
      const r = REGIOES[rep.regiao];
      if (!r) { return; }
      contagem[rep.regiao]++;
      const cx = r.x + r.w / 2 + deslocamento(rep.id, r.w / 2 - 14);
      const cy = r.y + r.h / 2 + 8 + deslocamento(String(rep.id) + "y", r.h / 2 - 26);
      const pino = el("g", { "class": "mapa-pino" }, camada);
      el("circle", { cx: cx, cy: cy, r: 8 }, pino);
      const t = el("title", {}, pino);
      t.textContent = (rep.tipo || "Reporte") + ": " + (rep.local || "");
    });
    const partes = Object.keys(contagem).map(function (k) { return k + ": " + contagem[k]; });
    resumo.textContent = lista.length === 0
      ? "Nenhum reporte no mapa ainda. Envie o primeiro pelo formulário."
      : lista.length + (lista.length === 1 ? " reporte" : " reportes") + " no mapa. " + partes.join(", ") + ".";
  }

  desenhar();
  document.addEventListener("reportes:mudou", desenhar);
  window.addEventListener("storage", desenhar);
})();
