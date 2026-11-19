/* Página inicial: calculadora "quanto tempo o trânsito leva de você?" */

(function () {
  "use strict";

  const MEDIA_MINUTOS = 145;   // 2h25 por dia: média paulistana (Viver em SP 2024)
  const DIAS_POR_ANO = 240;    // 5 dias por semana x 48 semanas

  const barra = document.getElementById("minutos");
  const valor = document.getElementById("minutos-valor");
  const semaforo = document.getElementById("semaforo");
  const frase = document.getElementById("calc-frase");
  const comparacao = document.getElementById("calc-comparacao");
  if (!barra || !valor || !semaforo || !frase || !comparacao) { return; }

  // 145 -> "2h25"
  function formatarHoraMinuto(minutos) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return h + "h" + String(m).padStart(2, "0");
  }

  // Cor da barra: verde até perto da média, laranja na média, vermelho cheio no limite.
  // Entre um ponto e outro a cor muda aos poucos.
  const PARADAS = [
    [20,  [47, 214, 123]],   // verde
    [100, [47, 214, 123]],
    [145, [255, 159, 28]],   // laranja (a média paulistana)
    [200, [255, 106, 26]],
    [250, [255, 59, 48]],    // vermelho cheio
    [300, [255, 59, 48]]
  ];
  function corDaBarra(minutos) {
    for (let i = 1; i < PARADAS.length; i++) {
      if (minutos <= PARADAS[i][0]) {
        const a = PARADAS[i - 1], b = PARADAS[i];
        const t = (minutos - a[0]) / (b[0] - a[0]);
        const c = a[1].map(function (v, k) { return Math.round(v + (b[1][k] - v) * t); });
        return "rgb(" + c.join(",") + ")";
      }
    }
    return "rgb(255,59,48)";
  }

  function atualizar() {
    const minimo = parseInt(barra.min, 10), maximo = parseInt(barra.max, 10);
    const cor = corDaBarra(parseInt(barra.value, 10));
    barra.style.setProperty("--pct", ((barra.value - minimo) / (maximo - minimo) * 100) + "%");
    barra.style.setProperty("--cor-barra", cor);
    valor.style.color = cor;
    const minutos = parseInt(barra.value, 10);
    const horasAno = (minutos * DIAS_POR_ANO) / 60;
    const diasInteiros = horasAno / 24;
    const diferenca = minutos - MEDIA_MINUTOS;

    valor.textContent = formatarHoraMinuto(minutos) + " por dia";
    barra.setAttribute("aria-valuetext", formatarHoraMinuto(minutos) + " por dia");

    frase.textContent = "Isso dá " + formatarInteiro(horasAno) + " horas por ano, o equivalente a "
      + formatarInteiro(diasInteiros) + " dias inteiros.";

    let estado;
    if (diferenca >= 20) {
      estado = "vermelho";
      comparacao.textContent = "Você está " + diferenca + " min por dia acima da média paulistana.";
    } else if (diferenca <= -20) {
      estado = "verde";
      comparacao.textContent = "Você está " + Math.abs(diferenca) + " min por dia abaixo da média paulistana.";
    } else {
      estado = "amarelo";
      comparacao.textContent = "Você está perto da média paulistana (2h25 por dia).";
    }
    semaforo.setAttribute("data-estado", estado);
  }

  barra.addEventListener("input", atualizar);
  atualizar();
})();
