const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('<script src="toggle-apply.js">')) {
  html = html.replace('</head>', '  <script src="toggle-apply.js"></script>\n</head>');
}

html = html.replace('<div class="servicos__cta-banner reveal">', '<div class="servicos__cta-banner reveal" data-toggle-id="cta-banner">');

const serviceMap = {
  'NR-11 — Transporte e Movimentação': 'servico-nr11',
  'NR-12 — Segurança em Máquinas': 'servico-nr12',
  'NR-13 — Caldeiras e Vasos de Pressão': 'servico-nr13',
  'Playground': 'servico-playground',
  'Ar Condicionado — PMOC': 'servico-pmoc',
  'Geradores': 'servico-geradores',
  'Elevadores': 'servico-elevadores',
  'Exaustão de Cozinha': 'servico-exaustao',
  'Linha de Gás': 'servico-gas',
  'Máquinas Pesadas': 'servico-maquinas',
  'Andaimes': 'servico-andaimes',
  'Modificação Veicular': 'servico-veicular',
  'AVCB / CLCB': 'servico-avcb',
  'Linha de Vida': 'servico-linha-vida',
  'Sistema de Ancoragem': 'servico-ancoragem',
  'Responsabilidade Técnica': 'servico-rt',
  'Perícia e Assistência Técnica Judicial': 'servico-pericia',
};

const diffMap = {
  'Conformidade ABNT': 'diferencial-abnt',
  'Emissão de ART': 'diferencial-art',
  'Equipe Qualificada': 'diferencial-equipe',
  'Atendimento Ágil': 'diferencial-agil',
};

for (const [title, id] of Object.entries(serviceMap)) {
  const regex = new RegExp(`(<div class="service-card reveal[^>]*>\\s*<div class="service-card__icon[^>]*>.*?<\\/div>\\s*<h4 class="service-card__title">${title})`, 's');
  html = html.replace(regex, (match) => {
    return match.replace('<div class="service-card reveal"', `<div class="service-card reveal" data-toggle-id="${id}"`);
  });
}

for (const [title, id] of Object.entries(diffMap)) {
  const regex = new RegExp(`(<div class="diferencial-card reveal[^>]*>\\s*<div class="diferencial-card__icon[^>]*>.*?<\\/div>\\s*<h3>${title})`, 's');
  html = html.replace(regex, (match) => {
    return match.replace(/<div class="diferencial-card reveal[^>]*"/, `$& data-toggle-id="${id}"`);
  });
}

fs.writeFileSync('index.html', html);
console.log('Done');
