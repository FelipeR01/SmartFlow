/* ==========================================================================
   Simulador: comparação de dois trajetos e botão "Copiar resultado".
   Usa o array `corredores` e as funções de dados.js. Valores ILUSTRATIVOS.
   As viagens por dia e os dias por semana vêm dos campos de "Meu trajeto".
   ========================================================================== */
(function () {
  "use strict";

  const selA = document.getElementById("comp-a");
  const selB = document.getElementById("comp-b");
  const saida = document.getElementById("comp-resultado");
  const botao = document.getElementById("btn-copiar");
  const aviso = document.getElementById("copiar-aviso");
  const inViagens = document.getElementById("trajeto-viagens");
  const inDias = document.getElementById("trajeto-dias");
  if (!selA || !selB || !saida || typeof corredores === "undefined") { return; }

  let textoAtual = "";

  function preencher(select, idInicial) {
    corredores.forEach(function (c) {
      const o = document.createElement("option");
      o.value = String(c.id);
      o.textContent = c.nome + " (" + c.regiao + ")";
      select.appendChild(o);
    });
    select.value = String(idInicial);
  }

  function achar(select) {
    return corredores.find(function (c) { return String(c.id) === select.value; });
  }

  // Lê um inteiro válido do campo; se estiver inválido, usa o valor padrão
  function lerInt(input, minimo, maximo, padrao) {
    const n = Number(input.value.trim());
    return input.value.trim() !== "" && Number.isInteger(n) && n >= minimo && n <= maximo ? n : padrao;
  }

  function linha(c, viagens, dias) {
    const hoje = horasPerdidasPorAno(c.atraso, viagens, dias);
    const depois = aplicarGanho(hoje, c.ganho);
    return { c: c, hoje: hoje, depois: depois, volta: hoje - depois };
  }

  function celula(tag, texto, rotulo) {
    const e = document.createElement(tag);
    if (tag === "th") { e.scope = "row"; } else if (rotulo) { e.setAttribute("data-rotulo", rotulo); }
    e.textContent = texto;
    return e;
  }

  function desenhar() {
    const viagens = lerInt(inViagens, 1, 6, 2);
    const dias = lerInt(inDias, 1, 7, 5);
    const a = linha(achar(selA), viagens, dias);
    const b = linha(achar(selB), viagens, dias);

    const tabela = document.createElement("table");
    tabela.className = "tabela-comparar";
    const cap = document.createElement("caption");
    cap.textContent = "Horas por ano perdidas no pico, com " + viagens + " viagens por dia e " + dias + " dias por semana (valores ilustrativos).";
    tabela.appendChild(cap);
    const cab = document.createElement("thead");
    const lc = document.createElement("tr");
    ["Trajeto", "Hoje", "Com o SmartFlow", "Horas devolvidas"].forEach(function (t) {
      const th = document.createElement("th"); th.scope = "col"; th.textContent = t; lc.appendChild(th);
    });
    cab.appendChild(lc); tabela.appendChild(cab);
    const corpo = document.createElement("tbody");
    [a, b].forEach(function (r) {
      const tr = document.createElement("tr");
      tr.appendChild(celula("th", r.c.nome));
      tr.appendChild(celula("td", formatarInteiro(r.hoje) + " h", "Hoje"));
      tr.appendChild(celula("td", formatarInteiro(r.depois) + " h", "Com o SmartFlow"));
      tr.appendChild(celula("td", formatarInteiro(r.volta) + " h", "Horas devolvidas"));
      corpo.appendChild(tr);
    });
    tabela.appendChild(corpo);

    let frase;
    if (a.c.id === b.c.id) {
      frase = "Você escolheu o mesmo trajeto nos dois campos. Troque um deles para comparar.";
    } else {
      const pior = a.hoje >= b.hoje ? a : b;
      const outro = pior === a ? b : a;
      const dif = Math.round(pior.hoje - outro.hoje);
      const maisVolta = a.volta >= b.volta ? a : b;
      frase = dif === 0
        ? "Os dois trajetos custam o mesmo número de horas por ano hoje."
        : "A " + pior.c.nome + " custa cerca de " + formatarInteiro(dif) + " horas a mais por ano que a " + outro.c.nome + ".";
      frase += " O SmartFlow devolveria mais horas na " + maisVolta.c.nome + " (" + formatarInteiro(maisVolta.volta) + " h por ano).";
    }
    const p = document.createElement("p");
    p.className = "comp-frase";
    p.textContent = frase;

    saida.innerHTML = "";
    saida.appendChild(tabela);
    saida.appendChild(p);

    textoAtual = "SmartFlow (dados ilustrativos): " + a.c.nome + " = " + formatarInteiro(a.hoje) + " h/ano hoje, "
      + formatarInteiro(a.depois) + " h com o SmartFlow. " + b.c.nome + " = " + formatarInteiro(b.hoje) + " h/ano hoje, "
      + formatarInteiro(b.depois) + " h com o SmartFlow. " + frase;
  }

  function avisar(msg) { aviso.textContent = msg; }

  function copiar() {
    const texto = textoAtual;
    function reserva() {
      const campo = document.createElement("textarea");
      campo.value = texto;
      campo.setAttribute("readonly", "");
      campo.className = "so-leitor";
      document.body.appendChild(campo);
      campo.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(campo);
      avisar(ok ? "Resultado copiado." : "Não foi possível copiar. Selecione o texto da tabela e copie com Ctrl+C.");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(function () { avisar("Resultado copiado."); }, reserva);
    } else { reserva(); }
  }

  preencher(selA, 3);   // Faria Lima
  preencher(selB, 1);   // Paulista
  desenhar();
  selA.addEventListener("change", function () { avisar(""); desenhar(); });
  selB.addEventListener("change", function () { avisar(""); desenhar(); });
  inViagens.addEventListener("input", desenhar);
  inDias.addEventListener("input", desenhar);
  botao.addEventListener("click", copiar);
})();
