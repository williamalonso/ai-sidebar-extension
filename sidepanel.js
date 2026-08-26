const urls = {
  chatgpt: "https://chatgpt.com",
  gemini: "https://gemini.google.com/app",
  // deepseek: "https://chat.deepseek.com",
  claude: "https://claude.ai",
  // copilot: "https://copilot.microsoft.com"
};

function openAI(ai) {
  const iframe = document.getElementById('ai-frame');
  const welcome = document.getElementById('welcome-message');
  
  welcome.style.display = 'none';
  iframe.style.display = 'block';
  iframe.src = urls[ai];
}

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.tabs button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Remover classe active de todos
      buttons.forEach(btn => btn.classList.remove('active'));
      // Adicionar a classe active ao botão clicado
      button.classList.add('active');
      
      const ai = button.getAttribute('data-ai');
      openAI(ai);
    });
  });
});