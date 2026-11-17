/* Aplica o tema salvo (ou o do sistema) antes de a página aparecer, para não piscar. */
(function () {
  "use strict";
  var tema = null;
  try { tema = window.localStorage.getItem("smartflow_tema"); } catch (erro) { tema = null; }
  if (tema !== "claro" && tema !== "escuro") {
    tema = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "claro" : "escuro";
  }
  document.documentElement.setAttribute("data-tema", tema);
})();
