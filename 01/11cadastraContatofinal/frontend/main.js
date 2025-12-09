// Seleciona os elementos do DOM com os quais vamos interagir.
const form = document.getElementById('contact-form');
const responseMessage = document.getElementById('response-message');

// Adiciona um "escutador" de eventos ao formulário, que será acionado no 'submit'.
form.addEventListener('submit', async (event) => {
  // 1. Previne o comportamento padrão do formulário, que é recarregar a página.
  event.preventDefault();

  // 2. Coleta os dados do formulário usando a API FormData.
  const formData = new FormData(form);
  // Converte os dados do FormData para um objeto JavaScript simples.
  const data = Object.fromEntries(formData.entries());

  // Desabilita o botão para prevenir múltiplos envios enquanto a requisição está em andamento.
  const submitButton = form.querySelector('.submit-btn');
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';

  // Limpa mensagens anteriores
  responseMessage.textContent = '';
  responseMessage.className = '';

  try {
    // 3. Envia os dados para o backend usando a API fetch.
    const response = await fetch('http://localhost:3000/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Informa ao backend que estamos enviando JSON.
      },
      body: JSON.stringify(data), // Converte o objeto JavaScript para uma string JSON.
    });

    // 4. Analisa a resposta do backend.
    const result = await response.json();

    // 5. Exibe a mensagem de feedback para o usuário.
    if (result.success) {
      responseMessage.textContent = result.message;
      responseMessage.classList.add('success');
      form.reset(); // Limpa o formulário em caso de sucesso.
    } else {
      // Se o backend retornar um erro (ex: validação falhou), exibe a mensagem de erro.
      responseMessage.textContent = result.message;
      responseMessage.classList.add('error');
    }

  } catch (error) {
    // 6. Captura erros de rede (ex: backend fora do ar).
    console.error('Erro ao enviar o formulário:', error);
    responseMessage.textContent = 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
    responseMessage.classList.add('error');

  } finally {
    // Reabilita o botão de envio, independentemente do resultado.
    submitButton.disabled = false;
    submitButton.textContent = 'Enviar Mensagem';
  }
});
