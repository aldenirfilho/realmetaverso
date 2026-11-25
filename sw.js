/* Realmetaverso · aplicativo · cópia para ler sem internet (service worker)
   ALDENIR ROCHA DE OLIVEIRA FILHO · PROJETO 360X

   Onde mora: na raiz do site (…/realmetaverso/sw.js). A fonte fica no repositório do Códice,
   em aplicativo/sw.js, e os testes em tests/test_aplicativo.py.

   O que faz:
   - guarda neste aparelho as quatro páginas do site, o código e as artes, para tudo abrir sem internet;
   - com internet, páginas e código vêm sempre do servidor; a cópia só entra se a rede falhar ou demorar;
   - imagens e fontes saem da cópia e se renovam por trás.

   O que não faz:
   - não toca em nada fora da pasta do site. O domínio aldenirfilho.github.io é dividido com outros
     sites e aplicativos do autor (o blog Mensagens que Importam, a Bíblia Sem Jaula 365): pedidos a
     eles passam direto, e as cópias deles não são lidas nem apagadas aqui. Este arquivo só apaga
     cópias cujo nome começa com "realmetaverso-";
   - não guarda pedaços de arquivo (respostas a pedidos com Range), respostas de erro nem PDFs que
     ninguém abriu: só entra na cópia resposta inteira e bem-sucedida (200).

   Para desligar o aplicativo em todos os aparelhos: publique no lugar deste o arquivo
   aplicativo/desligar/sw.js (o README do repositório do Códice explica). */
'use strict';

const VERSAO = 'v2';               // troque para obrigar todos os aparelhos a refazer a cópia
const PREFIXO = 'realmetaverso-';
const COPIA = PREFIXO + VERSAO;
const RAIZ = new URL('./', self.location).href;
const ESPERA = 3500;               // ms à espera do servidor antes de abrir a cópia, quando ela existe
const FONTES_GOOGLE = ['fonts.googleapis.com', 'fonts.gstatic.com'];

/* Sem estes o aplicativo não se instala: as quatro páginas (Diário nº 019, Concórdia, Cidade-Origem e Códice) e o código do Códice. */
const ESSENCIAIS = ['./', 'concordia/', 'origem/', 'codice/', 'codice/assets/edicao-ilustrada.css', 'codice/assets/edicao-ilustrada.js',
  'codice/assets/aplicativo.js', 'manifest.webmanifest', 'codice/assets/app/icone-192.png'];

/* Buscados depois, um a um, sem travar nada: as fontes das páginas do Diário, as artes do Códice no
   tamanho de leitura e o Manifesto. As pranchas ampliadas (1672 px) e os PDFs ficam guardados quando
   o leitor os abre. */
const EXTRAS = ['assets/brasao-oraculo.svg',
  'assets/fonts/atkinson-hyperlegible-latin-400-normal.woff2', 'assets/fonts/atkinson-hyperlegible-latin-400-italic.woff2',
  'assets/fonts/atkinson-hyperlegible-latin-700-normal.woff2', 'assets/fonts/atkinson-hyperlegible-latin-700-italic.woff2',
  'assets/fonts/cinzel-latin-500-normal.woff2', 'assets/fonts/cinzel-latin-700-normal.woff2',
  'assets/fonts/lexend-latin-400-normal.woff2', 'assets/fonts/lexend-latin-600-normal.woff2',
  'codice/assets/brasao.svg', 'codice/assets/app/apple-touch-icon.png', 'codice/publicacoes/manifesto.html',
  'codice/assets/hero-800.webp', 'codice/assets/hero-1200.webp', 'codice/assets/hero-friso.webp', 'codice/assets/hero-selo.webp',
  'codice/assets/genese-800.webp', 'codice/assets/genese-friso.webp', 'codice/assets/genese-selo.webp',
  'codice/assets/biblioteca-800.webp', 'codice/assets/biblioteca-friso.webp', 'codice/assets/biblioteca-selo.webp',
  'codice/assets/ponte-800.webp', 'codice/assets/ponte-friso.webp', 'codice/assets/ponte-selo.webp',
  'codice/assets/luz-800.webp', 'codice/assets/luz-friso.webp', 'codice/assets/luz-selo.webp'];

