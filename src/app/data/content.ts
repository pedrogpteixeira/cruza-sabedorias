export interface Service {
  id: string;
  number: string;
  category: 'Empresas' | 'Particulares' | 'Todos';
  icon: 'book' | 'receipt' | 'users' | 'building' | 'chart' | 'report';
  name: string;
  description: string;
  scope: readonly string[];
  whenToAsk: string;
}

/** Serviços observados no site original CruzaSabedorias. Descrições editoriais reescritas. */
export const services: readonly Service[] = [
  {
    id: 'contabilidade', number: '01', category: 'Empresas', icon: 'book',
    name: 'Contabilidade e Fiscalidade',
    description: 'Organização contabilística e acompanhamento das obrigações fiscais, com informação clara para gerir o dia a dia.',
    scope: ['Organização contabilística', 'Acompanhamento fiscal', 'Informação de apoio à decisão'],
    whenToAsk: 'Se procura organizar documentos e obrigações recorrentes ou pretende compreender melhor a informação contabilística da sua atividade.',
  },
  {
    id: 'irs-irc', number: '02', category: 'Todos', icon: 'receipt',
    name: 'IRS, IRC e Recibos Verdes',
    description: 'Apoio no enquadramento e nas obrigações fiscais de empresas, particulares e profissionais independentes.',
    scope: ['IRS e IRC', 'Trabalhadores independentes', 'Dúvidas e obrigações declarativas'],
    whenToAsk: 'Se precisa de esclarecer o seu enquadramento fiscal, preparar obrigações declarativas ou obter orientação sobre recibos verdes.',
  },
  {
    id: 'salarios', number: '03', category: 'Empresas', icon: 'users',
    name: 'Processamento Salarial',
    description: 'Acompanhamento das rotinas de processamento salarial e das tarefas administrativas relacionadas.',
    scope: ['Processamento de vencimentos', 'Gestão administrativa', 'Obrigações associadas'],
    whenToAsk: 'Se necessita de apoio no processamento de vencimentos e na organização dos procedimentos administrativos associados.',
  },
  {
    id: 'empresas', number: '04', category: 'Empresas', icon: 'building',
    name: 'Abertura e Estruturação de Empresas',
    description: 'Apoio na preparação e organização contabilística e fiscal dos primeiros passos de uma atividade empresarial.',
    scope: ['Início de atividade', 'Estruturação do negócio', 'Enquadramento contabilístico e fiscal'],
    whenToAsk: 'Se está a preparar o início de uma atividade ou quer esclarecer a organização contabilística e fiscal de uma nova empresa.',
  },
  {
    id: 'consultoria', number: '05', category: 'Empresas', icon: 'chart',
    name: 'Consultoria Financeira e de Gestão',
    description: 'Transformar informação financeira em contexto útil para analisar prioridades e apoiar decisões de gestão.',
    scope: ['Acompanhamento de gestão', 'Leitura financeira', 'Apoio à tomada de decisão'],
    whenToAsk: 'Se procura interpretar os dados financeiros da empresa para enquadrar decisões e identificar prioridades de gestão.',
  },
  {
    id: 'relatorios', number: '06', category: 'Empresas', icon: 'report',
    name: 'Relatórios Financeiros',
    description: 'Informação financeira estruturada para perceber a evolução da atividade e avaliar os seus indicadores.',
    scope: ['Análise de informação', 'Relatórios de apoio', 'Indicadores de atividade'],
    whenToAsk: 'Se pretende estruturar indicadores e relatórios que ajudem a acompanhar a evolução económica da sua atividade.',
  },
];

export const profiles = [
  { number: '01', eyebrow: 'EMPRESAS & PME', title: 'O teu negócio merece clareza.', description: 'Da contabilidade ao processamento salarial e à consultoria, uma visão mais estruturada sobre a gestão.', service: 'Contabilidade e Fiscalidade', className: 'business' },
  { number: '02', eyebrow: 'INDEPENDENTES', title: 'Trabalhar por conta própria, com apoio.', description: 'IRS, recibos verdes e obrigações fiscais: orientação para dedicares mais tempo à tua atividade.', service: 'IRS, IRC e Recibos Verdes', className: 'freelance' },
  { number: '03', eyebrow: 'PARTICULARES', title: 'As tuas questões fiscais importam.', description: 'Esclarecimento e apoio em matérias de IRS e enquadramento fiscal, de acordo com a situação de cada pessoa.', service: 'IRS, IRC e Recibos Verdes', className: 'personal' },
] as const;

export const faqs = [
  { q: 'Trabalham com empresas e trabalhadores independentes?', a: 'Sim. Os serviços apresentados incluem contabilidade e fiscalidade para empresas, bem como apoio em IRS, IRC e recibos verdes. O enquadramento concreto depende da sua atividade.' },
  { q: 'Estou a pensar abrir uma empresa. Podem ajudar?', a: 'A abertura e estruturação de empresas faz parte dos serviços apresentados. Contacte-nos para explicar o projeto e conhecer o âmbito do acompanhamento.' },
  { q: 'Posso pedir apoio apenas com o IRS?', a: 'O apoio em IRS está incluído na oferta de serviços. O primeiro contacto permite perceber que ajuda procura e analisar a sua situação.' },
  { q: 'Como funciona o primeiro contacto?', a: 'Descreva brevemente a sua situação através do formulário. A equipa poderá avaliar o pedido e esclarecer os próximos passos e as condições aplicáveis.' },
] as const;

export interface TeamMember {
  id: string;
  index: string;
  initials: string;
  name: string;
  role: string;
  email: string;
  description: string;
  story: string;
}

/** Identificação e biografias fornecidas pela Cruza Sabedorias (captura de "Sobre nós"). */
export const teamMembers: readonly TeamMember[] = [
  {
    id: 'joana-rodrigues',
    index: '01',
    initials: 'JR',
    name: 'Joana Dalila Pereira Rodrigues',
    role: 'Técnica de Contabilidade | Gerente',
    email: 'joana.rodrigues@cruzasabedorias.pt',
    description: 'Responsável pela contabilização de documentos, acompanhamento administrativo da empresa, apoio direto ao contabilista certificado, reuniões e visitas a clientes, envio de declarações e gestão diária dos processos contabilísticos.',
    story: 'Abraçou este projeto ainda grávida da sua filha, nascida em julho de 2021, conciliando desde o início a criação do gabinete com um forte sentido de responsabilidade, organização e compromisso.',
  },
  {
    id: 'rosa-queiros',
    index: '02',
    initials: 'RQ',
    name: 'Rosa Maria Santos Queirós',
    role: 'Assistente Administrativa | Técnica de Contabilidade',
    email: 'rosa.queiros@cruzasabedorias.pt',
    description: 'Responsável pela organização, arquivo e contabilização de documentos, assegurando o suporte administrativo e operacional necessário ao bom funcionamento do gabinete.',
    story: 'Reconhecida pela sua postura responsável e pela atitude positiva no trabalho diário.',
  },
];

export const contactSubjects = services.map(service => service.name);

export const legal = {
  name: 'Fernando Manuel de Lima Oliveira e Silva',
  occNumber: '80496',
} as const;
