/* Realmetaverso · aplicativo: instalar, ler sem internet e saber de edição nova
   ALDENIR ROCHA DE OLIVEIRA FILHO · PROJETO 360X

   O que este arquivo faz, nas três páginas do site (Diário nº 019, Concórdia e Códice Vivo):
   registra a cópia para ler sem internet (o sw.js da raiz do site), põe o convite "Instalar
   aplicativo" com o passo a passo de cada aparelho, avisa quando a conexão cai, avisa quando
   há edição mais nova e acerta a cor da barra do aparelho com a pele escolhida.

   Onde ele liga: só no endereço do aplicativo. A página diz qual é com
   <link rel="manifest" href="…" data-app-escopo="/realmetaverso/">; se ela estiver sendo servida
   de outro lugar (o Códice sozinho, uma cópia de trabalho, uma moldura de visualizador), este
   arquivo não faz nada: nenhum pedido, nenhum botão, nenhum erro.

   O que ele não faz: não envia nada a ninguém e não lê nem apaga dados de outros sites. */
(function () {
'use strict';
const doc = document, raiz = doc.documentElement;

/* ───────── este é o endereço do aplicativo? ───────── */
try { if (window.top !== window.self) return; } catch (e) { return; }
const elo = doc.querySelector('link[rel="manifest"][data-app-escopo]');
if (!elo || !window.isSecureContext) return;
let casa, sw;
try { casa = new URL('./', elo.href); sw = navigator.serviceWorker; } catch (e) { return; }
if (!sw || casa.origin !== location.origin || casa.pathname !== elo.getAttribute('data-app-escopo')) return;

const ENDERECO = location.href.split('#')[0];
const noAparelho = () => {
  try {
    return navigator.standalone === true || ['standalone', 'minimal-ui', 'window-controls-overlay'].some(m => matchMedia('(display-mode: ' + m + ')').matches);
  } catch (e) { return false; }
};
raiz.classList.add('app-on');
raiz.classList.toggle('app-solo', noAparelho());
try { matchMedia('(display-mode: standalone)').addEventListener('change', () => raiz.classList.toggle('app-solo', noAparelho())); } catch (e) {}

/* ───────── aparência: usa as cores e as fontes da página, nas duas peles ───────── */
doc.head.insertAdjacentHTML('beforeend', '<style id="app-estilo">' +
  '.app-solo [data-app-instalar],.app-instalado [data-app-instalar]{display:none!important}' +
  '.app-lomb{padding:10px 12px}.app-lomb .btn{display:flex;gap:10px;align-items:center;width:100%;text-align:left}' +
  '.app-janela{width:min(92vw,31rem);max-height:92vh;padding:0;border:1px solid var(--linha,rgba(217,178,95,.3));border-radius:12px;background:var(--painel,#111727);color:var(--tinta,#ece4d0);font-family:var(--f-corpo,system-ui,sans-serif);box-shadow:0 18px 50px rgba(0,0,0,.55)}' +
  '.app-janela::backdrop{background:rgba(4,6,12,.74)}.app-janela-c{padding:22px 24px 20px}' +
  '.app-janela h2{margin:0;font-family:var(--f-display,Georgia,serif);font-size:1.25rem;line-height:1.25;color:var(--ouro2,#f2d38a)}' +
  '.app-janela p{margin:10px 0 0;font-size:.98rem;line-height:1.55}' +
  '.app-passos{margin:14px 0 0;padding-left:1.5em;font-size:.98rem;line-height:1.5}.app-passos li{padding:4px 0 4px 4px}' +
  '.app-passos li::marker{color:var(--ouro,#d9b25f);font-weight:700}.app-passos b{color:var(--ouro2,#f2d38a)}' +
  '.app-janela .app-menor{font-size:.86rem;color:var(--tinta2,#aba795)}' +
  '.app-botoes{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 0}' +
  '.app-b{font:inherit;font-size:.95rem;min-height:44px;padding:9px 18px;border-radius:8px;border:1px solid var(--linha,rgba(217,178,95,.3));background:var(--fundo,#0a0d16);color:var(--tinta,#ece4d0);cursor:pointer}' +
  '.app-b:hover{border-color:var(--ouro,#d9b25f)}.app-b[hidden]{display:none}' +
  '.app-b.app-forte{background:var(--ouro,#d9b25f);border-color:var(--ouro,#d9b25f);color:var(--fundo,#0a0d16);font-weight:700}' +
  '.app-avisos{position:fixed;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:80;display:flex;flex-direction:column;gap:8px;align-items:center;width:max-content;max-width:calc(100vw - 24px);pointer-events:none}' +
  '.app-aviso{pointer-events:auto;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;justify-content:center;padding:9px 16px;border-radius:20px;border:1px solid var(--linha,rgba(217,178,95,.3));background:var(--painel2,#19213a);color:var(--tinta,#ece4d0);font-family:var(--f-corpo,system-ui,sans-serif);font-size:.9rem;line-height:1.35;box-shadow:0 8px 24px rgba(0,0,0,.45)}' +
  '.app-aviso button{font:inherit;font-weight:700;min-height:32px;padding:4px 12px;border-radius:8px;border:1px solid var(--ouro,#d9b25f);background:none;color:var(--ouro2,#f2d38a);cursor:pointer}' +
  '@media print{.app-avisos,.app-lomb,[data-app-instalar]{display:none!important}}' +
  '</style>');

/* ───────── convite para instalar ───────── */
function gatilho() {
  const b = doc.createElement('button');
  b.type = 'button';
  b.className = 'btn';
  b.setAttribute('data-app-instalar', '');
  b.innerHTML = '<span aria-hidden="true">📲</span> <span>Instalar aplicativo</span>';
  return b;
}
const pe = doc.querySelector('#lombada .lomb-pe');           // Códice: no pé do índice
if (pe) {
  const d = doc.createElement('div');
  d.className = 'app-lomb';
  d.appendChild(gatilho());
  pe.parentNode.insertBefore(d, pe);
}
const acoes = doc.querySelector('.capa .acoes');             // Diário nº 019 e Concórdia: entre as ações da capa
if (acoes) acoes.appendChild(gatilho());

const aparelho = () => {
  const ua = navigator.userAgent || '';
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  if (/Firefox\//.test(ua)) return 'firefox';
  if (/Macintosh/.test(ua) && /Safari\//.test(ua) && !/Chrome\/|Chromium\/|Edg\/|OPR\//.test(ua)) return 'safari-mac';
  return 'computador';
};
const PASSOS = {
  ios: ['Toque em <b>Compartilhar</b>, o quadrado com a seta para cima, na barra do navegador.',
    'Role a lista e toque em <b>Adicionar à Tela de Início</b>.',
    'Confirme em <b>Adicionar</b>. O Realmetaverso passa a ficar entre os seus aplicativos.'],
  android: ['Toque no menu <b>⋮</b> do navegador.',
    'Escolha <b>Instalar aplicativo</b> ou <b>Adicionar à tela inicial</b>.',
    'Confirme em <b>Instalar</b>.'],
  'safari-mac': ['No menu do Safari, abra <b>Arquivo</b>.',
    'Escolha <b>Adicionar ao Dock</b>.',
    'Confirme em <b>Adicionar</b>.'],
  firefox: ['Copie o endereço desta página.',
    'Abra o endereço no <b>Chrome</b>, no <b>Edge</b> ou no <b>Safari</b>: o Firefox do computador não instala sites como aplicativo.',
    'Lá, clique de novo em <b>Instalar aplicativo</b>.'],
  computador: ['Na barra de endereço, clique no ícone de <b>instalar</b>: um monitor com uma seta.',
    'Se ele não aparecer, abra o menu <b>⋮</b> do navegador e escolha a opção de <b>instalar esta página como aplicativo</b>.',
    'Confirme em <b>Instalar</b>.']
};

doc.body.insertAdjacentHTML('beforeend', '<dialog class="app-janela" id="app-janela" aria-labelledby="app-janela-t"><div class="app-janela-c">' +
  '<h2 id="app-janela-t">Realmetaverso no seu aparelho</h2>' +
  '<p>Instalado, o site abre da tela de início, em tela cheia, e continua legível sem internet.</p>' +
  '<ol class="app-passos"></ol><p class="app-menor app-estado" role="status"></p>' +
  '<p class="app-botoes"><button type="button" class="app-b app-forte" data-app-agora hidden>Instalar agora</button>' +
  '<button type="button" class="app-b" data-app-fechar>Fechar</button></p>' +
  '<p class="app-menor">Para desfazer, apague o aplicativo como qualquer outro. A cópia fica só neste aparelho: nada é enviado a ninguém.</p>' +
  '</div></dialog><div class="app-avisos"></div>');
const janela = doc.getElementById('app-janela'), avisos = doc.querySelector('.app-avisos');
let oferta = null, quemAbriu = null;

function estado() {
  const n = raiz.dataset.appCopia;
  janela.querySelector('.app-estado').textContent = n
    ? 'Cópia para ler sem internet: pronta neste aparelho (' + n + ' arquivos).'
    : 'A cópia para ler sem internet está sendo preparada.';
}
function abrirJanela() {
  janela.querySelector('.app-passos').innerHTML = PASSOS[aparelho()].map(p => '<li>' + p + '</li>').join('');
  janela.querySelector('[data-app-agora]').hidden = !oferta;
  estado();
  if (janela.showModal) janela.showModal(); else janela.setAttribute('open', '');
}
function fecharJanela() { if (janela.open) { if (janela.close) janela.close(); else janela.removeAttribute('open'); } }
janela.addEventListener('close', () => { if (quemAbriu && doc.contains(quemAbriu)) quemAbriu.focus(); });

function chamarOferta() {
  const o = oferta;
  oferta = null;                       // cada oferta do navegador só pode ser usada uma vez
  try { Promise.resolve(o.prompt()).catch(() => {}); } catch (e) { abrirJanela(); }
}
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); oferta = e; });
window.addEventListener('appinstalled', () => { oferta = null; raiz.classList.add('app-instalado'); fecharJanela(); });

doc.addEventListener('click', e => {
  const alvo = e.target.closest ? e.target : e.target.parentElement;
  if (!alvo) return;
  const g = alvo.closest('[data-app-instalar]');
  if (g) { e.preventDefault(); quemAbriu = g; if (oferta) chamarOferta(); else abrirJanela(); return; }
  if (alvo.closest('[data-app-agora]')) { fecharJanela(); if (oferta) chamarOferta(); return; }
  if (alvo.closest('[data-app-fechar]')) { fecharJanela(); return; }
  if (alvo.closest('[data-app-recarregar]')) { location.reload(); return; }
  if (alvo === janela) {             // clique fora da caixa, sobre o fundo escurecido
    const b = janela.getBoundingClientRect();
    if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) fecharJanela();
  }
});

