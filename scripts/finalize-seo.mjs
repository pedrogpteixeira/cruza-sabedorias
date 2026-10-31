import { existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Finalize SEO for a static Netlify deployment.
 * - An official HTTPS origin is required before a build becomes indexable.
 * - Netlify deploy previews and branch builds never become indexable, even if
 *   PUBLIC_SITE_URL is accidentally shared across all deployment contexts.
 * - `npm start` remains indexable locally so Lighthouse can audit without
 *   failing the 'blocked from indexing' check on localhost.
 */
const directory = 'dist/cruza-sabedorias/browser';
const indexPath = join(directory, 'index.html');
if (!existsSync(indexPath)) {
  throw new Error('Build Angular não encontrada. Executa npm run build antes de finalizar o SEO.');
}

const configuredUrl = process.env.PUBLIC_SITE_URL?.trim() ?? '';
const context = process.env.CONTEXT?.trim() ?? '';
const isPreview = context !== '' && context !== 'production';
let origin = null;

if (configuredUrl) {
  const url = new URL(configuredUrl);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('PUBLIC_SITE_URL deve ser uma origem HTTPS sem caminho, parâmetros ou credenciais.');
  }
  if (!isPreview) origin = url.origin;
}

const robotsPattern = /<meta name="robots" content="(?:index,follow|noindex,nofollow)">/;
let html = readFileSync(indexPath, 'utf8');
if (!robotsPattern.test(html)) {
  throw new Error('Meta robots não encontrada no HTML. É necessário rever a configuração SEO.');
}

if (origin) {
  html = html.replace(robotsPattern, '<meta name="robots" content="index,follow">');
  html = html.replace(/(<meta property="og:image" content=")[^"]*(">)/, `$1${origin}/brand-social.png$2`);
  html = html.replace(/(<meta name="twitter:image" content=")[^"]*(">)/, `$1${origin}/brand-social.png$2`);

  const services = [
    'Contabilidade e Fiscalidade',
    'IRS, IRC e Recibos Verdes',
    'Processamento Salarial',
    'Abertura e Estruturação de Empresas',
    'Consultoria Financeira e de Gestão',
    'Relatórios Financeiros',
  ];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: `${origin}/`,
        name: 'Cruza Sabedorias',
        inLanguage: 'pt-PT',
      },
      {
        '@type': 'AccountingService',
        '@id': `${origin}/#empresa`,
        name: 'Cruza Sabedorias',
        url: `${origin}/`,
        logo: `${origin}/cruza-sabedorias-symbol-footer.png`,
        description: 'Serviços de contabilidade, fiscalidade e consultoria financeira para empresas, profissionais independentes e particulares.',
        areaServed: { '@type': 'Country', name: 'Portugal' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Serviços de contabilidade e consultoria',
          itemListElement: services.map(name => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name },
          })),
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${origin}/#pagina`,
        url: `${origin}/`,
        name: 'Cruza Sabedorias | Contabilidade e Consultoria Financeira',
        inLanguage: 'pt-PT',
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': `${origin}/#empresa` },
      },
    ],
  };
  const tags = [
    `<link rel="canonical" href="${origin}/">`,
    `<meta property="og:url" content="${origin}/">`,
    `<script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>`,
  ].join('\n  ');

  html = html.replace('</head>', `  ${tags}\n</head>`);
  writeFileSync(join(directory, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  writeFileSync(join(directory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${origin}/</loc></url>\n</urlset>\n`);
  console.log(`SEO público preparado para o domínio oficial: ${origin}`);
} else {
  html = html.replace(robotsPattern, '<meta name="robots" content="noindex,nofollow">');
  // Do not keep a stale sitemap from a previous local production test.
  rmSync(join(directory, 'sitemap.xml'), { force: true });
  writeFileSync(join(directory, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  console.log(isPreview
    ? 'Deploy de pré-visualização: não indexável, independentemente de PUBLIC_SITE_URL.'
    : 'Domínio oficial não definido: protótipo protegido com noindex.');
}

writeFileSync(indexPath, html);
