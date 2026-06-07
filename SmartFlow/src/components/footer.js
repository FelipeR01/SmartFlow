document.addEventListener('DOMContentLoaded', function() {

    var caminho = window.location.pathname;
    var emPages = caminho.includes('/pages/');
    var raiz = emPages ? '../' : './';
    var pasta = 'pages/';

    var html = `
        <div class="footer-inner">

            <div class="footer-marca">
                <a href="${raiz}index.html" class="footer-logo">SmartFlow</a>
                <p class="footer-copy">
                    SmartFlow © 2026 - Projeto Global Solution FIAP.
                    Desenvolvido por: Equipe SmartFlow 
                </p>
            </div>

            <div class="footer-links">
                <a href="#" class="footer-link">Privacy Policy</a>
                <a href="#" class="footer-link">Terms of Service</a>
                <a href="#" class="footer-link">API Documentation</a>
                <a href="#" class="footer-link footer-link-destaque">Link do Vídeo Pitch do YouTube</a>
            </div>

        </div>
    `;

    var footer = document.getElementById('footer');
    if (footer) footer.innerHTML = html;

});