// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: GERADOR DE ÍCONES
// ═══════════════════════════════════════════════════════════════════════════

const GeradorIcones = {
  // ── GERAR ÍCONE SVG BASE ──
  generateBaseSVG(projectName, color = '#3b82f6') {
    const initials = projectName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="512" fill="${color}"/>
  
  <!-- Gradient -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Rounded rectangle -->
  <rect width="512" height="512" rx="100" fill="url(#grad)"/>
  
  <!-- Text -->
  <text x="256" y="300" font-size="200" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial">
    ${initials}
  </text>
</svg>`;
  },

  // ── GERAR ÍCONES EM DIFERENTES TAMANHOS ──
  generateIconSizes(projectName, color = '#3b82f6') {
    const baseSVG = this.generateBaseSVG(projectName, color);

    const sizes = {
      'icon-16.svg': baseSVG,
      'icon-32.svg': baseSVG,
      'icon-64.svg': baseSVG,
      'icon-128.svg': baseSVG,
      'icon-192.svg': baseSVG,
      'icon-256.svg': baseSVG,
      'icon-512.svg': baseSVG,
      'favicon.svg': baseSVG,
      'apple-touch-icon.svg': baseSVG
    };

    return sizes;
  },

  // ── GERAR ICO PARA WINDOWS ──
  generateICO(projectName, color = '#3b82f6') {
    // Nota: Para gerar ICO real, seria necessário usar canvas ou biblioteca
    // Aqui retornamos um placeholder que pode ser convertido online
    return `<!-- Ícone ICO (converter SVG em ICO em: https://convertio.co/svg-ico/) -->
<!-- Arquivo: favicon.ico -->`;
  },

  // ── GERAR ICNS PARA MACOS ──
  generateICNS(projectName, color = '#3b82f6') {
    // Nota: ICNS é formato binário, precisa de ferramenta específica
    return `<!-- Ícone ICNS (usar: https://icoconvert.com/) -->
<!-- Arquivo: icon.icns -->`;
  },

  // ── GERAR TODOS OS ÍCONES ──
  generateAllIcons(project, color = '#3b82f6') {
    const icons = this.generateIconSizes(project.name, color);

    // Adicionar ao projeto
    Object.entries(icons).forEach(([name, content]) => {
      project.files[`assets/icons/${name}`] = content;
    });

    // Adicionar referências no HTML
    const htmlRef = `
<!-- Ícones PWA -->
<link rel="icon" type="image/svg+xml" href="./assets/icons/favicon.svg">
<link rel="apple-touch-icon" href="./assets/icons/apple-touch-icon.svg">
<link rel="manifest" href="./manifest.json">
`;

    return htmlRef;
  }
};
