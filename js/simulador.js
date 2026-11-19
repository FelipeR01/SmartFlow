/* ==========================================================================
   Simulador: lista de corredores (array de objetos em dados.js) mostrada na
   tela pelo DOM, com filtro, ordenação e a chave "SmartFlow ligado/desligado".
   Também calcula as horas que o usuário perde por ano no trajeto dele.
   ========================================================================== */

(function () {
  "use strict";

  const filtroRegiao = document.getElementById("filtro-regiao");
  const ordenacao = document.getElementById("ordenacao");
  const chave = document.getElementById("chave-smartflow");
  const chaveTexto = document.getElementById("chave-texto");
  const corpoTabela = document.getElementById("corpo-tabela");
  const resumo = document.getElementById("resumo-tabela");
  const legendaTabela = document.getElementById("legenda-tabela");

  const selectCorredor = document.getElementById("trajeto-corredor");
  const inputViagens = document.getElementById("trajeto-viagens");
  const inputDias = document.getElementById("trajeto-dias");
  const erroViagens = document.getElementById("erro-viagens");
  const erroDias = document.getElementById("erro-dias");
  const resultado = document.getElementById("resultado-trajeto");

  if (!corpoTabela || !chave) { return; }

  let smartflowLigado = false;

  // ---------- Montagem dos filtros ----------

  function preencherFiltros() {
    const regioes = [];
    corredores.forEach(function (c) {
      if (regioes.indexOf(c.regiao) === -1) { regioes.push(c.regiao); }
    });
    regioes.sort();
    regioes.forEach(function (regiao) {
      const opcao = document.createElement("option");
      opcao.value = regiao;
      opcao.textContent = regiao;
      filtroRegiao.appendChild(opcao);
    });

    corredores.forEach(function (c) {
      const opcao = document.createElement("option");
      opcao.value = String(c.id);
      opcao.textContent = c.nome + " (" + c.regiao + ")";
      selectCorredor.appendChild(opcao);
    });
  }

  // ---------- Lista de corredores ----------

  function corredoresVisiveis() {
    const regiao = filtroRegiao.value;
    let lista = corredores.filter(function (c) { return regiao === "todas" || c.regiao === regiao; });

    const criterio = ordenacao.value;
    lista = lista.slice(); // copia para não mexer no array original
    lista.sort(function (a, b) {
      if (criterio === "ganho") { return b.ganho - a.ganho; }
      if (criterio === "nome") { return a.nome.localeCompare(b.nome, "pt-BR"); }
      return b.atraso - a.atraso; // padrão: maior atraso primeiro
    });
    return lista;
  }

  function criarCelula(rotulo, ehCabecalhoDeLinha) {
    const celula = document.createElement(ehCabecalhoDeLinha ? "th" : "td");
    if (ehCabecalhoDeLinha) { celula.scope = "row"; } else { celula.setAttribute("data-rotulo", rotulo); }
    return celula;
  }

  function criarMedida(valorMin, classeExtra) {
    const caixa = document.createElement("div");
    caixa.className = "celula-medida";

    const numero = document.createElement("span");
    numero.textContent = valorMin + " min";

    const medidor = document.createElement("meter");
    medidor.min = 0;
    medidor.max = 20;
    medidor.value = valorMin;
    medidor.setAttribute("aria-label", valorMin + " minutos");
    if (classeExtra) { medidor.className = classeExtra; }

    caixa.appendChild(numero);
    caixa.appendChild(medidor);
    return caixa;
  }

  function criarLinha(c) {
    const linha = document.createElement("tr");

    const nome = criarCelula("Corredor", true);
    nome.textContent = c.nome;
    linha.appendChild(nome);

    const regiao = criarCelula("Região", false);
    regiao.textContent = c.regiao;
    linha.appendChild(regiao);

    const atraso = criarCelula("Atraso por viagem hoje", false);
    atraso.appendChild(criarMedida(c.atraso, ""));
    linha.appendChild(atraso);

    const depois = criarCelula("Atraso com o SmartFlow", false);
    const reducao = criarCelula("Redução", false);

    if (smartflowLigado) {
      const novoAtraso = Math.round(aplicarGanho(c.atraso, c.ganho) * 10) / 10;
      depois.appendChild(criarMedida(novoAtraso, "medida-verde"));
      reducao.className = "num ganho";
      reducao.textContent = "−" + c.ganho + "%";
    } else {
      depois.innerHTML = '<span aria-hidden="true">–</span><span class="so-leitor">Ligue o SmartFlow para ver</span>';
      reducao.innerHTML = '<span aria-hidden="true">–</span><span class="so-leitor">Ligue o SmartFlow para ver</span>';
    }
    linha.appendChild(depois);
    linha.appendChild(reducao);
    return linha;
  }

  function media(lista, campo) {
    if (lista.length === 0) { return 0; }
    let soma = 0;
    lista.forEach(function (c) { soma += c[campo]; });
    return soma / lista.length;
  }

  function desenharLista() {
    const lista = corredoresVisiveis();
    corpoTabela.innerHTML = "";

    if (lista.length === 0) {
      const linha = document.createElement("tr");
      const celula = document.createElement("td");
      celula.colSpan = 5;
      celula.textContent = "Nenhum corredor nessa região. Escolha outra região no filtro.";
      linha.appendChild(celula);
      corpoTabela.appendChild(linha);
    } else {
      lista.forEach(function (c) { corpoTabela.appendChild(criarLinha(c)); });
    }

    // Resumo anunciado para leitores de tela (região aria-live)
    const mediaAtraso = media(lista, "atraso");
    let texto = lista.length + (lista.length === 1 ? " corredor" : " corredores")
      + ". Atraso médio hoje: " + mediaAtraso.toFixed(1).replace(".", ",") + " min por viagem.";
    if (smartflowLigado && lista.length > 0) {
      let somaDepois = 0;
      lista.forEach(function (c) { somaDepois += aplicarGanho(c.atraso, c.ganho); });
      const mediaDepois = somaDepois / lista.length;
      texto += " Com o SmartFlow: " + mediaDepois.toFixed(1).replace(".", ",") + " min.";
    }
    resumo.textContent = texto;
    legendaTabela.textContent = smartflowLigado
      ? "Atraso por viagem no horário de pico, hoje e com o SmartFlow ligado (valores ilustrativos)."
      : "Atraso por viagem no horário de pico, hoje (valores ilustrativos). Ligue o SmartFlow para comparar.";
  }

  // ---------- Chave liga/desliga ----------

  function alternarSmartflow() {
    smartflowLigado = !smartflowLigado;
    chave.setAttribute("aria-checked", String(smartflowLigado));
    chaveTexto.textContent = smartflowLigado ? "SmartFlow ligado" : "SmartFlow desligado";
    desenharLista();
    calcularTrajeto();
  }

  // ---------- Meu trajeto ----------

  // Valida um campo numérico inteiro dentro de um intervalo. Devolve o número ou null.
  function lerNumero(input, minimo, maximo, elementoErro, mensagem) {
    const texto = input.value.trim();
    const numero = Number(texto);
    const valido = texto !== "" && Number.isInteger(numero) && numero >= minimo && numero <= maximo;
    if (valido) {
      elementoErro.textContent = "";
      input.removeAttribute("aria-invalid");
      return numero;
    }
    elementoErro.textContent = mensagem;
    input.setAttribute("aria-invalid", "true");
    return null;
  }

  function calcularTrajeto() {
    const corredor = corredores.find(function (c) { return String(c.id) === selectCorredor.value; });
    const viagens = lerNumero(inputViagens, 1, 6, erroViagens, "Informe de 1 a 6 viagens por dia.");
    const dias = lerNumero(inputDias, 1, 7, erroDias, "Informe de 1 a 7 dias por semana.");

    if (!corredor || viagens === null || dias === null) {
      resultado.innerHTML = "<p>Preencha os campos acima para ver o cálculo.</p>";
      return;
    }

    const horasHoje = horasPerdidasPorAno(corredor.atraso, viagens, dias);
    const horasDepois = aplicarGanho(horasHoje, corredor.ganho);
    const economia = horasHoje - horasDepois;

    resultado.innerHTML = "";
    const p1 = document.createElement("p");
    p1.textContent = "Na " + corredor.nome + ", você perde cerca de " + formatarInteiro(horasHoje)
      + " horas por ano a mais por causa do trânsito no pico.";
    resultado.appendChild(p1);

    const p2 = document.createElement("p");
    p2.className = "resultado-destaque";
    if (smartflowLigado) {
      p2.textContent = "Com o SmartFlow: cerca de " + formatarInteiro(horasDepois) + " horas. São "
        + formatarInteiro(economia) + " horas devolvidas a você por ano.";
    } else {
      p2.textContent = "Ligue o SmartFlow acima para ver quantas horas voltam para você.";
    }
    resultado.appendChild(p2);

    const p3 = document.createElement("p");
    p3.className = "nota";
    p3.textContent = "Cálculo: atraso por viagem x " + viagens + " viagens por dia x " + dias
      + " dias por semana x " + SEMANAS_POR_ANO + " semanas. Valores ilustrativos.";
    resultado.appendChild(p3);
  }

  // ---------- Início ----------

  preencherFiltros();
  desenharLista();
  calcularTrajeto();

  filtroRegiao.addEventListener("change", desenharLista);
  ordenacao.addEventListener("change", desenharLista);
  chave.addEventListener("click", alternarSmartflow);
  selectCorredor.addEventListener("change", calcularTrajeto);
  inputViagens.addEventListener("input", calcularTrajeto);
  inputDias.addEventListener("input", calcularTrajeto);
})();
