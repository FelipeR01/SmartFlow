/* ==========================================================================
   Formulário "Reportar um ponto de trânsito".
   - validação feita em JavaScript (o formulário usa novalidate)
   - mensagens de erro e de sucesso aparecem na própria página, sem janelas de aviso do navegador
   - os reportes ficam salvos só neste navegador (localStorage)
   ========================================================================== */

(function () {
  "use strict";

  const formulario = document.getElementById("form-reporte");
  if (!formulario) { return; }

  const CHAVE = "smartflow_reportes";

  const resumoErros = document.getElementById("resumo-erros");
  const mensagemSucesso = document.getElementById("mensagem-sucesso");
  const listaReportes = document.getElementById("lista-reportes");
  const contadorTexto = document.getElementById("contador-descricao");
  const botaoLimpar = document.getElementById("btn-limpar");

  const campoNome = document.getElementById("nome");
  const campoEmail = document.getElementById("email");
  const campoRegiao = document.getElementById("regiao");
  const campoLocal = document.getElementById("local");
  const campoDescricao = document.getElementById("descricao");
  const campoConsentimento = document.getElementById("consentimento");
  const radiosTipo = formulario.querySelectorAll('input[name="tipo"]');

  // ---------- Armazenamento ----------

  function carregarReportes() {
    try {
      const salvo = window.localStorage.getItem(CHAVE);
      const lista = salvo ? JSON.parse(salvo) : [];
      return Array.isArray(lista) ? lista : [];
    } catch (erro) {
      return [];
    }
  }

  function salvarReportes(lista) {
    try {
      window.localStorage.setItem(CHAVE, JSON.stringify(lista));
      return true;
    } catch (erro) {
      return false;
    }
  }

  // ---------- Regras de validação ----------
  // Cada regra devolve uma mensagem de erro, ou "" quando está tudo certo.

  const regras = {
    nome: function () {
      const v = campoNome.value.trim();
      if (v === "") { return "Informe seu nome."; }
      if (v.length < 3) { return "O nome precisa ter pelo menos 3 letras."; }
      return "";
    },
    email: function () {
      const v = campoEmail.value.trim();
      if (v === "") { return "Informe seu e-mail."; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { return "Use um e-mail válido, como nome@exemplo.com."; }
      return "";
    },
    regiao: function () {
      if (campoRegiao.value === "") { return "Escolha a região onde fica o ponto."; }
      return "";
    },
    local: function () {
      const v = campoLocal.value.trim();
      if (v === "") { return "Informe o local, por exemplo: Av. Celso Garcia com Rua Catumbi."; }
      if (v.length < 5) { return "Descreva o local com pelo menos 5 caracteres."; }
      return "";
    },
    tipo: function () {
      const marcado = formulario.querySelector('input[name="tipo"]:checked');
      if (!marcado) { return "Escolha o tipo de problema."; }
      return "";
    },
    descricao: function () {
      const v = campoDescricao.value.trim();
      if (v === "") { return "Descreva o que acontece nesse ponto."; }
      if (v.length < 20) { return "Escreva pelo menos 20 caracteres. Faltam " + (20 - v.length) + "."; }
      if (v.length > 300) { return "Use no máximo 300 caracteres. Há " + (v.length - 300) + " a mais."; }
      return "";
    },
    consentimento: function () {
      if (!campoConsentimento.checked) { return "Marque a caixa para guardar o reporte neste navegador."; }
      return "";
    }
  };

  // Campo que recebe o foco quando há erro (para o grupo de rádios, é o primeiro rádio)
  const camposPrincipais = {
    nome: campoNome,
    email: campoEmail,
    regiao: campoRegiao,
    local: campoLocal,
    tipo: radiosTipo[0],
    descricao: campoDescricao,
    consentimento: campoConsentimento
  };

  const rotulos = {
    nome: "Nome",
    email: "E-mail",
    regiao: "Região",
    local: "Local",
    tipo: "Tipo de problema",
    descricao: "Descrição",
    consentimento: "Consentimento"
  };

  // Mostra (ou limpa) o erro de um campo. Devolve true se o campo está válido.
  function validarCampo(nome) {
    const mensagem = regras[nome]();
    const elementoErro = document.getElementById("erro-" + nome);
    elementoErro.textContent = mensagem;

    if (nome === "tipo") {
      const grupo = document.getElementById("grupo-tipo");
      if (mensagem) { grupo.setAttribute("aria-invalid", "true"); } else { grupo.removeAttribute("aria-invalid"); }
    } else {
      const campo = camposPrincipais[nome];
      if (mensagem) { campo.setAttribute("aria-invalid", "true"); } else { campo.removeAttribute("aria-invalid"); }
    }
    return mensagem === "";
  }

  function atualizarContador() {
    const tamanho = campoDescricao.value.length;
    contadorTexto.textContent = tamanho + " de 300 caracteres";
  }

  // ---------- Lista de reportes salvos ----------

  function desenharReportes() {
    const reportes = carregarReportes();
    listaReportes.innerHTML = "";
    botaoLimpar.hidden = reportes.length === 0;

    if (reportes.length === 0) {
      const vazio = document.createElement("li");
      vazio.className = "vazio";
      vazio.textContent = "Você ainda não enviou nenhum reporte. Preencha o formulário ao lado para registrar o primeiro.";
      listaReportes.appendChild(vazio);
      return;
    }

    reportes.forEach(function (r) {
      const item = document.createElement("li");
      item.className = "reporte";

      const titulo = document.createElement("h3");
      titulo.textContent = r.tipo + " em " + r.local;
      item.appendChild(titulo);

      const meta = document.createElement("p");
      meta.className = "reporte-meta";
      meta.textContent = "Região " + r.regiao + ", enviado em " + r.data + " por " + r.nome + ".";
      item.appendChild(meta);

      const texto = document.createElement("p");
      texto.textContent = r.descricao;
      item.appendChild(texto);

      const remover = document.createElement("button");
      remover.type = "button";
      remover.className = "botao botao-escuro";
      remover.textContent = "Remover";
      remover.setAttribute("aria-label", "Remover o reporte em " + r.local);
      remover.addEventListener("click", function () {
        const restantes = carregarReportes().filter(function (outro) { return outro.id !== r.id; });
        salvarReportes(restantes);
        desenharReportes();
        mensagemSucesso.textContent = "Reporte removido.";
      });
      item.appendChild(remover);

      listaReportes.appendChild(item);
    });
  }

  // ---------- Envio ----------

  function mostrarResumoDeErros(nomesComErro) {
    resumoErros.innerHTML = "";
    if (nomesComErro.length === 0) { return; }

    const titulo = document.createElement("h3");
    titulo.textContent = nomesComErro.length === 1
      ? "Há 1 campo para corrigir"
      : "Há " + nomesComErro.length + " campos para corrigir";
    resumoErros.appendChild(titulo);

    const ul = document.createElement("ul");
    nomesComErro.forEach(function (nome) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#" + camposPrincipais[nome].id;
      link.textContent = rotulos[nome] + ": " + document.getElementById("erro-" + nome).textContent;
      link.addEventListener("click", function (evento) {
        evento.preventDefault();
        camposPrincipais[nome].focus();
      });
      li.appendChild(link);
      ul.appendChild(li);
    });
    resumoErros.appendChild(ul);
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    mensagemSucesso.textContent = "";

    const comErro = [];
    Object.keys(regras).forEach(function (nome) {
      if (!validarCampo(nome)) { comErro.push(nome); }
    });

    mostrarResumoDeErros(comErro);

    if (comErro.length > 0) {
      resumoErros.focus();
      return;
    }

    const tipoMarcado = formulario.querySelector('input[name="tipo"]:checked');
    const reporte = {
      id: String(Date.now()) + "-" + Math.floor(Math.random() * 1000),
      nome: campoNome.value.trim(),
      regiao: campoRegiao.value,
      local: campoLocal.value.trim(),
      tipo: tipoMarcado.value,
      descricao: campoDescricao.value.trim(),
      data: new Date().toLocaleDateString("pt-BR")
    };

    const lista = carregarReportes();
    lista.unshift(reporte);
    const salvou = salvarReportes(lista);

    if (!salvou) {
      resumoErros.innerHTML = "<h3>Não foi possível salvar</h3><p>O navegador bloqueou o armazenamento local. Tente sair do modo privado e envie de novo.</p>";
      resumoErros.focus();
      return;
    }

    formulario.reset();
    Object.keys(regras).forEach(function (nome) {
      document.getElementById("erro-" + nome).textContent = "";
    });
    Array.prototype.forEach.call(formulario.querySelectorAll("[aria-invalid]"), function (el) {
      el.removeAttribute("aria-invalid");
    });
    atualizarContador();
    desenharReportes();
    mensagemSucesso.textContent = "Reporte enviado. Ele aparece na lista abaixo, salvo neste navegador.";
  });

  // Validação enquanto a pessoa preenche: no campo que ela acabou de deixar
  ["nome", "email", "regiao", "local", "descricao"].forEach(function (nome) {
    const campo = camposPrincipais[nome];
    campo.addEventListener("blur", function () { validarCampo(nome); });
    campo.addEventListener("input", function () {
      // Só reavalia ao digitar se o campo já estava com erro
      if (campo.getAttribute("aria-invalid") === "true") { validarCampo(nome); }
    });
  });
  radiosTipo.forEach(function (radio) {
    radio.addEventListener("change", function () { validarCampo("tipo"); });
  });
  campoConsentimento.addEventListener("change", function () { validarCampo("consentimento"); });
  campoDescricao.addEventListener("input", atualizarContador);

  botaoLimpar.addEventListener("click", function () {
    salvarReportes([]);
    desenharReportes();
    mensagemSucesso.textContent = "Todos os reportes foram removidos deste navegador.";
  });

  atualizarContador();
  desenharReportes();
})();
