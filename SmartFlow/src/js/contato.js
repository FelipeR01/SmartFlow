var SERVICE_ID  = 'service_u4ney8j';
var TEMPLATE_ID = 'template_k2wne6f';
var PUBLIC_KEY  = 'nv3s-_Yg4znxbqFdX';


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
                feedback.textContent = '// REQUEST_RECEIVED. OUR ENGINEERS WILL CONTACT YOU SHORTLY.';

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
                feedback.textContent = '// ERROR: TRANSMISSION_FAILED. RETRY OR CONTACT DIRECTLY.';

                setTimeout(function() {
                    botaoEnviar.disabled    = false;
                    botaoEnviar.textContent = 'Solicitar Reunião';
                    feedback.style.display  = 'none';
                }, 4000);
            });
    });

});