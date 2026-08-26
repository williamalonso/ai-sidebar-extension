# Como a Extensão Funciona — Guia Didático

## O que é essa extensão?

É uma extensão para o Chrome que adiciona uma **barra lateral (side panel)** ao navegador. Nessa barra lateral você pode abrir ChatGPT, Gemini ou Claude sem sair da página que está navegando.

---

## Estrutura de arquivos

```
ai-sidebar-extension/
├── manifest.json     ← Ponto de entrada: define a extensão para o Chrome
├── background.js     ← Processo em segundo plano (service worker)
├── sidepanel.html    ← Interface visual da barra lateral
├── sidepanel.js      ← Lógica dos botões e carregamento das IAs
├── styles.css        ← Estilos visuais da barra lateral
├── rules.json        ← Regras para remover bloqueios de iframe
└── README.md
```

---

## Por onde a extensão começa?

### 1. `manifest.json` — o ponto de partida

O Chrome lê esse arquivo primeiro. Ele é o "documento de identidade" da extensão e define:

- **Nome e versão** da extensão
- **Permissões** necessárias (`sidePanel`, `declarativeNetRequest`)
- **Quais sites** a extensão pode acessar (ChatGPT, Gemini, Claude etc.)
- **Qual arquivo** roda em segundo plano: `background.js`
- **Qual arquivo** é a interface da barra lateral: `sidepanel.html`
- **Quais regras** de rede usar: `rules.json`

### 2. `background.js` — o gatilho

Roda invisível em segundo plano como um *service worker* (não tem interface visual).

```js
// Quando o usuário clica no ícone da extensão na barra do Chrome:
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id }); // abre a barra lateral
});

// Na primeira instalação, configura para sempre abrir ao clicar no ícone:
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
```

**Resumo:** ao clicar no ícone da extensão, o `background.js` ordena ao Chrome para abrir a barra lateral.

### 3. `sidepanel.html` — a interface visual

Quando a barra lateral abre, o Chrome carrega esse arquivo. Ele contém:

- **Botões** para cada IA (ChatGPT, Gemini, Claude)
- Um **`<iframe>`** inicialmente oculto — é onde a IA será exibida
- Uma mensagem de boas-vindas que some ao escolher uma IA
- Carrega o `styles.css` (visual) e o `sidepanel.js` (lógica)

### 4. `sidepanel.js` — a lógica dos botões

Controla o que acontece quando o usuário clica num botão de IA:

```js
// Mapeamento: nome da IA → URL do site
const urls = {
  chatgpt: "https://chatgpt.com",
  gemini:  "https://gemini.google.com/app",
  claude:  "https://claude.ai",
};

// Ao clicar num botão:
// 1. Esconde a mensagem de boas-vindas
// 2. Exibe o iframe
// 3. Define o src do iframe para a URL da IA escolhida
```

O iframe carrega o site da IA diretamente dentro da barra lateral.

### 5. `rules.json` — removendo bloqueios

Sites como ChatGPT e Claude normalmente **bloqueiam** serem carregados dentro de iframes (por segurança, via cabeçalhos HTTP `X-Frame-Options` e `Content-Security-Policy`).

O `rules.json` usa a API `declarativeNetRequest` do Chrome para **remover esses cabeçalhos** nas respostas dos sites listados no `manifest.json`, permitindo que carreguem no iframe da extensão.

### 6. `styles.css` — visual

Define a aparência dos botões e da barra lateral. Sem lógica funcional.

---

## Fluxo completo passo a passo

```
Usuário clica no ícone da extensão
         ↓
background.js detecta o clique
         ↓
Chrome abre a barra lateral com sidepanel.html
         ↓
sidepanel.html carrega styles.css e sidepanel.js
         ↓
Usuário vê botões: [ChatGPT] [Gemini] [Claude]
         ↓
Usuário clica em um botão
         ↓
sidepanel.js define o src do iframe com a URL da IA
         ↓
Chrome faz requisição ao site da IA
         ↓
rules.json remove os cabeçalhos de bloqueio de iframe
         ↓
Site da IA carrega dentro da barra lateral ✅
```

---

## DeepSeek e Copilot

No código você vai notar linhas comentadas:

```html
<!-- <button id="btn-deepseek" data-ai="deepseek">DeepSeek</button> -->
<!-- <button id="btn-copilot" data-ai="copilot">Copilot</button> -->
```

Esses botões existem no código mas estão desativados. Para reativá-los, basta remover os comentários em `sidepanel.html` e em `sidepanel.js`.

---

## Qual pasta selecionar ao instalar no Chrome?

Ao carregar a extensão em `chrome://extensions` no modo desenvolvedor, selecione a pasta raiz do repositório:

```
ai-sidebar-extension/
```

É a pasta que contém diretamente o `manifest.json`. O Chrome precisa encontrar esse arquivo na raiz da pasta selecionada.
