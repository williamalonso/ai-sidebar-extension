const urls = {
  chatgpt: "https://chatgpt.com",
  gemini: "https://gemini.google.com/app",
  // deepseek: "https://chat.deepseek.com",
  claude: "https://claude.ai",
  // copilot: "https://copilot.microsoft.com"
};

const lang = navigator.language.startsWith('pt') ? 'pt' : 'en';

const i18n = {
  en: { welcome: 'Choose an AI above 👆' },
  pt: { welcome: 'Escolha uma IA acima 👆' },
};

function openAI(ai) {
  const iframe = document.getElementById('ai-frame');
  const welcome = document.getElementById('welcome-message');

  welcome.style.display = 'none';
  iframe.style.display = 'block';
  iframe.src = urls[ai];
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('welcome-message').querySelector('p').textContent = i18n[lang].welcome;

  const buttons = document.querySelectorAll('.tabs button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const ai = button.getAttribute('data-ai');
      openAI(ai);
    });
  });
});