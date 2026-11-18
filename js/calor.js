/* ==========================================================================
   Impacto: mapa de calor dos corredores (array `corredores` de dados.js).
   Cada quadrado é um corredor, colorido pelo atraso médio por viagem no pico.
   O botão alterna entre "Hoje" e "Com o SmartFlow". Valores ILUSTRATIVOS.
   ========================================================================== */
(function () {
  "use strict";

  const caixa = document.getElementById("calor-mapa");
  const botoes = document.querySelectorAll("[data-calor]");
  const resumo = document.getElementById("calor-resumo");
  if (!caixa || typeof corredores === "undefined") { return; }

  const LIMITES = [8, 10, 12, 14, 16]; // minutos; abaixo de 8 = nível 0 (verde)
  const regioes = [];
  corredores.forEach(function (c) { if (regioes.indexOf(c.regiao) === -1) { regioes.push(c.regiao); } });

  function nivel(min) {
    let n = 0;
    LIMITES.forEach(function (l) { if (min >= l) { n++; } });
    return n;
  }
  function fmt(v) { return v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }

  function valor(c, depois) { return depois ? aplicarGanho(c.atraso, c.ganho) : c.atraso; }

  function desenhar(depois) {
    caixa.innerHTML = "";
    let soma = 0, vermelhos = 0;
    regioes.forEach(function (regiao) {
      const grupo = document.createElement("section");
      grupo.className = "calor-grupo";
      grupo.setAttribute("aria-label", "Região " + regiao);
      const t = document.createElement("h3");
      t.textContent = regiao;
      grupo.appendChild(t);
      const lista = document.createElement("ul");
      lista.className = "calor-lista";
      corredores.filter(function (c) { return c.regiao === regiao; }).forEach(function (c) {
        const v = valor(c, depois);
        soma += v;
        const n = nivel(v);
        if (n >= 4) { vermelhos++; }
        const li = document.createElement("li");
        li.className = "calor-celula calor-n" + n;
        const nome = document.createElement("span");
        nome.className = "calor-nome";
        nome.textContent = c.nome.replace(/^Av\.\s*/, "");
        const num = document.createElement("strong");
        num.textContent = fmt(v) + " min";
        li.appendChild(nome);
        li.appendChild(num);
        lista.appendChild(li);
      });
      grupo.appendChild(lista);
      caixa.appendChild(grupo);
    });
    resumo.textContent = (depois ? "Com o SmartFlow" : "Hoje") + ": atraso médio de " + fmt(soma / corredores.length)
      + " min por viagem e " + vermelhos + " de " + corredores.length + " corredores nos dois níveis mais altos (valores ilustrativos).";
    botoes.forEach(function (b) { b.setAttribute("aria-pressed", String((b.getAttribute("data-calor") === "depois") === depois)); });
  }

  botoes.forEach(function (b) { b.addEventListener("click", function () { desenhar(b.getAttribute("data-calor") === "depois"); }); });
  desenhar(false);
})();
