document.addEventListener('DOMContentLoaded', function() {

    var iaAtiva = false;
    var btnIa = document.getElementById('btn-ia');
    var btnIaPainel = document.getElementById('btn-ia-painel');
    var iaDesc = document.getElementById('ia-desc');
    var badgeCritico = document.querySelector('.badge-critico');
    var valorGrande = document.querySelector('.valor-grande');
    var valorUnidade = document.querySelector('.valor-unidade');
    var vazao = document.getElementById('vazao');
    var espera = document.getElementById('espera');
    var confianca = document.getElementById('confianca');


    function ativarIA() {
        iaAtiva = true;

        btnIa.textContent = 'Engine de IA Ativa';
        btnIa.classList.add('ativo');

        valorGrande.innerHTML = 'Fluxo<br>Normal:<br>450';
        valorUnidade.textContent = 'Veículos/hora.';
        valorGrande.style.color = 'var(--color-secondary-emerald)';

        if (badgeCritico) {
            badgeCritico.textContent = 'NORMALIZADO (IA ATIVA)';
            badgeCritico.style.color = 'var(--color-secondary-emerald)';
            badgeCritico.style.borderColor = 'var(--color-secondary-emerald)';
        }

        vazao.textContent = '450 v/h';
        espera.textContent = '12s';
        confianca.textContent = '99.2%';

        if (iaDesc) {
            iaDesc.textContent = 'IA Ativa. Fluxo normalizado para 450 veículos/hora. Ciclos reduzidos para 1.';
        }
    }

    function desativarIA() {
        iaAtiva = false;

        btnIa.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> Ativar Engine de IA';
        btnIa.classList.remove('ativo');

        valorGrande.innerHTML = 'Gargalo<br>Crítico:<br>1.250';
        valorUnidade.textContent = 'Veículos/hora.';
        valorGrande.style.color = '';

        if (badgeCritico) {
            badgeCritico.textContent = 'ESTADO CRÍTICO (SEM IA)';
            badgeCritico.style.color = '';
            badgeCritico.style.borderColor = '';
        }

        vazao.textContent = '1.250 v/h';
        espera.textContent = '45s';
        confianca.textContent = '—';

        if (iaDesc) {
            iaDesc.textContent = 'Qualidade do Ar: Níveis Normalizados. Fluxo Otimizado: 450 Veículos/hora.';
        }
    }

    if (btnIa) {
        btnIa.addEventListener('click', function() {
            if (iaAtiva) {
                desativarIA();
            } else {
                ativarIA();
            }
        });
    }

    if (btnIaPainel) {
        btnIaPainel.addEventListener('click', function() {
            if (iaAtiva) {
                desativarIA();
            } else {
                ativarIA();
            }
        });
    }


    var btnReload = document.getElementById('btn-reload');
    if (btnReload) {
        btnReload.addEventListener('click', function() {
            btnReload.style.opacity = '0.5';
            setTimeout(function() {
                btnReload.style.opacity = '1';
            }, 800);
        });
    }


    var relogio = document.getElementById('relogio');

    var horas = 11;
    var minutos = 2;
    var segundos = 51;
    var centesimos = 8;

    function atualizarRelogio() {
        centesimos += 3;

        if (centesimos >= 100) {
            centesimos = 0;
            segundos++;
        }

        if (segundos >= 60) {
            segundos = 0;
            minutos++;
        }

        if (minutos >= 60) {
            minutos = 0;
            horas++;
        }

        var h  = String(horas).padStart(2, '0');
        var m  = String(minutos).padStart(2, '0');
        var s  = String(segundos).padStart(2, '0');
        var cs = String(centesimos).padStart(2, '0');

        if (relogio) {
            relogio.textContent = h + ':' + m + ':' + s + '.' + cs;
        }
    }

    setInterval(atualizarRelogio, 50);

});