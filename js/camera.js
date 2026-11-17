/* Solução: demonstração de câmera. A imagem é uma gravação e os números são ilustrativos. */
(function () {
  "use strict";

  const video = document.getElementById("cam-video");
  const hora = document.getElementById("cam-hora");
  const pausa = document.getElementById("cam-pausa");
  const fila = document.getElementById("cam-fila");
  const medidor = document.getElementById("cam-medidor");
  const verde = document.getElementById("cam-verde");
  const modo = document.getElementById("cam-modo");
  const chave = document.getElementById("cam-chave");
  const chaveTexto = document.getElementById("cam-chave-texto");
  const resultado = document.getElementById("cam-resultado");
  if (!video || !fila || !chave) { return; }

  const reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ligado = false;

  // Relógio da câmera
  function relogio() {
    const d = new Date();
    hora.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()].map(function (n) { return String(n).padStart(2, "0"); }).join(":");
  }
  relogio();
  setInterval(relogio, 1000);

  // Vídeo: toca sozinho, exceto para quem pediu menos movimento. Sempre há botão para pausar.
  function atualizarBotao() { pausa.textContent = video.paused ? "Tocar vídeo" : "Pausar vídeo"; }
  if (!reduzir) {
    const p = video.play();
    if (p && p.catch) { p.catch(function () { atualizarBotao(); }); }
  }
  video.addEventListener("play", atualizarBotao);
  video.addEventListener("pause", atualizarBotao);
  pausa.addEventListener("click", function () { if (video.paused) { video.play(); } else { video.pause(); } });
  atualizarBotao();

  // A leitura vem da simulação (js/simulacao.js), não do vídeo.
  function desenhar() {
    const sim = window.smartflowSim && window.smartflowSim.estado();
    if (!sim) { return; }
    const e = ligado ? sim.smart : sim.fixo;
    fila.textContent = e.fila + (e.fila === 1 ? " veículo" : " veículos");
    medidor.value = Math.min(40, e.fila);
    verde.textContent = (e.ativo ? e.verde : 0) + " s";
    modo.textContent = ligado ? "decidido pelo SmartFlow" : "ciclo fixo (30 s e 14 s)";
    resultado.textContent = ligado
      ? "Com o SmartFlow, a fila simulada agora é de " + sim.smart.fila + " veículos. No ciclo fixo seria de " + sim.fixo.fila + "."
      : "Ligue o SmartFlow para ver a fila do mesmo cruzamento com o semáforo adaptativo.";
  }

  chave.addEventListener("click", function () {
    ligado = !ligado;
    chave.setAttribute("aria-checked", String(ligado));
    chaveTexto.textContent = ligado ? "SmartFlow ligado" : "SmartFlow desligado";
    desenhar();
  });

  if (!reduzir) { setInterval(desenhar, 1000); }
  desenhar();
})();
