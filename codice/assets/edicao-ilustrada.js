/* Realmetaverso · Códice Vivo Ilustrado · camada visual opcional · versão 2.3 (25/11/2026)
   ALDENIR ROCHA DE OLIVEIRA FILHO · PROJETO 360X

   O que este arquivo faz: acrescenta ao Códice Vivo a prancha de abertura, os percursos de leitura,
   a galeria ampliável, os frisos das seções, o sumário e as conexões de cada capítulo, a retomada
   da leitura, o "copiar link", a leitura do Manifesto RM-ET-001 dentro do próprio códice e a Mesa
   das Mensagens, que lê do blog Mensagens que Importam a folha do dia e as últimas mensagens.

   O que ele não faz: não toca em nenhuma norma, lei, axioma ou contador. Os dados do cânone ficam
   no index.html. Se este arquivo ou a folha de estilo faltarem, o códice segue inteiro no modo texto.
   O que vem do blog entra sempre como texto, nunca como código, e só é buscado quando o leitor abre
   a Mesa (no aplicativo instalado, uma vez por dia).

   Como entra: o index.html chama window.CodiceIlustrado(contexto) uma vez, antes de abrir a primeira
   seção, e recebe de volta { aoAbrir(secao, trecho) }.

   Artes: quatro ilustrações originais geradas com IA (ChatGPT, 23/11/2026) e a prancha V (A Luz que Curvou),
   vetorial, desenhada por Claude em 25/11/2026 (fonte em assets/luz-fonte.svg); sem pessoas reais nem marcas.
   Primeira edição ilustrada: ChatGPT. Revisão, auditoria e esta versão: Claude. */
