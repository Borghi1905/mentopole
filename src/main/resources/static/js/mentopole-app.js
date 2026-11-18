(()=>{
const $=i=>document.getElementById(i),
API=window.MP_API_BASE??'/api',
K='mp_sessao';

const ROL={
    CIDADAO:'Cidadão',
    GESTOR:'Gestor',
    ADMINISTRADOR:'Administrador'
};

const MOD=[
    ['PRESENCIAL','Presencial'],
    ['VIRTUAL','Virtual'],
    ['HIBRIDA','Híbrida']
];

const ST={
    user:null,
    demo:false,
    tab:'territorio',
    opener:null
};

const h=(t,a,...k)=>{
    const e=document.createElement(t);

    for(const x in a||{}){
        const v=a[x];

        if(x==='class')e.className=v;
        else if(x.slice(0,2)==='on')e[x]=v;
        else if(v!==false&&v!=null)e.setAttribute(x,v===true?'':v);
    }

    k.flat(9).forEach(c=>
        c!=null&&e.append(
            c.nodeType?c:document.createTextNode(c)
        )
    );

    return e;
};

const S=(t,a,x)=>{
    const e=document.createElementNS(
        'http://www.w3.org/2000/svg',t
    );

    for(const k in a)e.setAttribute(k,a[k]);

    if(x!=null)e.textContent=x;

    return e;
};

const sget=()=>{
    try{
        return JSON.parse(
            localStorage.getItem(K)||
            sessionStorage.getItem(K)||
            'null'
        );
    }catch(e){
        return null;
    }
};

const sset=(s,keep)=>{
    try{
        localStorage.removeItem(K);
        sessionStorage.removeItem(K);

        if(s){
            (keep?localStorage:sessionStorage)
                .setItem(K,JSON.stringify(s));
        }
    }catch(e){}
};

const fd=s=>s?new Date(s).toLocaleDateString('pt-BR'):'—';

const emp=t=>h('div',{class:'emp'},t);

const sec=t=>h('h4',{class:'sec'},t);

const st=s=>h(
    'span',
    {class:'bd '+String(s).toLowerCase()},
    {
        PENDENTE:'Pendente',
        VALIDADO:'Validado',
        REJEITADO:'Rejeitado'
    }[s]||s
);

const errMsg=x=>
    (x&&x.message)||String(x);

const ops=(a,all)=>[
    h('option',{value:''},all),
    a.map(x=>h('option',{value:x.id},x.nome))
];

/* ---- Exemplos de demonstração ---- */

const DD={

'/categorias-problema':[
    'Saneamento básico',
    'Poluição sonora',
    'Insegurança alimentar',
    'Violência urbana',
    'Falta de infraestrutura'
].map((nome,i)=>({id:i+1,nome})),

'/regioes':[
    {id:1,nome:'Região de exemplo A'},
    {id:2,nome:'Região de exemplo B'}
],

'/indicadores':[
    {id:1,nome:'Índice de vulnerabilidade territorial',unidade:'%'},
    {id:2,nome:'Renda média',unidade:'R$'},
    {id:3,nome:'Cobertura de saneamento',unidade:'%'}
],

'/fontes':[
    {id:1,nome:'Fonte de exemplo'}
],

'/instituicoes':[
    {id:1,nome:'Instituição de exemplo'}
],

'/categorias-servico':[
    {id:1,nome:'Acolhimento'},
    {id:2,nome:'Atendimento psicológico'}
],

'/dados-territoriais':[
    {regiaoId:1,indicadorId:1,valor:30,fonte:'Fonte de exemplo',periodo:'2022'},
    {regiaoId:1,indicadorId:1,valor:35,fonte:'Fonte de exemplo',periodo:'2023'},
    {regiaoId:2,indicadorId:1,valor:50,fonte:'Fonte de exemplo',periodo:'2023'},
    {regiaoId:1,indicadorId:2,valor:2000,fonte:'Fonte de exemplo',periodo:'2023'}
],

'/servicos':[
    {
        id:1,
        nome:'Serviço de exemplo (presencial)',
        instituicao:'Instituição de exemplo',
        categoriaId:1,
        categoria:'Acolhimento',
        modalidade:'PRESENCIAL',
        endereco:'Endereço de exemplo, 100',
        regiaoId:1,
        regiao:'Região de exemplo A',
        telefone:'0000-0000',
        horario:'Seg a sex, 8h–17h'
    },
    {
        id:2,
        nome:'Serviço de exemplo (virtual)',
        instituicao:'Instituição de exemplo',
        categoriaId:2,
        categoria:'Atendimento psicológico',
        modalidade:'VIRTUAL',
        regiaoId:2,
        regiao:'Região de exemplo B',
        link:'https://exemplo.invalid'
    }
],

'/relatos':[
    {
        id:1,
        usuarioNome:'Cidadão de exemplo',
        categoria:'Poluição sonora',
        regiaoId:1,
        regiao:'Região de exemplo A',
        bairro:'Bairro X',
        cidade:'Cidade Y',
        descricao:'Relato de exemplo para validar o layout.',
        status:'PENDENTE',
        dataRegistro:'2025-01-10'
    },
    {
        id:2,
        usuarioNome:'Cidadão de exemplo',
        categoria:'Saneamento básico',
        regiaoId:2,
        regiao:'Região de exemplo B',
        bairro:'Bairro Z',
        cidade:'Cidade Y',
        descricao:'Outro relato de exemplo.',
        status:'VALIDADO',
        dataRegistro:'2025-01-12'
    }
]};

DD['/relatos/meus']=DD['/relatos'];

/* ---- Comunicação com o backend Java ---- */

/* ---- Adaptador front <-> backend Java (rotas e nomes de campos) ----
   O backend usa idRegiao, idCategoriaProblema, /servicos-apoio etc.; as telas usam id, regiaoId, /servicos.
   Em modo demonstração nada é convertido. */

const ROTAS={'/servicos':'/servicos-apoio','/fontes':'/fontes-dado'};
const num=v=>(v===''||v===undefined||v===null)?null:Number(v);
const sub=(o,k)=>o?o[k]:undefined;

const ADAPT={
    '/regioes':x=>({...x,id:x.idRegiao}),
    '/categorias-problema':x=>({...x,id:x.idCategoria}),
    '/categorias-servico':x=>({...x,id:x.idTipoServico}),
    '/indicadores':x=>({...x,id:x.idIndicador,unidade:x.unidadeMedida}),
    '/fontes-dado':x=>({...x,id:x.idFonte}),
    '/instituicoes':x=>({...x,id:x.idInstituicao}),
    '/dados-territoriais':x=>({
        ...x,
        id:x.idDado,
        regiaoId:sub(x.regiao,'idRegiao'),
        indicadorId:sub(x.indicador,'idIndicador'),
        valor:x.valor==null?x.valor:Number(x.valor),
        fonte:sub(x.fonteDado,'nome'),
        periodo:x.periodoReferencia
    }),
    '/servicos-apoio':x=>({
        ...x,
        id:x.idServico,
        instituicao:sub(x.instituicao,'nome'),
        categoriaId:sub(x.categoriaServico,'idTipoServico'),
        categoria:sub(x.categoriaServico,'nome'),
        regiaoId:sub(x.regiao,'idRegiao'),
        regiao:sub(x.regiao,'nome'),
        horario:x.horarioFuncionamento,
        link:x.linkAtendimento
    }),
    '/relatos':x=>({
        ...x,
        id:x.idRelato,
        usuarioNome:x.autorNome,
        categoria:sub(x.categoriaProblema,'nome'),
        regiaoId:sub(x.regiao,'idRegiao'),
        regiao:sub(x.regiao,'nome'),
        bairro:sub(x.regiao,'bairro'),
        cidade:sub(x.regiao,'cidade'),
        dataRegistro:x.dataRelato
    })
};

async function api(m,p,b){
    if(ST.demo)return apiBruta(m,p,b);

    let[base,qs]=p.split('?');
    let statusFiltro=null,meus=false;

    if(base==='/relatos/meus'){
        base='/relatos';
        meus=true;
    }

    if(qs){
        statusFiltro=new URLSearchParams(qs).get('status')||null;
    }

    const rel=base.match(/^\/relatos\/(\d+)$/);

    if(m==='PATCH'&&rel){
        m='PUT';
        base='/relatos/'+rel[1]+'/status';
    }

    base=ROTAS[base]||base;

    if(m==='POST'&&base==='/relatos'&&b){
        b={
            descricao:b.descricao,
            latitude:num(b.latitude),
            longitude:num(b.longitude),
            idRegiao:num(b.regiaoId),
            idCategoriaProblema:num(b.categoriaId)
        };
    }

    let r=await apiBruta(m,base,b);
    const ad=ADAPT[base];

    if(ad&&Array.isArray(r)){
        r=r.map(ad);

        if(base==='/relatos'){
            if(statusFiltro)r=r.filter(x=>x.status===statusFiltro);
            if(meus&&ST.user)r=r.filter(x=>x.usuarioNome===ST.user.nome);
        }
    }else if(ad&&r&&typeof r==='object'){
        r=ad(r);
    }

    return r;
}

async function apiBruta(m,p,b){

    if(ST.demo){
        await 0;

        return m==='GET'
            ?(DD[p.split('?')[0]]||[])
            :(b||{});
    }

    let r;

    const ctl=new AbortController();
    const tm=setTimeout(()=>ctl.abort(),25000);

    try{
        r=await fetch(API+p,{
            method:m,
            signal:ctl.signal,
            credentials:'same-origin',
            headers:{
                'Content-Type':'application/json'
            },
            body:b!==undefined&&b!==null
                ?JSON.stringify(b)
                :undefined
        });
    }catch(e){
        if(e&&e.name==='AbortError'){
            throw new Error(
                'O servidor demorou demais para responder (mais de 25s). Provável travamento no banco de dados: confira transações abertas (COMMIT/ROLLBACK) no SQL Developer/DBeaver e o console do Spring.'
            );
        }

        throw new Error(
            'Backend Java não conectado ('+
            (API||location.origin)+
            '). Confirme que o servidor está rodando e abra o site por ele (http://localhost:8080), não pelo arquivo HTML.'
        );
    }finally{
        clearTimeout(tm);
    }

    if(r.status===401&&ST.user){
        out();

        throw new Error(
            'Sessão expirada. Entre novamente.'
        );
    }

    if(!r.ok){
        let t='';

        try{
            const erro=await r.json();
            t=erro.mensagem||erro.message||'';
        }catch(e){}

        if(r.status===404&&(!t||t==='Not Found')){
            t='A rota '+m+' '+p+' não existe no backend (esta tela ainda não foi integrada à API).';
        }

        throw new Error(
            t||'Erro '+r.status+' ao falar com a API.'
        );
    }

    return r.status===204?null:r.json();
}

/* ---- Formulários ---- */

let uid=0;

const fld=(n,l,t,o,req)=>{
    const id='f_'+n+(++uid);
    let i;

    if(t==='textarea'){
        i=h('textarea',{
            id,
            name:n,
            required:req,
            rows:4,
            maxlength:1000
        });
    }else if(t==='select'){
        i=h(
            'select',
            {id,name:n,required:req},
            h('option',{value:''},'Selecione'),
            (o||[]).map(x=>
                h('option',{value:x[0]},x[1])
            )
        );
    }else{
        i=h('input',{
            id,
            name:n,
            type:t||'text',
            required:req,
            step:t==='number'?'any':null,
            maxlength:t==='number'?null:200
        });
    }

    return t==='checkbox'
        ?h(
            'label',
            {class:'chk'},
            h('input',{type:'checkbox',name:n}),
            l
        )
        :[
            h('label',{for:id},l),
            i
        ];
};

const form=(fs,btn,fn)=>{
    const m=h('p',{class:'sm',role:'status'});

    const f=h(
        'form',
        {
            onsubmit:async e=>{
                e.preventDefault();

                const d={};

                new FormData(f).forEach((v,k)=>d[k]=v);

                f.querySelectorAll(
                    'input[type=checkbox]'
                ).forEach(c=>{
                    d[c.name]=c.checked;
                });

                m.textContent='Enviando…';

                try{
                    await fn(d,f,m);
                }catch(x){
                    m.textContent=errMsg(x);
                }
            }
        },
        fs.map(a=>fld(...a)),
        h(
            'div',
            {style:'margin-top:16px'},
            h('button',{class:'btn',type:'submit'},btn)
        ),
        m
    );

    return f;
};

const o2=a=>a.map(x=>[x.id,x.nome]);

/* ---- Gráficos simples ---- */

const bars=o=>{
    const k=Object.entries(o);

    if(!k.length)return emp('Sem registros.');

    const m=Math.max(1,...k.map(x=>x[1]));
    const e=h('div');

    k.sort((a,b)=>b[1]-a[1]).forEach(([n,v])=>{
        e.append(
            h(
                'div',
                {class:'ap-bar'},
                n,
                h(
                    'i',
                    null,
                    h('b',{
                        style:'width:'+v/m*100+'%'
                    })
                ),
                String(Math.round(v*10)/10)
            )
        );
    });

    return e;
};

const cnt=(a,f)=>{
    const o={};

    a.forEach(x=>{
        const k=f(x)||'—';
        o[k]=(o[k]||0)+1;
    });

    return o;
};

function line(p){
    if(p.length<2){
        return emp(
            'São necessários ao menos 2 períodos para mostrar a evolução.'
        );
    }

    const W=560,H=180,P=30;
    const v=p.map(x=>x[1]);
    const lo=Math.min(...v);
    const sp=Math.max(...v)===lo
        ?1
        :Math.max(...v)-lo;

    const X=i=>P+i*(W-2*P)/(p.length-1);
    const Y=y=>H-P-(y-lo)/sp*(H-2*P);

    const s=S('svg',{
        viewBox:'0 0 '+W+' '+H,
        width:'100%',
        role:'img',
        'aria-label':'Evolução do indicador'
    });

    s.append(
        S('polyline',{
            points:p.map((q,i)=>X(i)+','+Y(q[1])).join(' '),
            fill:'none',
            stroke:'#c4b5fd',
            'stroke-width':2
        })
    );

    p.forEach((q,i)=>{
        s.append(
            S('circle',{
                cx:X(i),
                cy:Y(q[1]),
                r:3.5,
                fill:'#8b5cf6'
            }),
            S('text',{
                x:X(i),
                y:H-8,
                'text-anchor':'middle',
                fill:'#9a98ad',
                'font-size':11
            },q[0]),
            S('text',{
                x:X(i),
                y:Y(q[1])-9,
                'text-anchor':'middle',
                fill:'#ecebf3',
                'font-size':11
            },String(Math.round(q[1]*10)/10))
        );
    });

    return s;
}

const last=(ds,r,i)=>
    ds.filter(x=>x.regiaoId==r&&x.indicadorId==i)
       .sort((a,b)=>String(b.periodo).localeCompare(String(a.periodo)))[0];

const fv=(d,i)=>{
    const n=+d.valor;

    return i.unidade==='%'
        ?n.toFixed(1)+'%'
        :n.toLocaleString('pt-BR')+(i.unidade?' '+i.unidade:'');
};

const mapsLink=r=>
    r.latitude!=null&&r.latitude!==''&&
    r.longitude!=null&&r.longitude!==''
        ?h(
            'a',
            {
                href:'https://www.google.com/maps?q='+
                    encodeURIComponent(r.latitude+','+r.longitude),
                target:'_blank',
                rel:'noopener'
            },
            'Ver no mapa'
        )
        :null;

/* ---- Telas ---- */

const TABS={
    territorio:['Território','*'],
    servicos:['Serviços de apoio','*'],
    conta:['Entrar','V'],
    relatar:['Registrar problema','CIDADAO'],
    meus:['Meus relatos','CIDADAO'],
    painel:['Painel do gestor','GESTOR'],
    cadastros:['Cadastros','GESTOR'],
    validar:['Validação de relatos','ADMINISTRADOR'],
    perfil:['Perfil','CIDADAO GESTOR ADMINISTRADOR']
};

const can=k=>{
    const r=TABS[k][1];

    return r==='*'||
        (r==='V'?!ST.user:!!ST.user&&r.includes(ST.user.tipo));
};

const VIEWS={};

/* ---- Conta / Login / Cadastro ---- */

VIEWS.conta=async()=>{

    const lg=form(
        [
            ['email','E-mail','email',0,1],
            ['senha','Senha','password',0,1],
            ['manter','Manter conectado','checkbox']
        ],
        'Entrar',
        async(d,f,m)=>{

            const r=await api('POST','/auth/login',d);

            const usuario={
                idUsuario:r.idUsuario,
                nome:r.nome,
                email:r.email,
                tipo:r.tipoUsuario,
                dataCadastro:r.dataCadastro
            };

            ST.user=usuario;

            sset(
                {user:usuario},
                d.manter
            );

            upd();
            enter();
        }
    );

    const rc=h(
        'details',
        {class:'ap-d'},
        h('summary',null,'Esqueci minha senha'),
        form(
            [['email','E-mail cadastrado','email',0,1]],
            'Enviar link de recuperação',
            async(d,f,m)=>{
                await api('POST','/auth/recuperar',d);

                m.textContent=
                    'Se o e-mail existir, enviaremos as instruções.';
            }
        )
    );

    const rg=form(
        [
            ['nome','Nome completo','text',0,1],
            ['email','E-mail','email',0,1],
            ['senha','Senha (mín. 8, com letras e números)','password',0,1],
            ['conf','Confirmar senha','password',0,1]
        ],
        'Criar conta',
        async(d,f,m)=>{

            if(d.senha.length<8){
                throw new Error(
                    'A senha precisa ter ao menos 8 caracteres.'
                );
            }

            if(d.senha!==d.conf){
                throw new Error('As senhas não conferem.');
            }

            await api('POST','/auth/register',{
                nome:d.nome,
                email:d.email,
                senha:d.senha
            });

            m.textContent=
                'Conta criada como Cidadão! Redirecionando para o login…';

            f.reset();

            setTimeout(()=>{
                m.textContent='';
                go(true);
            },1400);
        }
    );

    const dm=h(
        'details',
        {class:'ap-d'},
        h('summary',null,'Pré-visualizar telas (modo demonstração)'),
        h(
            'p',
            {class:'sm'},
            'Sem backend: mostra cada perfil com dados de exemplo claramente marcados. Nada é salvo.'
        ),
        h(
            'div',
            {style:'display:flex;gap:8px;flex-wrap:wrap'},
            Object.keys(ROL).map(t=>
                h(
                    'button',
                    {
                        class:'btn g',
                        type:'button',
                        onclick:()=>{
                            ST.demo=true;
                            ST.user={
                                nome:'Usuário demonstração',
                                email:'demo@exemplo.invalid',
                                tipo:t
                            };
                            upd();
                            enter();
                        }
                    },
                    ROL[t]
                )
            )
        )
    );

    const pL=h(
        'div',
        {class:'au-pane',id:'au-l',role:'tabpanel'},
        lg,
        rc
    );

    const pR=h(
        'div',
        {class:'au-pane',id:'au-r',role:'tabpanel',hidden:true},
        rg
    );

    const bL=h(
        'button',
        {
            type:'button',
            class:'on',
            role:'tab',
            'aria-selected':'true'
        },
        'Entrar'
    );

    const bR=h(
        'button',
        {
            type:'button',
            role:'tab',
            'aria-selected':'false'
        },
        'Criar conta'
    );

    const go=l=>{
        pL.hidden=!l;
        pR.hidden=l;
        bL.classList.toggle('on',l);
        bR.classList.toggle('on',!l);
        bL.setAttribute('aria-selected',l);
        bR.setAttribute('aria-selected',!l);
    };

    bL.onclick=()=>go(true);
    bR.onclick=()=>go(false);

    const tg=h(
        'div',
        {class:'au-tg',role:'tablist'},
        bL,
        bR
    );

    return h('div',{class:'au'},tg,pL,pR,dm);
};

/* ---- Registrar problema ---- */

VIEWS.relatar=async()=>{

    const[cs,rg]=await Promise.all(
        ['/categorias-problema','/regioes'].map(p=>api('GET',p))
    );

    const gm=h('p',{class:'sm',role:'status'});
    const w=h('div',{style:'max-width:640px'});

    const f=form(
        [
            ['categoriaId','Categoria do problema','select',o2(cs),1],
            ['regiaoId','Região','select',o2(rg),1],
            ['bairro','Bairro','text',0,1],
            ['cidade','Cidade','text',0,1],
            ['descricao','Descrição detalhada do problema','textarea',0,1],
            ['latitude','Latitude','number'],
            ['longitude','Longitude','number']
        ],
        'Enviar relato',
        async(d,f2,m)=>{
            await api('POST','/relatos',d);

            w.replaceChildren(
                h(
                    'div',
                    {class:'res'},
                    h(
                        'h3',
                        {style:'font:400 28px var(--f1);margin:0 0 10px'},
                        'Relato enviado'
                    ),
                    h(
                        'p',
                        null,
                        'Recebemos seu relato. Ele aparece como ',
                        st('PENDENTE'),
                        ' até ser validado.'
                    ),
                    h(
                        'button',
                        {
                            class:'btn',
                            onclick:()=>go('meus')
                        },
                        'Acompanhar em Meus relatos'
                    )
                )
            );
        }
    );

    w.append(
        h(
            'button',
            {
                class:'btn g',
                type:'button',
                onclick:()=>{
                    if(!navigator.geolocation){
                        gm.textContent=
                            'Seu navegador não oferece geolocalização.';
                        return;
                    }

                    navigator.geolocation.getCurrentPosition(
                        p=>{
                            f.latitude.value=p.coords.latitude.toFixed(6);
                            f.longitude.value=p.coords.longitude.toFixed(6);
                            gm.textContent='Localização preenchida.';
                        },
                        ()=>{
                            gm.textContent=
                                'Não foi possível obter a localização. Digite manualmente ou envie sem coordenadas.';
                        },
                        {timeout:10000}
                    );
                }
            },
            'Usar minha localização'
        ),
        gm,
        f
    );

    return w;
};

/* ---- Meus relatos ---- */

VIEWS.meus=async()=>{

    const a=await api('GET','/relatos/meus');

    if(!a.length)return emp('Você ainda não enviou relatos.');

    return h(
        'div',
        {class:'tw'},
        h(
            'table',
            {class:'tb'},
            h(
                'thead',
                null,
                h(
                    'tr',
                    null,
                    ['Descrição','Enviado em','Região','Categoria','Status']
                        .map(x=>h('th',null,x))
                )
            ),
            h(
                'tbody',
                null,
                a.map(r=>
                    h(
                        'tr',
                        null,
                        h('td',null,r.descricao),
                        h('td',null,fd(r.dataRegistro)),
                        h('td',null,r.regiao||'—'),
                        h('td',null,r.categoria||'—'),
                        h('td',null,st(r.status))
                    )
                )
            )
        )
    );
};

/* ---- Território ---- */

VIEWS.territorio=async()=>{

    const[rg,ind,ds]=await Promise.all(
        ['/regioes','/indicadores','/dados-territoriais']
            .map(p=>api('GET',p))
    );

    if(!rg.length){
        return emp(
            'Nenhuma região cadastrada. Regiões e indicadores virão da API (REGIAO, INDICADOR, DADO_TERRITORIAL).'
        );
    }

    let A=rg[0].id,B='';

    const w=h('div');

    const cmp=h(
        'select',
        {'aria-label':'Comparar com'},
        ops(rg,'Comparar com…')
    );

    cmp.onchange=()=>{
        B=cmp.value;
        draw();
    };

    const nm=id=>(rg.find(x=>x.id==id)||{}).nome;

    const cell=(r,i)=>{
        const d=last(ds,r,i);

        return d
            ?h(
                'td',
                null,
                h('span',{class:'v'},fv(d,i)),
                h('br'),
                h(
                    'small',
                    {class:'sm'},
                    'Fonte: '+(d.fonte||'—')+
                    ' · Período: '+(d.periodo||'—')
                )
            )
            :h('td',null,'sem dados');
    };

    const draw=()=>{
        w.replaceChildren(
            h(
                'div',
                {class:'chips'},
                rg.map(r=>
                    h(
                        'button',
                        {
                            class:'chip',
                            type:'button',
                            'aria-pressed':r.id==A,
                            onclick:()=>{
                                A=r.id;
                                draw();
                            }
                        },
                        r.nome
                    )
                ),
                cmp,
                h(
                    'button',
                    {
                        class:'btn g',
                        type:'button',
                        onclick:()=>{
                            close();
                            $('gcard').click();
                        }
                    },
                    'Abrir mapa-múndi'
                )
            ),

            h(
                'div',
                {class:'mo-ban real'},
                h('b',null,'Leitura correta'),
                h(
                    'span',
                    null,
                    'Percentuais são índices de vulnerabilidade territorial (metodologia da fonte). Não representam probabilidade individual nem diagnóstico clínico.'
                )
            ),

            ind.length
                ?h(
                    'div',
                    {class:'tw'},
                    h(
                        'table',
                        {class:'tb'},
                        h(
                            'thead',
                            null,
                            h(
                                'tr',
                                null,
                                h('th',null,'Indicador'),
                                h('th',null,nm(A)),
                                B?h('th',null,nm(B)):null
                            )
                        ),
                        h(
                            'tbody',
                            null,
                            ind.map(i=>
                                h(
                                    'tr',
                                    null,
                                    h('td',null,i.nome),
                                    cell(A,i.id),
                                    B?cell(B,i.id):null
                                )
                            )
                        )
                    )
                )
                :emp('Nenhum indicador cadastrado.')
        );
    };

    draw();
    cmp.value=B;

    return w;
};

/* ---- Serviços ---- */

VIEWS.servicos=async()=>{

    const[sv,cs,rg]=await Promise.all(
        ['/servicos','/categorias-servico','/regioes']
            .map(p=>api('GET',p))
    );

    const q=h('input',{
        type:'search',
        placeholder:'Buscar serviço ou instituição'
    });

    const c=h('select',null,ops(cs,'Todas as categorias'));

    const m=h(
        'select',
        null,
        h('option',{value:''},'Todas as modalidades'),
        MOD.map(x=>h('option',{value:x[0]},x[1]))
    );

    const r=h('select',null,ops(rg,'Todas as regiões'));

    const L=h('div');

    const card=x=>h(
        'article',
        {class:'ap-c'},
        h(
            'div',
            null,
            h('b',null,x.nome),
            ' ',
            h(
                'span',
                {class:'bd'},
                (MOD.find(y=>y[0]===x.modalidade)||[0,x.modalidade||'—'])[1]
            )
        ),
        h(
            'p',
            {class:'sm'},
            (x.instituicao||'—')+
            ' · '+(x.categoria||'—')+
            ' · Atende: '+(x.regiao||'—')
        ),
        x.endereco
            ?h(
                'p',
                {class:'sm'},
                x.endereco+' ',
                x.modalidade!=='VIRTUAL'
                    ?h(
                        'a',
                        {
                            href:'https://www.google.com/maps/search/'+encodeURIComponent(x.endereco),
                            target:'_blank',
                            rel:'noopener'
                        },
                        'ver no mapa'
                    )
                    :null
            )
            :null,
        x.telefone
            ?h(
                'p',
                {class:'sm'},
                'Telefone: ',
                h(
                    'a',
                    {
                        href:'tel:'+String(x.telefone).replace(/[^\d+]/g,'')
                    },
                    x.telefone
                )
            )
            :null,
        x.horario
            ?h('p',{class:'sm'},'Horário: '+x.horario)
            :null,
        /^https?:\/\//i.test(x.link||'')
            ?h(
                'a',
                {
                    class:'btn g',
                    href:x.link,
                    target:'_blank',
                    rel:'noopener'
                },
                'Atendimento online'
            )
            :null
    );

    const draw=()=>{
        const t=q.value.trim().toLowerCase();

        const a=sv.filter(x=>
            (!t||((x.nome||'')+' '+(x.instituicao||'')).toLowerCase().includes(t))&&
            (!c.value||x.categoriaId==c.value)&&
            (!m.value||x.modalidade===m.value)&&
            (!r.value||x.regiaoId==r.value)
        );

        L.replaceChildren(
            ...(a.length
                ?a.map(card)
                :[emp(
                    sv.length
                        ?'Nenhum serviço com esses filtros.'
                        :'Nenhum serviço cadastrado ainda. Os dados virão da API (SERVICO_APOIO).'
                )]
            )
        );
    };

    [q,c,m,r].forEach(e=>e.oninput=draw);

    draw();

    return h(
        'div',
        null,
        h(
            'p',
            null,
            'Em crise, ligue gratuitamente para o ',
            h('b',null,'CVV, 188'),
            ' (24 h) ou ',
            h('b',null,'SAMU, 192'),
            '.'
        ),
        h('div',{class:'ap-f'},q,c,m,r),
        L
    );
};

/* ---- Validação de relatos ---- */

VIEWS.validar=async()=>{

    const sel=h(
        'select',
        null,
        [
            ['PENDENTE','Pendentes'],
            ['VALIDADO','Validados'],
            ['REJEITADO','Rejeitados']
        ].map(x=>h('option',{value:x[0]},x[1]))
    );

    const L=h('div');

    const card=r=>{

        const m=h('span',{class:'sm',role:'status'});
        const c=h('article',{class:'ap-c'});

        const b=(l,s,g)=>h(
            'button',
            {
                class:'btn'+(g?' g':''),
                type:'button',
                onclick:async()=>{
                    try{
                        await api('PATCH','/relatos/'+r.id,{
                            status:s
                        });

                        c.remove();
                    }catch(e){
                        m.textContent=errMsg(e);
                    }
                }
            },
            l
        );

        c.append(
            h(
                'div',
                null,
                st(r.status),
                ' ',
                h('b',null,r.categoria||'—'),
                ' · '+(r.regiao||'—')
            ),
            h('p',null,r.descricao),
            h(
                'p',
                {class:'sm'},
                'Enviado por '+(r.usuarioNome||'—')+
                ' em '+fd(r.dataRegistro)
            ),
            h(
                'details',
                null,
                h('summary',{class:'sm'},'Detalhes e localização'),
                h(
                    'p',
                    {class:'sm'},
                    [
                        r.bairro,
                        r.cidade
                    ].filter(Boolean).join(', ')+
                    ' · lat '+(r.latitude??'—')+
                    ', lng '+(r.longitude??'—')+
                    ' ',
                    mapsLink(r)
                )
            )
        );

        if(r.status==='PENDENTE'){
            c.append(
                h(
                    'div',
                    {
                        style:'display:flex;gap:10px;flex-wrap:wrap;align-items:center'
                    },
                    b('Validar','VALIDADO'),
                    b('Rejeitar','REJEITADO',1),
                    m
                )
            );
        }

        return c;
    };

    const load=async()=>{
        L.replaceChildren(
            h('p',{class:'sm'},'Carregando…')
        );

        try{
            let a=await api(
                'GET',
                '/relatos?status='+sel.value
            );

            if(ST.demo){
                a=a.filter(x=>x.status===sel.value);
            }

            L.replaceChildren(
                ...(a.length
                    ?a.map(card)
                    :[emp('Nenhum relato nesta lista.')]
                )
            );
        }catch(e){
            L.replaceChildren(emp(errMsg(e)));
        }
    };

    sel.onchange=load;
    load();

    return h('div',null,h('div',{class:'ap-f'},sel),L);
};

/* ---- Painel do gestor ---- */

VIEWS.painel=async()=>{

    const[rl,rg,ind,ds,sv,ins]=await Promise.all(
        [
            '/relatos',
            '/regioes',
            '/indicadores',
            '/dados-territoriais',
            '/servicos',
            '/instituicoes'
        ].map(p=>api('GET',p))
    );

    const fs=h(
        'select',
        null,
        h('option',{value:''},'Todos os status'),
        ['PENDENTE','VALIDADO','REJEITADO'].map(s=>
            h(
                'option',
                {value:s},
                s[0]+s.slice(1).toLowerCase()
            )
        )
    );

    const fr=h('select',null,ops(rg,'Todas as regiões'));

    const box=h('div');
    const w=h('div');

    const draw=()=>{
        const l=rl.filter(x=>
            (!fs.value||x.status===fs.value)&&
            (!fr.value||x.regiaoId==fr.value)
        );

        const n=s=>l.filter(x=>x.status===s).length;

        box.replaceChildren(
            h(
                'div',
                {class:'ap-kpi'},
                [
                    ['Relatos',l.length],
                    ['Pendentes',n('PENDENTE')],
                    ['Validados',n('VALIDADO')],
                    ['Rejeitados',n('REJEITADO')],
                    ['Serviços',sv.length],
                    ['Instituições',ins.length]
                ].map(([a,b])=>
                    h(
                        'div',
                        null,
                        h('b',null,String(b)),
                        a
                    )
                )
            ),
            h(
                'div',
                {class:'ap-two',style:'margin-top:20px'},
                h(
                    'div',
                    null,
                    sec('Relatos por região'),
                    bars(cnt(l,x=>x.regiao))
                ),
                h(
                    'div',
                    null,
                    sec('Relatos por categoria'),
                    bars(cnt(l,x=>x.categoria))
                )
            )
        );
    };

    [fs,fr].forEach(e=>e.onchange=draw);

    draw();

    const ci=h('select',null,ops(ind,'Indicador…'));
    const er=h('select',null,ops(rg,'Região…'));
    const eo=h('select',null,ops(ind,'Indicador…'));

    const o1=h('div');
    const o2e=h('div');

    ci.onchange=()=>{
        const i=ind.find(x=>x.id==ci.value);

        if(!i){
            o1.replaceChildren();
            return;
        }

        const o={};

        rg.forEach(r=>{
            const d=last(ds,r.id,i.id);

            if(d)o[r.nome]=+d.valor;
        });

        o1.replaceChildren(
            Object.keys(o).length
                ?bars(o)
                :emp('Sem dados deste indicador.')
        );
    };

    const ev=()=>{
        if(!er.value||!eo.value){
            o2e.replaceChildren();
            return;
        }

        o2e.replaceChildren(
            line(
                ds.filter(x=>
                    x.regiaoId==er.value&&
                    x.indicadorId==eo.value
                )
                .sort((a,b)=>
                    String(a.periodo).localeCompare(String(b.periodo))
                )
                .map(x=>[String(x.periodo),+x.valor])
            )
        );
    };

    er.onchange=ev;
    eo.onchange=ev;

    w.append(
        h('div',{class:'ap-f'},fs,fr),
        box,
        sec('Comparação entre regiões'),
        h('div',{class:'ap-f'},ci),
        o1,
        sec('Evolução ao longo do tempo'),
        h('div',{class:'ap-f'},er,eo),
        o2e,
        h(
            'p',
            {class:'sm'},
            'Percentuais de vulnerabilidade territorial não são probabilidade individual nem diagnóstico.'
        )
    );

    return w;
};

/* ---- Cadastros ---- */

VIEWS.cadastros=async()=>{

    const[rg,ind,fo,ins,cs]=await Promise.all(
        [
            '/regioes',
            '/indicadores',
            '/fontes',
            '/instituicoes',
            '/categorias-servico'
        ].map(p=>api('GET',p))
    );

    const cad=(t,p,fs)=>h(
        'details',
        {class:'ap-d'},
        h('summary',null,t),
        form(
            [
                ['id','ID (só para atualizar um registro existente)','number'],
                ...fs
            ],
            'Salvar',
            async(v,f,m)=>{
                const id=v.id;
                delete v.id;

                await api(
                    id?'PUT':'POST',
                    p+(id?'/'+id:''),
                    v
                );

                m.textContent=id?'Atualizado.':'Cadastrado.';
                f.reset();
            }
        )
    );

    return h(
        'div',
        null,

        cad(
            'Indicador (INDICADOR)',
            '/indicadores',
            [
                ['nome','Nome','text',0,1],
                ['unidade','Unidade de medida (%, R$, hab/km²…)','text']
            ]
        ),

        cad(
            'Fonte de dados (FONTE_DADO)',
            '/fontes',
            [
                ['nome','Nome da fonte','text',0,1],
                ['url','Link (opcional)','url']
            ]
        ),

        cad(
            'Dado territorial (DADO_TERRITORIAL)',
            '/dados-territoriais',
            [
                ['regiaoId','Região','select',o2(rg),1],
                ['indicadorId','Indicador','select',o2(ind),1],
                ['fonteId','Fonte','select',o2(fo),1],
                ['valor','Valor','number',0,1],
                ['periodo','Período de referência (ex.: 2023)','text',0,1]
            ]
        ),

        cad(
            'Instituição (INSTITUICAO)',
            '/instituicoes',
            [
                ['nome','Nome','text',0,1],
                ['site','Site (opcional)','url'],
                ['contato','Contato (opcional)','text']
            ]
        ),

        cad(
            'Serviço de apoio (SERVICO_APOIO)',
            '/servicos',
            [
                ['nome','Nome do serviço','text',0,1],
                ['instituicaoId','Instituição','select',o2(ins),1],
                ['categoriaId','Categoria','select',o2(cs),1],
                ['modalidade','Modalidade','select',MOD,1],
                ['endereco','Endereço','text'],
                ['regiaoId','Região atendida','select',o2(rg)],
                ['telefone','Telefone','tel'],
                ['horario','Horário de funcionamento','text'],
                ['link','Link para atendimento','url'],
                ['latitude','Latitude','number'],
                ['longitude','Longitude','number']
            ]
        )
    );
};

/* ---- Perfil ---- */

VIEWS.perfil=async()=>{

    const u=ST.user;

    const row=(a,b)=>
        h('p',null,h('b',null,a+': '),b);

    const pf=form(
        [['nome','Nome','text',0,1]],
        'Salvar',
        async(d,f,m)=>{
            const r=await api('PUT','/me',{nome:d.nome});

            ST.user=Object.assign(
                {},
                u,
                r||{},
                {nome:d.nome}
            );

            sset(
                {user:ST.user},
                !!localStorage.getItem(K)
            );

            upd();

            m.textContent='Informações atualizadas.';
        }
    );

    pf.nome.value=u.nome;

    return h(
        'div',
        {class:'ap-two'},

        h(
            'div',
            {class:'mo-panel'},
            row('Nome',u.nome),
            row('E-mail',u.email),
            row('Tipo de usuário',ROL[u.tipo]||u.tipo),
            row('Cadastro em',fd(u.dataCadastro)),
            h(
                'button',
                {
                    class:'btn g',
                    type:'button',
                    onclick:out
                },
                'Sair da conta'
            )
        ),

        h(
            'div',
            null,
            sec('Editar informações'),
            pf,
            sec('Alterar senha'),
            form(
                [
                    ['atual','Senha atual','password',0,1],
                    ['nova','Nova senha (mín. 8)','password',0,1]
                ],
                'Alterar senha',
                async(d,f,m)=>{
                    if(d.nova.length<8){
                        throw new Error(
                            'A nova senha precisa ter ao menos 8 caracteres.'
                        );
                    }

                    await api('PUT','/me/senha',d);

                    m.textContent='Senha alterada.';
                    f.reset();
                }
            )
        )
    );
};

/* ---- Shell / navegação ---- */

const home=()=>({
    CIDADAO:'relatar',
    GESTOR:'painel',
    ADMINISTRADOR:'validar'
}[ST.user.tipo]||'perfil');

function slot(){

    const b=$('authSec');

    if(!b)return;

    if(ST.user){

        b.replaceChildren(
            h(
                'div',
                {class:'res'},

                h(
                    'h3',
                    {
                        style:'font:400 28px var(--f1);margin:0 0 10px'
                    },
                    'Olá, '+ST.user.nome.split(' ')[0]+'.'
                ),

                h(
                    'p',
                    null,
                    'Você está conectado como '+
                    (ROL[ST.user.tipo]||ST.user.tipo)+
                    (ST.demo?' (demonstração)':'')+'.'
                ),

                h(
                    'div',
                    {style:'display:flex;gap:10px;flex-wrap:wrap'},

                    h(
                        'button',
                        {
                            class:'btn',
                            type:'button',
                            onclick:enter
                        },
                        'Abrir minha área'
                    ),

                    h(
                        'button',
                        {
                            class:'btn g',
                            type:'button',
                            onclick:out
                        },
                        'Sair'
                    )
                )
            )
        );

    }else{
        VIEWS.conta().then(e=>b.replaceChildren(e));
    }
}

const hubs=()=>[$('hubH'),$('hubO')];

function hubShut(){

    document.querySelectorAll('.hub-m').forEach(m=>{
        m.hidden=true;

        const b=m.previousSibling;

        b&&b.setAttribute&&
            b.setAttribute('aria-expanded','false');
    });
}

function hubFill(box){

    if(!box)return;

    box.replaceChildren();

    const ov=box.id==='hubO';
    const u=ST.user;

    if(!u){

        if(ov)return;

        box.append(
            h(
                'button',
                {
                    class:'hub-b in',
                    type:'button',
                    onclick:()=>{
                        OV.classList.contains('open')
                            ?go('conta')
                            :open('conta');
                    }
                },
                'Entrar'
            )
        );

        return;
    }

    const nm=(u.nome||'Usuário').trim().split(' ')[0];

    const b=h(
        'button',
        {
            class:'hub-b',
            type:'button',
            'aria-haspopup':'menu',
            'aria-expanded':'false',
            'aria-label':'Menu da conta de '+nm
        },
        h('span',{class:'hub-av'},nm.charAt(0)),
        h('span',{class:'nm'},nm),
        h('i')
    );

    const go2=k=>{
        hubShut();

        OV.classList.contains('open')
            ?go(k)
            :open(k);
    };

    const m=h(
        'div',
        {
            class:'hub-m',
            role:'menu',
            hidden:true
        },

        h(
            'div',
            {class:'hub-i'},
            h('b',null,u.nome||'Usuário'),
            u.email?h('span',null,u.email):null,
            h(
                'em',
                null,
                (ROL[u.tipo]||u.tipo)+(ST.demo?' · demo':'')
            )
        ),

        h(
            'button',
            {
                type:'button',
                role:'menuitem',
                onclick:()=>{
                    hubShut();
                    enter();
                }
            },
            'Minha área'
        ),

        h(
            'button',
            {
                type:'button',
                role:'menuitem',
                onclick:()=>go2('perfil')
            },
            'Meu perfil'
        ),

        h(
            'button',
            {
                type:'button',
                role:'menuitem',
                class:'hub-o',
                onclick:()=>{
                    hubShut();
                    out();
                }
            },
            'Sair da conta'
        )
    );

    b.onclick=e=>{
        e.stopPropagation();

        const o=m.hidden;

        hubShut();

        m.hidden=!o;

        b.setAttribute('aria-expanded',String(o));
    };

    box.append(b,m);
}

document.addEventListener('click',e=>{
    if(!e.target.closest||!e.target.closest('.hub')){
        hubShut();
    }
});

document.addEventListener('keydown',e=>{
    if(e.key==='Escape')hubShut();
});

function upd(){

    slot();

    hubs().forEach(hubFill);

    const a=$('navAcc');

    if(a){
        a.textContent=ST.user
            ?ST.user.nome.split(' ')[0]
            :'Entrar';
    }

    const b=$('apBan');

    b.hidden=!ST.demo;
    b.textContent='';

    if(ST.demo){
        b.append(
            h('b',null,'Modo demonstração'),
            h(
                'span',
                null,
                'dados de exemplo; nada é salvo nem enviado.'
            )
        );
    }
}

function tabs(){

    const w=$('apTabs');

    w.replaceChildren(
        ...Object.keys(TABS)
            .filter(can)
            .map(k=>
                h(
                    'button',
                    {
                        class:'mo-tab',
                        type:'button',
                        role:'tab',
                        'aria-selected':k===ST.tab,
                        onclick:()=>go(k)
                    },
                    TABS[k][0]
                )
            )
    );
}

async function render(){

    const b=$('apBody');
    const t=ST.tab;

    b.replaceChildren(
        h('p',{class:'sm'},'Carregando…')
    );

    try{

        const v=await VIEWS[t]();

        if(ST.tab===t){
            b.replaceChildren(v);
        }

    }catch(e){

        b.replaceChildren(emp(errMsg(e)));
    }
}

/* ---- Mantém o usuário da tela igual ao do banco (perfil alterado depois do login) ---- */

let ultSync=0;

async function sync(forcar){
    if(!ST.user||ST.demo)return;

    const agora=Date.now();

    if(!forcar&&agora-ultSync<15000)return;

    ultSync=agora;

    try{
        const r=await fetch(API+'/auth/me',{credentials:'same-origin'});

        if(r.status===401){
            out();
            return;
        }

        if(!r.ok)return;

        const u=await r.json();

        const novo={
            idUsuario:u.idUsuario,
            nome:u.nome,
            email:u.email,
            tipo:u.tipoUsuario,
            dataCadastro:u.dataCadastro
        };

        if(JSON.stringify(novo)===JSON.stringify(ST.user))return;

        ST.user=novo;

        sset({user:novo},!!localStorage.getItem(K));

        upd();

        if(OV.classList.contains('open')){
            go(can(ST.tab)?ST.tab:home());
        }
    }catch(e){}
}

function go(k){

    sync();

    if(!TABS[k]||!can(k)){
        k=ST.user?home():'conta';
    }

    ST.tab=k;

    tabs();

    $('apT').textContent=TABS[k][0];

    $('apBody').scrollTop=0;

    upd();

    render();
}

function out(){

    if(!ST.demo){

        fetch(API+'/auth/logout',{
            method:'POST',
            credentials:'same-origin'
        }).catch(()=>{});
    }

    sset(null);

    ST.user=null;
    ST.demo=false;

    upd();

    if(OV.classList.contains('open')){
        go('conta');
    }
}

function enter(){

    OV.classList.contains('open')
        ?go(home())
        :open(home());
}

const OV=$('appov');

function open(k,e){

    ST.opener=e||document.activeElement;

    OV.classList.add('open');

    OV.setAttribute('aria-hidden','false');

    document.body.style.overflow='hidden';

    go(k);

    $('apX').focus({preventScroll:true});
}

function close(){

    OV.classList.remove('open');

    OV.setAttribute('aria-hidden','true');

    document.body.style.overflow='';

    if(ST.opener&&ST.opener.focus){
        ST.opener.focus({preventScroll:true});
    }
}

$('apX').onclick=close;

OV.addEventListener('keydown',e=>{
    if(e.key==='Escape')close();
    e.stopPropagation();
});

['wheel','touchstart','touchmove'].forEach(v=>
    OV.addEventListener(
        v,
        e=>e.stopPropagation(),
        {passive:true}
    )
);

document.querySelectorAll('[data-ap]').forEach(a=>
    a.addEventListener('click',e=>{
        e.preventDefault();

        open(
            a.dataset.ap==='conta'&&ST.user
                ?'perfil'
                :a.dataset.ap,
            a
        );
    })
);

const s=sget();

if(s&&s.user){
    ST.user=s.user;
}

upd();

sync(true);

document.addEventListener('visibilitychange',()=>{
    if(!document.hidden)sync(true);
});

})();