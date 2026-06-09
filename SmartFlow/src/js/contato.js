var SERVICE_ID  = 'service_9ouy3ea';
var TEMPLATE_ID = 'template_cezgivo';
var PUBLIC_KEY  = 'nv3s-_Yg4znxbqFdX';

emailjs.init({
    publicKey: PUBLIC_KEY,
});

document.addEventListener('DOMContentLoaded', function() {

    var formulario  = document.getElementById('formulario-poc');
    var botaoEnviar = document.getElementById('btn-enviar');
    var feedback    = document.getElementById('form-feedback');

    if (!formulario) return; 

    formulario.addEventListener('submit', function(evento) {

   
        evento.preventDefault();

  
        botaoEnviar.disabled    = true;
        botaoEnviar.textContent = 'Enviando...';

 
        var dados = {
            nome        : document.getElementById('nome').value,
            email       : document.getElementById('email').value,
            instituicao : document.getElementById('instituicao').value,
            regiao      : document.getElementById('regiao').value,
            objetivos   : document.getElementById('objetivos').value,
        };


        emailjs.send(SERVICE_ID, TEMPLATE_ID, dados, PUBLIC_KEY)

            .then(function() {
                feedback.style.display = 'block';
                feedback.classList.remove('erro');
                feedback.textContent = '// SOLICITAÇÃO RECEBIDA. NOSSOS ENGENHEIROS ENTRARÃO EM CONTATO COM VOCÊ EM BREVE.';

                formulario.reset();

                setTimeout(function() {
                    botaoEnviar.disabled    = false;
                    botaoEnviar.textContent = 'Solicitar Reunião';
                    feedback.style.display  = 'none';
                }, 5000);
            })

            .catch(function(erro) {
                console.error('Erro EmailJS:', erro);

                feedback.style.display = 'block';
                feedback.classList.add('erro');
                feedback.textContent = '// ERRO: FALHA NA TRANSMISSÃO. TENTE NOVAMENTE OU ENTRE EM CONTATO DIRETAMENTE.';

                setTimeout(function() {
                    botaoEnviar.disabled    = false;
                    botaoEnviar.textContent = 'Solicitar Reunião';
                    feedback.style.display  = 'none';
                }, 4000);
            });
    });

});