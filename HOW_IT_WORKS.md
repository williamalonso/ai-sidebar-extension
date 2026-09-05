# How the Extension Works — A Developer Guide

## What is this extension?

A Chrome extension that adds a **side panel** to the browser. Inside that panel you can open ChatGPT, Gemini, or Claude without leaving the page you're on.

---

## File structure

```
ai-sidebar-extension/
├── manifest.json     ← Entry point: defines the extension to Chrome
├── background.js     ← Background process (service worker)
├── sidepanel.html    ← Side panel UI
├── sidepanel.js      ← Button logic and AI loading
├── styles.css        ← Visual styles
├── rules.json        ← Rules to strip iframe-blocking headers
└── README.md
```

---

## Where does the extension start?

### 1. `manifest.json` — the entry point

Chrome reads this file first. It acts as the extension's ID card and defines:

- **Name and version**
- **Required permissions** (`sidePanel`, `declarativeNetRequest`)
- **Which sites** the extension can access (ChatGPT, Gemini, Claude, etc.)
- **Which file** runs in the background: `background.js`
- **Which file** is the side panel UI: `sidepanel.html`
- **Which network rules** to apply: `rules.json`

### 2. `background.js` — the trigger

Runs invisibly as a *service worker* (no visual interface).

```js
// When the user clicks the extension icon in Chrome's toolbar:
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id }); // opens the side panel
});

// On first install, configure it to always open on icon click:
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
```

**Summary:** clicking the extension icon tells Chrome to open the side panel.

### 3. `sidepanel.html` — the UI

When the side panel opens, Chrome loads this file. It contains:

- **Buttons** for each AI (ChatGPT, Gemini, Claude)
- A **`<iframe>`** initially hidden — where the AI will be displayed
- A welcome message that disappears once an AI is selected
- Loads `styles.css` (visuals) and `sidepanel.js` (logic)

### 4. `sidepanel.js` — button logic

Controls what happens when the user clicks an AI button:

```js
// Mapping: AI name → site URL
const urls = {
  chatgpt: "https://chatgpt.com",
  gemini:  "https://gemini.google.com/app",
  claude:  "https://claude.ai",
};

// On button click:
// 1. Hide the welcome message
// 2. Show the iframe
// 3. Set the iframe src to the chosen AI's URL
```

The iframe loads the AI's website directly inside the side panel.

### 5. `rules.json` — stripping blockers

Sites like ChatGPT and Claude normally **block** being loaded inside iframes (via `X-Frame-Options` and `Content-Security-Policy` HTTP headers).

`rules.json` uses Chrome's `declarativeNetRequest` API to **remove those headers** from responses for the listed sites, allowing them to load inside the extension's iframe.

### 6. `styles.css` — visuals

Defines the appearance of buttons and the side panel. No functional logic.

---

## Full flow, step by step

```
User clicks the extension icon
         ↓
background.js detects the click
         ↓
Chrome opens the side panel with sidepanel.html
         ↓
sidepanel.html loads styles.css and sidepanel.js
         ↓
User sees buttons: [ChatGPT] [Gemini] [Claude]
         ↓
User clicks a button
         ↓
sidepanel.js sets the iframe src to the AI's URL
         ↓
Chrome makes a request to the AI's site
         ↓
rules.json strips the iframe-blocking headers
         ↓
AI site loads inside the side panel ✅
```

---

## DeepSeek and Copilot

You'll notice commented-out lines in the code:

```html
<!-- <button id="btn-deepseek" data-ai="deepseek">DeepSeek</button> -->
<!-- <button id="btn-copilot" data-ai="copilot">Copilot</button> -->
```

These buttons exist but are disabled. To enable them, remove the comments in `sidepanel.html` and `sidepanel.js`.

---

## Which folder to select when installing in Chrome?

When loading the extension at `chrome://extensions` in developer mode, select the repository root folder:

```
ai-sidebar-extension/
```

It must be the folder that contains `manifest.json` directly at its root.
