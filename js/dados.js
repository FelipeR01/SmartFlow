/* ==========================================================================
   Dados do protótipo (usados no Simulador e na página de Impacto).

   ATENÇÃO: os valores abaixo são ILUSTRATIVOS. Servem para demonstrar a
   simulação. Não são medições oficiais da CET nem de outro órgão.
   - atraso: minutos extras por viagem, no horário de pico, nesse corredor
   - ganho:  redução percentual desse atraso quando os semáforos se adaptam
   ========================================================================== */

const corredores = [
  { id: 1,  nome: "Av. Paulista",                 regiao: "Centro", modal: "Ônibus e carros", atraso: 9,  ganho: 18 },
  { id: 2,  nome: "Av. Brigadeiro Luís Antônio",  regiao: "Centro", modal: "Ônibus e carros", atraso: 8,  ganho: 17 },
  { id: 3,  nome: "Av. Faria Lima",               regiao: "Oeste",  modal: "Carros",          atraso: 14, ganho: 22 },
  { id: 4,  nome: "Av. Rebouças",                 regiao: "Oeste",  modal: "Ônibus e carros", atraso: 11, ganho: 20 },
  { id: 5,  nome: "Av. Francisco Morato",         regiao: "Oeste",  modal: "Ônibus e carros", atraso: 12, ganho: 19 },
  { id: 6,  nome: "Av. Santo Amaro",              regiao: "Sul",    modal: "Ônibus e carros", atraso: 15, ganho: 21 },
  { id: 7,  nome: "Av. Interlagos",               regiao: "Sul",    modal: "Ônibus e carros", atraso: 12, ganho: 19 },
  { id: 8,  nome: "Av. Eng. Luís Carlos Berrini", regiao: "Sul",    modal: "Carros",          atraso: 10, ganho: 20 },
  { id: 9,  nome: "Av. Radial Leste",             regiao: "Leste",  modal: "Ônibus e carros", atraso: 13, ganho: 16 },
  { id: 10, nome: "Av. Celso Garcia",             regiao: "Leste",  modal: "Ônibus e carros", atraso: 16, ganho: 23 },
  { id: 11, nome: "Av. Sapopemba",                regiao: "Leste",  modal: "Ônibus",          atraso: 18, ganho: 24 },
  { id: 12, nome: "Av. Inajar de Souza",          regiao: "Norte",  modal: "Ônibus e carros", atraso: 15, ganho: 22 },
  { id: 13, nome: "Av. Cruzeiro do Sul",          regiao: "Norte",  modal: "Ônibus e carros", atraso: 10, ganho: 18 }
];

// Premissa usada nos cálculos: 48 semanas de deslocamento por ano.
const SEMANAS_POR_ANO = 48;

// Horas perdidas por ano para um trajeto.
// atrasoMin: minutos extras por viagem | viagensDia: viagens por dia | diasSemana: dias por semana
function horasPerdidasPorAno(atrasoMin, viagensDia, diasSemana) {
  return (atrasoMin * viagensDia * diasSemana * SEMANAS_POR_ANO) / 60;
}

// Atraso depois do SmartFlow, dado o percentual de ganho.
function aplicarGanho(valor, ganhoPercentual) {
  return valor * (1 - ganhoPercentual / 100);
}

// Formata número com separador brasileiro e 0 casas decimais.
function formatarInteiro(numero) {
  return Math.round(numero).toLocaleString("pt-BR");
}
