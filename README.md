# SmartFlow

Protótipo web da **Global Solution 2026/2 (FIAP)**, tema **CitizenTech**.
Curso: Engenharia de Software.

## O que é

O SmartFlow é uma proposta para quem se desloca todos os dias em São Paulo, principalmente quem depende de ônibus. A ideia é que o cidadão reporte onde o trânsito trava e que os semáforos passem a se ajustar à fila real, em vez de seguir sempre o mesmo tempo.

- **Cidadão beneficiado:** quem se desloca diariamente em São Paulo para trabalhar ou estudar.
- **Problema:** o paulistano gasta em média 2h25 por dia em deslocamentos; quem usa transporte coletivo gasta 2h47, dez minutos a mais que em 2023 (Rede Nossa São Paulo, *Viver em SP 2024: Mobilidade Urbana*, Ipec).
- **ODS:** 11 (cidades e comunidades sustentáveis) e 13 (ação contra a mudança global do clima).

## Como abrir

Não precisa instalar nada. Abra o arquivo `index.html` em qualquer navegador (dois cliques).

Site publicado: **https://smart-flow-nine-alpha.vercel.app**  
Código: **https://github.com/FelipeR01/SmartFlow**

## Páginas

| Página | Arquivo | O que tem |
|---|---|---|
| Início | `index.html` | Problema com dado real e fonte, calculadora com semáforo, proposta e ODS |
| Solução | `pages/solucao.html` | Como funciona, o que o protótipo faz e o que a solução completa faria, ecossistema |
| Simulador | `pages/simulador.html` | Tabela de 13 corredores, filtro, ordenação, chave do SmartFlow e cálculo "Meu trajeto" |
| Impacto | `pages/impacto.html` | Gráfico de horas por ano, ODS, indicadores e plano de expansão |
| Reportar | `pages/reportar.html` | Formulário com validação em JavaScript e lista de reportes salvos no navegador |

## Estrutura de pastas

```text
SmartFlow/
├── index.html
├── README.md
├── pages/   solucao, simulador, impacto, reportar
├── css/     fontes, base, cidade (tema), home, paginas, simulador, reportar, impacto
├── img/     logo, favicon (SVG, ICO, PNG) e fotos
├── fonts/   Inter e Sora (licença SIL OFL), embutidas para funcionar offline
├── js/      comum, tema, movimento, dados, home, radar, simulador, comparar, simulacao, camera, impacto, calor, reportar, mapa
└── img/     logo, diagrama-solucao.svg e fotos/ (fotos, vídeo e quadros)
```

## Tecnologias

HTML5 semântico, CSS3 (variáveis, flexbox, grid e media queries) e JavaScript puro (arrays de objetos, DOM, eventos, validação de formulário e `localStorage`). Nenhum framework ou biblioteca externa. Nenhum recurso é carregado da internet, então o site funciona offline.

## Acessibilidade

Tags semânticas e landmarks, link "Pular para o conteúdo", `label` em todos os campos, mensagens de erro ligadas aos campos, navegação completa pelo teclado com foco visível, contraste conferido, alvos de toque de pelo menos 44 px, respeito a `prefers-reduced-motion`, **modo de alto contraste** e **ajuste do tamanho do texto** em todas as páginas.

## Dados ilustrativos

Os corredores, atrasos e percentuais de redução do Simulador e do Impacto (`js/dados.js`) são **valores ilustrativos** criados para demonstrar a simulação. Não são medições oficiais. O único dado real do site é o tempo de deslocamento citado acima, com fonte.

## Integrantes

| Nome | RM |
|---|---|
| Nicholas de Freitas Araujo | RM573712 |
| Luiz Felipe Carvalho Matos | RM572964 |
| Paulo José Agustavo Rocha Fonseca | RM570734 |
| Guilherme Matias dos Santos | RM570788 |
| Felipe Rodrigues da Silva | RM571100 |

## Vídeo pitch

**COLE AQUI O LINK PÚBLICO DO VÍDEO (YouTube, Google Drive ou Vimeo)**

## Uso de IA generativa

- **Ferramenta:** Claude (Anthropic).
- **Para quê:** leitura e organização dos requisitos, planejamento, rascunho do código e dos textos, e testes automatizados de acessibilidade e de funcionamento.
- **Como foi usada:** o resultado foi revisado e testado pelo grupo antes da entrega.
- **Vídeo pitch:** a narração foi gerada por IA de texto para voz (Piper, voz pt_BR "faber", código aberto), a partir de um roteiro escrito com apoio do Claude e revisado pelo grupo. A edição foi feita com Remotion. As imagens do vídeo são as mesmas fotos e vídeos de uso livre listados em "Imagens e vídeo", mais o vídeo aéreo de João Pavese (Pexels) no fechamento.

