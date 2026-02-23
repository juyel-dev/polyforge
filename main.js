import init, { greet, add } from './pkg/polyforge_core.js';

let editor;
let pyodideReady = false;
let pyodide;

async function loadMonaco() {
  const vs = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.51.0/min/vs';
  require.config({ paths: { vs } });
  require(['vs/editor/editor.main'], () => {
    editor = monaco.editor.create(document.getElementById('editor'), {
      value: '// Welcome to PolyForge\n// Offline • Mobile • Any Language\nconsole.log("Hello from phone!");',
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true,
      fontSize: 15
    });
  });
}

async function loadPyodide() {
  if (pyodideReady) return;
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js';
  document.head.appendChild(script);
  await new Promise(r => script.onload = r);
  pyodide = await loadPyodide();
  pyodideReady = true;
  console.log('✅ Pyodide ready (offline cached)');
}

async function runJS() {
  const code = editor.getValue();
  const output = document.getElementById('output');
  try {
    const result = new Function(code)();
    output.innerHTML = `<span class="text-green-400">JS Output: ${result || 'done'}</span>`;
  } catch (e) {
    output.innerHTML = `<span class="text-red-400">Error: ${e.message}</span>`;
  }
}

async function runPython() {
  await loadPyodide();
  const code = editor.getValue();
  const output = document.getElementById('output');
  try {
    const result = await pyodide.runPythonAsync(code);
    output.innerHTML = `<span class="text-blue-400">Python Output: ${result}</span>`;
  } catch (e) {
    output.innerHTML = `<span class="text-red-400">Python Error: ${e.message}</span>`;
  }
}

async function callRust() {
  await init();
  const output = document.getElementById('output');
  const name = prompt("Enter your name (Rust WASM test)", "Friend");
  const msg = greet(name);
  const sum = add(25, 17);
  output.innerHTML = `<span class="text-purple-400">${msg}<br>Rust Add(25+17) = ${sum}</span>`;
}

// Load everything
document.addEventListener('DOMContentLoaded', () => {
  loadMonaco();
  loadPyodide();
});