const noSite = url => url.origin === self.location.origin && url.href.startsWith(RAIZ);
const eFonte = url => FONTES_GOOGLE.includes(url.hostname);
const ePagina = url => /\/$|\.html$/.test(url.pathname);
const eArte = url => /\.(?:webp|png|jpe?g|gif|avif|svg|ico|woff2?)$/i.test(url.pathname);
const guardavel = r => !!r && r.status === 200 && (r.type === 'basic' || r.type === 'cors');
const pedidoDeFonte = endereco => new Request(endereco, { mode: 'cors', credentials: 'omit' });

/* O endereço sob o qual uma resposta fica guardada. Uma página vale pela pasta: "codice/index.html",
   "codice/" e "codice/?origem=..." são a mesma cópia. */
function chave(endereco, pagina) {
  const u = new URL(endereco);
  u.hash = '';
  if (pagina) {
    u.search = '';
    if (u.pathname.endsWith('/index.html')) u.pathname = u.pathname.slice(0, -10);
  }
  return u.href;
}
const aCopia = () => caches.open(COPIA);
const daCopia = k => aCopia().then(c => c.match(k, { ignoreVary: true }));
const guardar = (k, r) => aCopia().then(c => c.put(k, r)).catch(() => {});
/* Uma resposta que chegou por redirecionamento não pode ser devolvida a uma navegação: guarda-se uma cópia limpa. */
const limpa = async r => (r.redirected ? new Response(await r.blob(), { status: r.status, statusText: r.statusText, headers: r.headers }) : r);

/* ───────── instalar: guarda o essencial; ativar: apaga só as cópias antigas deste aplicativo ───────── */
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await aCopia();
    await Promise.all(ESSENCIAIS.map(async u => {
      const k = new URL(u, RAIZ).href;
      const r = await fetch(new Request(k, { cache: 'reload' }));
      if (!guardavel(r)) throw new Error('Não foi possível guardar ' + u + ' (resposta ' + r.status + ')');
      await c.put(k, await limpa(r));
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const nome of await caches.keys()) {
      if (nome.startsWith(PREFIXO) && nome !== COPIA) await caches.delete(nome);
    }
    await self.clients.claim();
  })());
});

/* ───────── as duas maneiras de responder ───────── */
/* Rede primeiro: o servidor manda. A cópia entra se ele falhar, responder com erro de servidor ou demorar. */
async function redePrimeiro(e, pedido, k) {
  const daRede = fetch(pedido).then(r => {
    if (guardavel(r)) e.waitUntil(guardar(k, r.clone()));
    return r;
  });
  const copia = await daCopia(k);
  if (!copia) return daRede.catch(() => null);
  e.waitUntil(daRede.catch(() => {}));
  let relogio;
  const demorou = new Promise(ok => { relogio = setTimeout(() => ok(copia), ESPERA); });
  const resposta = await Promise.race([daRede.then(r => (r.status >= 500 ? copia : r), () => copia), demorou]);
  clearTimeout(relogio);
  return resposta;
}

/* Cópia primeiro: serve o que está guardado e, se pedido, renova por trás para a próxima vez. */
async function copiaPrimeiro(e, pedido, k, renovar) {
  const copia = await daCopia(k);
  if (copia) {
    if (renovar) e.waitUntil(fetch(pedido).then(r => (guardavel(r) ? guardar(k, r) : null)).catch(() => {}));
    return copia;
  }
  const r = await fetch(pedido);
  if (guardavel(r)) e.waitUntil(guardar(k, r.clone()));
  return r;
}