/* ───────── avisos: sem conexão e edição nova ───────── */
function aviso(id, html) {
  let a = doc.getElementById(id);
  if (html === null) { if (a) a.remove(); return; }
  if (a) return;
  a = doc.createElement('div');
  a.id = id;
  a.className = 'app-aviso';
  a.setAttribute('role', 'status');
  a.innerHTML = html;
  avisos.appendChild(a);
}
const rede = () => aviso('app-sem-rede', navigator.onLine === false ? '<span>Sem conexão · lendo a cópia guardada neste aparelho</span>' : null);
window.addEventListener('offline', rede);
window.addEventListener('online', rede);
rede();

/* Edição nova: guarda o carimbo da página aberta e, quando o leitor volta ao aplicativo, pergunta ao
   servidor se o carimbo mudou. É um pedido só de cabeçalho, no máximo a cada dois minutos. */
let carimbo = null, ultima = 0;
async function conferir() {
  if (navigator.onLine === false || doc.visibilityState === 'hidden' || Date.now() - ultima < 120000) return;
  ultima = Date.now();
  try {
    const r = await fetch(ENDERECO, { method: 'HEAD', cache: 'no-store' });
    /* o mesmo conteúdo pode vir com carimbo forte ou fraco (W/"…"): compara-se sem o prefixo */
    const c = r.ok ? (r.headers.get('etag') || r.headers.get('last-modified') || '').replace(/^W\//, '') : '';
    if (!c) return;
    if (carimbo === null) carimbo = c;
    else if (c !== carimbo) aviso('app-nova', '<span>Há uma edição mais nova deste site.</span><button type="button" data-app-recarregar>Atualizar</button>');
  } catch (e) { /* sem rede: tenta na próxima volta */ }
}
setTimeout(conferir, 5000);
doc.addEventListener('visibilitychange', conferir);
window.addEventListener('online', conferir);
window.addEventListener('pageshow', e => { if (e.persisted) conferir(); });

/* ───────── cor da barra do aparelho: obsidiana ou pergaminho ───────── */
const metaCor = doc.querySelector('meta[name="theme-color"]');
const cor = () => { if (metaCor) metaCor.setAttribute('content', raiz.getAttribute('data-pele') === 'pergaminho' ? '#f0e6cf' : '#0a0d16'); };
try { new MutationObserver(cor).observe(raiz, { attributes: true, attributeFilter: ['data-pele'] }); } catch (e) {}
cor();

/* ───────── cópia para ler sem internet ───────── */
function aquecer(reg) {
  if (!reg || !reg.active) return;
  let urls = [ENDERECO];
  try {
    urls = urls.concat([...doc.querySelectorAll('link[rel~="stylesheet"][href]')].map(l => l.href),   // inclui as fontes do Google
      performance.getEntriesByType('resource').map(r => r.name));
  } catch (e) {}
  const economia = !!(navigator.connection && navigator.connection.saveData);   // quem pediu economia de dados só guarda o que já abriu
  reg.active.postMessage({ tipo: 'aquecer', urls, extras: !economia });
}
function registrar() {
  sw.addEventListener('message', e => {
    const d = e.data || {};
    if (d.tipo === 'copia') { raiz.dataset.appCopia = String(d.arquivos); estado(); }
  });
  try { sw.startMessages(); } catch (e) {}
  sw.register(casa.href + 'sw.js', { scope: casa.href }).catch(() => {});
  sw.ready.then(aquecer).catch(() => {});
}
if (doc.readyState === 'complete') registrar(); else window.addEventListener('load', registrar, { once: true });
})();
