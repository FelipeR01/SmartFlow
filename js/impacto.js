/* ==========================================================================
   Impacto: gráfico de barras montado com elementos nativos (meter), a partir
   do mesmo array de corredores usado no Simulador.
   Trajeto de referência: 2 viagens por dia, 5 dias por semana.
   ========================================================================== */

(function () {
  "use strict";

  const lista = document.getElementById("grafico-corredores");
  const total = document.getElementById("impacto-total");
  if (!lista) { return; }

  const VIAGENS_DIA = 2;
  const DIAS_SEMANA = 5;

  // Calcula as horas de cada corredor e ordena do maior para o menor.
  const dadosGrafico = corredores.map(function (c) {
    const hoje = horasPerdidasPorAno(c.atraso, VIAGENS_DIA, DIAS_SEMANA);
    const depois = aplicarGanho(hoje, c.ganho);
    return { nome: c.nome, regiao: c.regiao, hoje: hoje, depois: depois };
  });
  dadosGrafico.sort(function (a, b) { return b.hoje - a.hoje; });

  const maximo = Math.ceil(dadosGrafico[0].hoje / 10) * 10;

  function criarLinha(rotulo, valor, classeMedidor) {
    const linha = document.createElement("div");
    linha.className = "grafico-linha";

    const nome = document.createElement("span");
    nome.textContent = rotulo;

    const medidor = document.createElement("meter");
    medidor.min = 0;
    medidor.max = maximo;
    medidor.value = valor;
    medidor.setAttribute("aria-label", rotulo + ": " + formatarInteiro(valor) + " horas por ano");
    if (classeMedidor) { medidor.className = classeMedidor; }

    const numero = document.createElement("strong");
    numero.textContent = formatarInteiro(valor) + " h";

    linha.appendChild(nome);
    linha.appendChild(medidor);
    linha.appendChild(numero);
    return linha;
  }

  let somaEconomia = 0;

  dadosGrafico.forEach(function (d) {
    const item = document.createElement("li");

    const titulo = document.createElement("h3");
    titulo.textContent = d.nome + " (" + d.regiao + ")";
    item.appendChild(titulo);

    item.appendChild(criarLinha("Hoje", d.hoje, ""));
    item.appendChild(criarLinha("Com SmartFlow", d.depois, "medida-verde"));
    lista.appendChild(item);

    somaEconomia += d.hoje - d.depois;
  });

  if (total) {
    const mediaEconomia = somaEconomia / dadosGrafico.length;
    total.textContent = "Em média, um passageiro que faz esse trajeto recuperaria cerca de "
      + formatarInteiro(mediaEconomia) + " horas por ano.";
  }
})();