function semConexao() {
  const html = '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Sem conexão · Realmetaverso</title><meta name="author" content="ALDENIR ROCHA DE OLIVEIRA FILHO · PROJETO 360X">' +
    '<style>html{background:#0a0d16;color:#ece4d0;font:17px/1.6 "Atkinson Hyperlegible","Segoe UI",system-ui,sans-serif}' +
    'main{max-width:34rem;margin:14vh auto 0;padding:0 22px}h1{font:700 1.7rem/1.2 Cinzel,Georgia,serif;color:#f2d38a;margin:0 0 .5em}' +
    'a{color:#4fd8e8;text-underline-offset:3px}p{margin:.8em 0}.ir{display:inline-block;margin-right:14px;padding:9px 18px;border-radius:8px;background:#d9b25f;color:#0a0d16;font-weight:700;text-decoration:none}' +
    'button{font:inherit;color:inherit;background:#111727;border:1px solid rgba(217,178,95,.4);border-radius:8px;padding:8px 16px;cursor:pointer}' +
    'small{display:block;margin-top:3em;color:#aba795}</style></head><body><main><h1>Sem conexão</h1>' +
    '<p>Esta página ainda não foi guardada neste aparelho. O Códice Vivo, o Diário nº 019, a Concórdia das Tradições e a Cidade-Origem estão guardados e abrem sem internet.</p>' +
    '<p><a class="ir" href="' + RAIZ + 'codice/">Abrir o Códice Vivo</a><button type="button" onclick="location.reload()">Tentar de novo</button></p>' +
    '<p><a href="' + RAIZ + '">Diário nº 019 · Do Oráculo Digital</a><br><a href="' + RAIZ + 'concordia/">Diário nº 020 · Da Concórdia das Tradições</a><br><a href="' + RAIZ + 'origem/">Diário nº 021 · Da Cidade-Origem</a></p>' +
    '<small>Realmetaverso · Aldenir Rocha de Oliveira Filho · Projeto 360X</small></main></body></html>';
  return new Response(html, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

/* ───────── cada pedido das páginas do site ───────── */
self.addEventListener('fetch', e => {
  const p = e.request;
  if (p.method !== 'GET') return;
  const url = new URL(p.url);
  if (eFonte(url)) {
    /* refeito em modo CORS: assim a resposta pode ser guardada pelo tamanho real, sem reserva de espaço */
    e.respondWith(copiaPrimeiro(e, pedidoDeFonte(p.url), p.url, url.hostname === 'fonts.googleapis.com'));
    return;
  }
  if (!noSite(url)) return;        // outro site, do mesmo domínio ou não: passa direto
  if (p.mode === 'navigate') {
    e.respondWith(redePrimeiro(e, p, chave(p.url, true)).then(r => r || semConexao()));
    return;
  }
  const k = chave(p.url, false);
  e.respondWith(eArte(url) ? copiaPrimeiro(e, p, k, true) : redePrimeiro(e, p, k).then(r => r || Response.error()));
});

/* ───────── a página pede: "guarde o que eu já carreguei e o que falta para ler sem internet" ───────── */
/* Os arquivos de fonte citados numa folha de estilo do Google. Ela traz um bloco por alfabeto; o português
   cabe inteiro no bloco "latin", então só ele é buscado de antemão. Os outros, se a página usar, ficam
   guardados quando forem pedidos. */
async function arquivosDeFonte(resposta) {
  const css = await resposta.text(), blocos = [];
  const re = /(?:\/\*\s*([\w-]+)\s*\*\/\s*)?@font-face\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const u = /url\((["']?)(https:\/\/fonts\.gstatic\.com\/[^)"']+)\1\)/.exec(m[2]);
    if (u) blocos.push({ alfabeto: m[1] || '', endereco: u[2] });
  }
  const latinos = blocos.filter(b => b.alfabeto === 'latin');
  return (latinos.length ? latinos : blocos).slice(0, 24).map(b => b.endereco);
}

self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.tipo !== 'aquecer') return;
  e.waitUntil((async () => {
    const c = await aCopia(), vistos = new Set();
    const fila = (Array.isArray(d.urls) ? d.urls.slice(0, 200) : []).concat(d.extras ? EXTRAS.map(u => new URL(u, RAIZ).href) : []);
    while (fila.length) {
      const endereco = fila.shift();
      if (vistos.has(endereco) || vistos.size > 300) continue;
      vistos.add(endereco);
      try {
        const url = new URL(endereco);
        const fonte = eFonte(url);
        if (!fonte && !noSite(url)) continue;
        if (/\.pdf$/i.test(url.pathname)) continue;
        const k = fonte ? url.href : chave(url.href, ePagina(url));
        let r = await c.match(k, { ignoreVary: true });
        if (!r) {
          r = await fetch(fonte ? pedidoDeFonte(url.href) : url.href);
          if (!guardavel(r)) continue;
          const paraGuardar = r.clone();
          await c.put(k, await limpa(paraGuardar));
        }
        if (url.hostname === 'fonts.googleapis.com') fila.push(...await arquivosDeFonte(r));
      } catch (erro) { /* um arquivo que falhou não impede os outros */ }
    }
    const arquivos = (await c.keys()).length;
    if (e.source) e.source.postMessage({ tipo: 'copia', arquivos, versao: VERSAO });
  })());
});
