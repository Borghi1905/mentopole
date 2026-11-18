/* Mentópole · cena 3D, conteúdo, questionário, apoio e mapa-múndi.
   Extraído do HTML original; únicas alterações: mídias por URL (MP_ASSETS) e ponte Thymeleaf (chips/questionário). */
(()=>{
/* Mídias servidas de /static (URLs montadas no template via th:inline). Antes: base64 embutido no HTML. */
const MPA=window.MP_ASSETS||{mp3:'/audio/mentopole.mp3',glb:'/models/cerebro.glb',glb2:'/models/figura.glb'};
const $=s=>document.querySelector(s);
history.scrollRestoration='manual';scrollTo(0,0);
const LD={p:{f:0,m:0,g:0,h:0,u:0},w:{f:.08,m:.17,g:.4,h:.1,u:.25}},LB=document.getElementById('lbar'),LP=document.getElementById('lpc'),LL=document.getElementById('lp'),LBL={f:'carregando fontes',m:'preparando a música',g:'montando o cérebro',h:'preparando o bonequinho',u:'preparando a cena'};let ldT=0,ldV=0;
function setP(k,v){LD.p[k]=v;ldT=0;for(const q in LD.p)ldT+=LD.p[q]*LD.w[q];LL.textContent=LBL[k]+'…'}
const LTR=[...document.querySelectorAll('#ldw span')];requestAnimationFrame(()=>requestAnimationFrame(()=>document.getElementById('load').classList.add('in')));
(function tick(){ldV+=(ldT-ldV)*.15;const pc=Math.min(100,Math.round(ldV*100+.4));LB.style.width=pc+'%';LP.textContent=pc;LTR.forEach((s,i)=>s.style.setProperty('--p',Math.min(100,Math.max(0,(ldV*9-i)*100))+'%'));if(ldV<.995||ldT<.999)requestAnimationFrame(tick);else{LB.style.width='100%';LP.textContent='100';LTR.forEach(s=>s.style.setProperty('--p','100%'))}})();
Promise.race([Promise.all(['900 20px "Big Shoulders Display"','400 20px "Instrument Serif"','300 16px "Inter Tight"','400 13px "JetBrains Mono"'].map(f=>document.fonts.load(f))),new Promise(r=>setTimeout(r,6000))]).catch(()=>{}).then(()=>setP('f',1));

let RM=false;

/* ---------- conteúdo ---------- */
const P=[
{k:'Ruas e ruído',t:'Ruas que nunca silenciam',b:'Barulho constante e deslocamentos longos aumentam o desgaste diário. A OMS reconhece efeitos do ruído ambiental sobre a saúde; a evidência específica sobre saúde mental ainda está em construção.',s:'OMS, Environmental Noise Guidelines for the European Region (2018)',u:'https://www.who.int/europe/publications/i/item/9789289053563',q:'Quando foi\nsua última pausa\nde silêncio?',th:{towers:1,haze:.2}},
{k:'Poluição',t:'O ar também pesa',b:'Estudos epidemiológicos apontam associação entre exposição prolongada à poluição do ar e mais sintomas depressivos. A causalidade ainda é investigada.',s:'OMS, qualidade do ar e saúde',u:'https://www.who.int/health-topics/air-pollution',q:'O que você\nrespira\nao sair de casa?',th:{towers:.8,haze:.8}},
{k:'Violência urbana',t:'Estar em alerta o tempo todo',b:'Viver sob medo e insegurança mantém o corpo em vigilância e pode se ligar a ansiedade, depressão e estresse pós-traumático. Muitas pessoas deixam de sair, e o isolamento cresce.',s:'OMS, Relatório mundial sobre violência e saúde (2002)',u:'https://www.who.int/publications/i/item/9241545615',q:'Por qual rua\nvocê evita\npassar?',th:{towers:.6,red:1,haze:.3}},
{k:'Desigualdade',t:'Dois lados da mesma cidade',b:'Renda, moradia, trabalho e acesso a serviços são determinantes sociais da saúde mental. Quem vive com menos recursos tem menos acesso a cuidado e mais exposição a estresse.',s:'OMS e Fundação Calouste Gulbenkian, Social determinants of mental health (2014)',u:'https://www.who.int/publications/i/item/9789241506809',q:'Quem chega\nao cuidado\nprimeiro?',th:{split:1,haze:.25}},
{k:'Solidão',t:'Multidão sem conexão',b:'Cidades cheias podem ser lugares solitários. Laços sociais frágeis estão ligados a pior saúde mental, e a OMS tratou a conexão social como prioridade de saúde pública.',s:'OMS, Comissão sobre Conexão Social',u:'https://www.who.int/groups/commission-on-social-connection',q:'Quem sabe\ncomo você\nestá de verdade?',th:{lone:1,haze:.2,towers:.7}},
{k:'Falta de áreas verdes',t:'Onde está o verde?',b:'Revisões indicam que acesso a parques e espaços verdes se associa a melhor bem-estar e menos sintomas de depressão e ansiedade. Bairros sem verde ficam sem esse fator de proteção.',s:'OMS Europa, Urban green spaces and health (2016)',u:'https://www.who.int/europe/publications/i/item/WHO-EURO-2016-3352-43111-60341',q:'Qual a árvore\nmais próxima\nda sua casa?',th:{towers:1,haze:.35}}
];
const chips=$('#chips'),info=$('#info');
/* Ponte Thymeleaf: se o servidor renderizou os chips (th:each) com a mesma quantidade de fatores da cena 3D, eles são usados;
   caso contrário (sem dados / quantidade diferente) vale a lista P acima, e o visual é idêntico ao original. */
let SV=[...chips.querySelectorAll('.chip')];
if(SV.length!==P.length){SV.forEach(b=>b.remove());SV=[]}
if(SV.length)SV.forEach((b,i)=>{b.setAttribute('aria-pressed','false');b.onclick=()=>pick(i)});
else P.forEach((p,i)=>{const b=document.createElement('button');b.className='chip';b.textContent=p.k;b.setAttribute('aria-pressed','false');b.onclick=()=>pick(i);chips.append(b)});
function showInfo(i){info.replaceChildren();const sd=SV.length?SV[i].dataset:null,p=sd&&sd.titulo?{t:sd.titulo,b:sd.texto||'',s:sd.fonte||'',u:sd.url||''}:P[i];const h=document.createElement('h3');h.textContent=p.t;const d=document.createElement('p');d.textContent=p.b;const a=document.createElement('a');a.href=p.u;a.target='_blank';a.rel='noopener';a.textContent='Fonte: '+p.s;a.className='sm';info.append(h,d);if(p.u)info.append(a)}
showInfo(0);

/* ---------- cadastro e questionário ---------- */
const KEY='mt_perfil',Q=['Pouco interesse ou prazer em coisas que antes me faziam bem','Sentir-me para baixo, sem ânimo ou sem esperança','Dificuldade para dormir, ou dormir demais','Cansaço ou pouca energia','Dificuldade de concentração no dia a dia','Sentir-me sozinho(a) mesmo cercado(a) de pessoas','Evitar sair por insegurança, barulho ou desgaste do deslocamento','Pensamentos de que seria melhor não estar aqui ou de me machucar'];
const OP=['Nunca','Alguns dias','Mais da metade dos dias','Quase todos os dias'];
const safe={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v);return true}catch(e){return false}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
const qf=$('#qf');
/* Ponte Thymeleaf: usa as perguntas renderizadas pelo servidor (th:each) apenas se forem exatamente Q.length grupos de OP.length opções;
   senão, limpa o formulário e monta a partir de Q/OP (padrão original). A lógica de pontuação continua no JS. */
const okSrv=(()=>{const fs=[...qf.querySelectorAll('fieldset.q')];return fs.length===Q.length&&fs.every((f,i)=>f.querySelectorAll('input[type=radio][name="q'+i+'"]').length===OP.length)})();
if(!okSrv)qf.replaceChildren();
else qf.querySelectorAll('input[type=radio]').forEach(r=>r.onchange=prog);
if(!okSrv)Q.forEach((t,i)=>{const f=document.createElement('fieldset');f.className='q';f.style.cssText='border:0;padding:0;margin:0 0 20px';const l=document.createElement('legend');l.className='q';l.textContent=t;const o=document.createElement('div');o.className='opts';OP.forEach((x,v)=>{const lb=document.createElement('label');const r=document.createElement('input');r.type='radio';r.name='q'+i;r.value=v;r.onchange=prog;const s=document.createElement('span');s.textContent=x;lb.append(r,s);o.append(lb)});f.append(l,o);qf.append(f)});
if(!qf.querySelector('button[type=submit]')){const sb=document.createElement('button');sb.className='btn';sb.type='submit';sb.textContent='Ver orientação';qf.append(sb)}
function prog(){let n=0;Q.forEach((_,i)=>{if(qf['q'+i].value!=='')n++});$('#pb').style.width=n/Q.length*100+'%'}
function enter(){const pf=JSON.parse(safe.get(KEY)||'null');if(!pf)return;$('#reg').classList.add('hide');$('#quiz').classList.remove('hide');$('#hi').textContent='Olá, '+pf.nome+'.'}
$('#f').onsubmit=e=>{e.preventDefault();const n=$('#nm').value.trim(),m=$('#em').value.trim(),a=$('#id').value,er=$('#ferr');
if(!n||!a){er.textContent='Preencha nome e faixa etária.';return}
if(m&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)){er.textContent='E-mail inválido.';return}
if(!$('#ok').checked){er.textContent='É necessário concordar para continuar.';return}
er.textContent='';safe.set(KEY,JSON.stringify({nome:n,email:m,faixa:a,em:new Date().toISOString()}));enter()};
qf.onsubmit=e=>{e.preventDefault();let s=0,miss=false;Q.forEach((_,i)=>{const v=qf['q'+i].value;if(v==='')miss=true;else if(i<7)s+=+v});
const crisis=qf.q7.value!==''&&+qf.q7.value>0;
if(miss){alert('Responda todas as perguntas para ver a orientação.');return}
const o=$('#out');o.replaceChildren();o.classList.remove('hide');
const box=document.createElement('div');box.className='res'+(crisis?' alert':'');
const h=document.createElement('h3');h.style.cssText='font:400 28px var(--f1);margin:0 0 10px';
const p=document.createElement('p');
let txt=s<=5?['Poucos sinais no momento','Suas respostas indicam poucos sinais de sofrimento nas últimas semanas. Cuidar do sono, do movimento e dos vínculos ajuda a manter esse equilíbrio.']:s<=11?['Alguns sinais que merecem atenção','Há sinais que aparecem com alguma frequência. Conversar com alguém de confiança e procurar a UBS do seu bairro pode ajudar a entender o que está acontecendo.']:['Sinais frequentes de sofrimento','Vários sinais aparecem com frequência. Vale conversar com um profissional de saúde, na UBS ou no CAPS, para uma avaliação cuidadosa.'];
h.textContent=txt[0];p.textContent=txt[1];box.append(h,p);
if(crisis){const c=document.createElement('p');c.innerHTML='<b>Você marcou pensamentos sobre não estar aqui ou se machucar.</b> Você não precisa passar por isso sozinho(a). Ligue agora para o <b>CVV, 188</b> (gratuito, 24 horas) ou, em risco imediato, <b>SAMU, 192</b>. Se puder, avise alguém próximo.';box.append(c)}
const n=document.createElement('p');n.className='sm';n.textContent='Esta orientação não é um diagnóstico nem um resultado clínico. Só um profissional de saúde pode avaliar sua situação.';
const a=document.createElement('a');a.className='btn g';a.href='#apoio';a.textContent='Encontrar apoio';
box.append(n,a);o.append(box);o.scrollIntoView({block:'nearest',behavior:RM?'auto':'smooth'})};
$('#wipe').onclick=()=>{safe.del(KEY);$('#f').reset();qf.reset();prog();$('#out').classList.add('hide');$('#quiz').classList.add('hide');$('#reg').classList.remove('hide');alert('Dados apagados deste navegador.')};
enter();

/* ---------- apoio ---------- */
$('#find').onclick=()=>{const n=$('#need').value,c=$('#city').value.trim(),s=$('#svc');s.replaceChildren();
const add=(t,d,l,lt)=>{const x=document.createElement('div');const b=document.createElement('b');b.textContent=t;const p=document.createElement('p');p.style.margin='4px 0';p.textContent=d;x.append(b,p);if(l){const a=document.createElement('a');a.href=l;a.target='_blank';a.rel='noopener';a.textContent=lt;x.append(a)}s.append(x)};
const mp=q=>'https://www.google.com/maps/search/'+encodeURIComponent(q+(c?' '+c:''));
if(n==='a'){add('CVV, 188','Apoio emocional gratuito e sigiloso, 24 horas, por telefone, chat e e-mail.','https://www.cvv.org.br/','cvv.org.br');add('SAMU, 192','Emergência com risco de vida.');add('UPA 24h','Atendimento de urgência, inclusive em crise.',mp('UPA 24 horas'),'Buscar UPA no mapa')}
if(n==='b'){add('CAPS (Centro de Atenção Psicossocial)','Cuidado em saúde mental pelo SUS. Em geral, é possível procurar diretamente.',mp('CAPS Centro de Atenção Psicossocial'),'Buscar CAPS no mapa');add('UBS de referência','A porta de entrada do SUS. Encaminha e acompanha.',mp('UBS Unidade Básica de Saúde'),'Buscar UBS no mapa')}
if(n==='c'){add('UBS mais próxima','Leve documento e cartão SUS, se tiver. Diga que quer conversar sobre saúde mental.',mp('UBS Unidade Básica de Saúde'),'Buscar UBS no mapa');add('CVV, 188','Para conversar, a qualquer hora.','https://www.cvv.org.br/','cvv.org.br')}
add('Lista oficial de estabelecimentos','Confirme endereço, horários e tipo de serviço na base oficial do Ministério da Saúde.','https://cnes.datasus.saude.gov.br/','CNES/DataSUS');
const w=document.createElement('p');w.className='sm';w.textContent='Os resultados do mapa vêm do Google Maps e podem não estar atualizados. Confirme por telefone antes de ir.';s.append(w)};