(function(){
'use strict';

window.CodiceIlustrado=function(cx){
  const raiz=document.documentElement;

  /* Só entra com a folha de estilo carregada: sem ela, as artes apareceriam soltas e fora de medida. */
  if(getComputedStyle(raiz).getPropertyValue('--rv-css').trim()!=='1')return null;

  /* Entra inteira ou não entra: se algo falhar no meio, devolve ao códice cada peça trocada e sai. */
  const g=cx.ganchos,antes={inicio:cx.R.inicio,apos:cx.AFTER.inicio,view:g.view,foco:g.focusEl,mapa:g.applyMap};
  const sub=document.querySelector('.lomb-topo small'),subTexto=sub?sub.textContent:'';
  try{return entrar(cx,raiz);}
  catch(e){
    cx.R.inicio=antes.inicio;cx.AFTER.inicio=antes.apos;g.view=antes.view;g.focusEl=antes.foco;g.applyMap=antes.mapa;
    delete cx.R.manifesto;delete cx.AFTER.manifesto;delete cx.SEC.manifesto;delete cx.R.mesa;delete cx.SEC.mesa;
    raiz.classList.remove('rv-on','rv-framed');
    if(sub)sub.textContent=subTexto;
    cx.main.removeAttribute('tabindex');
    document.querySelectorAll('.rv-skip,.rv-progress,.rv-lightbox,.rv-nav-sep,#nav a[data-go="manifesto"],#nav a[data-go="mesa"],#nav a[data-el="rv-galeria"]').forEach(x=>x.remove());
    throw e;
  }
};

function entrar(cx,raiz){
  const {D,SEC,R,AFTER,NODES,IDX,esc,strip,norm,$,$$,main,inp,purl,ligar,focoNode,focoInicio,ganchos}=cx;

  const emMoldura=(()=>{try{return window.self!==window.top;}catch(e){return true;}})();
  const meta=document.querySelector('meta[name="codice-url-publica"]');
  const urlPublica=meta&&meta.content?meta.content:'';
  const aviso=e=>{try{console.warn('Edição ilustrada:',e);}catch(_){}};
  const NOTION_MANIFESTO='https://app.notion.com/p/4214e3810a8281c38ea5cf7ab888436e';
  const SITE_DIARIO='https://aldenirfilho.github.io/realmetaverso/';
  const SITE_CONCORDIA='https://aldenirfilho.github.io/realmetaverso/concordia/';
  const SITE_ORIGEM='https://aldenirfilho.github.io/realmetaverso/origem/';
  const SITE_MENSAGENS='https://aldenirfilho.github.io/biblia-sem-jaula-365/blog/';

  /* ───────── conteúdo desta camada ───────── */
  const ARTES=[
    {k:'hero',n:'I',t:'A Fortaleza do Conhecimento',sec:'sociedade',id:'soc-instituicoes',
     alt:'Fortaleza de obsidiana e ouro sobre um promontório, com um grande vitral em forma de astrolábio, sob uma aurora azul e um céu cósmico.',
     d:'Uma interpretação artística da arquitetura e dos caminhos do Realmetaverso.'},
    {k:'genese',n:'II',t:'A matéria aprende a amar',sec:'genese',id:'gen-prologo',
     alt:'Três chamas, uma branca, uma dourada e uma ciano, convergem num ponto de luz no cosmos azul-noite.',
     d:'Energia, matéria e a imaginação que dá origem ao universo ficcional.'},
    {k:'biblioteca',n:'III',t:'A memória dos códices',sec:'codice',id:'livro-I',
     alt:'Biblioteca tecno-medieval com estantes de livros antigos, um astrolábio dourado e um códice aberto sobre a mesa.',
     d:'Uma biblioteca imaginária para guardar leis, histórias e perguntas.'},
    {k:'ponte',n:'IV',t:'Amor com fé na humanidade',sec:'ponte',id:null,
     alt:'Ponte de pedra entre uma cidade antiga e um horizonte dourado; pequenos caminhantes a atravessam juntos.',
     d:'A passagem simbólica entre a imaginação e a responsabilidade com a vida.'},
    {k:'luz',n:'V',t:'A Luz que Curvou',sec:'leis',id:'lei-origem',
     alt:'Eclipse total do Sol com a coroa dourada sobre uma pequena cidade com torre de igreja; um telescópio aponta para o Sol e linhas ciano pontilhadas mostram a luz das estrelas curvando ao passar perto dele.',
     d:'29 de maio de 1919: a luz das estrelas curva perto do Sol, e a Cidade-Origem ganha o seu Dia da Luz.'}
  ];
  const PERCURSOS=[
    {t:'Conhecer este universo',a:'genese',d:'Da origem dos mundos às histórias que os habitam.',
     p:[['genese','gen-prologo','Ler a gênese'],['fundamentos','fun-manifesto','Conhecer os princípios'],['saga',null,'Entrar na narrativa']]},
    {t:'Entender as conexões',a:'biblioteca',d:'Como os fundamentos se desdobram em leis e vida em sociedade.',
     p:[['incisos','inc-I','Começar pela honra'],['leis','lei-geossocial','Explorar a parceria'],['sociedade','soc-economia','Ler sobre a economia']]},
    {t:'Refletir sobre o mundo',a:'ponte',d:'Dos paradoxos às perguntas e aos limites da ficção.',
     p:[['paradoxos','par-intro','Explorar os paradoxos'],['polemicas',null,'Comparar os debates'],['ponte',null,'Cruzar a ponte com o real']]},
    {t:'A fé e o oráculo',a:'hero',d:'A fé do autor, a IA que aconselha e não governa, e a carta de sugestões.',
     p:[['fundamentos','fun-fe','Ler a declaração de fé'],['leis','lei-oraculo','Conhecer o Oráculo Digital'],['manifesto',null,'Ler a carta de amor e fé']]},
    {t:'As tradições à mesa',a:'genese',d:'Do rótulo ao ato: muitas casas, uma só mesa, e cada tradição com o seu papel.',
     p:[['leis','lei-concordia','Ler a Concórdia das Tradições'],['polemicas','pol-religiao','Entender “religião não importa”'],['sociedade','soc-templos','Visitar os Templos']]}
  ];
  /* Friso de cada seção: [arte, posição vertical do recorte, espelhar]. O espelho só serve para variar
     o ornamento entre seções que usam a mesma arte; as artes não têm texto. */
  const FRISO={
    genese:['genese','50%'],fundamentos:['genese','8%',1],axiomas:['genese','94%'],manifesto:['genese','30%',1],mesa:['ponte','18%',1],
    incisos:['biblioteca','4%'],codice:['biblioteca','96%'],leis:['biblioteca','38%',1],diario:['luz','50%'],glossario:['biblioteca','20%',1],acervo:['biblioteca','86%',1],
    sociedade:['hero','22%'],saga:['hero','78%',1],caderno:['hero','2%',1],empresas:['hero','52%'],
    paradoxos:['ponte','88%'],polemicas:['ponte','66%',1],revisao:['ponte','100%',1],ponte:['ponte','40%']
  };
  const CREDITO='<p class="rv-credito">Edição ilustrada: quatro artes originais geradas com IA (ChatGPT, 23/11/2026) e a prancha V, vetorial, desenhada por Claude (25/11/2026), sem pessoas reais nem marcas. Camada visual revista e auditada por Claude em 23/11/2026. ALDENIR ROCHA DE OLIVEIRA FILHO · PROJETO 360X.</p>';

  /* ───────── utilitários ───────── */
  const arq=(k,s)=>'assets/'+k+'-'+s+'.webp';
  const lk=(sec,id,rot,cls)=>'<a'+(cls?' class="'+cls+'"':'')+' href="'+purl(sec,id)+'" data-go="'+sec+'"'+(id?' data-el="'+esc(id)+'"':'')+'>'+rot+'</a>';
  const fora=(url,rot,cls)=>'<a'+(cls?' class="'+cls+'"':'')+' href="'+url+'" target="_blank" rel="noopener noreferrer">'+rot+'</a>';
  const slug=s=>norm(strip(s)).replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,48).replace(/-+$/,'');
  const chave=s=>norm(strip(s)).replace(/\s+/g,' ').trim();
  function unicos(nomes,prefixo){
    const vistos=new Map();
    return nomes.map(n=>{let s=prefixo+(slug(n)||'item');const q=(vistos.get(s)||0)+1;vistos.set(s,q);return q>1?s+'-'+q:s;});
  }

  raiz.classList.add('rv-on');
  if(emMoldura)raiz.classList.add('rv-framed');
  if('scrollRestoration' in history){try{history.scrollRestoration='manual';}catch(e){}}

  /* ───────── glossário e acervo ganham endereço próprio (estável, pelo nome) ───────── */
  const idGlos=unicos(D.glos.map(g=>g[0]),'termo-'),idAcervo=unicos(D.acervo.map(a=>a[2]),'fonte-');
  const mapaGlos=new Map(D.glos.map((g,i)=>[chave(g[0]),idGlos[i]])),mapaAcervo=new Map(D.acervo.map((a,i)=>[chave(a[2]),idAcervo[i]]));
  IDX.forEach(it=>{
    if(it.el)return;
    if(it.sec==='glossario'){const id=mapaGlos.get(chave(it.t.replace(/^📚\s*/,'')));if(id)it.el=id;}
    else if(it.sec==='acervo'){const a=D.acervo.find(x=>chave(x[1]+' '+x[2])===chave(it.t));if(a)it.el=mapaAcervo.get(chave(a[2]));}
  });

  /* ───────── títulos e grafo de conexões (recíprocas, tiradas das remissões que o códice já traz) ───────── */
  const T=new Map();
  D.sec.forEach(s=>{if(s[0]!=='inicio')T.set(s[0],s[2]);});
  NODES.forEach(n=>T.set(n.sec+'/'+n.id,strip(n.t)));
  IDX.forEach(it=>{if(it.el&&!T.has(it.sec+'/'+it.el))T.set(it.sec+'/'+it.el,it.t);});
  let G=null;
  function grafo(){
    if(G)return G;
    G=new Map();
    const liga=(a,b)=>{if(a===b)return;[[a,b],[b,a]].forEach(([x,y])=>{if(!G.has(x))G.set(x,new Set());G.get(x).add(y);});};
    D.sec.forEach(s=>{
      const sec=s[0];if(sec==='inicio')return;
      let doc;try{const t=document.createElement('template');t.innerHTML=R[sec]();doc=t.content;}catch(e){aviso(e);return;}
      let atual=sec;
      doc.querySelectorAll('[id],a[data-go]').forEach(el=>{
        if(el.id&&T.has(sec+'/'+el.id))atual=sec+'/'+el.id;
        if(el.matches('a[data-go]')&&T.has(el.dataset.go)){
          const dono=el.closest('details[id],article[id]');
          const de=dono&&T.has(sec+'/'+dono.id)?sec+'/'+dono.id:atual;
          liga(de,el.dataset.go+(el.dataset.el?'/'+el.dataset.el:''));
          liga(sec,el.dataset.go);
        }
      });
    });
    return G;
  }
  const ligados=k=>[...(grafo().get(k)||[])].filter(x=>T.has(x)).map(x=>{const i=x.indexOf('/');return {s:i<0?x:x.slice(0,i),id:i<0?null:x.slice(i+1),t:T.get(x)};});

  /* ───────── capa: prancha de abertura, atalhos, retomada, percursos, galeria ───────── */
  function imagem(k,tam,alt,larg,alto,extra){return '<img src="'+arq(k,tam)+'" alt="'+esc(alt)+'" width="'+larg+'" height="'+alto+'" decoding="async"'+(extra||' loading="lazy"')+'>';}
  let ultimo=null;
  try{const s=JSON.parse(localStorage.getItem('rmv-last-reading')||'null');
    if(s&&typeof s.sec==='string'&&typeof s.title==='string'&&(!s.id||/^[A-Za-z0-9-]+$/.test(s.id)))ultimo=s;}catch(e){}
  function retomar(){
    if(!ultimo||!SEC[ultimo.sec])return '';
    return '<p class="rv-resume" id="rv-retomar">Continuar a leitura: '+lk(ultimo.sec,ultimo.id,esc(ultimo.title))+' <small>Ponto guardado só neste navegador.</small></p>';
  }
  function percursos(){
    return '<section class="rv-percursos" id="rv-percursos" aria-labelledby="rv-percursos-t"><h2 id="rv-percursos-t">Escolha seu caminho de leitura</h2>'+
      '<p class="rv-lede">Cinco percursos curtos para se orientar no acervo, no seu ritmo.</p><div class="rv-trails">'+
      PERCURSOS.map(t=>'<article class="rv-trail"><img class="rv-selo" src="'+arq(t.a,'selo')+'" alt="" width="192" height="192" decoding="async">'+
        '<div><h3>'+t.t+'</h3><p>'+t.d+'</p><ol>'+t.p.map(p=>'<li>'+lk(p[0],p[1],p[2])+'</li>').join('')+'</ol></div></article>').join('')+
      '</div></section>';
  }
  function galeria(){
    return '<section class="rv-gallery" id="rv-galeria" aria-labelledby="rv-galeria-t"><h2 id="rv-galeria-t">Cinco janelas para o Realmetaverso</h2>'+
      '<p class="rv-lede">Artes originais geradas com IA para esta edição. Toque numa prancha para ampliar e siga para o capítulo ligado a ela.</p><div class="rv-gallery-grid">'+
      ARTES.map(a=>'<figure><button type="button" data-rv-art="'+a.k+'" aria-label="Ampliar a prancha '+a.n+': '+esc(a.t)+'">'+imagem(a.k,'800',a.alt,800,450)+'</button>'+
        '<figcaption><h3><span class="rv-num">'+a.n+'</span>'+a.t+'</h3><p>'+a.d+'</p>'+lk(a.sec,a.id,'Ler '+SEC[a.sec].t)+'</figcaption></figure>').join('')+
      '</div></section>';
  }
  function publicacoes(onde){
    return '<aside class="rv-pubs" aria-labelledby="rv-pubs-'+onde+'"><h3 id="rv-pubs-'+onde+'">Publicações desta edição</h3><div class="rv-pubs-grid">'+
      '<article><h4>Diário Oficial nº 028 · Ato nº 58</h4><p><b>Da Carta das Cláusulas Pétreas.</b> Treze princípios que nenhuma lei futura pode contrariar, e cinco regras que os guardam. Com a Apostila nº 1 ao Ato nº 56, a Rede da Cura fica completa.</p>'+
        '<p class="rv-links">'+lk('leis','carta-petreas','Ler a Carta')+lk('diario','do-028','Ver no Diário')+lk('leis','lei-rede','Rede da Cura')+'</p></article>'+
      '<article><h4>Diário Oficial nº 021 · Ato nº 51</h4><p><b>Da Cidade-Origem.</b> Sobral, Ceará, Brasil, é o berço do Realmetaverso: a Luz de 1919, os Santuários, as Marcas e uma Aliança que não destrói.</p>'+
        '<p class="rv-links">'+lk('leis','lei-origem','Ler a lei')+lk('diario','do-021','Ver no Diário')+fora(SITE_ORIGEM,'Página pública e PDF')+'</p></article>'+
      '<article><h4>Diário Oficial nº 020 · Ato nº 50</h4><p><b>Da Concórdia das Tradições.</b> O rótulo religioso não é a medida de ninguém: contam as atitudes e as ações. Todas as tradições são respeitadas, cada uma com o seu papel.</p>'+
        '<p class="rv-links">'+lk('leis','lei-concordia','Ler a lei')+lk('diario','do-020','Ver no Diário')+fora(SITE_CONCORDIA,'Página pública e PDF')+fora(SITE_MENSAGENS,'Mesa das Mensagens (blog)')+'</p></article>'+
      '</div></aside>';
  }
  const inicioBase=R.inicio;
  R.inicio=()=>{
    let h=inicioBase();
    const A=ARTES[0];
    const prancha='<figure class="rv-frontis"><img src="'+arq('hero','1200')+'" srcset="'+arq('hero','800')+' 800w, '+arq('hero','1200')+' 1200w, '+arq('hero','1672')+' 1672w" '+
      'sizes="(max-width:900px) calc(100vw - 32px), (max-width:1500px) calc(100vw - 336px), 1180px" alt="'+esc(A.alt)+'" width="1672" height="941" decoding="async" fetchpriority="high">'+
      '<figcaption>Prancha I. '+A.t+'. Arte gerada com IA.</figcaption></figure>';
    /* o convite para instalar só aparece onde o aplicativo existe: quem decide é assets/aplicativo.js, pela classe app-on */
    const atalhos='<nav class="rv-quick" aria-label="Atalhos de leitura">'+lk('inicio','rv-percursos','Começar a leitura','btn rv-primario')+
      lk('inicio','mapa-vivo','Explorar o mapa','btn')+lk('inicio','rv-galeria','Ver as pranchas','btn')+
      lk('mesa',null,'<span aria-hidden="true">🪑</span> Mesa das Mensagens','btn')+
      '<button type="button" class="btn rv-instalar" data-app-instalar><span aria-hidden="true">📲</span> Instalar aplicativo</button></nav>';
    /* funções no lugar de textos: um título guardado com "$" não é lido como padrão de troca */
    h=h.replace('<header class="capa">',()=>'<header class="capa">'+prancha);
    h=h.replace('<div class="conta">',()=>atalhos+'<div class="conta">');
    h=h.replace('</header>',()=>'</header>'+retomar()+linhaMesa(mesaGuardada())+percursos());
    return h+galeria()+publicacoes('inicio');
  };

  /* ───────── manifesto RM-ET-001: lido dentro do códice, a partir da página da publicação ───────── */
  SEC.manifesto={id:'manifesto',e:'🕊️',t:'Amor com fé na humanidade',
    x:'Declaração de fé pessoal e carta de sugestões do autor.'};
  const NORMA='<aside class="rv-norma"><h3>Como esta carta se liga ao cânone</h3><p>O manifesto é uma <b>publicação</b>, não um ato normativo. '+
    'A norma correspondente é o '+lk('leis','lei-oraculo','Ato nº 49 · Do Oráculo Digital')+', publicado no '+lk('diario','do-019','Diário Oficial nº 019')+
    '. Lá, a crença do autor fica registrada como fé pessoal e valem as salvaguardas: a IA aconselha, não governa; nenhuma IA é a voz de Deus; a decisão é sempre humana.</p></aside>';
  const SEM_TEXTO='<p class="rv-lede">Não foi possível abrir aqui o texto integral da publicação.</p>'+
    '<p>Em resumo: é a declaração de fé pessoal do autor e a sua carta de sugestões. Ela afirma honra, amor, justiça, dignidade, respeito às diferenças e oportunidade para todos, '+
    'registra a crença como fé do autor e lembra que sugestões, inclusive as produzidas por IA, podem ser questionadas, corrigidas ou recusadas.</p>';
  R.manifesto=()=>'<div class="rv-manifesto" aria-live="polite"><p class="rv-lede">Abrindo a publicação…</p></div>'+NORMA+
    '<p class="rv-acoes rv-fora"><a class="btn" href="publicacoes/manifesto.html">Abrir a página avulsa</a><a class="btn" href="publicacoes/Manifesto_Amor_Fe_Humanidade_360X.pdf">Abrir o PDF</a>'+
    fora(NOTION_MANIFESTO,'Registro no Notion (privado)','btn')+'</p>';
  let textoManifesto=null;
  function prepararManifesto(txt){
    const m=new DOMParser().parseFromString(txt,'text/html').querySelector('main');
    if(!m)throw new Error('publicação sem conteúdo');
    m.querySelectorAll('script,style,link,.actions,h1,.eyebrow,.subtitle,.nota-canone').forEach(x=>x.remove());
    m.querySelectorAll('[id]').forEach(x=>{x.id='mf-'+x.id;});
    m.querySelectorAll('[aria-labelledby]').forEach(x=>x.setAttribute('aria-labelledby','mf-'+x.getAttribute('aria-labelledby')));
    m.querySelectorAll('img').forEach(i=>{['src','srcset'].forEach(a=>{const v=i.getAttribute(a);if(v)i.setAttribute(a,v.replace(/\.\.\/assets\//g,'assets/'));});
      i.removeAttribute('fetchpriority');i.setAttribute('loading','lazy');});
    m.querySelectorAll('a[href]').forEach(a=>{
      const h=a.getAttribute('href'),k=h.indexOf('index.html#');
      if(k>=0){const r=h.slice(k+11),i=r.indexOf('--'),s=i>0?r.slice(0,i):r,e=i>0?r.slice(i+2):'';
        if(SEC[s]){a.setAttribute('href',purl(s,e));a.dataset.go=s;if(e)a.dataset.el=e;}}
      else if(/^https?:/.test(h)){a.target='_blank';a.rel='noopener noreferrer';}
      else{a.setAttribute('href','publicacoes/'+h);a.classList.add('rv-fora');}
    });
    return m.innerHTML;
  }
  AFTER.manifesto=v=>{
    const c=v.querySelector('.rv-manifesto');
    if(!textoManifesto)textoManifesto=fetch('publicacoes/manifesto.html').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text();}).then(prepararManifesto);
    textoManifesto.then(h=>{c.innerHTML=h;ligar(c);},e=>{textoManifesto=null;aviso(e);c.innerHTML=SEM_TEXTO;});
  };

  /* ───────── Mesa das Mensagens: o blog do autor, lido na hora (Ato nº 50, Art. 8º) ─────────
     A Mesa não copia o blog para o códice: busca a página do blog quando o leitor abre a seção, tira dela
     os dois blocos de dados (as folhas e o diário), guarda um resumo pequeno neste navegador e mostra a
     folha do dia pela mesma regra do blog. Tudo o que vem de lá passa por esc(): é texto, nunca código. */
  SEC.mesa={id:'mesa',e:'🪑',t:'Mesa das Mensagens',x:'A folha do dia e as últimas mensagens do blog Mensagens que Importam.'};
  const PILARES={ideia:'A ideia',mensagem:'A mensagem',projecao:'A projeção',autocontrole:'O autocontrole',vida:'A vida',redencao:'A redenção'};
  const MESA_CHAVE='rmv-mesa',MESA_FRESCA=15*60*1000,MESA_LIMITE=20000;
  const texto=(v,max)=>String(v==null?'':v).replace(/\*\*|==/g,'').replace(/\s+/g,' ').trim().slice(0,max);
  const doDia=iso=>new Date(+iso.slice(0,4),+iso.slice(5,7)-1,+iso.slice(8,10));
  /* data de calendário de verdade: "2026-10-99" não passa */
  const dataOk=s=>{if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=doDia(s);return d.getMonth()+1===+s.slice(5,7)&&d.getDate()===+s.slice(8,10);};
  const pilar=p=>Object.prototype.hasOwnProperty.call(PILARES,p)?PILARES[p]:(p||'livre');
  const hojeIso=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
  const diaMes=iso=>iso.slice(8,10)+'/'+iso.slice(5,7);
  /* resumo guardado: {v, em, f:[folhas em ordem de data], d:[as cinco mensagens mais recentes]} */
  function resumoDoBlog(folhas,diario){
    const f=(Array.isArray(folhas)?folhas:[]).filter(e=>e&&Number.isInteger(e.n)&&e.n>0&&e.n<1000&&dataOk(e.data)&&e.titulo).slice(0,400)
      .map(e=>({n:e.n,d:e.data,p:texto(e.pilar,24),e:texto(e.emoji,8),t:texto(e.titulo,160),g:texto(e.gancho,300),a:texto(e.acao,300),k:texto(e.ancora,200)}))
      .sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:a.n-b.n);
    if(!f.length)throw new Error('o blog veio sem folhas');
    const d=(Array.isArray(diario)?diario:[]).filter(x=>x&&dataOk(x.d)&&x.ref).reverse()
      .map(x=>({d:x.d,r:texto(x.ref,160),t:texto(x.tema,320),k:texto(x.ancora,200)})).sort((a,b)=>a.d<b.d?1:a.d>b.d?-1:0).slice(0,5);
    return {v:1,em:Date.now(),f,d};
  }
  function mesaGuardada(){
    try{const m=JSON.parse(localStorage.getItem(MESA_CHAVE)||'null');
      if(m&&m.v===1&&typeof m.em==='number'&&Array.isArray(m.f)&&m.f.length&&Array.isArray(m.d)&&
        m.f.every(e=>e&&Number.isInteger(e.n)&&dataOk(e.d)&&typeof e.t==='string')&&m.d.every(x=>x&&dataOk(x.d)))return m;}catch(e){}
    return null;
  }
  /* a mesma regra do blog: a folha da data; antes da primeira, a primeira; depois da última, o ciclo recomeça */
  function folhaDoDia(m,iso){
    const o=m.f,exatas=o.filter(e=>e.d===iso);
    if(exatas.length)return {e:exatas[exatas.length-1],releitura:false};
    if(iso<o[0].d)return {e:o[0],releitura:false};
    const dias=Math.round((doDia(iso)-doDia(o[0].d))/864e5);
    return {e:o[((dias%o.length)+o.length)%o.length],releitura:true};
  }
  /* A capa nunca depende da Mesa: se o resumo guardado não servir, a linha simplesmente não aparece. */
  function linhaMesa(m){
    if(!m)return '';
    try{
      const e=folhaDoDia(m,hojeIso()).e;
      return '<p class="rv-resume" id="rv-mesa-hoje">Na Mesa hoje: '+lk('mesa',null,(e.e?esc(e.e)+' ':'')+esc(e.t))+(e.k?' <small>'+esc(e.k)+'</small>':'')+'</p>';
    }catch(erro){aviso(erro);return '';}
  }
  function linhaDaCapa(m){
    const capa=document.querySelector('#v-inicio .capa');if(!capa||!m)return;
    const ja=document.getElementById('rv-mesa-hoje');
    if(ja)ja.outerHTML=linhaMesa(m);else(document.getElementById('rv-retomar')||capa).insertAdjacentHTML('afterend',linhaMesa(m));
    const nova=document.getElementById('rv-mesa-hoje');if(nova)ligar(nova);
  }
  function folhaHtml(m){
    const iso=hojeIso(),{e,releitura}=folhaDoDia(m,iso);
    return '<article class="rv-mesa-folha" id="rv-mesa-folha" aria-labelledby="rv-mesa-folha-t">'+
      '<p class="rv-mesa-rotulo">Folha de hoje, '+esc(doDia(iso).toLocaleDateString('pt-BR',{weekday:'long'}))+', '+diaMes(iso)+' · pilar: '+esc(pilar(e.p))+
        ' · '+(releitura?'releitura do fólio ':'fólio ')+e.n+'</p>'+
      '<h3 id="rv-mesa-folha-t">'+(e.e?'<span aria-hidden="true">'+esc(e.e)+'</span> ':'')+esc(e.t)+'</h3>'+
      (e.g?'<p class="rv-mesa-gancho">'+esc(e.g)+'</p>':'')+
      (e.a?'<p class="rv-mesa-acao"><b>Ação de hoje:</b> '+esc(e.a)+'</p>':'')+
      (e.k?'<blockquote class="rv-mesa-ancora">'+esc(e.k)+'</blockquote>':'')+
      '<p>'+fora(SITE_MENSAGENS+'#f'+e.n,'Ler a folha inteira no blog','btn rv-mesa-ler')+'</p></article>';
  }
  function diarioHtml(m){
    if(!m.d.length)return '';
    return '<section class="rv-mesa-diario" aria-labelledby="rv-mesa-diario-t"><h3 id="rv-mesa-diario-t">Últimas mensagens do diário</h3><ul id="rv-mesa-diario">'+
      m.d.map(x=>'<li><time datetime="'+x.d+'">'+diaMes(x.d)+'</time><span><b>'+esc(x.r)+'</b>'+(x.t?' '+esc(x.t):'')+(x.k?' <q>'+esc(x.k)+'</q>':'')+'</span></li>').join('')+
      '</ul><p>'+fora(SITE_MENSAGENS+'#diario','Ver o diário inteiro no blog')+'</p></section>';
  }
  function estadoHtml(estado,m){
    const quando=m?new Date(m.em).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'';
    const fala={lendo:'Lendo o blog…','ao-vivo':'Lido do blog em '+quando+'.',
      copia:'O blog não respondeu agora. Esta é a cópia guardada neste aparelho em '+quando+'.',
      sem:'Não foi possível ler o blog agora, e ainda não há cópia guardada neste aparelho.'}[estado];
    return '<p class="rv-mesa-estado" role="status" data-estado="'+estado+'">'+fala+
      (estado==='lendo'?'':' <button type="button" class="rv-copiar" data-rv-mesa-ler>'+(estado==='ao-vivo'?'Atualizar':'Tentar de novo')+'</button>')+'</p>';
  }
  R.mesa=()=>'<div class="rv-mesa">'+estadoHtml('lendo')+'<div class="rv-mesa-corpo"></div></div>'+
    '<aside class="rv-norma"><h3>Como a Mesa se liga ao cânone</h3><p>O blog Mensagens que Importam é do autor e foi reconhecido como <b>Mesa das Mensagens</b> pelo '+
    lk('leis','lei-concordia','Ato nº 50 · Da Concórdia das Tradições')+' (Art. 8º), publicado no '+lk('diario','do-020','Diário Oficial nº 020')+
    ': o lugar em que as vozes se sentam lado a lado. A Mesa mostra; não julga a fé de ninguém. O que aparece aqui é lido do blog na hora; os textos sagrados citados lá trazem a fonte, '+
    'e as tradições citadas não endossam esta obra.</p></aside>'+
    '<p class="rv-acoes">'+fora(SITE_MENSAGENS,'Abrir o blog','btn')+fora(SITE_MENSAGENS+'#diario','Diário de mensagens','btn')+fora(SITE_MENSAGENS+'#realmetaverso','O Realmetaverso no blog','btn')+'</p>';
  function pintarMesa(estado,m){
    const v=document.getElementById('v-mesa');if(!v)return;
    const st=v.querySelector('.rv-mesa-estado'),corpo=v.querySelector('.rv-mesa-corpo'),comFoco=st.contains(document.activeElement);
    const semFolha='<p class="rv-lede">A Mesa continua aberta no blog: '+fora(SITE_MENSAGENS,'Mensagens que Importam')+'.</p>';
    let miolo='';
    try{miolo=m?folhaHtml(m)+diarioHtml(m):'';}catch(erro){aviso(erro);m=null;if(estado!=='lendo')estado='sem';}
    st.outerHTML=estadoHtml(estado,m);
    corpo.innerHTML=miolo||(estado==='sem'?semFolha:'');
    if(miolo)ligar(corpo);
    const botao=v.querySelector('[data-rv-mesa-ler]');
    if(comFoco&&botao)botao.focus();
  }
  /* Lê a página do blog só até achar os dois blocos de dados: eles vêm antes das imagens, que são o grosso do peso. */
  async function lerBlog(){
    const corte=new AbortController(),relogio=setTimeout(()=>corte.abort(),MESA_LIMITE);
    try{
      const r=await fetch(SITE_MENSAGENS,{credentials:'omit',signal:corte.signal});
      if(!r.ok)throw new Error('HTTP '+r.status);
      let pagina='',folhas=null,diario=null;
      const bloco=id=>{const m=new RegExp('<script\\b[^>]*\\bid=(["\'])'+id+'\\1[^>]*>').exec(pagina);if(!m)return null;
        const a=m.index+m[0].length,b=pagina.indexOf('</script>',a);return b<0?null:pagina.slice(a,b);};
      const achou=()=>{folhas=folhas||bloco('dados-codice');diario=diario||bloco('dados-diario');return !!(folhas&&diario);};
      if(r.body&&r.body.getReader){
        const leitor=r.body.getReader(),dec=new TextDecoder();
        for(;;){
          const {done,value}=await leitor.read();
          if(value)pagina+=dec.decode(value,{stream:true});
          if(achou()){leitor.cancel().catch(()=>{});break;}
          if(done)break;
        }
      }else{pagina=await r.text();achou();}
      if(!folhas)throw new Error('o blog mudou de formato');
      return resumoDoBlog(JSON.parse(folhas),diario?JSON.parse(diario):[]);
    }finally{clearTimeout(relogio);}
  }
  let mesaLendo=null;
  function atualizarMesa(forcar){
    const guardada=mesaGuardada();
    const idade=guardada?Date.now()-guardada.em:-1;   /* idade negativa: relógio mexido; lê de novo */
    if(!forcar&&idade>=0&&idade<MESA_FRESCA){pintarMesa('ao-vivo',guardada);return Promise.resolve(guardada);}
    if(mesaLendo)return mesaLendo;
    pintarMesa('lendo',guardada);
    mesaLendo=lerBlog().then(m=>{try{localStorage.setItem(MESA_CHAVE,JSON.stringify(m));}catch(e){}pintarMesa('ao-vivo',m);linhaDaCapa(m);return m;},
      ()=>{pintarMesa(guardada?'copia':'sem',guardada);return guardada;}).finally(()=>{mesaLendo=null;});
    return mesaLendo;
  }
  /* No aplicativo instalado, a capa busca a folha do dia uma vez por dia, sem o leitor pedir; no navegador, só quando ele abre a Mesa. */
  function mesaDoDia(){
    try{
      if(!raiz.classList.contains('rv-on')||!raiz.classList.contains('app-solo')||navigator.onLine===false||(navigator.connection&&navigator.connection.saveData))return;
      const g=mesaGuardada();
      if(g&&new Date(g.em).toDateString()===new Date().toDateString())return;
      atualizarMesa(true);
    }catch(e){aviso(e);}
  }
  if(document.readyState==='complete')setTimeout(mesaDoDia,900);else window.addEventListener('load',()=>setTimeout(mesaDoDia,900),{once:true});

  /* ───────── cada seção: friso, trilha, copiar link, sumário, conexões ───────── */
  function realcar(v,sec){
    if(v.dataset.rv)return;v.dataset.rv='1';
    if(sec!=='inicio'){
      const cab=v.querySelector('.cab'),rod=v.querySelector('.rodape'),f=FRISO[sec]||['hero','50%'];
      cab.insertAdjacentHTML('beforebegin','<div class="rv-friso" aria-hidden="true"><img src="'+arq(f[0],'friso')+'" alt="" width="1280" height="276" decoding="async" style="object-position:50% '+f[1]+(f[2]?';transform:scaleX(-1)':'')+'"></div>'+
        '<div class="rv-barra"><nav class="rv-path" aria-label="Você está em">'+lk('inicio',null,'Códice Vivo')+'<span aria-hidden="true">›</span><span aria-current="page">'+SEC[sec].t+'</span></nav>'+
        '<span class="rv-tools"><span class="rv-status" role="status"></span><button type="button" class="rv-copiar" data-rv-copy>Copiar link</button></span></div>');
      if(sec==='glossario')v.querySelectorAll('.glos>div').forEach(el=>{const dt=el.querySelector('dt'),id=dt&&mapaGlos.get(chave(dt.textContent));if(id&&!el.id)el.id=id;});
      if(sec==='acervo')v.querySelectorAll('tbody tr').forEach(el=>{const b=el.querySelector('b'),id=b&&mapaAcervo.get(chave(b.textContent));if(id&&!el.id)el.id=id;});
      const nos=NODES.filter(n=>n.sec===sec&&v.querySelector('[id="'+n.id+'"]'));
      if(nos.length)cab.insertAdjacentHTML('afterend','<details class="rv-outline"><summary>Neste capítulo · '+nos.length+' entradas</summary><ul>'+
        nos.map(n=>'<li>'+lk(sec,n.id,esc(strip(n.t)))+'</li>').join('')+'</ul></details>');
      nos.forEach(n=>{
        const dest=v.querySelector('[id="'+n.id+'"]'),ls=ligados(sec+'/'+n.id).filter(l=>l.id);
        if(!ls.length)return;
        const h='<details class="rv-linked"><summary>Conexões deste trecho · '+ls.length+'</summary><p>Remissões que o códice já traz, reunidas nos dois sentidos.</p><ul>'+
          ls.map(l=>'<li>'+lk(l.s,l.id,esc(l.t))+' <small>'+SEC[l.s].t+'</small></li>').join('')+'</ul></details>';
        if(dest.matches('details')){const c=dest.querySelector('.ac-c');if(c)c.insertAdjacentHTML('beforeend',h);}
        else if(dest.matches('article'))dest.insertAdjacentHTML('beforeend',h);
        else{let p=dest.nextElementSibling;while(p&&!p.matches('.bh,.rodape,h2'))p=p.nextElementSibling;
          if(p)p.insertAdjacentHTML('beforebegin',h);else dest.parentElement.insertAdjacentHTML('beforeend',h);}
      });
      const rel=ligados(sec).filter(l=>!l.id);
      if(rel.length&&rod)rod.insertAdjacentHTML('beforebegin','<aside class="rv-related" aria-labelledby="rv-rel-'+sec+'"><h3 id="rv-rel-'+sec+'">Continue pelas conexões</h3>'+
        '<p>Seções ligadas a esta pelas remissões do próprio acervo.</p><nav aria-label="Seções relacionadas">'+
        rel.map(l=>lk(l.s,null,'<span aria-hidden="true">'+SEC[l.s].e+'</span> '+esc(l.t))).join('')+'</nav></aside>');
      if((sec==='fundamentos'||sec==='ponte')&&rod)rod.insertAdjacentHTML('beforebegin',publicacoes(sec));
      if(sec==='leis'){const o=v.querySelector('#lei-oraculo .ac-c');
        if(o)o.insertAdjacentHTML('beforeend','<p class="rv-veja">Ver também: '+lk('manifesto',null,'Amor com fé na humanidade')+', a carta de fé e sugestões do autor (publicação RM-ET-001).</p>');}
    }
    v.querySelectorAll('.rodape').forEach(r=>r.insertAdjacentHTML('beforeend',CREDITO));
    ligar(v);
  }
  const vistaBase=ganchos.view;
  ganchos.view=function(sec){const v=vistaBase(sec);try{realcar(v,sec);}catch(e){aviso(e);}return v;};

  /* ───────── ir a um trecho: limpa filtro que o esconda e leva o foco do teclado junto ───────── */
  /* Numa moldura (iframe) sem toque de quem lê, o navegador proíbe foco automático: aí só rola até o trecho. */
  const emMolduraSemToque=()=>{let fora=true;try{fora=window.self!==window.top;}catch(e){}const ua=navigator.userActivation;return fora&&!(ua&&ua.hasBeenActive);};
  const focoBase=ganchos.focusEl;
  ganchos.focusEl=function(id){
    const el=document.getElementById(id);if(!el)return;
    try{
      if(el.hidden){const v=el.closest('.view'),f=v&&v.querySelector('#ax-f,#gl-f');if(f){f.value='';f.dispatchEvent(new Event('input'));}el.hidden=false;}
    }catch(e){aviso(e);}
    focoBase(id);
    try{if(!el.hasAttribute('tabindex'))el.setAttribute('tabindex','-1');if(!emMolduraSemToque())el.focus({preventScroll:true});}catch(e){}
  };

  /* ───────── mapa vivo: pontos alcançáveis pelo teclado ───────── */
  const mapaBase=ganchos.applyMap;
  ganchos.applyMap=function(){
    mapaBase();
    try{const s=$('#mv-svg');if(s)s.querySelectorAll('.no').forEach(g=>{const fut=g.classList.contains('fut');g.setAttribute('tabindex',fut?'-1':'0');g.setAttribute('aria-hidden',String(fut));});}catch(e){aviso(e);}
  };
  const aposInicio=AFTER.inicio;
  AFTER.inicio=function(v){
    aposInicio(v);
    try{
      const s=$('#mv-svg');
      s.querySelectorAll('.no').forEach(g=>{g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',strip(NODES[+g.dataset.n].t));});
      const c=s.querySelector('.centro');if(c){c.setAttribute('tabindex','0');c.setAttribute('role','button');c.setAttribute('aria-label','Visão geral do mapa');}
      s.addEventListener('keydown',e=>{
        if(e.key!=='Enter'&&e.key!==' ')return;
        const n=e.target.closest('[data-n]');
        if(n){e.preventDefault();focoNode(+n.dataset.n);}
        else if(e.target.closest('.centro')){e.preventDefault();focoInicio();}
      });
      new MutationObserver(()=>ligar($('#mv-foco'))).observe($('#mv-foco'),{childList:true,subtree:true});
    }catch(e){aviso(e);}
  };

  /* ───────── moldura da página: pular para o conteúdo, progresso, índice, janela das pranchas ───────── */
  document.body.insertAdjacentHTML('afterbegin','<a class="rv-skip" href="#main">Pular para o conteúdo</a><div class="rv-progress" aria-hidden="true"></div>');
  main.setAttribute('tabindex','-1');
  $('.rv-skip').addEventListener('click',e=>{e.preventDefault();main.focus({preventScroll:true});window.scrollTo(0,0);});
  $('#nav').insertAdjacentHTML('beforeend','<span class="rv-nav-sep" role="presentation"></span>'+
    lk('inicio','rv-galeria','<span class="em">🎨</span><span>Galeria ilustrada</span>')+
    lk('manifesto',null,'<span class="em">🕊️</span><span>Amor com fé na humanidade</span>')+
    lk('mesa',null,'<span class="em">🪑</span><span>Mesa das Mensagens</span>'));
  const sub=$('.lomb-topo small');if(sub)sub.textContent=sub.textContent.replace('Códice Vivo ·','Códice Vivo ilustrado ·');
  document.body.insertAdjacentHTML('beforeend','<dialog class="rv-lightbox" aria-labelledby="rv-art-t"><div class="rv-dialog-head"><h2 id="rv-art-t"></h2>'+
    '<button class="btn" type="button" data-rv-close>Fechar</button></div><img alt=""><p></p></dialog>');
  const janela=$('.rv-lightbox');let botaoArte=null;
  const fecharJanela=()=>{if(janela.close)janela.close();else janela.removeAttribute('open');};
  janela.addEventListener('close',()=>{if(botaoArte)botaoArte.focus();});

  const enderecoDaLeitura=()=>(emMoldura&&urlPublica?urlPublica:location.href.split('#')[0])+location.hash;
  document.addEventListener('click',e=>{
    const arte=e.target.closest('[data-rv-art]');
    if(arte){
      const a=ARTES.find(x=>x.k===arte.dataset.rvArt);
      if(a){botaoArte=arte;$('#rv-art-t').textContent='Prancha '+a.n+'. '+a.t;
        const im=janela.querySelector('img');im.src=arq(a.k,'1672');im.alt=a.alt;
        janela.querySelector('p').textContent=a.d+' Ilustração artística gerada com IA para a edição de 23/11/2026.';
        if(janela.showModal)janela.showModal();else janela.setAttribute('open','');}
      return;
    }
    if(e.target.closest('[data-rv-close]')){fecharJanela();return;}
    if(e.target.closest('[data-rv-mesa-ler]')){atualizarMesa(true);return;}
    if(e.target===janela){const b=janela.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)fecharJanela();return;}
    const copiar=e.target.closest('[data-rv-copy]');
    if(copiar){
      const st=copiar.parentElement.querySelector('.rv-status'),url=enderecoDaLeitura();
      const naMao=()=>{st.innerHTML='Copie o endereço: <input type="text" readonly aria-label="Endereço desta leitura">';const i=st.querySelector('input');i.value=url;i.focus();i.select();};
      try{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(()=>{st.textContent='Link copiado.';},naMao);else naMao();}catch(_){naMao();}
    }
  });
  const barra=$('.rv-progress');
  const progresso=()=>{const max=raiz.scrollHeight-innerHeight;barra.style.transform='scaleX('+(max>0?Math.min(1,scrollY/max):0)+')';};
  window.addEventListener('scroll',progresso,{passive:true});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){$('#lombada').classList.remove('aberta');$('#b-menu').setAttribute('aria-expanded','false');}
    const ae=document.activeElement;
    if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!(ae&&(/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)||ae.isContentEditable))){e.preventDefault();inp.focus();}
  });
  (window.requestIdleCallback||(f=>setTimeout(f,600)))(()=>{try{grafo();}catch(e){aviso(e);}});

  /* ───────── chamado pelo códice a cada seção aberta ───────── */
  function aoAbrir(sec,trecho){
    $$('#nav a[data-el]').forEach(a=>a.removeAttribute('aria-current'));
    requestAnimationFrame(progresso);
    if(sec==='mesa')atualizarMesa(false);
    if(sec==='inicio')return;
    ultimo={sec,id:trecho||null,title:T.get(sec+(trecho?'/'+trecho:''))||SEC[sec].t};
    try{localStorage.setItem('rmv-last-reading',JSON.stringify(ultimo));}catch(e){}
    const ja=document.getElementById('rv-retomar');
    if(ja)ja.outerHTML=retomar();
    else{const capa=document.querySelector('#v-inicio .capa');if(capa)capa.insertAdjacentHTML('afterend',retomar());}
    const novo=document.getElementById('rv-retomar');if(novo)ligar(novo);
  }
  return {versao:'2.3',aoAbrir};
}
})();
