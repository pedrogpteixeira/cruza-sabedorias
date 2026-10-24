import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The official domain is configured on Netlify as PUBLIC_SITE_URL.
// Previews stay noindex to avoid presenting the client's previous wrong domain as canonical.
const directory = 'dist/cruza-sabedorias/browser';
const output = join(directory, 'index.html');
if (!existsSync(output)) throw new Error('Angular build output não encontrado. Executa npm run build antes deste script.');
const raw = process.env.PUBLIC_SITE_URL?.trim() ?? '';
let origin = null;
if (raw) {
  const url = new URL(raw);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || (url.pathname !== '/' && url.pathname !== '')) {
    throw new Error('PUBLIC_SITE_URL tem de ser um domínio HTTPS sem caminho, parâmetros ou credenciais.');
  }
  origin = url.origin;
}
let html = readFileSync(output, 'utf8');
if (origin) {
  html = html.replace('<meta name="robots" content="noindex,nofollow">', '<meta name="robots" content="index,follow">');
  html = html.replace('<meta property="og:image" content="/brand-social.png">', `<meta property="og:image" content="${origin}/brand-social.png">`);
  html = html.replace('<meta name="twitter:image" content="/brand-social.png">', `<meta name="twitter:image" content="${origin}/brand-social.png">`);
  const metadata = [
    `<link rel="canonical" href="${origin}/">`,
    `<meta property="og:url" content="${origin}/">`,
    `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AccountingService',
      name: 'Cruza Sabedorias',
      url: `${origin}/`,
      description: 'Serviços de contabilidade, fiscalidade e consultoria financeira para empresas, independentes e particulares.',
      areaServed: 'PT',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Serviços',
        itemListElement: ['Contabilidade e Fiscalidade','IRS, IRC e Recibos Verdes','Processamento Salarial','Abertura e Estruturação de Empresas','Consultoria Financeira e de Gestão','Relatórios Financeiros'].map(name => ({ '@type': 'OfferCatalog', name })),
      },
    }).replaceAll('<', '\\u003c')}</script>`,
  ].join('\n  ');
  html = html.replace('</head>', `  ${metadata}\n</head>`);
  writeFileSync(join(directory, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  writeFileSync(join(directory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`);
  console.log(`SEO publicado com domínio oficial: ${origin}`);
} else {
  writeFileSync(join(directory, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  console.log('PUBLIC_SITE_URL não definido: protótipo noindex; sem domínio canónico nem sitemap público.');
}
writeFileSync(output, html);
