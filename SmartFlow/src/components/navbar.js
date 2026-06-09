document.addEventListener('DOMContentLoaded', () => {

    const path = window.location.pathname;

    // Está dentro de src/pages?
    const emPages = path.includes('/src/pages/');

    // Base correta
    const base = emPages ? '../../' : './';

    const navHTML = `
        <nav class="nav">

            <a href="${base}index.html" class="nav-logo">
                SmartFlow
            </a>

            <ul class="nav-links">

                <li>
                    <a href="${base}index.html" data-page="home">
                        Home
                    </a>
                </li>

                <li>
                    <a href="${base}src/pages/tecnologia.html" data-page="tecnologia">
                        Technology
                    </a>
                </li>

                <li>
                    <a href="${base}src/pages/simulador.html" data-page="simulador">
                        Simulator
                    </a>
                </li>

                <li>
                    <a href="${base}src/pages/impacto.html" data-page="impacto">
                        Impact
                    </a>
                </li>

                <li>
                    <a href="${base}src/pages/contato.html" data-page="contato">
                        Contact
                    </a>
                </li>

            </ul>

            <a href="${base}src/pages/contato.html" class="nav-btn">
                Get Started
            </a>

            <button class="nav-toggle" aria-label="Abrir menu">
                <span></span>
                <span></span>
                <span></span>
            </button>

        </nav>
    `;

    const navBar = document.getElementById('nav-bar');

    if (navBar) {
        navBar.innerHTML = navHTML;
    }

    // Página ativa
    const mapa = {
        home: /index\.html$|\/$/,
        tecnologia: /tecnologia/,
        simulador: /simulador/,
        impacto: /impacto/,
        contato: /contato/,
    };

    document.querySelectorAll('.nav-links a')
        .forEach(link => {

            const pagina = link.dataset.page;

            if (mapa[pagina]?.test(path)) {
                link.classList.add('ativo');
            }
        });

    // Menu mobile
    const toggle = document.querySelector('.nav-toggle');

    toggle?.addEventListener('click', () => {
        navBar.classList.toggle('aberto');
    });

});