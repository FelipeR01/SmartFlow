document.addEventListener('DOMContentLoaded', function() {

    // 1. Lógica para definir os caminhos relativos corretamente
    var caminho = window.location.pathname;
    var emPages = caminho.includes('/pages/');
    var raiz = emPages ? '../' : './';
    var pasta = 'pages/';

    // 2. Estrutura HTML da Navbar
    var html = `
        <nav class="nav">
            <a href="${raiz}index.html" class="nav-logo">SmartFlow</a>
            <ul class="nav-links">
                <li><a href="${raiz}index.html" data-pagina="home">Home</a></li>
                <li><a href="${raiz}${pasta}tecnologia.html" data-pagina="tecnologia">Technology</a></li>
                <li><a href="${raiz}${pasta}simulador.html" data-pagina="simulador">Simulator</a></li>
                <li><a href="${raiz}${pasta}impacto.html" data-pagina="impacto">Impact</a></li>
                <li><a href="${raiz}${pasta}contato.html" data-pagina="contato">Contact</a></li>
            </ul>
            <a href="${raiz}${pasta}contato.html" class="nav-btn">Get Started</a>
            <button class="nav-toggle" aria-label="Abrir menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    `;

    // 3. Injeta a Navbar dentro da tag <header id="nav-bar"></header>
    var navBarContainer = document.getElementById('nav-bar');
    if (navBarContainer) {
        navBarContainer.innerHTML = html;
    }

    // 4. Lógica para marcar o link da página atual como ativo
    var mapa = {
        'home' : /index\.html|\/$/,
        'tecnologia': /tecnologia/,
        'simulador' : /simulador/,
        'impacto' : /impacto/,
        'contato' : /contato/,
    };

    document.querySelectorAll('.nav-links a').forEach(function(link) {
        var pagina = link.dataset.pagina;
        if (mapa[pagina] && mapa[pagina].test(caminho)) {
            link.classList.add('ativo'); // Garanta que seu CSS tem estilos para .ativo
        }
    });

    // 5. Lógica do Menu Mobile (Menu Hambúrguer) corrigida
    const menuBtn = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        // Alterna o menu aberto/fechado ao clicar no botão
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('aberto'); // Usa a classe 'aberto' na ul.nav-links
        });

        // Fecha o menu automaticamente caso o usuário clique em um link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('aberto');
            });
        });
    }
});