## Origem do projeto e créditos

Este protótipo é uma evolução do projeto SmartFlow do próprio grupo, publicado em agosto de 2026 em `github.com/FelipeR01/SmartFlow`. O código desta versão foi reescrito para o tema CitizenTech. Fontes de dados e links estão na página **Impacto**, seção "Fontes e créditos" (também ligada no rodapé de todas as páginas).

## Imagens e vídeo

Cada foto e vídeo aparece uma única vez no site. As imagens de terceiros têm licença livre (Unsplash, Pexels ou Creative Commons) e foram recortadas e comprimidas para a web.

| Arquivo | Onde aparece | Autor e licença |
|---|---|---|
| `img/fotos/video-marginal.mp4` (+ `.jpg`) | vídeo da capa (Início) | João Pavese, Pexels (licença Pexels) |
| `img/fotos/video-paulista.mp4` (+ `.jpg`) | demonstração de câmera (Solução) | Luiz Valerio Trindade, Pexels (licença Pexels) |
| `img/fotos/video-skyline.mp4` (+ `.jpg`) | fundo das páginas internas | Zinho Santos, Pexels (licença Pexels) |
| `img/fotos/sp-marginal-lentidao.webp` | foto do problema (Início) | Mariordo, Wikimedia Commons (CC BY-SA 3.0) |
| `img/fotos/sp-pedestres-faixa.webp` | galeria (Início) | Tutz Dias, Unsplash (licença Unsplash) |
| `img/fotos/sp-avenida-arvores.webp` | faixa de foto (Simulador) | Bruno Thethe, Unsplash (licença Unsplash) |
| `img/fotos/sp-onibus-paulista.webp` | "Quem sente a diferença" (Impacto) | Selena Jiménez, Unsplash (licença Unsplash) |
| `img/fotos/sp-prestes-maia.webp` | foto ao lado dos reportes (Reportar) | maria roberta castilho, Unsplash (licença Unsplash) |
| `img/fotos/cab-solucao.webp` | topo da Solução | Felipe Brayner, Unsplash (licença Unsplash) |
| `img/fotos/cab-simulador.webp` | topo do Simulador | Vitor Mendes Stafusa, Unsplash (licença Unsplash) |
| `img/fotos/cab-impacto.webp` | topo do Impacto | Maick Maciel, Unsplash (licença Unsplash) |
| `img/fotos/cab-reportar.webp` | topo do Reportar | Daniel Granja, Unsplash (licença Unsplash) |
| `img/fotos/sp-estaiada-noite.webp`, `sp-viaduto-lentidao.webp`, `sp-paulista-entardecer.webp` | galeria (Início) e Impacto | enviadas pelo grupo. PREENCHER (origem; se foram geradas com IA, escreva isso aqui) |
| `img/fotos/camera-faria-lima.webp` | imagem de câmera (Solução) | do protótipo anterior do grupo. PREENCHER (fonte da imagem) |

Movimento: entrada dos blocos ao rolar, barras que crescem, faixa de tráfego animada e diagrama animado na Solução, tudo em CSS e JavaScript puros (`js/movimento.js`). Quem ativa "reduzir movimento" no sistema vê a página sem animações.

O vídeo da página inicial tem botão "Pausar vídeo" e fica parado para quem pede movimento reduzido no sistema.


## Fontes tipográficas

Sora (títulos) e Inter (texto), todas com licença SIL Open Font License. Os arquivos e as licenças estão em `fonts/`.


## Funcionalidades interativas

- **Início:** calculadora de minutos perdidos (barra que muda de cor) e radar dos 13 corredores (`js/home.js`, `js/radar.js`).
- **Solução:** simulação de um cruzamento com dois semáforos recebendo os mesmos carros (`js/simulacao.js`). Modelo simplificado, com ônibus e pedidos de pedestre. As taxas de chegada são hipóteses do grupo, não medições.
- **Simulador:** tabela com filtro e ordenação, "Meu trajeto" e comparação de dois trajetos com botão de copiar (`js/simulador.js`, `js/comparar.js`).
- **Impacto:** barras de horas por corredor e mapa de calor (`js/impacto.js`, `js/calor.js`).
- **Reportar:** formulário com validação própria e mapa esquemático dos reportes salvos no navegador (`js/reportar.js`, `js/mapa.js`).
