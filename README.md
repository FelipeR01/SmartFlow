# 🚦 SmartFlow - Sistema de Gestão Viária Inteligente

![Status](https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge)
![Global Solution](https://img.shields.io/badge/FIAP-Global_Solution_2026-black?style=for-the-badge)
![Linguagens](https://img.shields.io/badge/Tecnologias-HTML5_|_CSS3_|_JavaScript-blue?style=for-the-badge)

## 📖 Descrição do Projeto

O **SmartFlow** é um "Command Dashboard" (Painel de Controle) B2B focado em Cidades Inteligentes (*Smart Cities*). Ele foi concebido para resolver o gargalo crônico de mobilidade urbana na cidade de São Paulo, que atualmente suporta uma frota de quase 10 milhões de veículos. 

O projeto simula um sistema que abandona os tempos fixos de semáforos. Utilizando Visão Computacional (processada na borda - *Edge Computing*) integrada a câmeras de trânsito já existentes, a Inteligência Artificial calcula a densidade das vias em tempo real e orquestra a abertura dos semáforos, priorizando a fluidez. 

Para validar o impacto ambiental (redução de emissões de marcha lenta), o sistema cruza os ganhos de fluxo com APIs de monitoramento climático da NASA.

## 🎯 Objetivo e Impacto (ESG)

*   **Redução de Tempo de Viagem:** Estimativa de devolução de até 40 minutos diários para o cidadão.
*   **Mitigação Climática:** Previsão de queda de 20% nas emissões locais de CO₂/NO₂ em corredores de tráfego denso.
*   **Alinhamento ONU:** Contribuição direta com a **ODS 11** (Cidades Sustentáveis) e **ODS 13** (Ação Climática).

## 🗂️ Estrutura do Site (Abas e Funcionalidades)

A Prova de Conceito (PoC) entregue é uma *Single Page Application* composta por 5 seções principais:

1.  **Início (`#home`):** Apresentação do problema viário em São Paulo (2026) e a proposta de valor do SmartFlow.
2.  **Tecnologia (`#tech`):** Arquitetura distribuída detalhada (Integração IoT, Edge Computing, Validação Espacial).
3.  **Simulador (`#simulator`):** Dashboard interativo que simula a IA atuando no cruzamento Faria Lima x JK. (Utiliza JavaScript para interatividade dinâmica).
4.  **Impacto (`#impact`):** Relatório Data-Driven comprovando viabilidade financeira e ambiental (Dados FGV e IEMA).
5.  **Contato (`#contact`):** Formulário de captação para prefeituras e investidores.

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido focado em alta performance visual sem dependência de frameworks pesados (Zero-weight depth):

*   **HTML5 Semântico:** Estruturação lógica e acessível.
*   **CSS3 (Custom Properties / Grid):** Design System baseado em variáveis, interface "Dark Mode" estilo SaaS corporativo e Glassmorphism.
*   **JavaScript (Vanilla ES6):** Controle de navegação das abas e execução da lógica interativa do Simulador em tempo real.


## Estrutura

/smartflow
│── index.html
│── /assets
│   └── (imagens e icones)
│── /css
│   │── tokens.css (As variáveis baseadas no DESIGN.md)
│   │── reset.css  (Limpeza padrão)
│   │── components.css (Botões, Cards, Inputs)
│   └── layout.css (O grid de 12 colunas e as 5 Abas)
└── /js
    └── app.js (Lógica de navegação e simulador)
