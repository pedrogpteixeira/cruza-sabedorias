# Cruza Sabedorias — Landing Page Angular

Landing page Angular autónoma, em português de Portugal, construída de raiz a partir dos serviços publicados no site antigo da Cruza Sabedorias. **Não pertence à Desafio Único e não deve ser publicada nesse domínio.**

## Arranque

Requisitos: Node.js `22.22.3+`, `24.15.0+` ou `26+`, npm.

```bash
npm ci
npm start
```

O servidor de desenvolvimento ficará disponível no endereço indicado pela CLI (habitualmente `http://localhost:4200`).

### Verificações

```bash
npm run check
npm run test:forms
npm run build
```

A build de produção é gerada em `dist/cruza-sabedorias/browser/`.

## Estrutura

- `src/app/data/content.ts`: **fonte central** dos serviços, públicos-alvo, perguntas frequentes e dados profissionais.
- `src/app/app.component.html`: homepage e navegação; ficheiro visual/editorial principal.
- `src/styles.css`: sistema de estilos, hero e estados responsivos.
- `src/app/features/contact.*`: formulário reativo com validações.
- `src/app/features/contact-form.ts`: serialização e submissão para Netlify Forms.
- `public/netlify-forms.html`: formulário estático para a deteção automática da Netlify.
- `public/_redirects`: fallback da SPA.
- `netlify.toml`: build e cabeçalhos de segurança.

## Netlify

1. Criar um **novo** site Netlify para a Cruza Sabedorias.
2. Configurar domínio correto da Cruza Sabedorias **apenas quando confirmado pelo cliente**.
3. Importar o repositório. A configuração em `netlify.toml` usa `npm run build` e `dist/cruza-sabedorias/browser`.
4. Em *Forms*, ativar *Form detection* e fazer um novo deploy, caso seja necessário.
5. Verificar que o formulário `cruza-contactos` foi reconhecido e realizar um teste sem dados pessoais reais.
6. Configurar as *Submission notifications* no painel da Netlify, usando apenas um email validado pelo cliente.

Em localhost o envio é **intencionalmente bloqueado** com mensagem clara no envio; no deploy o POST funciona através da Netlify. O resultado de um POST HTTP 200 não deve ser interpretado como envio de email pela Netlify sem confirmação das notificações.

## Conteúdo recuperado e limites

O site antigo em `https://desafiounico.pt/` foi consultado através dos resultados indexados de pesquisa porque o servidor respondeu com HTTP 502 à leitura direta. Serviços confirmados por indexação:

1. Contabilidade e Fiscalidade
2. IRS, IRC e Apoio a Recibos Verdes
3. Processamento Salarial
4. Abertura e Estruturação de Empresas
5. Consultoria Financeira e de Gestão
6. Relatórios Financeiros

Dados profissionais no site original indexado: **Fernando Manuel de Lima Oliveira e Silva, Contabilista Certificado, n.º CC 80496**. Confirmar com o cliente antes de publicação final.

Não foram comprovados contactos oficiais, morada, antiguidade, número de clientes, avaliações ou preços — por esse motivo esses dados **não foram inventados**. O formulário permite pedir contacto.

- Fonte indexada: https://desafiounico.pt/
- Fonte indexada de serviços e informação profissional: https://desafiounico.pt/index.php/category/uncategorized/

## Antes de publicar em produção

- Confirmar o **domínio oficial** e os dados legais, fiscais, contacto e marca com a Cruza Sabedorias.
- Disponibilizar uma **política de privacidade validada**, com identidade do responsável e finalidade/prazo de conservação, antes de recolher dados pessoais reais. O consentimento visível no protótipo não substitui a política de privacidade.
- Validar âmbito e descrições de todos os serviços.
- Configurar e testar notificações Netlify.
- Rever `npm audit` após instalação; caso existam advisories transitivos, atualizar dependências dentro de versões compatíveis, **evitando `npm audit fix --force` sem revisão**.
- Rever cabeçalhos de segurança, banner/consentimento caso sejam adicionados cookies não essenciais e os recursos tipográficos externos.

## Design e acessibilidade

Layout editorial responsivo, sem bibliotecas de animação externas, animação de entrada progressiva, `prefers-reduced-motion`, navegação por teclado, FAQ com `details`, menu móvel, estados de validação do formulário e `aria-live` na resposta ao envio.


## V7 — Conversão e preparação de publicação

- Os cartões de serviço permitem expandir uma explicação adicional e continuar para o formulário com o serviço pré-selecionado.
- O footer apresenta os emails profissionais verificados de Joana Rodrigues e Rosa Queirós. Não existe email geral, telefone ou morada publicados sem confirmação.
- Em mobile existe um atalho fixo de contacto.
- Existe um resumo de privacidade no rodapé da landing page; **não substitui a política de privacidade integral**. O responsável legal, prazos de conservação, bases legais e procedimentos devem ser confirmados antes de tratar dados reais em produção.

### SEO e domínio correto

O `netlify.toml` executa `npm run build && node scripts/finalize-seo.mjs`. Por defeito, o site permanece `noindex` (ideal para apresentação do protótipo) e publica `robots.txt` com `Disallow: /`.

Quando o cliente confirmar o **domínio oficial** (não utilizar o domínio anterior de outra empresa), define a variável de ambiente `PUBLIC_SITE_URL` em Netlify como `https://dominio-oficial.pt` e faz novo deploy. O script irá então:

- publicar a tag canonical, URL Open Graph e imagem social absoluta;
- criar `sitemap.xml` e `robots.txt` que permitem a indexação;
- acrescentar dados estruturados `AccountingService` sem números, moradas ou contactos inventados.

O PNG Open Graph está em `public/brand-social.png`. A configuração `PUBLIC_SITE_URL` só deve ser ativada em produção após confirmação do domínio e revisão dos dados.

Para validar localmente após a build: `node scripts/finalize-seo.mjs` (por defeito noindex).

**Nota:** antes do deploy, rever os emails, informação legal e privacidade com o cliente. Em Netlify Forms, configurar as notificações de submissão no painel, separadamente do envio dos dados.