/* ---------- 3D ---------- */
const cv=$('#c');let R;
try{R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'})}catch(e){$('#lp').textContent='WebGL indisponível. O conteúdo continua acessível abaixo.';setTimeout(()=>{$('#load').classList.add('off');document.body.classList.remove('lock')},1200);return}
const dpr=Math.min(devicePixelRatio,innerWidth<760?1.5:2);R.setPixelRatio(dpr);R.setClearColor(0x050509);
const S=new THREE.Scene();S.fog=new THREE.FogExp2(0x050509,.07);
const cam=new THREE.PerspectiveCamera(38,1,.1,300);
const U={uO:{value:new THREE.Vector3()},uD:{value:new THREE.Vector3(0,0,-1)},uH:{value:0},uT:{value:0},uE:{value:0},uP:{value:0}};
const brainMat=new THREE.ShaderMaterial({uniforms:U,vertexShader:`
attribute vec3 tc;uniform vec3 uO,uD;uniform float uH,uT,uE,uP;varying vec3 vN,vW;varying float vM,vE,vJ;
float h(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
void main(){vec3 P=position,nl=normal;vec3 cc=floor(tc*9.);vec3 ce=(cc+.5)/9.;
vec3 rr=vec3(h(cc),h(cc+7.1),h(cc+13.3));
float e=clamp((uE-.16-rr.x*.4)/.44,0.,1.);vE=e;
vec3 dir=normalize(ce+(rr-.5)*1.2+vec3(0.,.25,0.));
float ang=e*e*(rr.y-.5)*5.;float cs=cos(ang),sn=sin(ang);vec3 q=P-ce;
q.xz=mat2(cs,-sn,sn,cs)*q.xz;nl.xz=mat2(cs,-sn,sn,cs)*nl.xz;
P=ce+q*(1.-smoothstep(.45,1.,e)*.75)+dir*e*e*e*(1.5+rr.z*4.5);P+=nl*.014*uP;
vec4 w=modelMatrix*vec4(P,1.);vec3 n=normalize(mat3(modelMatrix)*nl);
vec3 c2=(floor(tc*6.)+.5)/6.;vec3 r2=vec3(h(floor(tc*6.)+3.7),h(floor(tc*6.)+9.1),h(floor(tc*6.)+17.));
vec3 wc=(modelMatrix*vec4(c2,1.)).xyz;vec3 tw=wc-uO;float dc=length(tw-uD*dot(tw,uD));
float hv=smoothstep(.42,.08,dc)*uH*(1.-smoothstep(.0,.2,uE));vJ=hv;
float hop=hv*(.16+r2.z*.3)*(.75+.25*sin(uT*16.+r2.x*30.));
w.xyz+=normalize(mat3(modelMatrix)*c2+vec3(0.,.15,0.)+(r2-.5)*.5)*hop;
vec3 t=w.xyz-uO;float d=length(t-uD*dot(t,uD));float m=smoothstep(.8,.05,d)*uH;vM=m;

vW=w.xyz;vN=n;gl_Position=projectionMatrix*viewMatrix*w;}`,fragmentShader:`
uniform float uT,uP;varying vec3 vN,vW;varying float vM,vE,vJ;
float h(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
void main(){vec3 N=normalize(vN),V=normalize(cameraPosition-vW);
float fr=pow(1.-max(dot(N,V),0.),2.6);
vec3 L1=normalize(vec3(-.6,.8,.7)),L2=normalize(vec3(.9,.1,-.5)),L3=normalize(vec3(0.,-.7,.5));
float d1=max(dot(N,L1),0.),d2=max(dot(N,L2),0.),d3=max(dot(N,L3),0.);
vec3 c=vec3(.035,.035,.05)+vec3(.13,.12,.17)*d1*.85+vec3(.40,.17,.95)*d2*.6+vec3(.16,.05,.3)*d3*.5;
c+=vec3(.75,.65,1.)*pow(max(dot(reflect(-L1,N),V),0.),38.)*.4;
c+=vec3(.5,.25,1.)*fr*.95;
float cav=smoothstep(.2,-.6,dot(N,vec3(0.,1.,0.))*.0+sin(vW.x*22.)*sin(vW.y*22.)*sin(vW.z*22.));
c*=1.-cav*.18;
c*=1.-vM*.6*(1.-vJ);
float cell=h(floor(vW*34.)+floor(uT*11.));
c+=vec3(.55,.2,1.)*vM*fr*1.4;
c+=vec3(.45,.12,1.)*vM*step(.972,cell)*1.6;
c+=vec3(.5,.02,.1)*vM*step(.993,cell)*2.;
c+=vec3(.5,.2,1.)*vM*(.5+.5*sin(vW.y*80.-uT*9.))*.05;
c=mix(c,vec3(.02,.02,.035),smoothstep(5.,13.,length(cameraPosition-vW)));
if(h(floor(vW*110.))<vE*vE*1.08-.06)discard;
c+=vec3(.55,.25,1.)*vE*(1.-vE*.5)*1.5*(.35+fr);c+=vec3(.5,.2,1.)*vJ*(.5+fr*1.6);c+=vec3(.45,.15,1.)*uP*(.05+fr*.5);
gl_FragColor=vec4(c,1.);}`});
const brain=new THREE.Group();S.add(brain);const mirror=new THREE.Group();S.add(mirror);const WY=-1.5;
const core=new THREE.Mesh(new THREE.SphereGeometry(.6,24,24),new THREE.MeshBasicMaterial({color:0x7c3aed,transparent:true,opacity:.4,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));brain.add(core);
const glow=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');const g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(120,70,255,.55)');g.addColorStop(.4,'rgba(70,30,160,.2)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));s.scale.set(7,7,1);s.position.z=-2.2;return s})();S.add(glow);

/* painéis urbanos procedurais */
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
function city(th,alt,q){const W=512,H=640,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
const dep=!!alt;seed=(th.sd=th.sd||Math.floor(Math.random()*1e6)+1);if(false){x.fillStyle='#07060c';x.fillRect(0,0,W,H);x.fillStyle='#e8e4ff';x.font='italic 52px "Instrument Serif",Georgia,serif';x.textBaseline='middle';q.split('\n').forEach((l,i,a)=>x.fillText(l,34,H/2+(i-(a.length-1)/2)*70));x.strokeStyle='rgba(139,92,246,.7)';x.lineWidth=2;x.strokeRect(14,14,W-28,H-28);return c}
const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#16121f');g.addColorStop(1,'#2b2437');x.fillStyle=g;x.fillRect(0,0,W,H);
const bld=(x0,w,h,col,lit)=>{x.fillStyle=col;x.fillRect(x0,H-h,w,h);for(let yy=H-h+10;yy<H-8;yy+=14)for(let xx=x0+6;xx<x0+w-8;xx+=11){const r1=rnd(),r2=rnd(),r3=rnd();if(r1<lit*(dep?.2:1)){x.fillStyle=r2<.15?'#c4b5fd':'#e9d8a6';x.globalAlpha=.35+r3*.5;x.fillRect(xx,yy,5,7);x.globalAlpha=1}}};
const tw=th.towers??.8;
if(th.split){for(let i=0;i<6;i++)bld(i*40,38,260+rnd()*220,'#0c0b13',.5);for(let i=0;i<9;i++)bld(256+i*28,26,60+rnd()*60,'#1c1722',.12);x.fillStyle='rgba(0,0,0,.4)';x.fillRect(250,0,12,H)}
else for(let L=0;L<3;L++){let xx=-10;while(xx<W){const w=30+rnd()*50,h=(120+rnd()*(250*tw))*(1-L*.18);bld(xx,w,h,['#2a2336','#17131f','#0a090f'][L],th.lone?.05:.3-.06*L);xx+=w+2}}
if(th.lone){x.fillStyle='#e9d8a6';x.fillRect(W*.62,H-120,7,9);x.fillStyle='#050509';x.fillRect(W*.6,H-58,9,42)}
if(th.haze){const hz=x.createLinearGradient(0,0,0,H);hz.addColorStop(0,'rgba(120,110,100,0)');hz.addColorStop(1,'rgba(150,130,110,'+th.haze*.7+')');x.fillStyle=hz;x.fillRect(0,0,W,H)}
if(th.red){x.fillStyle='rgba(150,10,30,.35)';x.fillRect(0,H-90,W,90)}
const im=x.getImageData(0,0,W,H);for(let i=0;i<im.data.length;i+=4){const n=(rnd()-.5)*26;im.data[i]+=n;im.data[i+1]+=n;im.data[i+2]+=n}x.putImageData(im,0,0);
x.fillStyle='rgba(5,5,9,.25)';for(let y=0;y<H;y+=3)x.fillRect(0,y,W,1);
if(dep){x.globalCompositeOperation='saturation';x.fillStyle='#808080';x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over';x.fillStyle='rgba(6,8,18,.5)';x.fillRect(0,0,W,H);x.strokeStyle='rgba(175,185,215,.25)';for(let i=0;i<150;i++){const rx=rnd()*W,ry=rnd()*H;x.beginPath();x.moveTo(rx,ry);x.lineTo(rx-4,ry+18);x.stroke()}const gg=x.createLinearGradient(0,H*.5,0,H);gg.addColorStop(0,'rgba(0,0,0,0)');gg.addColorStop(1,'rgba(0,0,0,.9)');x.fillStyle=gg;x.fillRect(0,H*.5,W,H*.5);x.fillStyle='#d9d6e8';x.font='italic 30px "Instrument Serif",Georgia,serif';x.textBaseline='alphabetic';q.split('\n').forEach((l,i,a)=>x.fillText(l,26,H-30-(a.length-1-i)*34))}
return c}
const PV=`varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const PF=`uniform sampler2D a,b;uniform float uH,uT,uR,uS;varying vec2 vU;
float h(float n){return fract(sin(n*91.3458)*47453.5453);}
void main(){vec2 u=vU;float row=floor(u.y*22.);float t=floor(uT*7.);
float tear=step(.55,h(row+t+uS))*uH;u.x+=(h(row*1.7+t)-.5)*.14*tear;
float k=uH*.012;vec4 A=vec4(texture2D(a,u+vec2(k,0.)).r,texture2D(a,u).g,texture2D(a,u-vec2(k,0.)).b,1.);
float nz=h(floor(vU.y*60.)+uS)*.05+h(floor(vU.y*14.)+uS*2.)*.07;float tl=vU.x*.8+vU.y*.45+nz;float front=uR*1.6-.1;
vec4 B=texture2D(b,vU);float edge=step(tl,front);float band=smoothstep(.05,0.,abs(tl-front))*step(.001,uR)*step(uR,.995);float shade=smoothstep(.1,0.,front-tl)*step(tl,front);
vec3 c=mix(A.rgb,B.rgb,edge);c*=mix(.62,1.,uH);c+=vec3(.4,.1,.9)*tear*.18;c*=1.-shade*.5;c=mix(c,vec3(.92,.88,1.),band*.9);
float e=min(min(vU.x,1.-vU.x),min(vU.y,1.-vU.y));c+=vec3(.55,.35,1.)*smoothstep(.02,0.,e)*(.25+uH*.9);
gl_FragColor=vec4(c,1.);}`;
const pos=[[-2.3,.5,.4],[2.4,.8,.1],[-2.7,-.5,-.8],[2.7,-.4,.8],[-.9,1.7,-1],[1.2,1.6,-.9]];
const panels=[].map((p,i)=>{const sh=new THREE.ShaderMaterial({vertexShader:PV,fragmentShader:PF,uniforms:{a:{value:new THREE.CanvasTexture(city(p.th,false))},b:{value:new THREE.CanvasTexture(city(p.th,true,p.q))},uH:{value:0},uT:U.uT,uR:{value:0},uS:{value:i*3.7}},side:THREE.DoubleSide});
const m=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.4),sh);m.position.set(...pos[i]);m.userData={i,base:pos[i][1],px:pos[i][0],pz:pos[i][2],h:0,r:0,rt:0};m.lookAt(0,0,0);m.rotateY((i%2?-1:1)*.25);S.add(m);return m});
/* poeira */
const N=700,pa=new Float32Array(N*3);for(let i=0;i<N;i++){pa[i*3]=(Math.random()-.5)*14;pa[i*3+1]=(Math.random()-.5)*8;pa[i*3+2]=(Math.random()-.5)*10-1}
const dust=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(pa,3)),new THREE.PointsMaterial({color:0x9d7bff,size:.02,transparent:true,opacity:.5,depthWrite:false}));S.add(dust);

/* som: música gerada em tempo real (Web Audio) */
const AU={ctx:null,on:false,lp:null,bt:0,last:0};const getT=()=>clock.elapsedTime;
function buildAudio(){
const C=AU.ctx=new(window.AudioContext||window.webkitAudioContext)();
const M=AU.master=C.createGain();M.gain.value=0;M.connect(C.destination);
const L=C.sampleRate*4,ib=C.createBuffer(2,L,C.sampleRate);for(let ch=0;ch<2;ch++){const d=ib.getChannelData(ch);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,3)}
const rv=AU.rv=C.createConvolver();rv.buffer=ib;const rg=C.createGain();rg.gain.value=.7;rv.connect(rg);rg.connect(M);
const dry=AU.dry=C.createGain();dry.gain.value=.65;dry.connect(M);
const bus=AU.bus=C.createGain();bus.connect(dry);bus.connect(rv);
const lp=AU.lp=C.createBiquadFilter();lp.type='lowpass';lp.frequency.value=380;lp.Q.value=2;lp.connect(bus);
const lfo=C.createOscillator(),lg=C.createGain();lfo.frequency.value=.06;lg.gain.value=140;lfo.connect(lg);lg.connect(lp.frequency);lfo.start();
[[65.4,'sine',.07],[98,'sine',.05],[130.8,'sine',.04]].forEach(([f,ty,g])=>[-4,4].forEach(dt=>{const o=C.createOscillator(),gg=C.createGain();o.type=ty;o.frequency.value=f;o.detune.value=dt;gg.gain.value=g;o.connect(gg);gg.connect(lp);o.start()}));
const nb=C.createBuffer(1,C.sampleRate*3,C.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
const ns=C.createBufferSource();ns.buffer=nb;ns.loop=true;const bp=C.createBiquadFilter();bp.type='bandpass';bp.frequency.value=420;bp.Q.value=.7;const ng=C.createGain();ng.gain.value=.03;{const l3=C.createOscillator(),g3=C.createGain();l3.frequency.value=.11;g3.gain.value=.022;l3.connect(g3);g3.connect(ng.gain);l3.start()}ns.connect(bp);bp.connect(ng);ng.connect(bus);ns.start();
const lf2=C.createOscillator(),lg2=C.createGain();lf2.frequency.value=.08;lg2.gain.value=250;lf2.connect(lg2);lg2.connect(bp.frequency);lf2.start();
const CH=[[130.8,164.8,196,293.7],[110,130.8,164.8,196],[174.6,220,261.6,329.6],[98,146.8,196,220]];let ci=0;
const pad=()=>{if(AU.on&&C.state==='running'){const t=C.currentTime;CH[ci++%4].forEach(f=>[-6,6].forEach(dt=>{const o=C.createOscillator(),g=C.createGain(),fl=C.createBiquadFilter();fl.type='lowpass';fl.frequency.value=900;o.type='triangle';o.frequency.value=f;o.detune.value=dt;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+5);g.gain.linearRampToValueAtTime(0,t+13);o.connect(fl);fl.connect(g);g.connect(bus);o.start(t);o.stop(t+13.5)}))}setTimeout(pad,10000)};pad();
const bell=()=>{if(AU.on&&C.state==='running'){const f=[523.3,587.3,659.3,784,880][Math.floor(Math.random()*5)],t=C.currentTime;const o=C.createOscillator(),o2=C.createOscillator(),g=C.createGain(),g2=C.createGain();o.frequency.value=f;o2.frequency.value=f*2.01;g2.gain.value=.25;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.01);g.gain.exponentialRampToValueAtTime(.0005,t+4.5);o.connect(g);o2.connect(g2);g2.connect(g);g.connect(rv);g.connect(bus);o.start(t);o2.start(t);o.stop(t+5);o2.stop(t+5)}setTimeout(bell,6000+Math.random()*7000)};bell();
}
function thump(t,v){const C=AU.ctx,o=C.createOscillator(),g=C.createGain();o.frequency.setValueAtTime(70,t);o.frequency.exponentialRampToValueAtTime(32,t+.22);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.5*v,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g);g.connect(AU.dry);o.start(t);o.stop(t+.4)}
function beat(){if(!AU.on)return;const t=AU.ctx.currentTime;thump(t,1);thump(t+.3,.6);AU.bt=setTimeout(beat,(1.5-(getT()%1.5))*1000+8)}
function drop(){if(!AU.on||AU.ctx.state!=='running')return;const t=AU.ctx.currentTime;if(t-AU.last<.4)return;AU.last=t;const o=AU.ctx.createOscillator(),g=AU.ctx.createGain(),f=500+Math.random()*500;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.8,t+.08);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+.005);g.gain.exponentialRampToValueAtTime(.0005,t+.9);o.connect(g);g.connect(AU.rv);g.connect(AU.dry);o.start(t);o.stop(t+1)}
const mus=new Audio();mus.loop=true;let mon=false,mfd=0,mload=false;
function mfade(to){clearInterval(mfd);mfd=setInterval(()=>{const d=to-mus.volume;if(Math.abs(d)<.02){mus.volume=to;clearInterval(mfd);if(to===0)mus.pause()}else mus.volume=Math.max(0,Math.min(1,mus.volume+Math.sign(d)*.02))},60)}
function prepMusic(){if(mload)return mload;mload=new Promise(res=>{mus.preload='auto';mus.volume=0;const done=()=>res();mus.addEventListener('canplaythrough',done,{once:true});mus.addEventListener('error',done,{once:true});setTimeout(done,9000);mus.src=MPA.mp3;mus.load()});return mload}
function toggleMusic(){prepMusic();
mon=!mon;snd.setAttribute('aria-pressed',mon);if(mon){mus.play().catch(()=>{mon=false;snd.setAttribute('aria-pressed',false)});mfade(.7)}else mfade(0)}
document.addEventListener('visibilitychange',()=>{if(document.hidden)mus.pause();else if(mon)mus.play().catch(()=>{})});
setP('m',.3);prepMusic().then(()=>setP('m',1));
const snd=$('#snd');snd.addEventListener('pointerdown',e=>{const r=snd.getBoundingClientRect();snd.style.setProperty('--rx',(e.clientX-r.left)+'px');snd.style.setProperty('--ry',(e.clientY-r.top)+'px');snd.classList.remove('rp');void snd.offsetWidth;snd.classList.add('rp')});snd.onclick=()=>{toggleMusic();return;if(!AU.ctx)buildAudio();AU.on=!AU.on;snd.setAttribute('aria-pressed',AU.on);snd.textContent=AU.on?'Som: ligado':'Som: desligado';clearTimeout(AU.bt);if(AU.on){AU.ctx.resume();AU.master.gain.setTargetAtTime(.9,AU.ctx.currentTime,1.2)}else AU.master.gain.setTargetAtTime(0,AU.ctx.currentTime,.4)};
document.addEventListener('visibilitychange',()=>{if(!AU.ctx)return;if(document.hidden)AU.ctx.suspend();else if(AU.on)AU.ctx.resume()});
/* oceano */
const RP=Array.from({length:24},()=>new THREE.Vector3(0,0,-99));let rpi=0;
const water=new THREE.Mesh(new THREE.PlaneGeometry(140,140),new THREE.ShaderMaterial({side:THREE.DoubleSide,transparent:true,depthWrite:false,uniforms:{uRp:{value:RP},uT:U.uT,uP:U.uP},vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,fragmentShader:`uniform vec3 uRp[24];uniform float uT,uP;varying vec3 vW;
float mh(float n){return fract(sin(n*127.1)*43758.5453);}
float mvn(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mh(i),mh(i+1.),f);}
float mrg(float x,float s){float h=0.,a=.5,f=1.;for(int i=0;i<5;i++){float n=1.-abs(mvn(x*f+s)*2.-1.);h+=a*pow(n,1.6)*1.4;f*=2.03;a*=.5;}return h;}
vec3 mountains(vec3 d,vec3 base,float t){
float ph=atan(d.x,-d.z),ey=d.y;vec3 col=base;
vec2 sp=vec2(ph*44.,ey*44.),si=floor(sp);float sh=mh(si.x*13.1+si.y*71.7);
col+=vec3(.8,.82,1.)*step(.975,sh)*smoothstep(.3,0.,length(fract(sp)-.5))*smoothstep(.02,.16,ey)*(.6+.4*sin(t*1.5+sh*40.))*1.2;col+=vec3(.12,.09,.2)*exp(-abs(ey)*16.)*.6;
vec2 mp=vec2(ph+.3,ey-.15);float md=length(mp);
col+=vec3(.55,.45,.95)*exp(-md*6.)*.5+vec3(.5,.45,.85)*exp(-md*20.)*.55+vec3(.92,.9,1.)*smoothstep(.034,.03,md)*.92;
for(int k=0;k<4;k++){float fk=float(k);
float x=ph*(2.2+fk*.9)+fk*11.7;
float h=.012+.062*mrg(x,fk*9.3)*(1.+(3.-fk)*.45);
float cover=smoothstep(h+.0016,h-.0016,ey);
vec3 mc=mix(vec3(.27,.21,.46),vec3(.02,.018,.045),pow(fk/3.,.8));mc=mix(mc,base*1.5+vec3(.04,.03,.08),smoothstep(h,-.02,ey)*.55*(1.-fk*.2));
mc=mix(mc,base,smoothstep(.07,0.,ey)*(1.-fk*.15));
float rim=smoothstep(h-.012,h,ey)*cover;
mc+=vec3(.6,.45,1.)*rim*.9*exp(-md*1.4)*(1.-fk*.15);
col=mix(col,mc,cover);}
return col;}

void main(){vec2 p=vW.xz;float h=0.;vec2 g=vec2(0.);
for(int i=0;i<24;i++){vec3 r=uRp[i];float a=uT-r.z;if(a>0.&&a<7.){vec2 dv=p-r.xy;float d=length(dv)+1e-3;float fr=a*2.2;float x=d-fr;float env=exp(-x*x*1.6)*exp(-a*.5)/(1.+d*.15);float ph=x*6.5;h+=sin(ph)*env;g+=(cos(ph)*6.5*env-sin(ph)*env*3.2*x)*dv/d;}}
g+=vec2(sin(p.x*1.7+uT*.5),cos(p.y*1.3+uT*.4))*.02;
vec3 n=normalize(vec3(-g.x*.12,1.,-g.y*.12));
vec3 V=normalize(cameraPosition-vW);float dist=length(cameraPosition-vW);
vec3 R=reflect(-V,n);float fres=pow(1.-max(dot(n,V),0.),3.);
vec3 sky0=mix(vec3(.065,.058,.1)*.9,vec3(.05,.045,.09),smoothstep(0.,.3,R.y));vec3 sky=mountains(R,sky0,uT);
vec3 toB=normalize(-vW);float sp=pow(max(dot(R,toB),0.),90.);
vec3 col=vec3(.006,.006,.012)+sky*(.25+fres*.75)+vec3(.5,.3,1.)*sp*(.6+uP*.7)+vec3(.45,.3,1.)*h*h*.5;
float f=smoothstep(7.,48.,dist);col=mix(col,vec3(.065,.058,.1),f);
float nf=smoothstep(.05,1.2,abs(cameraPosition.y-vW.y));if(cameraPosition.y<vW.y){float cz=normalize(vW-cameraPosition).y;float win=smoothstep(.6,.72,cz);vec3 lit=vec3(.2,.17,.38)*(.6+.5*smoothstep(.72,1.,cz));vec3 uw=vec3(.025,.03,.07);vec3 uc=mix(uw*.6,lit+uw,win);uc=mix(uc,uw,smoothstep(2.,18.,dist));gl_FragColor=vec4(uc,nf);}else gl_FragColor=vec4(col,mix(.8,1.,f)*nf);}`}));
water.rotation.x=-Math.PI/2;water.position.y=WY;water.renderOrder=1;S.add(water);
const haze=(()=>{const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.scale(1,.25);const g=x.createRadialGradient(256,256,0,256,256,256);g.addColorStop(0,'rgba(85,70,140,.5)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,512,512);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));s.scale.set(90,10,1);s.position.set(0,-.3,-26);return s})();S.add(haze);
const beams=[];const bt2=(()=>{const c=document.createElement('canvas');c.width=64;c.height=256;const x=c.getContext('2d');const gx=x.createLinearGradient(0,0,64,0);gx.addColorStop(0,'rgba(255,255,255,0)');gx.addColorStop(.5,'rgba(255,255,255,1)');gx.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gx;x.fillRect(0,0,64,256);x.globalCompositeOperation='destination-in';const gy=x.createLinearGradient(0,0,0,256);gy.addColorStop(0,'rgba(0,0,0,0)');gy.addColorStop(.18,'rgba(0,0,0,1)');gy.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gy;x.fillRect(0,0,64,256);return new THREE.CanvasTexture(c)})();
for(let i=0;i<7;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(1.2+Math.random()*1.6,12),new THREE.MeshBasicMaterial({map:bt2,color:0x9d7bff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,side:THREE.DoubleSide}));m.position.set((i-3)*2.4+Math.random(),-7.5,-3-Math.random()*6);m.rotation.z=.12+Math.random()*.1;m.userData.s=Math.random()*6;m.renderOrder=2;m.visible=false;S.add(m);beams.push(m)}
const CC=new THREE.Color(),UWE=document.getElementById('uw');
const sky=new THREE.Mesh(new THREE.SphereGeometry(120,32,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{uHor:{value:new THREE.Color(.065,.058,.1)},uTop:{value:new THREE.Color(.0196,.0196,.0353)},uT:U.uT,uUw:{value:0}},vertexShader:`varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 vD;uniform vec3 uHor,uTop;uniform float uT,uUw;
float mh(float n){return fract(sin(n*127.1)*43758.5453);}
float mvn(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mh(i),mh(i+1.),f);}
float mrg(float x,float s){float h=0.,a=.5,f=1.;for(int i=0;i<5;i++){float n=1.-abs(mvn(x*f+s)*2.-1.);h+=a*pow(n,1.6)*1.4;f*=2.03;a*=.5;}return h;}
vec3 mountains(vec3 d,vec3 base,float t){
float ph=atan(d.x,-d.z),ey=d.y;vec3 col=base;
vec2 sp=vec2(ph*44.,ey*44.),si=floor(sp);float sh=mh(si.x*13.1+si.y*71.7);
col+=vec3(.8,.82,1.)*step(.975,sh)*smoothstep(.3,0.,length(fract(sp)-.5))*smoothstep(.02,.16,ey)*(.6+.4*sin(t*1.5+sh*40.))*1.2;col+=vec3(.12,.09,.2)*exp(-abs(ey)*16.)*.6;
vec2 mp=vec2(ph+.3,ey-.15);float md=length(mp);
col+=vec3(.55,.45,.95)*exp(-md*6.)*.5+vec3(.5,.45,.85)*exp(-md*20.)*.55+vec3(.92,.9,1.)*smoothstep(.034,.03,md)*.92;
for(int k=0;k<4;k++){float fk=float(k);
float x=ph*(2.2+fk*.9)+fk*11.7;
float h=.012+.062*mrg(x,fk*9.3)*(1.+(3.-fk)*.45);
float cover=smoothstep(h+.0016,h-.0016,ey);
vec3 mc=mix(vec3(.27,.21,.46),vec3(.02,.018,.045),pow(fk/3.,.8));mc=mix(mc,base*1.5+vec3(.04,.03,.08),smoothstep(h,-.02,ey)*.55*(1.-fk*.2));
mc=mix(mc,base,smoothstep(.07,0.,ey)*(1.-fk*.15));
float rim=smoothstep(h-.012,h,ey)*cover;
mc+=vec3(.6,.45,1.)*rim*.9*exp(-md*1.4)*(1.-fk*.15);
col=mix(col,mc,cover);}
return col;}

void main(){vec3 d=normalize(vD);float y=max(d.y,0.);vec3 base=mix(uHor,uTop,smoothstep(0.,.5,y));gl_FragColor=vec4(mix(mountains(d,base,uT),base,uUw),1.);}`}));sky.renderOrder=-10;sky.frustumCulled=false;S.add(sky);
const mist=[0,1,2].map(i=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:haze.material.map,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,opacity:.32}));s.scale.set(130+i*30,11+i*4,1);s.position.set(0,-.9+i*.35,-34-i*10);s.renderOrder=2;S.add(s);return s});const BN=320,bv=new Float32Array(BN),bP=new Float32Array(BN*3),bS=new Float32Array(BN);for(let i=0;i<BN;i++){bP[i*3]=(Math.random()-.5)*16;bP[i*3+1]=-11+Math.random()*9.5;bP[i*3+2]=-9+Math.random()*15;bv[i]=.35+Math.random()*.7;bS[i]=.05+Math.pow(Math.random(),2)*.25}
const bubG=new THREE.BufferGeometry();bubG.setAttribute('position',new THREE.BufferAttribute(bP,3));bubG.setAttribute('sz',new THREE.BufferAttribute(bS,1));
const bubM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uO2:{value:0}},vertexShader:`attribute float sz;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=sz*(700./-mv.z);gl_Position=projectionMatrix*mv;}`,fragmentShader:`uniform float uO2;void main(){vec2 c=gl_PointCoord-.5;float d=length(c);if(d>.5)discard;float ring=smoothstep(.5,.4,d)*smoothstep(.22,.46,d);float hl=smoothstep(.1,0.,length(c-vec2(-.17,-.17)));float a=(ring*.7+hl*.9+.04)*uO2;gl_FragColor=vec4(vec3(.72,.66,1.)*a,a);}`});
const bubs=new THREE.Points(bubG,bubM);bubs.renderOrder=3;bubs.frustumCulled=false;bubs.visible=false;S.add(bubs);
/* modelo */
setP('g',.05);
const loadBrain=ab=>{setP('g',.12);setTimeout(()=>new THREE.GLTFLoader().parse(ab,'',g=>{setP('g',.55);let geo;g.scene.traverse(o=>{if(o.isMesh&&!geo)geo=o.geometry});
geo.computeBoundingBox();const bb=geo.boundingBox,c=bb.getCenter(new THREE.Vector3()),sz=bb.getSize(new THREE.Vector3());
geo.translate(-c.x,-c.y,-c.z);{const s0=2/Math.max(sz.x,sz.y,sz.z);geo.scale(s0,s0,s0)}geo.computeVertexNormals();geo=geo.toNonIndexed();
{const pa=geo.attributes.position.array,tA=new Float32Array(pa.length);for(let i=0;i<pa.length;i+=9){const cx=(pa[i]+pa[i+3]+pa[i+6])/3,cy=(pa[i+1]+pa[i+4]+pa[i+7])/3,cz=(pa[i+2]+pa[i+5]+pa[i+8])/3;for(let j=0;j<9;j+=3){tA[i+j]=cx;tA[i+j+1]=cy;tA[i+j+2]=cz}}geo.setAttribute('tc',new THREE.BufferAttribute(tA,3))}
const mesh=new THREE.Mesh(geo,brainMat);mesh.scale.setScalar(1.05);mesh.frustumCulled=false;brain.add(mesh);BRG=geo;if(innerWidth>=760){const mm=new THREE.Mesh(geo,brainMat);mm.scale.setScalar(1.05);mm.frustumCulled=false;mirror.add(mm)}
setP('g',1);loadFig()},e=>{setP('g',1);loadFig();LL.textContent='modelo 3D indisponível'}),700)};
fetch(MPA.glb).then(r=>{if(!r.ok)throw new Error(r.status);return r.arrayBuffer()}).then(loadBrain).catch(e=>{setP('g',1);loadFig();LL.textContent='modelo 3D indisponível'});

/* pensamento: um raio sai do cérebro, forma um oval e volta; ao clicar, vira poeira preta */
function buildBoltData(N,f,rnd,sd){
const Cx=1.8+(rnd()-.5)*.2,Cy=.5+(rnd()-.5)*.2,a=1.2+(rnd()-.5)*.2,b=.78+(rnd()-.5)*.14,ph=-.2+(rnd()-.5)*.3,cp=Math.cos(ph),sp=Math.sin(ph),r1=rnd()*6,r2=rnd()*6;
const th0=3.5+(rnd()-.5)*.1,th1=th0+5.55,ST=14,K=N+1-2*ST;
const el=th=>{const x=a*Math.cos(th)*(1+.08*Math.sin(th*3+r1)),y=b*Math.sin(th)*(1+.1*Math.cos(th*2+r2));return[Cx+x*cp-y*sp,Cy+x*sp+y*cp]};
const E0=el(th0),E1=el(th1),S0=[.1,.18,.05],S1=[.1,.62,.05];let P=[];
for(let k=0;k<ST;k++){const u=k/ST;P.push([S0[0]+(E0[0]-S0[0])*u,S0[1]+(E0[1]-S0[1])*u,S0[2]+(.25-S0[2])*u])}
for(let i=0;i<K;i++){const u=i/(K-1),th=th0+(th1-th0)*u,p=el(th),nz=.05*Math.sin(u*13+r1)+.035*Math.sin(u*27+r2);P.push([p[0]+nz*.5,p[1]+nz,.25+Math.sin(u*6.28)*.15])}
for(let k=1;k<=ST;k++){const u=k/ST;P.push([E1[0]+(S1[0]-E1[0])*u,E1[1]+(S1[1]-E1[1])*u,.25+(S1[2]-.25)*u])}
for(let it=0;it<4;it++){const Q=P.map(p=>p.slice());for(let i=1;i<P.length-1;i++)for(let c=0;c<3;c++)Q[i][c]=(P[i-1][c]+2*P[i][c]+P[i+1][c])/4;P=Q}
P=P.map(p=>[p[0]*f*sd,p[1]*f,p[2]]);
const nv=N*4,pos=new Float32Array(nv*3),tan=new Float32Array(nv*3),per=new Float32Array(nv*3),side=new Float32Array(nv),e=new Float32Array(nv),tt=new Float32Array(nv),pidx=new Float32Array(nv),ch=new Float32Array(nv),idx=new Uint16Array(N*6);
const T=[];for(let i=0;i<=N;i++){const A=P[Math.max(0,i-1)],B=P[Math.min(N,i+1)];let tx=B[0]-A[0],ty=B[1]-A[1],tz=B[2]-A[2];const l=Math.hypot(tx,ty,tz)||1;T.push([tx/l,ty/l,tz/l])}
for(let i=0;i<N;i++){const sg=[P[i+1][0]-P[i][0],P[i+1][1]-P[i][1],P[i+1][2]-P[i][2]],sl=Math.hypot(...sg)||1;
for(let k=0;k<4;k++){const v=i*4+k,pi=i+(k>>1),sd=(k&1)?1:-1,en=(k>>1)?1:-1,p=P[pi],tq=T[pi];
pos.set(p,v*3);tan.set([sg[0]/sl,sg[1]/sl,sg[2]/sl],v*3);const pl=Math.hypot(tq[0],tq[1])||1;per.set([-tq[1]/pl,tq[0]/pl,0],v*3);
side[v]=sd;e[v]=en;tt[v]=pi/N;pidx[v]=pi;ch[v]=Math.floor(i/6)}
const o=i*4;idx.set([o,o+1,o+2,o+1,o+3,o+2],i*6)}
return{P,pos,tg:tan,tan,per,side,e,tt,pidx,ch,idx,Cx:Cx*f*sd,Cy:Cy*f}}

const BN2=150,BS={state:'idle',next:Infinity,t0:0,near:false,P:[],c:[0,0]};
const bGeo=new THREE.BufferGeometry();
['position','tg','per','loc'].forEach(n=>bGeo.setAttribute(n,new THREE.BufferAttribute(new Float32Array(BN2*12),3)));
['side','e','tt','pidx','ch'].forEach(n=>bGeo.setAttribute(n,new THREE.BufferAttribute(new Float32Array(BN2*4),1)));
bGeo.setIndex(new THREE.BufferAttribute(new Uint16Array(BN2*6),1));
const BU={uT:U.uT,uAsp:{value:1},uW:{value:.011},uBr:{value:0},uJ:{value:1},uMv:{value:1},uGrow:{value:0},uTail:{value:0},uA:{value:1},uHov:{value:0},uHd:{value:1},uMir:{value:1},uBm:{value:brain.matrixWorld},uTk:{value:new THREE.Vector4(0,0,0,1)},uTr:{value:0},uOff:{value:0}};
const bVS=`attribute vec3 tg;attribute vec3 per;attribute vec3 loc;attribute float side,e,tt,pidx,ch;
uniform float uT,uAsp,uW,uBr,uJ,uMv,uTr,uOff;uniform vec4 uTk;uniform mat4 uBm;varying float vS,vT,vWt;varying vec2 vQ;
float jag(float a){return .045*sin(a*17.3+1.7)+.03*sin(a*41.1+4.2)+.016*sin(a*93.+.7);}
float hh(float n){return fract(sin(n*91.3458)*47453.5453);}
void main(){vec3 p=position;float wa=clamp(smoothstep(.22,0.,tt)+smoothstep(.78,1.,tt),0.,1.);p=mix(p,(uBm*vec4(loc,1.)).xyz,wa);
float env=smoothstep(0.,.08,tt)*smoothstep(1.,.92,tt);
float jn=sin(uT*2.2+pidx*.22)*.6+sin(uT*3.7+pidx*.41)*.4;
p+=per*jn*.03*env*uJ;
vec3 vel=vec3(hh(ch)-.5,hh(ch+3.1)-.2,hh(ch+7.7)-.5)*vec3(1.6,1.2,1.6);
p+=(vel*uBr*(.6+uBr)-vec3(0.,uBr*uBr*.7,0.))*uMv;
{vec2 dr=uTk.zw,pr2=vec2(-dr.y,dr.x),d2=p.xy-uTk.xy;float al=dot(d2,dr),sq=dot(d2,pr2)+jag(al);float wt=smoothstep(uTr*2.6+.25,uTr*2.6-.25,abs(al))*step(.0001,uTr);p.xy+=pr2*(sq<0.?-1.:1.)*uOff*wt;vQ=p.xy;vWt=wt;}
vec4 cl=projectionMatrix*modelViewMatrix*vec4(p,1.);vec4 cl2=projectionMatrix*modelViewMatrix*vec4(p+tg*.05,1.);
vec2 d=(cl2.xy/cl2.w-cl.xy/cl.w)*vec2(uAsp,1.);d=normalize(d+vec2(1e-5));
vec2 pr=vec2(-d.y,d.x)/vec2(uAsp,1.);
float w=uW*(1.-uBr*.6)*(.8+.4*sin(uT*14.+tt*40.)*uJ);
cl.xy+=(pr*side*w+d/vec2(uAsp,1.)*e*w*.6)*cl.w;
gl_Position=cl;vS=side;vT=tt;}
`,bFS=`uniform float uGrow,uTail,uA,uBr,uHov,uHd,uT,uMir,uTr,uOff;uniform vec4 uTk;varying float vS,vT,vWt;varying vec2 vQ;
float jag(float a){return .045*sin(a*17.3+1.7)+.03*sin(a*41.1+4.2)+.016*sin(a*93.+.7);}
void main(){if(vT>uGrow||vT<uTail)discard;
vec2 dr=uTk.zw,pr2=vec2(-dr.y,dr.x);float al=dot(vQ-uTk.xy,dr),sq=dot(vQ-uTk.xy,pr2)+jag(al);float off=uOff*vWt;if(off>.0001&&abs(sq)<off*.96)discard;float rim=off>.0001?smoothstep(.06,0.,abs(sq)-off)*vWt:0.;
float head=exp(-(uGrow-vT)*10.)*uHd;float pulse=pow(.5+.5*sin(vT*30.-uT*5.),6.)*.5;
float core=exp(-vS*vS*3.2);float halo=exp(-vS*vS*1.3)*.5;
vec3 glow=mix(vec3(.55,.32,1.),vec3(1.,.95,1.),core*.8);
vec3 col=glow*(.7+head*1.4+pulse+uHov*.6)*(core+halo);
float alpha=clamp(core+halo,0.,1.)*uA;
float k=smoothstep(0.,.35,uBr);
vec3 dark=mix(vec3(.012,.012,.016),vec3(.42,.45,.5),smoothstep(.4,.85,abs(vS))*.85);
float ad=(1.-smoothstep(.8,1.,abs(vS)))*.95*(1.-smoothstep(.55,1.,uBr))*uA;
col=mix(col,dark,k);alpha=mix(alpha,ad,k);col+=vec3(.9,.9,.95)*rim*.9*(1.-k);alpha=max(alpha,rim*.8*(1.-k)*uA);alpha*=uMir;
gl_FragColor=vec4(col,alpha);}
`;
const bMat=new THREE.ShaderMaterial({uniforms:BU,vertexShader:bVS,fragmentShader:bFS,transparent:true,depthWrite:false,side:THREE.DoubleSide});
const bMesh=new THREE.Mesh(bGeo,bMat);bMesh.frustumCulled=false;bMesh.renderOrder=4;bMesh.visible=false;S.add(bMesh);
const FU={uT:U.uT,uMask:{value:null},uBox:{value:new THREE.Vector4()},uTk:BU.uTk,uTr:BU.uTr,uOff:BU.uOff,uFa:{value:0},uPp:{value:0},uDk:{value:0}};
const fMesh=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.ShaderMaterial({uniforms:FU,transparent:true,depthWrite:false,side:THREE.DoubleSide,vertexShader:`varying vec2 vXY;void main(){vec4 w=modelMatrix*vec4(position,1.);vXY=w.xy;gl_Position=projectionMatrix*viewMatrix*w;}`,fragmentShader:`uniform sampler2D uMask;uniform vec4 uBox,uTk;uniform float uFa,uT,uTr,uOff,uPp,uDk;varying vec2 vXY;
float jag(float a){return .045*sin(a*17.3+1.7)+.03*sin(a*41.1+4.2)+.016*sin(a*93.+.7);}
float hh(float n){return fract(sin(n*91.3458)*47453.5453);}
void main(){vec2 dr=uTk.zw,pp=vec2(-dr.y,dr.x),ck=uTk.xy;vec2 d=vXY-ck;float al=dot(d,dr),dq=dot(d,pp);
float w=smoothstep(uTr*2.6+.25,uTr*2.6-.25,abs(al))*step(.0001,uTr);float off=uOff*w;
float sq=dq+jag(al);float sd=sq<0.?-1.:1.;if(off>.0001&&abs(sq)<off)discard;
vec2 p=ck+dr*al+pp*(dq-sd*off);vec2 uv=(p-uBox.xy)/(uBox.zw-uBox.xy);if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)discard;
float m=texture2D(uMask,uv).r;if(m<.01)discard;
vec3 col=mix(vec3(.5,.28,1.),vec3(.62,.63,.7),uPp);col=mix(col,vec3(.015,.015,.02),uDk);
float a=mix(uFa*(.6+.4*sin(uT*1.6+p.x*2.)),.42,uPp)*m;a*=1.-uDk*.92;
float rim=off>.0001?smoothstep(.05,0.,abs(sq)-off-hh(floor(al*70.))*.014)*w:0.;
col=mix(col,vec3(.92,.92,.95),rim*(1.-uDk));a=max(a,rim*.9*m*(1.-uDk));gl_FragColor=vec4(col,a);}`}));
fMesh.frustumCulled=false;fMesh.renderOrder=3;fMesh.visible=false;S.add(fMesh);
let bMeshM=null;if(innerWidth>=760){bMeshM=new THREE.Mesh(bGeo,new THREE.ShaderMaterial({uniforms:Object.assign({},BU,{uMir:{value:.28}}),vertexShader:bVS,fragmentShader:bFS,transparent:true,depthWrite:false,side:THREE.DoubleSide}));bMeshM.frustumCulled=false;bMeshM.renderOrder=4;bMeshM.visible=false;bMeshM.scale.y=-1;bMeshM.position.y=2*WY;S.add(bMeshM)}
const DN=6000,dG=new THREE.BufferGeometry(),DU={uBt:{value:0},uCk:{value:new THREE.Vector2()},uPx:{value:R.getPixelRatio()}};
['position','v','rd'].forEach(n=>dG.setAttribute(n,new THREE.BufferAttribute(new Float32Array(DN*3),3)));
const dPts=new THREE.Points(dG,new THREE.ShaderMaterial({uniforms:DU,transparent:true,depthWrite:false,vertexShader:`attribute vec3 v;attribute vec3 rd;uniform float uBt,uPx;uniform vec2 uCk;varying float vA;varying float vK;
void main(){float life=2.6+rd.x*2.2;float del=distance(position.xy,uCk)*.28+rd.y*.35;float age=uBt-del;
if(age<0.||age>life){gl_Position=vec4(2.,2.,2.,1.);gl_PointSize=0.;vA=0.;vK=0.;return;}
vec3 p=position+v*age*(.25+rd.z*.5)+vec3(sin(age*1.4+rd.z*30.)*.03,age*.12*(.4+rd.y)-age*age*.015,cos(age*1.1+rd.x*30.)*.03);
vA=(1.-smoothstep(life*.35,life,age))*smoothstep(0.,.25,age);vK=rd.z;
vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=max(1.5,(1.2+rd.y*1.4)*uPx*(6.9/-mv.z));}`,fragmentShader:`varying float vA;varying float vK;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float a=smoothstep(.5,.15,d)*vA;float lt=step(.62,vK);vec3 col=mix(vec3(.13,.14,.17),vec3(.52,.55,.6),lt);gl_FragColor=vec4(col,a*(.85-.2*lt));}`}));
dPts.frustumCulled=false;dPts.renderOrder=4;dPts.visible=false;S.add(dPts);
function buildBolt(){brain.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(brain.matrixWorld).invert();
const D=buildBoltData(BN2,Math.min(1,cam.aspect/1.25),Math.random,Math.random()<.5?1:-1),g=bGeo.attributes;BS.P=D.P.map(p=>new THREE.Vector3(p[0],p[1],p[2]));BS.c=[D.Cx,D.Cy];
const L=BS.P.map(p=>p.clone().applyMatrix4(inv)),loc=g.loc.array;
for(let v=0;v<BN2*4;v++){const pi=Math.round(D.pidx[v]);loc[v*3]=L[pi].x;loc[v*3+1]=L[pi].y;loc[v*3+2]=L[pi].z}g.loc.needsUpdate=true;
['position','tg','per','side','e','tt','pidx','ch'].forEach(k=>{g[k].array.set(k==='position'?D.pos:k==='tg'?D.tan:D[k]);g[k].needsUpdate=true});bGeo.index.array.set(D.idx);bGeo.index.needsUpdate=true;
const X=BS.P.map(p=>p.x),Y=BS.P.map(p=>p.y),x0=Math.min(...X)-.15,x1=Math.max(...X)+.15,y0=Math.min(...Y)-.15,y1=Math.max(...Y)+.15,cw=512,ch=Math.max(64,Math.round(512*(y1-y0)/(x1-x0))),cvm=document.createElement('canvas');cvm.width=cw;cvm.height=ch;
const c2=cvm.getContext('2d');c2.fillStyle='#fff';c2.beginPath();BS.P.forEach((p,i)=>{const px=(p.x-x0)/(x1-x0)*cw,py=(y1-p.y)/(y1-y0)*ch;i?c2.lineTo(px,py):c2.moveTo(px,py)});c2.closePath();c2.fill();
if(FU.uMask.value)FU.uMask.value.dispose();FU.uMask.value=new THREE.CanvasTexture(cvm);FU.uBox.value.set(x0,y0,x1,y1);fMesh.position.set((x0+x1)/2,(y0+y1)/2,.25);fMesh.scale.set(x1-x0,y1-y0,1)}
function fillDust(){const a=dG.attributes,pa=a.position.array,va=a.v.array,ra=a.rd.array,n=BS.P.length-1,X=BS.P.map(p=>p.x),Y=BS.P.map(p=>p.y);let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(let i=0;i<=n;i++){x0=Math.min(x0,X[i]);x1=Math.max(x1,X[i]);y0=Math.min(y0,Y[i]);y1=Math.max(y1,Y[i])}
const inP=(cx,cy)=>{let r=false;for(let i=0,j=n;i<=n;j=i++){if((Y[i]>cy)!==(Y[j]>cy)&&cx<(X[j]-X[i])*(cy-Y[i])/(Y[j]-Y[i])+X[i])r=!r}return r},ck=DU.uCk.value;
const put=(i,x,y,z)=>{pa[i*3]=x;pa[i*3+1]=y;pa[i*3+2]=z;const dx=x-ck.x,dy=y-ck.y,l=Math.hypot(dx,dy)||1;va[i*3]=dx/l*.15+(Math.random()-.5)*.3;va[i*3+1]=dy/l*.1+(Math.random()-.4)*.3;va[i*3+2]=(Math.random()-.5)*.3;ra[i*3]=Math.random();ra[i*3+1]=Math.random();ra[i*3+2]=Math.random()};
const LN=Math.floor(DN*.25);let i=0;
for(;i<LN;i++){const u=Math.random()*n,k=Math.floor(u),f=u-k,A=BS.P[k],B=BS.P[Math.min(n,k+1)];put(i,A.x+(B.x-A.x)*f+(Math.random()-.5)*.03,A.y+(B.y-A.y)*f+(Math.random()-.5)*.03,A.z+(B.z-A.z)*f)}
let tries=0;while(i<DN&&tries<60000){tries++;const x=x0+Math.random()*(x1-x0),y=y0+Math.random()*(y1-y0);if(!inP(x,y))continue;put(i++,x,y,.25+(Math.random()-.5)*.3)}
for(;i<DN;i++)put(i,0,0,-50);
a.position.needsUpdate=a.v.needsUpdate=a.rd.needsUpdate=true}
function boltHit(cx,cy){const w=innerWidth,h=innerHeight,N=BS.P.length-1,v=new THREE.Vector3(),X=[],Y=[];
for(let i=0;i<=N;i++){v.copy(BS.P[i]).project(cam);X.push((v.x*.5+.5)*w);Y.push((1-(v.y*.5+.5))*h)}
let best=1e12;for(let i=0;i<N;i++){const tt=i/N;if(tt>BU.uGrow.value||tt<BU.uTail.value)continue;const dx=X[i+1]-X[i],dy=Y[i+1]-Y[i],l2=dx*dx+dy*dy||1;let q=((cx-X[i])*dx+(cy-Y[i])*dy)/l2;q=Math.max(0,Math.min(1,q));const qx=X[i]+dx*q-cx,qy=Y[i]+dy*q-cy;best=Math.min(best,qx*qx+qy*qy)}
if(Math.sqrt(best)<34)return true;
if(BU.uGrow.value>.98&&BU.uTail.value<.02){let ins=false;for(let i=0,j=N;i<=N;j=i++){if((Y[i]>cy)!==(Y[j]>cy)&&cx<(X[j]-X[i])*(cy-Y[i])/(Y[j]-Y[i])+X[i])ins=!ins}return ins}
return false}
function boltHide(){BS.state='idle';bMesh.visible=false;fMesh.visible=false;if(bMeshM)bMeshM.visible=false;dPts.visible=false;BS.near=false}
function startBreak(cx,cy){BS.state='break';BS.t0=performance.now();BU.uBr.value=0;BU.uHd.value=0;BU.uHov.value=0;BU.uMv.value=0;BS.near=false;
let ck=BS.c;if(cx!==undefined){const v=new THREE.Vector3(cx/innerWidth*2-1,-(cy/innerHeight)*2+1,.5).unproject(cam),o=cam.position,d=v.sub(o).normalize(),q=(.25-o.z)/d.z;ck=[o.x+d.x*q,o.y+d.y*q]}
DU.uCk.value.set(ck[0],ck[1]);const an=Math.PI/2+(Math.random()-.5)*1.1;BU.uTk.value.set(ck[0],ck[1],Math.cos(an),Math.sin(an));BU.uTr.value=0;BU.uOff.value=0;FU.uPp.value=0;FU.uDk.value=0;
if(!RM){fillDust();DU.uBt.value=-1;dPts.visible=true}}
function boltUpdate(t,dt,uwf){const now=performance.now(),st=BS.state,ok=LD.live&&scrollY<innerHeight*.35&&E<.12&&uwf<.01&&!document.hidden;
if(st==='idle'){if(ok&&now>BS.next){buildBolt();BS.state='grow';BS.t0=now;BS.next=now+30000;BU.uGrow.value=RM?1:0;BU.uTail.value=0;BU.uA.value=1;BU.uBr.value=0;BU.uHd.value=1;BU.uTr.value=0;BU.uOff.value=0;FU.uPp.value=0;FU.uDk.value=0;BU.uJ.value=RM?0:1;BU.uMv.value=RM?0:1;bMesh.visible=true;fMesh.visible=true;if(bMeshM)bMeshM.visible=true}return}
BU.uAsp.value=cam.aspect;
if(st==='grow'){const p=Math.min(1,(now-BS.t0)/(RM?10:2000));BU.uGrow.value=1-Math.pow(1-p,2.2);if(p>=1){BS.state='live';BS.t0=now}}
else if(st==='live'){BU.uHd.value=Math.max(0,BU.uHd.value-dt*1.3);if(!ok||now-BS.t0>14000){BS.state='fade';BS.t0=now}}
else if(st==='fade'){const p=Math.min(1,(now-BS.t0)/1600);BU.uTail.value=p;BU.uA.value=1-.5*p;if(p>=1)boltHide()}
else if(st==='break'){const b=(now-BS.t0)/1000,sm=(x0,x1,x)=>{const k=Math.min(1,Math.max(0,(x-x0)/(x1-x0)));return k*k*(3-2*k)};
if(RM){BU.uBr.value=Math.min(1,b/.5);FU.uDk.value=Math.min(1,b/.5)}
else{const k=Math.min(1,b/1.1);BU.uTr.value=Math.min(1,b/.9);BU.uOff.value=.3*(1-(1-k)*(1-k));BU.uBr.value=sm(.7,1.6,b);FU.uPp.value=sm(0,.2,b)*(1-sm(.75,1.25,b));FU.uDk.value=sm(.7,1.4,b);DU.uBt.value=b-.85}
if(b>7.4)boltHide()}
if(BS.state==='grow'||BS.state==='live')BS.near=!overUI&&boltHit(innerWidth*(ptr.x*.5+.5),innerHeight*(1-(ptr.y*.5+.5)));else BS.near=false;
FU.uFa.value=(.1+.14*BU.uHov.value)*Math.min(1,Math.max(0,(BU.uGrow.value-.8)/.2))*BU.uA.value;BU.uHov.value=lerp(BU.uHov.value,BS.near?1:0,.2);if(BS.near)cv.style.cursor='pointer'}
addEventListener('click',e=>{if((BS.state==='live'||BS.state==='grow')&&e.target===cv&&boltHit(e.clientX,e.clientY))startBreak(e.clientX,e.clientY)});
/* bonequinho caindo debaixo d'água */
const fig=new THREE.Group(),figIn=new THREE.Group();fig.add(figIn);fig.visible=false;S.add(fig);
const figMat=new THREE.MeshStandardMaterial({color:0xe4e6f2,roughness:.8,metalness:0,emissive:0x1b1633,emissiveIntensity:1,transparent:false,opacity:1});
S.add(new THREE.HemisphereLight(0xb4bcff,0x120c24,1.0));const fLight=new THREE.DirectionalLight(0xeeeaff,1.2);fLight.position.set(1.5,4,3);S.add(fLight);
const fPt=new THREE.PointLight(0x8b5cf6,1.6,8);S.add(fPt);let lastFB=0;
function loadFig(){setP('h',.2);fetch(MPA.glb2).then(r=>{if(!r.ok)throw new Error(r.status);return r.arrayBuffer()}).then(ab=>setTimeout(()=>new THREE.GLTFLoader().parse(ab,'',g=>{let geo;g.scene.traverse(o=>{if(o.isMesh&&!geo)geo=o.geometry});if(geo)buildFig(geo);setP('h',1);warm()},e=>{setP('h',1);warm()}),30)).catch(e=>{setP('h',1);warm()})}
const FB={q:0,zk:0,uBk:{value:0},uHc:{value:new THREE.Vector3(-.004,-.092,.607)},uHr:{value:.384}};
let BRG=null,hb=null,hbMat=null,BTM=0,looping=false;const headMark=new THREE.Object3D(),HW=new THREE.Vector3(),FD=new THREE.Vector3(),FT=new THREE.Vector3(),FOOT=document.getElementById('footer'),FMSG=document.getElementById('fmsg'),FADE=document.getElementById('fade'),FBIG=document.querySelector('.fbig'),CARDS=[...document.querySelectorAll('.card')],CSIDE=[-1,1,-1];let FOX=0;
figMat.side=THREE.DoubleSide;
figMat.onBeforeCompile=sh=>{sh.uniforms.uBk=FB.uBk;sh.uniforms.uHc=FB.uHc;sh.uniforms.uHr=FB.uHr;
sh.vertexShader=sh.vertexShader.replace('#include <common>',`#include <common>
attribute vec3 tc;uniform float uBk;uniform vec3 uHc;uniform float uHr;varying vec3 vL;varying float vHm;
float hh3(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
float gE=0.;float gAng=0.;vec3 gCen=vec3(0.);vec3 gDir=vec3(0.);vec3 gRr=vec3(0.);`)
.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
vL=position;vHm=step(length(tc-uHc),uHr*1.08);
if(vHm>.5&&uBk>.001){vec3 cell=floor((tc-uHc)/.11);gRr=vec3(hh3(cell),hh3(cell+7.1),hh3(cell+13.3));gE=clamp((uBk-.28-gRr.x*.4)/.4,0.,1.);gCen=(cell+.5)*.11+uHc;gDir=normalize(gCen-uHc+(gRr-.5)*.5+vec3(1e-4));gAng=gE*gE*(gRr.y-.5)*6.;float cs0=cos(gAng),sn0=sin(gAng);objectNormal.xy=mat2(cs0,-sn0,sn0,cs0)*objectNormal.xy;}`)
.replace('#include <begin_vertex>',`#include <begin_vertex>
if(vHm>.5&&gE>0.){float cs1=cos(gAng),sn1=sin(gAng);vec3 q1=transformed-gCen;q1.xy=mat2(cs1,-sn1,sn1,cs1)*q1.xy;transformed=gCen+q1*(1.-smoothstep(.55,1.,gE)*.65)+gDir*gE*gE*(.35+gRr.z*1.4);}`);
sh.fragmentShader=sh.fragmentShader.replace('#include <common>',`#include <common>
uniform float uBk;uniform vec3 uHc;uniform float uHr;varying vec3 vL;varying float vHm;
vec3 h33(vec3 p){p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));return fract(sin(p)*43758.5453);}
vec3 wor(vec3 p){vec3 i=floor(p),f=fract(p);float d1=9.,d2=9.,id=0.;
for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)for(int z=-1;z<=1;z++){vec3 g=vec3(float(x),float(y),float(z));vec3 o=h33(i+g);vec3 r=g+o-f;float d=dot(r,r);
if(d<d1){d2=d1;d1=d;id=o.x;}else if(d<d2){d2=d;}}
return vec3(sqrt(d1),sqrt(d2),id);}
vec2 crackf(vec3 L,float dt){float ck=0.,rim=0.;
if(dt>.04){vec3 pp=L*4.2+sin(L.yzx*5.)*.16;vec3 w=wor(pp);float eg=w.y-w.x;float open=clamp(dt*1.5-w.z*.9,0.,1.);float wd=open*.26;
float c1=step(eg,wd);ck=c1;rim=smoothstep(wd+.07,wd,eg)*step(.001,open)*(1.-c1);
if(dt>.35){vec3 p2=L*9.5+sin(L.zxy*8.)*.12;vec3 w2=wor(p2);float e2=w2.y-w2.x;float o2=clamp((dt-.35)*1.7-w2.z*.7,0.,1.);float wd2=o2*.16;float c2=step(e2,wd2);
ck=max(ck,c2);rim=max(rim,smoothstep(wd2+.05,wd2,e2)*step(.001,o2)*(1.-c2));}}
return vec2(ck,rim);}
`)
.replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>
float rimK=0.;if(vHm>.5&&uBk>.02){vec2 ck=crackf((vL-uHc)/uHr*.9,clamp(uBk*2.4,0.,1.));if(ck.x>.5)discard;rimK=ck.y;}`)
.replace('#include <dithering_fragment>',`gl_FragColor.rgb+=vec3(.75,.62,1.)*rimK*.9;
#include <dithering_fragment>`)};
function buildFig(geo){geo.computeVertexNormals();geo=geo.toNonIndexed();const pa=geo.attributes.position.array,tA=new Float32Array(pa.length);
for(let i=0;i<pa.length;i+=9){const cx=(pa[i]+pa[i+3]+pa[i+6])/3,cy=(pa[i+1]+pa[i+4]+pa[i+7])/3,cz=(pa[i+2]+pa[i+5]+pa[i+8])/3;for(let j=0;j<9;j+=3){tA[i+j]=cx;tA[i+j+1]=cy;tA[i+j+2]=cz}}
geo.setAttribute('tc',new THREE.BufferAttribute(tA,3));
const m=new THREE.Mesh(geo,figMat);m.scale.setScalar(.9);m.frustumCulled=false;figIn.add(m);figIn.rotation.x=-Math.PI/2;
headMark.position.copy(FB.uHc.value);m.add(headMark);
}
function loopHome(){if(looping)return;looping=true;FADE.style.opacity=1;FADE.style.pointerEvents='auto';
setTimeout(()=>{scrollTo({top:0,behavior:'instant'});DV=0;E=0;sp=0;sc=6.9;FB.q=0;FB.zk=0;FB.uBk.value=0;BTM=0;setTimeout(()=>{FADE.style.opacity=0;FADE.style.pointerEvents='none';looping=false},350)},950)}
const atEnd=()=>scrollY+innerHeight>=document.documentElement.scrollHeight-3,dwell=()=>BTM&&performance.now()-BTM>1400;
addEventListener('wheel',e=>{if(!MAPOPEN&&e.deltaY>8&&atEnd()&&dwell())loopHome()},{passive:true});
let ty0=0;addEventListener('touchstart',e=>{ty0=e.touches[0].clientY},{passive:true});addEventListener('touchmove',e=>{if(!MAPOPEN&&atEnd()&&dwell()&&ty0-e.touches[0].clientY>50)loopHome()},{passive:true});
addEventListener('keydown',e=>{if(!MAPOPEN&&['ArrowDown','PageDown','End',' '].includes(e.key)&&atEnd()&&dwell())loopHome()});
document.getElementById('toTop').onclick=loopHome;
const CIO=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('in',e.isIntersecting)),{threshold:.2,rootMargin:'0px 0px -8% 0px'});document.querySelectorAll('.card').forEach(c=>CIO.observe(c));
const PROGI=document.querySelector('#prog i');
/* ===== mapa-múndi: botão com globo + seção "Saúde mental por região" ===== */
const GEO_ROWS=["....................................................................................................................................................................................", ".................................................00000000000000000000000000000......................................................................................................", "..............................................0000000000000000000000000000000000....................................................................................................", "........................................................0000000000000000000000000...................................................................................................", ".............................................................00000000000000000000....................................................222222222222...................................", ".................................................00...........000000000000000000..................................................222222222222222222................................", "................................000000........000000000.......00000000000000000............................................2222222222222222222222222222222222222222222..............", ".......0000000000000000000000000.............00000000000.......00000000000000.....................222222222.................22222222222222222222222222222222222222222222222222222222", "......0000000000000000000000000000000000000000000000000000.....0000000000........................2222222222222..22222222222222222222222222222222222222222222222222222222222222222222", "......0000000000000000000000000000000000000000000..0000000......000000........22222............222222222222...2222222222222222222222222222222222222222222222222222222222222222222222", ".......0000000000000000000000000000000000000000000...............0000.........................2222222222222222222222222222222222222222222222222222222222222222222222222222222222222.", "........00000000000000000000000000000000000000.....00..............00.......................222222...222222222222222222222222222222222222222222222222222222222222222222222.222222...", "..........00000......0000000000000000000000........0000000...................................222222...22222222222222222222222222222222222222222222222222222222222........22.........", "..........0............00000000000000000000........00000000............................22.....2.22...22222222222222222222222222222222222222222222222222222222222........222.........", "........................00000000000000000000000....000000000...........................22.....2.....2222222222222222222222222222222222222222222222222222222222..........22..........", "..........................00000000000000000000000.00000000000........................22.222.22222222222222222222222222222222222222222222222222222222222222222222........2...........", "...........................000000000000000000000000000000000000.........................222222222222222222222222555555555555555555555555666666666666666666666666....................", "............................00000000000000000000000000000000000..........................22222222222222222222222555555555555555555555555666666666666666666666666....................", "............................00000000000000000000000000000000..00.........................2222222222222222222222255555555555555555555555566666666666666666666666.....................", "............................00000000000000000000000000000................................2222222.22222222..2..225...555555555555555555556666666666666666666666......................", "............................000000000000000000000000000..............................222222....22..22222.......255..5555555555555555555566666666666666666666....66..................", "............................00000000000000000000000000...............................222222.....22..222333333333333.333333555555555555556666666666666666666.........................", "............................0000000000000000000000000................................22222........2.22.333333333333..33333555555555555556666666666666....6......6...................", ".............................00000000000000000000000.................................2222...............33333333333333333355555555555555666666666666666..6.....66...................", ".............................00000000000000000000000...................................33333333.............333333333333335555555555555566666666666666...6..666.....................", "...............................00000000000000000000...................................333333333.............333333333333335555555555555566666666666666.....6........................", "................................110000000000000000...................................33333333333333.3333...33333333333333355555555555555666666666666666.............................", "................................1.111000000.....00...................................33333333333333333333333333333.333333355555555555555666666666666666.............................", ".................................1.1111100.......0.................................333333333333333333333333.3333333.3333335555555555555566666666666666..............................", "....................................11111..........................................333333333333333333333333.33333333.3.....55555555555556666666666666...............................", ".....................................1111.........................................33333333333333333333333333.3333333333.....555555555555666666666666..6.............................", ".....................................11111...1....11.............................333333333333333333333333333..333333333......555555555..66666666....................................", "......................................1111...1........11.........................3333333333333333333333333333.33333333.........555555....666666.....................................", "........................................111111...................................44444444444444444444444444444.333333..........5555......6666666......6.............................", "...........................................11111.................................44444444444444444444444444444.3333............555.........66666......6.............................", "...............................................1..................................44444444444444444444444444444.3...............55.........6.666.......6............................", "...............................................1.....111..........................444444444444444444444444444444.44.............55.........6..66....................................", "................................................11..1111111........................44444444444444444444444444444444.............5..........6..6.....................................", "...................................................11111111111......................4444444444444444444444444444444...............5........66..........66...........................", "...................................................1111111111111......................4......444444444444444444444..........................6......66...............................", "...................................................1111111111111...............................444444444444444444.........................666.....666...............................", "..................................................111111111111111..............................44444444444444444...........................66...66666.66............................", "..................................................11111111111111111............................4444444444444444.............................66..66666.6.............................", ".................................................11111111111111111111...........................44444444444444..............................666..666..6......666....................", ".................................................1111111111111111111111.........................44444444444444................................6......66.......66....................", "..................................................1111111111111111111111........................4444444444444..................................666.............677.7................", "..................................................1111111111111111111111.........................4444444444444.....................................................7................", "...................................................111111111111111111111........................44444444444444......................................................................", "....................................................1111111111111111111.........................44444444444444....4........................................777...7..................", "....................................................111111111111111111..........................44444444444444...44......................................77777...77.................", ".....................................................11111111111111111...........................444444444444...444.....................................7777777..77.................", "......................................................1111111111111111..........................444444444444....444...................................7777777777777.................", ".......................................................111111111111111...........................44444444444....44..................................7777777777777777................", ".......................................................11111111111111............................44444444444....44.................................777777777777777777...............", ".......................................................111111111111..............................4444444444.....4..................................7777777777777777777..............", ".......................................................11111111111...............................444444444.........................................77777777777777777777.............", ".......................................................1111111111.................................44444444.........................................77777777777777777777.............", "......................................................11111111111.................................4444444..........................................77777777777777777777.............", "......................................................1111111111...................................44444...........................................777777....777777777..............", "......................................................1111111..................................................................................................7777777..........7...", ".....................................................11111111...................................................................................................77777............7..", ".....................................................111111......................................................................................................................77.", ".....................................................11111......................................................................................................................77..", ".....................................................1111..........................................................................................................7...........7....", ".....................................................1111.....................................................................................................................7.....", "....................................................11111...........................................................................................................................", ".....................................................111............................................................................................................................", ".....................................................11.............................................................................................................................", "......................................................11............................................................................................................................", "...................................................................................................................................................................................."];
const REG=[
{id:'AN',n:'América do Norte',ex:'Estados Unidos, Canadá, Groenlândia'},
{id:'LAC',n:'América Latina e Caribe',ex:'Brasil, México, Argentina, Colômbia, Chile, Cuba'},
{id:'EUR',n:'Europa',ex:'Alemanha, França, Reino Unido, Espanha, Rússia'},
{id:'MENA',n:'Oriente Médio e Norte da África',ex:'Egito, Arábia Saudita, Irã, Turquia, Marrocos'},
{id:'ASS',n:'África Subsaariana',ex:'Nigéria, Etiópia, África do Sul, Quênia, Angola'},
{id:'ACS',n:'Ásia Central e do Sul',ex:'Índia, Paquistão, Bangladesh, Cazaquistão, Afeganistão'},
{id:'LSE',n:'Leste e Sudeste Asiático',ex:'China, Japão, Indonésia, Vietnã, Filipinas'},
{id:'OCE',n:'Oceania',ex:'Austrália, Nova Zelândia, Papua-Nova Guiné'}];
const IND=[
{id:'depressao',n:'Carga de depressão',d:'Quanto a depressão pesa na população de cada região.',src:'OMS (Global Health Observatory) e IHME (Global Burden of Disease)',pol:'Cor mais clara = maior carga'},
{id:'tratamento',n:'Acesso ao cuidado',d:'Parcela das pessoas com necessidade que consegue tratamento.',src:'OMS (Mental Health Atlas) e pesquisas nacionais de saúde',pol:'Cor mais clara = maior acesso'},
{id:'profissionais',n:'Profissionais de saúde mental',d:'Disponibilidade de profissionais de saúde mental por habitante.',src:'OMS (Mental Health Atlas)',pol:'Cor mais clara = mais profissionais'}];
/* valores arbitrários, só para validar o layout: NÃO são dados reais */
const DEMO={depressao:{AN:62,LAC:41,EUR:77,MENA:35,ASS:58,ACS:49,LSE:68,OCE:30},tratamento:{AN:44,LAC:71,EUR:52,MENA:29,ASS:63,ACS:80,LSE:38,OCE:57},profissionais:{AN:47,LAC:63,EUR:29,MENA:71,ASS:54,ACS:38,LSE:82,OCE:22}};
const FMT_EX='{\n  "versao": 1,\n  "indicadores": {\n    "depressao": {\n      "nome": "nome do indicador",\n      "unidade": "%",\n      "fonte": "fonte dos dados",\n      "ano": 0,\n      "valores": { "AN": null, "LAC": null, "EUR": null, "MENA": null,\n                   "ASS": null, "ACS": null, "LSE": null, "OCE": null }\n    }\n  }\n}\n\nIds aceitos: depressao, tratamento, profissionais.\nUse null onde não houver dado.';
let MAPOPEN=false;
const MS={ind:0,sel:-1,hov:-1,real:null,t0:0,op:false,cell:1,hv:new Float32Array(8),rc:[]};
const $m=id=>document.getElementById(id),mkEl=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e};
const OV=$m('mapov'),MCV=$m('mapCv'),mctx=MCV.getContext('2d'),TIP=$m('mapTip');
const DX=[],DY=[],DR=[],GRID=new Uint8Array(70*180);
GEO_ROWS.forEach((row,ri)=>{for(let ci=0;ci<180;ci++){const ch=row[ci];if(ch!=='.'){DX.push(ci);DY.push(ri);DR.push(+ch);GRID[ri*180+ci]=+ch+1}}});
const RAMP=[[34,24,76],[92,58,190],[155,120,250],[214,196,255],[255,232,250]];
const ramp=u=>{u=Math.max(0,Math.min(1,u));const k=u*(RAMP.length-1),i=Math.min(RAMP.length-2,Math.floor(k)),f=k-i,a=RAMP[i],b=RAMP[i+1];return[(a[0]+(b[0]-a[0])*f)|0,(a[1]+(b[1]-a[1])*f)|0,(a[2]+(b[2]-a[2])*f)|0]};
const indData=ii=>MS.real&&MS.real[IND[ii].id]||null;
const valOf=(ii,ri)=>{if(MS.real){const d=indData(ii),v=d&&d.valores?d.valores[REG[ri].id]:null;return typeof v==='number'&&isFinite(v)?v:null}return DEMO[IND[ii].id][REG[ri].id]};
const rangeOf=ii=>{if(!MS.real)return[0,100];const vs=REG.map((_,r)=>valOf(ii,r)).filter(v=>v!==null);if(!vs.length)return[0,1];const lo=Math.min(...vs),hi=Math.max(...vs);return[lo,hi===lo?lo+1:hi]};
const fmtV=(ii,ri)=>{const v=valOf(ii,ri);if(v===null)return'sem dados';if(!MS.real)return Math.round(v)+'/100';const d=indData(ii),n=v.toLocaleString('pt-BR',{maximumFractionDigits:2});return d&&d.unidade?n+' '+d.unidade:n};
function recompute(){const[lo,hi]=rangeOf(MS.ind);MS.rc=REG.map((_,r)=>{const v=valOf(MS.ind,r);return v===null?null:ramp((v-lo)/(hi-lo))});
const ind=IND[MS.ind],d=indData(MS.ind);$m('mapDesc').textContent=ind.d;
$m('mapLegN').textContent=ind.pol+(MS.real&&d?' · '+(d.fonte||'')+(d.ano?' · '+d.ano:''):' · escala demonstrativa 0–100');
const b=$m('mapBan');b.classList.toggle('real',!!MS.real);b.textContent='';
if(MS.real){b.append(mkEl('b','','Dados importados'),mkEl('span','','valores carregados do arquivo local · nada é enviado a servidores'))}
else b.append(mkEl('b','','Dados demonstrativos'),mkEl('span','','valores ilustrativos para validar o layout. Nenhum número aqui é estatística real.'));
$m('mapRst').hidden=!MS.real;renderPanel();document.querySelectorAll('.mo-tab').forEach((t,i)=>t.setAttribute('aria-selected',i===MS.ind))}
function buildTabs(){const w=$m('mapTabs');w.textContent='';IND.forEach((ind,i)=>{const b=mkEl('button','mo-tab');b.type='button';b.setAttribute('role','tab');const s=mkEl('small','','0'+(i+1));b.append(s,document.createTextNode(ind.n));b.onclick=()=>{MS.ind=i;recompute()};w.append(b)})}
function selReg(r){MS.sel=r;renderPanel()}
function renderPanel(){const P=$m('mapPanel');P.textContent='';const ii=MS.ind,ind=IND[ii],d=indData(ii),[lo,hi]=rangeOf(ii);
if(MS.sel<0){P.append(mkEl('p','mp-hint','Selecione uma região no mapa ou na lista abaixo para ver o indicador.'))}
else{const r=MS.sel,top=mkEl('div');top.append(mkEl('h3','mp-name',REG[r].n));const v=mkEl('div','mp-val',fmtV(ii,r));v.append(mkEl('small','',MS.real?(d&&d.nome?d.nome:ind.n):'índice demonstrativo · '+ind.n));top.append(v);P.append(top)}
const rk=mkEl('div','mp-sec');rk.append(mkEl('h4','','Comparação entre regiões'));const list=mkEl('div','mp-rank');
REG.map((x,i)=>({i,v:valOf(ii,i)})).sort((a,b)=>(b.v===null)-(a.v===null)||b.v-a.v).forEach(o=>{const b=mkEl('button','mp-row'+(o.i===MS.sel?' on':''));b.type='button';b.append(mkEl('span','',REG[o.i].n));const bar=mkEl('i');const f=mkEl('b');f.style.width=(o.v===null?0:Math.max(3,(o.v-lo)/(hi-lo)*100))+'%';bar.append(f);const w=mkEl('span');w.append(bar);b.append(w);b.onclick=()=>selReg(o.i);b.onpointerenter=()=>{MS.hov=o.i};b.onpointerleave=()=>{MS.hov=-1};list.append(b)});rk.append(list);P.append(rk);
if(MS.sel>=0){const a=mkEl('div','mp-sec');a.append(mkEl('h4','','Países e territórios (exemplos)'),mkEl('p','',REG[MS.sel].ex));P.append(a)}
const s=mkEl('div','mp-sec');s.append(mkEl('h4','','Fonte'),mkEl('p','',MS.real&&d?(d.fonte||'não informada')+(d.ano?' · '+d.ano:''):'Aguardando integração. Fontes recomendadas para dados reais: '+ind.src+'.'));P.append(s);
P.append(mkEl('p','sm','Macrorregiões aproximadas; as fronteiras são simplificadas.'))}
function sizeMap(){const w=MCV.parentElement.clientWidth||600,d=Math.min(devicePixelRatio||1,2);MCV.style.width=w+'px';MCV.style.height=(w*70/180)+'px';MCV.width=Math.round(w*d);MCV.height=Math.round(w*70/180*d);MS.cell=MCV.width/180}
function drawMap(now){if(!MS.op)return;requestAnimationFrame(drawMap);const c=MS.cell,W=MCV.width,H=MCV.height,x=mctx;x.clearRect(0,0,W,H);
x.strokeStyle='rgba(196,181,253,.07)';x.lineWidth=1;x.beginPath();for(let lo=-150;lo<=150;lo+=30){const px=(lo+180)/2*c;x.moveTo(px,0);x.lineTo(px,H)}for(let la=-30;la<=60;la+=30){const py=((83-la)/2+.5)*c;x.moveTo(0,py);x.lineTo(W,py)}x.stroke();
for(let r=0;r<8;r++){const tg=Math.min(1,(r===MS.hov?1:0)+(r===MS.sel?.65:0));MS.hv[r]+=(tg-MS.hv[r])*.18}
const t=(now-MS.t0)/1000;
for(let i=0;i<DX.length;i++){const ci=DX[i],ri=DY[i],r=DR[i],p=Math.min(1,Math.max(0,t*1.1-(ci/180*.55+ri/70*.35)));if(p<=0)continue;const e=1-Math.pow(1-p,3),hv=MS.hv[r],col=MS.rc[r],rad=c*.36*e*(1+.3*hv),px=(ci+.5)*c,py=(ri+.5)*c;
if(col){x.fillStyle='rgb('+((col[0]+(255-col[0])*.45*hv)|0)+','+((col[1]+(255-col[1])*.4*hv)|0)+','+((col[2]+(255-col[2])*.25*hv)|0)+')';x.beginPath();x.arc(px,py,rad,0,6.283);x.fill()}
else{x.strokeStyle='rgba(150,150,170,'+(.35+.4*hv)+')';x.lineWidth=1;x.beginPath();x.arc(px,py,rad*.8,0,6.283);x.stroke()}}
if(!MS.real){x.save();x.translate(W/2,H*.5);x.rotate(-.12);x.fillStyle='rgba(217,164,65,.07)';x.font='900 '+((W*.11)|0)+'px "Big Shoulders Display",Impact,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('DEMONSTRATIVO',0,0);x.restore()}}
function regAt(ev){const rc=MCV.getBoundingClientRect(),x=(ev.clientX-rc.left)/rc.width*180,y=(ev.clientY-rc.top)/rc.height*70,ci=Math.floor(x),ri=Math.floor(y);
for(let d=0;d<=2;d++){let best=-1,bd=1e9;for(let dy=-d;dy<=d;dy++)for(let dx=-d;dx<=d;dx++){const cc=ci+dx,rr=ri+dy;if(cc<0||cc>=180||rr<0||rr>=70)continue;const g=GRID[rr*180+cc];if(g){const dd=(cc+.5-x)*(cc+.5-x)+(rr+.5-y)*(rr+.5-y);if(dd<bd){bd=dd;best=g-1}}}if(best>=0)return best}return-1}
MCV.addEventListener('pointermove',e=>{const r=regAt(e);MS.hov=r;MCV.style.cursor=r>=0?'pointer':'default';if(r<0){TIP.hidden=true;return}const bx=MCV.parentElement.getBoundingClientRect();TIP.hidden=false;TIP.textContent=REG[r].n+' · '+fmtV(MS.ind,r)+(MS.real?'':' (demo)');TIP.style.left=Math.min(bx.width-TIP.offsetWidth-4,e.clientX-bx.left+14)+'px';TIP.style.top=Math.max(0,e.clientY-bx.top-38)+'px'});
MCV.addEventListener('pointerleave',()=>{MS.hov=-1;TIP.hidden=true});
MCV.addEventListener('click',e=>{const r=regAt(e);if(r>=0)selReg(r)});
function openMap(ox,oy){if(MS.op)return;MS.op=true;OV.style.setProperty('--ox',ox+'px');OV.style.setProperty('--oy',oy+'px');OV.classList.add('open');OV.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';sizeMap();MS.t0=performance.now();recompute();requestAnimationFrame(drawMap);setTimeout(()=>{if(MS.op)MAPOPEN=true},980);$m('mapX').focus({preventScroll:true})}
function closeMap(){if(!MS.op)return;MS.op=false;MAPOPEN=false;OV.classList.remove('open');OV.setAttribute('aria-hidden','true');document.body.style.overflow='';$m('gcard').focus({preventScroll:true})}
$m('mapX').onclick=closeMap;$m('navMap').addEventListener('click',e=>{e.preventDefault();const r=e.currentTarget.getBoundingClientRect();openMap(r.left+r.width/2,r.top+r.height/2)});
addEventListener('keydown',e=>{if(!MS.op)return;if(e.key==='Escape'){closeMap();return}if(e.key==='Tab'){const f=[...OV.querySelectorAll('button,summary,label.mo-file,[tabindex]')].filter(n=>!n.hidden&&n.offsetParent!==null);if(!f.length)return;const a=document.activeElement,i=f.indexOf(a);if(e.shiftKey&&(i<=0)){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
addEventListener('resize',()=>{if(MS.op)sizeMap()});
/* importar dados reais (arquivo local) */
function importData(txt){const msg=$m('mapMsg');try{const j=JSON.parse(txt);if(!j||j.versao!==1||typeof j.indicadores!=='object')throw new Error('formato inválido (versao 1 + indicadores)');const out={};let n=0;
IND.forEach(ind=>{const s=j.indicadores[ind.id];if(!s||typeof s.valores!=='object')return;const vals={};let any=false;REG.forEach(r=>{const v=s.valores[r.id];if(v===null||v===undefined)vals[r.id]=null;else if(typeof v==='number'&&isFinite(v)){vals[r.id]=v;any=true}else throw new Error('valor inválido em '+ind.id+'.'+r.id)});
const str=(x,m)=>typeof x==='string'?x.slice(0,m):'';const ano=Number.isInteger(s.ano)&&s.ano>1900&&s.ano<2101?s.ano:0;out[ind.id]={nome:str(s.nome,80),unidade:str(s.unidade,16),fonte:str(s.fonte,140),ano,valores:vals};if(any)n++});
if(!n)throw new Error('nenhum indicador com valores numéricos');MS.real=out;msg.textContent='Dados carregados: '+n+' indicador(es).';recompute()}catch(err){msg.textContent='Não foi possível ler o arquivo: '+err.message}}
$m('mapFile').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;if(f.size>500000){$m('mapMsg').textContent='Arquivo grande demais (máx. 500 KB).';return}const r=new FileReader();r.onload=()=>importData(String(r.result));r.readAsText(f);e.target.value=''});
$m('mapRst').onclick=()=>{MS.real=null;$m('mapMsg').textContent='Voltou aos valores demonstrativos.';recompute()};
$m('mapFmt').textContent=FMT_EX;buildTabs();
/* botão com globo girando */
const gcard=$m('gcard'),GCV=$m('gcv'),gctx=GCV.getContext('2d'),GPAL=['#8ec5ff','#ffb27a','#c79bff','#ff8fb3','#8be0a9','#ffe27a','#7ae8e8','#eeeaff'];
let gAng=0,gHover=false;const GP=[];
{const N=3800,ga=Math.PI*(3-Math.sqrt(5));for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,r=Math.sqrt(1-y*y),th=ga*i,lat=Math.asin(y)*180/Math.PI,lon=Math.atan2(Math.sin(th)*r,Math.cos(th)*r)*180/Math.PI,row=Math.round((83-lat)/2),col=Math.max(0,Math.min(179,Math.round((lon+179)/2)));if(row<0||row>=70)continue;const ch=GEO_ROWS[row][col];if(ch!=='.')GP.push([lon*Math.PI/180,lat*Math.PI/180,+ch])}}
function gsize(){const d=Math.min(devicePixelRatio||1,2),s=GCV.clientWidth||96;GCV.width=GCV.height=Math.round(s*d)}gsize();addEventListener('resize',gsize);
const TX=Math.cos(.42),TY=Math.sin(.42);
function drawGlobe(){const s=GCV.width,c=s/2,R=c-5,x=gctx;x.clearRect(0,0,s,s);
const g=x.createRadialGradient(c*.78,c*.7,R*.05,c,c,R);g.addColorStop(0,'rgba(74,48,150,.6)');g.addColorStop(1,'rgba(10,8,24,.92)');x.fillStyle=g;x.beginPath();x.arc(c,c,R,0,6.283);x.fill();
x.strokeStyle=gHover?'rgba(214,196,255,.9)':'rgba(196,181,253,.5)';x.lineWidth=1.2*s/96;x.stroke();
const sz=Math.max(1.3,s/60);
for(let i=0;i<GP.length;i++){const p=GP[i],L=p[0]+gAng,cl=Math.cos(p[1]),px=cl*Math.sin(L),py=Math.sin(p[1]),pz=cl*Math.cos(L),y2=py*TX-pz*TY,z2=py*TY+pz*TX;if(z2<0)continue;
x.fillStyle=gHover?GPAL[p[2]]:'#c4b5fd';x.globalAlpha=.25+.75*z2;const q=sz*(.6+.55*z2);x.fillRect(c+px*R-q/2,c-y2*R-q/2,q,q)}
x.globalAlpha=1;const h=x.createLinearGradient(0,0,s,s);h.addColorStop(0,'rgba(255,255,255,.14)');h.addColorStop(.5,'rgba(255,255,255,0)');x.fillStyle=h;x.beginPath();x.arc(c,c,R,0,6.283);x.fill()}
gcard.addEventListener('pointerenter',()=>{gHover=true});
gcard.addEventListener('pointermove',e=>{const r=gcard.getBoundingClientRect();gcard.style.setProperty('--ry',(((e.clientX-r.left)/r.width-.5)*16)+'deg');gcard.style.setProperty('--rx',(-((e.clientY-r.top)/r.height-.5)*16)+'deg')});
gcard.addEventListener('pointerleave',()=>{gHover=false;gcard.style.setProperty('--rx','0deg');gcard.style.setProperty('--ry','0deg')});
gcard.onclick=()=>{const r=gcard.getBoundingClientRect();openMap(r.left+r.width/2,r.top+r.height/2)};
let gLast=performance.now();(function gloop(now){requestAnimationFrame(gloop);const dt=Math.min(.05,(now-gLast)/1000);gLast=now;if(MS.op||document.hidden||document.body.classList.contains('lock'))return;gAng+=dt*(gHover?1.6:.42);drawGlobe()})(performance.now());
/* câmera por seção */

const KF=[[0,6.9,.65,0],[.9,4.3,.4,-.6],[-.7,5,-.2,.9],[.35,4.6,.3,-.5]];
const secs=['home','cidade','bem-estar','apoio'].map(id=>document.getElementById(id));
let moved2=false,lastB=0,bi=0,DV=0,moved=false,lastR=0,lastA=0,E=0,sp=0,sc=0,focus=-1,fT=0,ptr=new THREE.Vector2(0,0),pdx=0,pdy=0,overUI=false,hov=-1;
const ray=new THREE.Raycaster(),links=[...document.querySelectorAll('nav a')];
function resize(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.fov=w/h<.8?58:38;cam.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
addEventListener('pointermove',e=>{moved=true;moved2=true;ptr.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);overUI=e.target!==cv&&!!e.target.closest('.card,header')});
function pick(i){focus=i;fT=performance.now();document.querySelectorAll('.chip').forEach((c,j)=>c.setAttribute('aria-pressed',j===i));showInfo(i)}
addEventListener('click',e=>{if(e.target!==cv||hov<0)return;pick(hov);document.getElementById('cidade').scrollIntoView({behavior:RM?'auto':'smooth'})});
const lerp=(a,b,t)=>a+(b-a)*t,ss=t=>t*t*(3-2*t);
function scrollP(){const m=secs.map(s=>s.getBoundingClientRect().top+scrollY);const y=scrollY+innerHeight*.5;let i=0;for(let k=0;k<m.length;k++)if(y>=m[k])i=k;const nx=Math.min(i+1,3),a=m[i],b=m[nx]||a+1;return{i,nx,t:i===nx?0:Math.min(1,Math.max(0,(y-a)/(b-a)))}}
const $cr=$('#cr'),$hint=$('#hint');const clock=new THREE.Clock();let sec=0;
function frame(){requestAnimationFrame(frame);if(MAPOPEN)return;const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;U.uT.value=RM?0:t;const bt=t%1.5,pl=RM?.2:Math.exp(-bt*9)+(bt>.3?.6*Math.exp(-(bt-.3)*9):0);U.uP.value=pl;if(AU.lp)AU.lp.frequency.value=380+E*1100;
const s=scrollP();const A=KF[s.i],B=KF[s.nx],k=s.i===0?ss(Math.min(1,Math.max(0,(scrollY/innerHeight-2.3)/.5))):ss(s.t);const eT=Math.min(1,Math.max(0,scrollY/(innerHeight*1.5)));E=RM?eT:lerp(E,eT,.08);U.uE.value=E;
let a=lerp(A[0],B[0],k),r=lerp(A[1],B[1],k),y=lerp(A[2],B[2],k),lx=lerp(A[3],B[3],k);
if(innerWidth<760){lx=0;y+=.5;r*=1.2}
if(focus>=0&&s.i===1){a=(focus-2.5)*.28;r=4.3}
if(s.i===0)r-=E*.6;const dvT=Math.min(1,Math.max(0,(scrollY/innerHeight-1.5)/.8));DV=RM?dvT:lerp(DV,dvT,.06);const dd2=DV*DV*(3-2*DV);y=lerp(y,-4.4+y*.5,dd2);y-=Math.max(0,scrollY/innerHeight-2.3)*1.0*dd2;const ly=lerp(-.3,y+1,dd2);sp=lerp(sp,a,RM?1:.05);sc=lerp(sc,r,RM?1:.05);
pdx=lerp(pdx,ptr.x,.05);pdy=lerp(pdy,ptr.y,.05);
cam.position.set(Math.sin(sp)*sc+pdx*.35,y+pdy*.2,Math.cos(sp)*sc);cam.lookAt(lx*.6,ly,0);const uwf=Math.min(1,Math.max(0,(WY+.2-cam.position.y)/1.5));
brain.scale.setScalar(1+.022*U.uP.value);brain.rotation.y=RM?0:t*.08+pdx*.25;brain.rotation.x=RM?0:Math.sin(t*.3)*.04+pdy*.08;brain.position.y=RM?0:Math.sin(t*.7)*.04;mirror.rotation.copy(brain.rotation);mirror.position.y=2*WY-brain.position.y;mirror.scale.set(brain.scale.x,-brain.scale.y,brain.scale.z);mirror.visible=brain.visible;core.material.opacity=(.3+.4*U.uP.value+.5*U.uH.value)*(1-Math.min(1,E*3));
ray.setFromCamera(ptr,cam);U.uO.value.copy(ray.ray.origin);U.uD.value.copy(ray.ray.direction);
const hit=!overUI&&ray.ray.distanceToPoint(new THREE.Vector3(0,0,0))<.95;
U.uH.value=lerp(U.uH.value,hit&&E<.2?1:0,hit?.12:.06);brain.visible=E<.995;
const hp=overUI?[]:ray.intersectObjects(panels.filter(p=>p.visible));hov=hp.length?hp[0].object.userData.i:-1;cv.style.cursor=hov>=0?'pointer':hit?'crosshair':'default';
if(!RM){const tt0=U.uT.value;if(moved&&tt0-lastR>.06){moved=false;lastR=tt0;const o=ray.ray.origin,dd=ray.ray.direction;if(o.y>WY&&dd.y<-.002){const tt=(WY-o.y)/dd.y;if(tt<60){RP[rpi%24].set(o.x+dd.x*tt,o.z+dd.z*tt,tt0);rpi++;drop()}}}if(tt0-lastA>2.8){lastA=tt0;RP[rpi%24].set((Math.random()-.5)*8,(Math.random()-.5)*6,tt0);rpi++}}
{bubM.uniforms.uO2.value=uwf;bubs.visible=uwf>.02;if(uwf>.02){const pa2=bubG.attributes.position.array;if(!RM&&moved2&&t-lastB>.05){moved2=false;lastB=t;const o=ray.ray.origin,dr=ray.ray.direction;for(let q=0;q<3;q++){const i=(bi++)%BN;pa2[i*3]=o.x+dr.x*5.5+(Math.random()-.5)*.6;pa2[i*3+1]=o.y+dr.y*5.5+(Math.random()-.5)*.6;pa2[i*3+2]=o.z+dr.z*5.5+(Math.random()-.5)*.6;bv[i]=.5+Math.random()*.6}drop()}
for(let i=0;i<BN;i++){pa2[i*3+1]+=bv[i]*dt;pa2[i*3]+=Math.sin(t*1.3+i)*.002;if(pa2[i*3+1]>Math.min(WY,cam.position.y+8)){pa2[i*3]=(Math.random()-.5)*16;pa2[i*3+1]=cam.position.y-9-Math.random()*3;pa2[i*3+2]=-9+Math.random()*15}}bubG.attributes.position.needsUpdate=true}}
panels.forEach(m=>{const vs=ss(Math.min(1,Math.max(0,(E-.3)/.4)));m.visible=vs>.01;m.scale.setScalar(.4+.6*vs);const d=m.userData,u=m.material.uniforms;d.h=lerp(d.h,m.userData.i===hov||focus===d.i?1:0,.12);u.uH.value=RM?d.h*.3:d.h;d.r=lerp(d.r,d.rt,.04);u.uR.value=d.r;m.position.set(d.px*vs,d.base+(RM?0:Math.sin(t*.5+d.i)*.08),d.pz*vs)});
dust.rotation.y=RM?0:t*.01;glow.material.opacity=.3+.45*Math.min(1,E*1.6)+.1*U.uH.value;glow.scale.setScalar(6+E*4);glow.material.opacity*=1-uwf;R.setClearColor(CC.setRGB(lerp(.0196,.025,uwf),lerp(.0196,.03,uwf),lerp(.0353,.07,uwf)));UWE.style.opacity=uwf;haze.material.opacity=1-uwf*.9;beams.forEach(m=>{m.visible=false});dust.material.opacity=.5+.3*uwf;sky.position.copy(cam.position);{const u=sky.material.uniforms;u.uUw.value=uwf;u.uHor.value.setRGB(lerp(.065,.025,uwf),lerp(.058,.03,uwf),lerp(.1,.07,uwf));u.uTop.value.setRGB(lerp(.0196,.025,uwf),lerp(.0196,.03,uwf),lerp(.0353,.07,uwf))}mist.forEach((s,i)=>{s.material.opacity=.32*(1-uwf);s.position.x=Math.sin(t*.03+i*2)*14});
{const ca=Math.max(0,1-E*3);$cr.style.opacity=ca;$hint.style.opacity=ca;document.body.classList.toggle('home',E<.3)}links.forEach((l,i)=>l.classList.toggle('on',i===s.i&&s.t<.5||i===s.nx&&s.t>=.5));
{const vis=figIn.children.length>0&&dd2>.01;fig.visible=vis;
if(vis){const op=ss(Math.min(1,Math.max(0,(dd2-.05)/.4)));figMat.opacity=op;figMat.transparent=op<.999;
let oxv=0;CARDS.forEach((c,i)=>{const r=c.getBoundingClientRect(),cy2=(r.top+r.bottom)/2,v=Math.max(0,1-Math.abs(cy2-innerHeight/2)/(innerHeight*.62));oxv+=CSIDE[i]*v*v});
const dsk=innerWidth>=900;FOX=lerp(FOX,lerp(Math.max(-1,Math.min(1,oxv))*(dsk?1.25:0),dsk?1.9:0,FB.zk),.08);const ox=FOX;
const fx0=lx*.6-cam.position.x,fz0=-cam.position.z,fl2=Math.hypot(fx0,fz0)||1,fxn=fx0/fl2,fzn=fz0/fl2,DD=5.4,cy=cam.position.y+(ly-cam.position.y)*DD/fl2+(innerWidth<760?.7+FB.zk*.9:0);
const wx=cam.position.x+fxn*DD-fzn*ox,wz=cam.position.z+fzn*DD+fxn*ox,k2=ss(dd2);
fig.position.set(lerp(0,wx,k2),lerp(-3.2,cy,k2)+Math.sin(t*.9)*.12,lerp(.9,wz,k2));
fig.rotation.set((.12+Math.sin(t*.6)*.1)*(1-FB.zk),Math.atan2(fxn,fzn)+Math.sin(t*.35)*.7*(1-FB.zk),Math.PI*(.92+.08*FB.zk)+Math.sin(t*.42)*.14*(1-FB.zk),'YXZ');
fig.scale.setScalar((innerWidth<760?.75:1)*(1+.28*FB.zk));fPt.position.set(fig.position.x-fxn*2,fig.position.y+.6,fig.position.z-fzn*2);
if(uwf>.5&&t-lastFB>.16){lastFB=t;const pb=bubG.attributes.position.array,i=(bi++)%BN;pb[i*3]=fig.position.x+(Math.random()-.5)*.4;pb[i*3+1]=fig.position.y-.7;pb[i*3+2]=fig.position.z+.3;bv[i]=.5+Math.random()*.5;bubG.attributes.position.needsUpdate=true}}}
{const fr=FOOT.getBoundingClientRect(),qr=Math.min(1,Math.max(0,(innerHeight-fr.top)/fr.height));FB.q=lerp(FB.q,qr,.14);const qq=FB.q,zk=ss(Math.min(1,qq/.38));FB.zk=zk;FB.uBk.value=0;
if(hb){hb.visible=FB.uBk.value>.03&&fig.visible;if(hb.visible){hb.scale.setScalar(.28*(1+.05*U.uP.value+.3*ss((FB.uBk.value-.45)/.4)));hbMat.uniforms.uT.value=U.uT.value;hbMat.uniforms.uP.value=U.uP.value}}
const mk=ss(Math.min(1,Math.max(0,(qq-.55)/.2)));FMSG.style.opacity=mk;FMSG.style.transform='translate3d('+(-70*(1-mk))+'px,0,0)';FBIG.style.opacity=mk*.95;FBIG.style.transform='translateY('+(40*(1-mk))+'px)';
PROGI.style.transform='scaleX('+Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))+')';
if(atEnd()){if(!BTM)BTM=performance.now()}else BTM=0}
boltUpdate(t,dt,uwf);R.render(S,cam)}
let started=false;
function warm(){fig.visible=true;fig.position.set(0,0,0);setP('u',.3);requestAnimationFrame(()=>{try{R.compile(S,cam)}catch(e){}setP('u',.65);requestAnimationFrame(()=>{try{R.render(S,cam)}catch(e){}fig.visible=false;setP('u',1);const fin=()=>{if(LD.p.f>=1&&LD.p.m>=1)ready();else setTimeout(fin,200)};fin()})})}
function ready(){LL.textContent='tudo pronto';$('#load').classList.add('ready');$('#lgo').classList.remove('hide');$('#go1').focus()}
function go(snd){if(started)return;started=true;LD.live=true;BS.next=performance.now()+12000;$('#load').classList.add('leaving');setTimeout(()=>$('#load').classList.add('off'),460);document.body.classList.remove('lock');scrollTo(0,0);frame();if(snd)toggleMusic()}
{const g=$('#go1');g.addEventListener('pointermove',e=>{const r=g.getBoundingClientRect();g.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.3)+'px)'});g.addEventListener('pointerleave',()=>{g.style.transform=''})}
$('#go1').onclick=()=>go(true);$('#go0').onclick=()=>go(false);
})();
