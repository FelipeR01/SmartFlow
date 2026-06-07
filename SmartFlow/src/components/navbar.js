document.addEventListener('DOMContentLoaded', function() {

    var caminho = window.location.pathname;
    var emPages = caminho.includes('/pages/');
    var raiz = emPages ? '../' : './';
    var pasta = 'pages/';

    var html = `
        <nav class="nav">
            <a href="${raiz}index.html" class="nav-logo">SmartFlow</a>

            <ul class="nav-links">
                <li><a href="${raiz}index.html"               data-pagina="home">Home</a></li>
                <li><a href="${raiz}${pasta}tecnologia.html"  data-pagina="tecnologia">Technology</a></li>
                <li><a href="${raiz}${pasta}simulador.html"   data-pagina="simulador">Simulator</a></li>
                <li><a href="${raiz}${pasta}impacto.html"     data-pagina="impacto">Impact</a></li>
                <li><a href="${raiz}${pasta}contato.html"     data-pagina="contato">Contact</a></li>
            </ul>

            <a href="${raiz}${pasta}contato.html" class="nav-btn">Get Started</a>

            <button class="nav-toggle" aria-label="Abrir menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    `;

    var navBar = document.getElementById('nav-bar');
    if (navBar) navBar.innerHTML = html;

    var mapa = {
        'home'      : /index\.html|\/$/ ,
        'tecnologia': /tecnologia/,
        'simulador' : /simulador/,
        'impacto'   : /impacto/,
        'contato'   : /contato/,
    };

    document.querySelectorAll('.nav-links a').forEach(function(link) {
        var pagina = link.dataset.pagina;
        if (mapa[pagina] && mapa[pagina].test(caminho)) {
            link.classList.add('ativo');
        }
    });

    var toggle = document.querySelector('.nav-toggle');
    if (toggle) {
        toggle.addEventListener('click', function() {
            navBar.classList.toggle('aberto');
        });
    }

});