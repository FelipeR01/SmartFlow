/* ==========================================================================
   Radar dos corredores (página inicial).
   Usa o array `corredores` de dados.js. Valores ILUSTRATIVOS, não oficiais.
   Cada ponta do radar é um corredor; a distância ao centro é o atraso
   médio por viagem no pico. Ligar o SmartFlow aplica o ganho de cada um.
   ========================================================================== */
(function () {
  "use strict";

  const svg = document.getElementById("radar-svg");
  if (!svg || typeof corredores === "undefined") { return; }

  const NS = "http://www.w3.org/2000/svg";
  const CX = 250, CY = 250, R = 165, MAX = 20;
  const reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const n = corredores.length;

  const chave = document.getElementById("radar-chave");
  const chaveTexto = document.getElementById("radar-chave-texto");
  const info = document.getElementById("radar-info");
  const caixa = document.getElementById("radar-caixa");

  let ligado = false, prog = 0, sel = 2, anim = 0;

  function el(nome, attrs, pai) {
    const e = document.createElementNS(NS, nome);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (pai) { pai.appendChild(e); }
    return e;
  }
  function ang(i) { return -Math.PI / 2 + (i * 2 * Math.PI) / n; }
  function pos(i, v) { const r = (v / MAX) * R; return [CX + Math.cos(ang(i)) * r, CY + Math.sin(ang(i)) * r]; }
  function fmt(v, c) { return v.toLocaleString("pt-BR", { minimumFractionDigits: c, maximumFractionDigits: c }); }

  // Grade (anéis e raios)
  const grade = el("g", { "class": "radar-grade-g", "aria-hidden": "true" }, svg);
  [5, 10, 15, 20].forEach(function (v) {
    el("circle", { cx: CX, cy: CY, r: (v / MAX) * R, "class": "radar-anel" }, grade);
    const t = el("text", { x: CX + 4, y: CY - (v / MAX) * R - 3, "class": "radar-escala" }, grade);
    t.textContent = v + " min";
  });
  corredores.forEach(function (c, i) {
    const p = pos(i, MAX);
    el("line", { x1: CX, y1: CY, x2: p[0], y2: p[1], "class": "radar-raio" }, grade);
  });

  // Regiões: um rótulo no meio de cada grupo de corredores
  const regioes = [];
  corredores.forEach(function (c, i) {
    const ult = regioes[regioes.length - 1];
    if (ult && ult.nome === c.regiao) { ult.fim = i; } else { regioes.push({ nome: c.regiao, ini: i, fim: i }); }
  });
  regioes.forEach(function (g) {
    const meio = (ang(g.ini) + ang(g.fim)) / 2;
    const x = CX + Math.cos(meio) * (R + 38), y = CY + Math.sin(meio) * (R + 38);
    const cos = Math.cos(meio);
    const t = el("text", { x: x, y: y + 5, "class": "radar-regiao", "text-anchor": cos > 0.3 ? "start" : (cos < -0.3 ? "end" : "middle") }, grade);
    t.textContent = g.nome;
  });

  const selRaio = el("line", { "class": "radar-sel", "aria-hidden": "true" }, svg);
  const polSem = el("polygon", { "class": "radar-area radar-sem", "aria-hidden": "true" }, svg);
  const polCom = el("polygon", { "class": "radar-area radar-com", "aria-hidden": "true" }, svg);
  const pontos = corredores.map(function (c, i) {
    const g = el("g", { "aria-hidden": "true" }, svg);
    const alvo = el("circle", { r: 14, "class": "radar-alvo" }, g);
    const sem = el("circle", { r: 4.5, "class": "radar-ponto radar-ponto-sem" }, g);
    const com = el("circle", { r: 4.5, "class": "radar-ponto radar-ponto-com" }, g);
    alvo.addEventListener("pointerenter", function () { selecionar(i); });
    alvo.addEventListener("click", function () { selecionar(i); });
    return { sem: sem, com: com, alvo: alvo };
  });

  function valor(i, depois) { const c = corredores[i]; return depois ? aplicarGanho(c.atraso, c.ganho) : c.atraso; }

  function desenhar() {
    const ptsSem = [], ptsCom = [];
    corredores.forEach(function (c, i) {
      const a = pos(i, valor(i, false));
      const b = pos(i, valor(i, false) + (valor(i, true) - valor(i, false)) * prog);
      ptsSem.push(a.join(",")); ptsCom.push(b.join(","));
      pontos[i].sem.setAttribute("cx", a[0]); pontos[i].sem.setAttribute("cy", a[1]);
      pontos[i].com.setAttribute("cx", b[0]); pontos[i].com.setAttribute("cy", b[1]);
      pontos[i].alvo.setAttribute("cx", a[0]); pontos[i].alvo.setAttribute("cy", a[1]);
      pontos[i].com.classList.toggle("radar-oculto", prog < 0.02);
      pontos[i].sem.classList.toggle("radar-ativo", i === sel);
    });
    polSem.setAttribute("points", ptsSem.join(" "));
    polCom.setAttribute("points", ptsCom.join(" "));
    polCom.classList.toggle("radar-oculto", prog < 0.02);
    const f = pos(sel, MAX);
    selRaio.setAttribute("x1", CX); selRaio.setAttribute("y1", CY); selRaio.setAttribute("x2", f[0]); selRaio.setAttribute("y2", f[1]);
  }

  function texto() {
    const c = corredores[sel];
    const depois = aplicarGanho(c.atraso, c.ganho);
    const base = c.nome + " (" + c.regiao + "): " + c.atraso + " min de atraso por viagem no pico.";
    return ligado ? base + " Com o SmartFlow: " + fmt(depois, 1) + " min, " + c.ganho + "% menos." : base;
  }
  function escrever() { info.textContent = texto(); }

  function selecionar(i) { sel = (i + n) % n; desenhar(); escrever(); }

  function animar(alvo) {
    window.cancelAnimationFrame(anim);
    if (reduzir) { prog = alvo; desenhar(); return; }
    const ini = prog, t0 = performance.now(), dur = 700;
    (function q(t) {
      const k = Math.min(1, (t - t0) / dur);
      prog = ini + (alvo - ini) * (1 - Math.pow(1 - k, 3));
      desenhar();
      if (k < 1) { anim = window.requestAnimationFrame(q); }
    })(t0);
  }

  chave.addEventListener("click", function () {
    ligado = !ligado;
    chave.setAttribute("aria-checked", String(ligado));
    chaveTexto.textContent = ligado ? "SmartFlow ligado" : "SmartFlow desligado";
    animar(ligado ? 1 : 0);
    escrever();
  });

  caixa.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); selecionar(sel + 1); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); selecionar(sel - 1); }
    else if (e.key === "Home") { e.preventDefault(); selecionar(0); }
    else if (e.key === "End") { e.preventDefault(); selecionar(n - 1); }
  });

  // Números de resumo, calculados dos mesmos dados
  let soma = 0, somaGanho = 0, maior = corredores[0], maiorGanho = corredores[0];
  corredores.forEach(function (c) {
    soma += c.atraso; somaGanho += c.ganho;
    if (c.atraso > maior.atraso) { maior = c; }
    if (c.ganho > maiorGanho.ganho) { maiorGanho = c; }
  });
  const set = function (id, t) { const e = document.getElementById(id); if (e) { e.textContent = t; } };
  set("radar-media", fmt(soma / n, 1) + " min");
  set("radar-ganho", fmt(somaGanho / n, 0) + "%");
  set("radar-maior", maior.atraso + " min");
  set("radar-maior-nome", maior.nome);
  set("radar-ganho-nome", "Maior ganho: " + maiorGanho.nome + ", " + maiorGanho.ganho + "%");

  selecionar(sel);
  svg.setAttribute("aria-label", "Radar com o atraso médio por viagem em " + n + " corredores de São Paulo. Dados ilustrativos.");
})();
