/* ============================================================
   FULLTECH CONGO — VANILLA JS REIMPLEMENTATION
   Source: React prototype supplied by the user.
   Architecture preserved: state -> storage -> auth -> nav -> pages -> modals -> calculations.
============================================================ */

(() => {
  'use strict';

  /* ============================== CONSTANTS ============================== */
  const INK = '#0A0A0A';
  const INK_2 = '#1C1C1C';
  const PAPER = '#F2F2F2';
  const ACCENT = '#E31E24';
  const ACCENT_DARK = '#B0141A';
  const STEEL = '#8B8F94';
  const GOOD = '#1E7A4C';
  const BAD = '#A61C1C';
  const LINE = '#E2E2E2';

  const NATURES = ['Achat', 'Transport', 'Fret maritime', 'Marketing', 'Operationnel', 'Imprevu'];
  const CATEGORIES_LIEES = ['Pneu', 'Chambre a air', 'Commun'];
  const DEVISES = ['USD', 'CDF'];
  const MODES_PAIEMENT = ['Especes', 'Mobile Money', 'Virement bancaire', 'Cheque'];
  const CAT_PRODUIT = ['Pneu', 'Chambre a air'];

  const fmt = (n) => (Number(n) || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $';
  const fmt0 = (n) => (Number(n) || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 });
  const pct = (n) => ((Number(n) || 0) * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' %';
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const pad4 = (n) => String(n).padStart(4, '0');

  /* ============================== STORAGE ============================== */
  const STORAGE_PREFIX = 'fulltech-congo-gestion:';

  const storage = {
    async get(key) {
      try {
        const raw = localStorage.getItem(STORAGE_PREFIX + key);
        return raw ? JSON.parse(raw) : null;
      } catch (_) {
        return null;
      }
    },
    async set(key, value) {
      try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        return true;
      } catch (_) {
        return false;
      }
    }
  };

  /* ============================== DEFAULT DATA ============================== */
  function defaultSettings() {
    return {
      tauxChange: 2800,
      margeCible: 0.40,
      methodePrix: 'marge',
      methodeRepartition: 'quantite',
      seuilPneu: 20,
      seuilChambre: 100,
      nextFactureNo: 4,
      entreprise: {
        nom: 'FullTech Congo',
        telephone: '+243 8XX XXX XXX',
        adresse: 'Av. du Commerce, Kinshasa, RDC',
        logo: '',
        conditions: 'Paiement a la livraison ou sous 7 jours. Marchandise vendue non reprise.'
      }
    };
  }

  function defaultUsers() {
    return [
      { id: uid(), username: 'admin', password: 'FullTech@2026', role: 'admin', nom: 'Administrateur', question: 'Quel est le nom de votre ville de naissance ?', reponse: 'Kinshasa' },
      { id: uid(), username: 'vendeur', password: 'Vente@2026', role: 'vendeur', nom: 'Vendeur Kinshasa', question: 'Quel est le nom de votre premier vehicule ?', reponse: 'Toyota' }
    ];
  }

  function defaultProducts() {
    return [
      { id: 'p1', ref: 'PNEU-001', marque: 'A definir', dimension: '185/65 R14', categorie: 'Pneu', qteAchetee: 100, prixAchatUnitaire: 9.82 },
      { id: 'p2', ref: 'CHAM-001', marque: 'A definir', dimension: 'Standard', categorie: 'Chambre a air', qteAchetee: 1000, prixAchatUnitaire: 0.98 }
    ];
  }

  function defaultClients() {
    return [
      { id: 'c1', nom: 'Kongo Motors', telephone: '+243 890 111 111', adresse: 'Limete, Kinshasa' },
      { id: 'c2', nom: 'Garage Delta', telephone: '+243 890 222 222', adresse: 'Kinshasa' },
      { id: 'c3', nom: 'Kinshasa Auto Parts', telephone: '+243 890 333 333', adresse: 'Kinshasa' }
    ];
  }

  function defaultSales() {
    return [
      { id: 's1', numero: 'FAC-2026-0001', date: '2026-01-15', clientId: 'c1', items: [{ productId: 'p1', qte: 10, prix: 35, remise: 0 }], montantPaye: 350, mode: 'Mobile Money', vendeur: 'admin' },
      { id: 's2', numero: 'FAC-2026-0002', date: '2026-01-18', clientId: 'c2', items: [{ productId: 'p2', qte: 50, prix: 3.2, remise: 10 }], montantPaye: 100, mode: 'Especes', vendeur: 'admin' },
      { id: 's3', numero: 'FAC-2026-0003', date: '2026-02-02', clientId: 'c3', items: [{ productId: 'p1', qte: 5, prix: 35, remise: 0 }], montantPaye: 0, mode: 'Virement bancaire', vendeur: 'admin' }
    ];
  }

  function defaultExpenses() {
    return [
      { id: uid(), date: '2026-01-01', nature: 'Achat', categorieLiee: 'Chambre a air', description: '1000 chambres a air x 0,98 USD', montant: 980, devise: 'USD', fournisseur: 'Fournisseur Chine', mode: 'Virement bancaire', type: 'Exceptionnelle' },
      { id: uid(), date: '2026-01-01', nature: 'Achat', categorieLiee: 'Pneu', description: '100 pneus x 9,82 USD', montant: 982, devise: 'USD', fournisseur: 'Fournisseur Chine', mode: 'Virement bancaire', type: 'Exceptionnelle' },
      { id: uid(), date: '2026-01-01', nature: 'Marketing', categorieLiee: 'Commun', description: 'Impression du logo sur pneus et chambres a air', montant: 90, devise: 'USD', fournisseur: '-', mode: 'Especes', type: 'Exceptionnelle' },
      { id: uid(), date: '2026-01-02', nature: 'Transport', categorieLiee: 'Commun', description: 'Envoi de la marchandise au port', montant: 170, devise: 'USD', fournisseur: '-', mode: 'Especes', type: 'Exceptionnelle' },
      { id: uid(), date: '2026-01-02', nature: 'Transport', categorieLiee: 'Commun', description: 'Transport aller-retour usine - photographe', montant: 28, devise: 'USD', fournisseur: '-', mode: 'Especes', type: 'Exceptionnelle' },
      { id: uid(), date: '2026-01-03', nature: 'Fret maritime', categorieLiee: 'Pneu', description: 'Transport maritime des pneus', montant: 1000, devise: 'USD', fournisseur: 'Compagnie maritime', mode: 'Virement bancaire', type: 'Exceptionnelle' },
      { id: uid(), date: '2026-01-03', nature: 'Fret maritime', categorieLiee: 'Chambre a air', description: 'Transport maritime des chambres a air', montant: 700, devise: 'USD', fournisseur: 'Compagnie maritime', mode: 'Virement bancaire', type: 'Exceptionnelle' },
      { id: uid(), date: '2026-01-04', nature: 'Marketing', categorieLiee: 'Commun', description: 'Creation du site e-commerce', montant: 200, devise: 'USD', fournisseur: 'Freelance', mode: 'Mobile Money', type: 'Exceptionnelle' },
      { id: uid(), date: '2026-01-04', nature: 'Marketing', categorieLiee: 'Commun', description: 'Photos et videos publicitaires', montant: 150, devise: 'USD', fournisseur: 'Freelance', mode: 'Mobile Money', type: 'Exceptionnelle' },
      { id: uid(), date: '2026-01-04', nature: 'Operationnel', categorieLiee: 'Commun', description: 'Tente personnalisee', montant: 170, devise: 'USD', fournisseur: '-', mode: 'Especes', type: 'Exceptionnelle' },
      { id: uid(), date: '2026-01-04', nature: 'Imprevu', categorieLiee: 'Commun', description: 'Provision imprevus et divers', montant: 100, devise: 'USD', fournisseur: '-', mode: 'Especes', type: 'Exceptionnelle' },
      { id: uid(), date: '2026-01-05', nature: 'Operationnel', categorieLiee: 'Commun', description: 'Loyer entrepot - janvier', montant: 150, devise: 'USD', fournisseur: 'Bailleur', mode: 'Virement bancaire', type: 'Fixe' },
      { id: uid(), date: '2026-01-05', nature: 'Operationnel', categorieLiee: 'Commun', description: 'Salaire agent commercial - janvier', montant: 300, devise: 'USD', fournisseur: '-', mode: 'Especes', type: 'Fixe' },
      { id: uid(), date: '2026-01-10', nature: 'Operationnel', categorieLiee: 'Commun', description: 'Carburant moto de livraison', montant: 40, devise: 'USD', fournisseur: 'Station Engen', mode: 'Especes', type: 'Variable' },
      { id: uid(), date: '2026-01-15', nature: 'Operationnel', categorieLiee: 'Commun', description: 'Commission transfert Mobile Money', montant: 15, devise: 'USD', fournisseur: 'Vodacom', mode: 'Mobile Money', type: 'Variable' },
      { id: uid(), date: '2026-01-20', nature: 'Operationnel', categorieLiee: 'Commun', description: 'Gardiennage du depot - janvier', montant: 50, devise: 'USD', fournisseur: 'Agence securite', mode: 'Especes', type: 'Fixe' }
    ];
  }

  const state = {
    settings: defaultSettings(),
    users: defaultUsers(),
    products: defaultProducts(),
    clients: defaultClients(),
    sales: defaultSales(),
    expenses: defaultExpenses(),
    session: null,
    page: 'dashboard',
    invoiceSale: null,
    mobileSidebar: false,
    charts: {}
  };

  const app = document.getElementById('app');
  const modalRoot = document.getElementById('modal-root');

  /* ============================== HELPERS ============================== */
  const esc = (value) => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  const icon = (name, size = 16, extra = '') => `<i data-lucide="${name}" width="${size}" height="${size}" class="${extra}"></i>`;

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  }

  function toast(message, type = 'neutral') {
    const el = document.createElement('div');
    el.className = `toast ${type === 'good' ? 'good' : type === 'bad' ? 'bad' : ''}`;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  async function loadCollections() {
    const keys = [
      ['settings', 'settings', defaultSettings],
      ['users', 'users', defaultUsers],
      ['products', 'products', defaultProducts],
      ['clients', 'clients', defaultClients],
      ['sales', 'sales', defaultSales],
      ['expenses', 'expenses', defaultExpenses]
    ];
    for (const [key, prop, maker] of keys) {
      const saved = await storage.get(key);
      if (saved !== null && saved !== undefined) state[prop] = saved;
    }
  }

  async function persist(key, value) {
    state[key] = value;
    await storage.set(key, value);
  }

  function currentUserIsAdmin() { return state.session?.role === 'admin'; }

  /* ============================== BRAND ============================== */
  function ftLogo(size = 36) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0"><rect width="40" height="40" rx="9" fill="${INK}"/><path d="M27.5 8.5 C33 8.5 36.5 13.5 36.5 20 C36.5 26.5 33 31.5 27.5 31.5" stroke="${STEEL}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".85"/><text x="8" y="27" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-style="italic" font-size="20" fill="#fff">F</text><text x="19" y="27" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-style="italic" font-size="20" fill="${ACCENT}">T</text></svg>`;
  }

  function brandMark(tagline = false) {
    return `<div class="brand-mark">${ftLogo(44)}<div class="text-center leading-none"><span class="text-lg font-black italic tracking-tight" style="color:${INK}">FULL</span><span class="text-lg font-black italic tracking-tight" style="color:${ACCENT}">TECH</span><span class="ml-1 text-lg font-black italic tracking-tight" style="color:${STEEL}">CONGO</span></div>${tagline ? `<div class="text-[10px] font-semibold tracking-widest" style="color:${ACCENT}">PERFORMANCE • DURABILITE • CONFIANCE</div>` : ''}</div>`;
  }

  /* ============================== CALCULATIONS ============================== */
  function expenseUSD(e, settings = state.settings) {
    return e.devise === 'CDF' ? (Number(e.montant) || 0) / (Number(settings.tauxChange) || 1) : (Number(e.montant) || 0);
  }

  function saleTotal(sale) {
    return sale.items.reduce((s, i) => s + (Number(i.qte) || 0) * (Number(i.prix) || 0) - (Number(i.remise) || 0), 0);
  }

  function saleSolde(sale) { return saleTotal(sale) - (Number(sale.montantPaye) || 0); }

  function saleStatut(sale) {
    const solde = saleSolde(sale);
    if (solde <= 0.009) return 'Paye';
    if ((Number(sale.montantPaye) || 0) > 0) return 'Partiel';
    return 'Impaye';
  }

  function costEngine() {
    const products = state.products;
    const expenses = state.expenses;
    const settings = state.settings;
    const byCat = { 'Pneu': { qte: 0, val: 0 }, 'Chambre a air': { qte: 0, val: 0 } };
    products.forEach((p) => {
      if (!byCat[p.categorie]) byCat[p.categorie] = { qte: 0, val: 0 };
      byCat[p.categorie].qte += Number(p.qteAchetee) || 0;
      byCat[p.categorie].val += (Number(p.qteAchetee) || 0) * (Number(p.prixAchatUnitaire) || 0);
    });
    const totalQte = Object.values(byCat).reduce((a,b) => a + b.qte, 0) || 1;
    const totalVal = Object.values(byCat).reduce((a,b) => a + b.val, 0) || 1;
    const allocatable = expenses.filter(e => ['Transport','Fret maritime','Marketing'].includes(e.nature));
    const commun = allocatable.filter(e => e.categorieLiee === 'Commun').reduce((s,e) => s + expenseUSD(e,settings),0);
    const directBy = {};
    allocatable.forEach(e => {
      if (e.categorieLiee !== 'Commun') directBy[e.categorieLiee] = (directBy[e.categorieLiee] || 0) + expenseUSD(e,settings);
    });
    const fraisTotalByCat = {};
    Object.keys(byCat).forEach(cat => {
      const ratio = settings.methodeRepartition === 'valeur' ? byCat[cat].val / totalVal : byCat[cat].qte / totalQte;
      fraisTotalByCat[cat] = (directBy[cat] || 0) + commun * ratio;
    });
    const fraisUnitaireByCat = {};
    Object.keys(byCat).forEach(cat => {
      fraisUnitaireByCat[cat] = byCat[cat].qte > 0 ? fraisTotalByCat[cat] / byCat[cat].qte : 0;
    });
    const margeCible = Number(settings.margeCible) || 0.4;
    const priceFor = (coutRevient) => settings.methodePrix === 'majoration'
      ? coutRevient * (1 + margeCible)
      : (margeCible < 1 ? coutRevient / (1 - margeCible) : coutRevient);
    return { byCat, fraisUnitaireByCat, priceFor, totalDepensesAllocables: commun + Object.values(directBy).reduce((a,b)=>a+b,0) };
  }

  function enrichedProducts() {
    const engine = costEngine();
    return state.products.map((p) => {
      const qteVendue = state.sales.reduce((s, sale) => s + sale.items.filter(i => i.productId === p.id).reduce((a,i) => a + (Number(i.qte)||0),0),0);
      const stockDispo = (Number(p.qteAchetee)||0) - qteVendue;
      const fraisUnitaire = engine.fraisUnitaireByCat[p.categorie] || 0;
      const coutRevient = (Number(p.prixAchatUnitaire)||0) + fraisUnitaire;
      const prixConseille = engine.priceFor(coutRevient);
      let sumMontant=0, sumQte=0;
      state.sales.forEach(sale => sale.items.filter(i=>i.productId===p.id).forEach(i => { sumMontant += (Number(i.prix)||0)*(Number(i.qte)||0); sumQte += Number(i.qte)||0; }));
      const prixReelMoyen = sumQte > 0 ? sumMontant/sumQte : prixConseille;
      const margeUnitaire = prixReelMoyen - coutRevient;
      const margeTotale = margeUnitaire * qteVendue;
      const pctMarge = prixReelMoyen > 0 ? margeUnitaire / prixReelMoyen : 0;
      const seuil = p.categorie === 'Pneu' ? state.settings.seuilPneu : p.categorie === 'Chambre a air' ? state.settings.seuilChambre : 0;
      return { ...p, qteVendue, stockDispo, fraisUnitaire, coutRevient, prixConseille, prixReelMoyen, margeUnitaire, margeTotale, pctMarge, seuil };
    });
  }

  /* ============================== GENERIC UI ============================== */
  function pageHeader(title, subtitle, action='') {
    return `<div class="flex flex-wrap items-center justify-between gap-3"><div><h2 class="section-title">${esc(title)}</h2>${subtitle ? `<p class="section-subtitle">${esc(subtitle)}</p>`:''}</div>${action}</div>`;
  }

  function card(content, cls='') { return `<div class="ft-card ${cls}">${content}</div>`; }

  function field(label, inputHtml, cls='') {
    return `<label class="flex flex-col gap-1 text-sm ${cls}"><span class="text-xs font-semibold uppercase tracking-wide" style="color:#6B6B6B">${esc(label)}</span>${inputHtml}</label>`;
  }

  function input(name, type='text', value='', placeholder='', extra='') {
    const isAttributeString = /[=]/.test(extra);
    const attrs = isAttributeString ? ` ${extra}` : '';
    const classes = isAttributeString ? '' : ` ${extra}`;
    return `<input id="${name}" name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" class="ft-input${classes}"${attrs}>`;
  }

  function select(name, options, value='', extra='') {
    return `<select id="${name}" name="${name}" class="ft-input ${extra}">${options.map(o => `<option value="${esc(o)}" ${String(o)===String(value)?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
  }

  function btn(label, variant='primary', attrs='', iconName='', small=false) {
    return `<button class="ft-btn ft-btn-${variant} ${small?'!px-2.5 !py-1.5 !text-xs':''}" ${attrs}>${iconName ? icon(iconName, small?13:15) : ''}<span>${label}</span></button>`;
  }

  function badge(label, tone='neutral') {
    const map = {
      good:['#E7F3EC',GOOD], bad:['#FBEAE9',BAD], warn:['#FDF0E4',ACCENT_DARK], neutral:['#EDEDED','#4A4A4A']
    };
    const [bg,fg] = map[tone] || map.neutral;
    return `<span class="ft-badge" style="background:${bg};color:${fg}">${esc(label)}</span>`;
  }

  function emptyState(text) { return `<div class="empty-state">${esc(text)}</div>`; }

  /* ============================== APP SHELL ============================== */
  function navItems() {
    const all = [
      ['dashboard','Tableau de bord','layout-dashboard',['admin','vendeur']],
      ['produits','Produits & stocks','package',['admin','vendeur']],
      ['achats','Achats & depenses','receipt',['admin']],
      ['ventes','Ventes & factures','shopping-cart',['admin','vendeur']],
      ['clients','Clients','users',['admin','vendeur']],
      ['rapports','Rapports','bar-chart-3',['admin','vendeur']],
      ['parametres','Parametres','settings',['admin']],
      ['utilisateurs','Utilisateurs','user',['admin']]
    ];
    return all.filter(n => n[3].includes(state.session.role));
  }

  function renderAppShell() {
    const nav = navItems();
    const logoHtml = state.settings.entreprise.logo ? `<img src="${esc(state.settings.entreprise.logo)}" alt="logo" class="h-9 w-9 rounded-lg object-cover">` : ftLogo(36);
    app.innerHTML = `
      <div class="app-shell">
        <aside id="sidebar" class="sidebar ${state.mobileSidebar?'open':''}">
          <div>
            <div class="mb-6 flex items-center gap-2 px-2">${logoHtml}<div class="leading-tight"><div class="text-sm font-bold text-white">${esc(state.settings.entreprise.nom)}</div><div class="text-[10px] font-semibold tracking-wide" style="color:${ACCENT}">PERFORMANCE • DURABILITE • CONFIANCE</div></div></div>
            <nav class="flex flex-col gap-1">${nav.map(([key,label,ico])=>`<button class="sidebar-link ${state.page===key?'active':''}" data-nav="${key}">${icon(ico,16)}<span>${esc(label)}</span></button>`).join('')}</nav>
          </div>
          <div class="border-t px-2 pt-3" style="border-color:#2A3543">
            <div class="mb-2 flex items-center gap-2 text-xs" style="color:#9AA3AE"><div class="flex h-7 w-7 items-center justify-center rounded-full text-white" style="background:${INK_2}">${icon('user',14)}</div><div><div class="font-semibold text-white">${esc(state.session.nom)}</div><div class="capitalize">${esc(state.session.role)}</div></div></div>
            <button id="logout-btn" class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium" style="color:#C7CCD3">${icon('log-out',15)}Se deconnecter</button>
          </div>
        </aside>
        <main class="main-panel">
          <div class="mb-4 flex items-center justify-between md:hidden"><button id="mobile-menu-btn" class="ft-btn ft-btn-ghost">${icon('menu',17)}Menu</button><span class="text-xs font-semibold" style="color:#6B6B6B">${esc(state.settings.entreprise.nom)}</span></div>
          <div id="page-container"></div>
        </main>
      </div>`;
    renderCurrentPage();
    document.querySelectorAll('[data-nav]').forEach(el => el.addEventListener('click', () => { state.page = el.dataset.nav; state.mobileSidebar = false; renderAppShell(); }));
    document.getElementById('logout-btn')?.addEventListener('click', () => { state.session = null; state.mobileSidebar=false; renderRoot(); });
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => { state.mobileSidebar = true; document.getElementById('sidebar')?.classList.add('open'); });
    refreshIcons();
  }

  function renderRoot() {
    if (!state.session) renderLogin(); else renderAppShell();
  }

  /* ============================== LOGIN ============================== */
  function renderLogin() {
    app.innerHTML = `<div class="login-shell"><div class="login-card fade-in"><div class="mb-6 flex flex-col items-center gap-1 text-center">${brandMark(true)}<div class="mt-2 text-xs" style="color:#6B6B6B">Gestion financiere - Pneus & chambres a air</div></div><div id="login-notice"></div><form id="login-form" class="flex flex-col gap-3">${field('Identifiant', input('login-username','text','','admin ou vendeur'))}${field('Mot de passe', input('login-password','password','','********'))}<div id="login-error"></div>${btn('Se connecter','primary','type="submit"','lock')}<button id="forgot-btn" type="button" class="self-center text-xs font-semibold underline-offset-2 hover:underline" style="color:${ACCENT}">Mot de passe oublie ?</button></form><div class="mt-5 rounded-lg p-3 leading-relaxed" style="background:${PAPER};color:#6B6B6B;font-size:11px">Demo : <b>admin / FullTech@2026</b> (acces complet) ou <b>vendeur / Vente@2026</b> (ventes et factures uniquement).<br>Prototype fonctionnant dans votre navigateur : pour un usage reel a Kinshasa avec plusieurs postes, prevoir un hebergement avec authentification renforcee.</div></div></div>`;
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
      const u = state.users.find(x => x.username.toLowerCase() === username.toLowerCase() && x.password === password);
      if (!u) { document.getElementById('login-error').innerHTML = `<div class="rounded-md px-3 py-2 text-xs" style="background:#FBEAE9;color:${BAD}">Identifiant ou mot de passe incorrect.</div>`; return; }
      state.session = { username:u.username, role:u.role, nom:u.nom };
      state.page = 'dashboard';
      renderRoot();
    });
    document.getElementById('forgot-btn').addEventListener('click', () => showForgotPasswordModal());
    refreshIcons();
  }

  function showForgotPasswordModal() {
    openModal('Mot de passe oublie', `<div id="forgot-modal-content"></div>`);
    let step = 1, username='', answer='', pass1='', pass2='';
    const draw = () => {
      const root = document.getElementById('forgot-modal-content');
      root.innerHTML = step===1 ? `<form id="forgot-1" class="flex flex-col gap-3"><div class="text-sm" style="color:#4A4A4A">Saisissez votre identifiant pour retrouver votre question de securite.</div>${field('Identifiant', input('fp-user','text',username,'admin ou vendeur'))}<div id="fp-error"></div><div class="flex justify-end gap-2">${btn('Annuler','ghost','type="button" id="fp-cancel"')}${btn('Continuer','primary','type="submit"')}</div></form>`
      : step===2 ? `<form id="forgot-2" class="flex flex-col gap-3"><div class="text-sm" style="color:#4A4A4A">${esc(state.users.find(x=>x.username.toLowerCase()===username.toLowerCase())?.question || '')}</div>${field('Votre reponse', input('fp-answer','text',answer))}<div id="fp-error"></div><div class="flex justify-end gap-2">${btn('Retour','ghost','type="button" id="fp-back"')}${btn('Verifier','primary','type="submit"')}</div></form>`
      : `<form id="forgot-3" class="flex flex-col gap-3"><div class="text-sm" style="color:#4A4A4A">Identite confirmee. Definissez un nouveau mot de passe pour <b>${esc(username)}</b>.</div>${field('Nouveau mot de passe', input('fp-p1','password',pass1))}${field('Confirmer le mot de passe', input('fp-p2','password',pass2))}<div id="fp-error"></div><div class="flex justify-end gap-2">${btn('Annuler','ghost','type="button" id="fp-cancel"')}${btn('Enregistrer le nouveau mot de passe','primary','type="submit"','save')}</div></form>`;
      bind(); refreshIcons();
    };
    const showErr = msg => { const el = document.getElementById('fp-error'); if (el) el.innerHTML = `<div class="rounded-md px-3 py-2 text-xs" style="background:#FBEAE9;color:${BAD}">${esc(msg)}</div>`; };
    const bind = () => {
      document.getElementById('fp-cancel')?.addEventListener('click', closeModal);
      document.getElementById('fp-back')?.addEventListener('click', () => { step=1; draw(); });
      document.getElementById('forgot-1')?.addEventListener('submit', e => { e.preventDefault(); username=document.getElementById('fp-user').value.trim(); const u=state.users.find(x=>x.username.toLowerCase()===username.toLowerCase()); if(!u){showErr('Aucun compte ne correspond a cet identifiant.');return;} if(!u.question||!u.reponse){showErr('Aucune question de securite n\'est configuree pour ce compte. Contactez un administrateur.');return;} step=2; draw(); });
      document.getElementById('forgot-2')?.addEventListener('submit', e => { e.preventDefault(); answer=document.getElementById('fp-answer').value; const u=state.users.find(x=>x.username.toLowerCase()===username.toLowerCase()); if(answer.trim().toLowerCase()!==String(u.reponse).trim().toLowerCase()){showErr('Reponse incorrecte.');return;} step=3; draw(); });
      document.getElementById('forgot-3')?.addEventListener('submit', async e => { e.preventDefault(); pass1=document.getElementById('fp-p1').value; pass2=document.getElementById('fp-p2').value; if(pass1.length<4){showErr('Le mot de passe doit contenir au moins 4 caracteres.');return;} if(pass1!==pass2){showErr('Les deux mots de passe ne correspondent pas.');return;} state.users=state.users.map(u=>u.username.toLowerCase()===username.toLowerCase()?{...u,password:pass1}:u); await persist('users',state.users); closeModal(); document.getElementById('login-notice').innerHTML = `<div class="mb-3 rounded-md px-3 py-2 text-xs" style="background:#E7F3EC;color:${GOOD}">Mot de passe reinitialise. Vous pouvez vous connecter.</div>`; });
    };
    draw();
  }

  /* ============================== MODALS ============================== */
  function openModal(title, body, wide=false, onClose=null) {
    modalRoot.innerHTML = `<div class="modal-backdrop fade-in" id="modal-backdrop"><div class="modal-panel ${wide?'wide':''}" role="dialog" aria-modal="true"><div class="flex items-center justify-between px-5 py-4" style="border-bottom:1px solid ${LINE}"><h3 class="text-base font-bold" style="color:${INK}">${esc(title)}</h3><button id="modal-close" class="rounded p-1 hover:bg-black/5">${icon('x',18)}</button></div><div class="p-5">${body}</div></div></div>`;
    const close = () => { modalRoot.innerHTML=''; if(onClose) onClose(); };
    document.getElementById('modal-close').addEventListener('click', close);
    document.getElementById('modal-backdrop').addEventListener('mousedown', e => { if(e.target.id==='modal-backdrop') close(); });
    modalRoot.dataset.close = '1';
    modalRoot._close = close;
    refreshIcons();
  }
  function closeModal() { modalRoot.innerHTML=''; modalRoot._close=null; }

  /* ============================== DASHBOARD ============================== */
  function renderDashboard() {
    const enriched = enrichedProducts();
    const ca = state.sales.reduce((s,sale)=>s+saleTotal(sale),0);
    const cogs = state.sales.reduce((s,sale)=>s+sale.items.reduce((a,i)=>{ const p=enriched.find(x=>x.id===i.productId); return a+(p?p.coutRevient*(Number(i.qte)||0):0); },0),0);
    const depensesTotales = state.expenses.reduce((s,e)=>s+expenseUSD(e),0);
    const margeBrute = ca-cogs;
    const stockValue = enriched.reduce((s,p)=>s+p.stockDispo*p.coutRevient,0);
    const investissement = state.expenses.filter(e=>e.type==='Exceptionnelle').reduce((s,e)=>s+expenseUSD(e),0);
    const opex = depensesTotales-investissement;
    const beneficeNet = margeBrute-opex;
    const stockFaible = enriched.filter(p=>p.stockDispo<p.seuil);
    const impayes = state.sales.filter(s=>saleStatut(s)!=='Paye');
    const sousMarge = enriched.filter(p=>p.pctMarge<state.settings.margeCible);
    const depParCat = {};
    state.expenses.forEach(e=>{ depParCat[e.nature]=(depParCat[e.nature]||0)+expenseUSD(e); });
    const margeParCat = [
      {name:'Pneus',value:Math.max(0,enriched.filter(p=>p.categorie==='Pneu').reduce((s,p)=>s+p.margeTotale,0))},
      {name:'Chambres a air',value:Math.max(0,enriched.filter(p=>p.categorie==='Chambre a air').reduce((s,p)=>s+p.margeTotale,0))}
    ];

    return `<div class="flex flex-col gap-5">${pageHeader('Tableau de bord',"Vue d'ensemble de l'activite en temps reel")}
      <div class="kpi-grid">
        ${statCard('Chiffre d\'affaires',fmt(ca),'wallet')}${statCard('Depenses totales',fmt(depensesTotales),'receipt')}${statCard('Marge brute',fmt(margeBrute),'trending-up',margeBrute>=0?'good':'bad')}${statCard('Benefice net',fmt(beneficeNet),beneficeNet>=0?'trending-up':'trending-down',beneficeNet>=0?'good':'bad','CA - CMV - depenses operationnelles')}${statCard('Valeur du stock',fmt(stockValue),'package-search')}${statCard('Investissement initial',fmt(investissement),'building-2')}${statCard('Clients',fmt0(state.clients.length),'users')}${statCard('Ventes enregistrees',fmt0(state.sales.length),'shopping-cart')}
      </div>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        ${card(`<h4 class="mb-3 text-sm font-bold">Depenses par nature</h4><div class="chart-box"><canvas id="dash-bar"></canvas></div>`, 'p-4 lg:col-span-2')}
        ${card(`<h4 class="mb-3 text-sm font-bold">Marge par categorie</h4><div class="chart-box"><canvas id="dash-pie"></canvas></div>`, 'p-4')}
      </div>
      ${card(`<h4 class="mb-3 flex items-center gap-2 text-sm font-bold">${icon('alert-triangle',15)} Alertes</h4><div class="grid grid-cols-1 gap-3 md:grid-cols-3"><div class="rounded-lg p-3" style="background:${stockFaible.length?'#FBEAE9':'#E7F3EC'}"><div class="mb-1.5 flex items-center justify-between"><span class="text-xs font-bold" style="color:${stockFaible.length?BAD:GOOD}">Stock faible</span>${badge(stockFaible.length,stockFaible.length?'bad':'good')}</div><div class="text-xs" style="color:${stockFaible.length?BAD:GOOD}">${stockFaible.length?stockFaible.slice(0,4).map(p=>esc(`${p.ref} : ${fmt0(p.stockDispo)} u. (seuil ${fmt0(p.seuil)})`)).join('<br>'):'Rien a signaler'}</div></div><div class="rounded-lg p-3" style="background:${impayes.length?'#FBEAE9':'#E7F3EC'}"><div class="mb-1.5 flex items-center justify-between"><span class="text-xs font-bold" style="color:${impayes.length?BAD:GOOD}">Ventes impayees / partielles</span>${badge(impayes.length,impayes.length?'bad':'good')}</div><div class="text-xs" style="color:${impayes.length?BAD:GOOD}">${impayes.length?impayes.slice(0,4).map(s=>esc(`${s.numero} - solde ${fmt(saleSolde(s))}`)).join('<br>'):'Rien a signaler'}</div></div><div class="rounded-lg p-3" style="background:${sousMarge.length?'#FBEAE9':'#E7F3EC'}"><div class="mb-1.5 flex items-center justify-between"><span class="text-xs font-bold" style="color:${sousMarge.length?BAD:GOOD}">Marge sous l'objectif</span>${badge(sousMarge.length,sousMarge.length?'bad':'good')}</div><div class="text-xs" style="color:${sousMarge.length?BAD:GOOD}">${sousMarge.length?sousMarge.slice(0,4).map(p=>esc(`${p.ref} : ${pct(p.pctMarge)} (objectif ${pct(state.settings.margeCible)})`)).join('<br>'):'Rien a signaler'}</div></div></div>`, 'p-4')}
    </div>`;
  }

  function statCard(label,value,ico,tone='ink',sub='') {
    const toneColor = tone==='good'?GOOD:tone==='bad'?BAD:INK;
    return `<div class="ft-card stat-card"><div class="flex items-center justify-between"><span class="text-xs font-semibold uppercase tracking-wide" style="color:#6B6B6B">${esc(label)}</span>${icon(ico,16,'stat-icon')}</div><div class="stat-value" style="color:${toneColor}">${esc(value)}</div>${sub?`<div class="text-xs" style="color:#6B6B6B">${esc(sub)}</div>`:''}</div>`;
  }

  function mountDashboardCharts(){
    destroyCharts();
    const dep={}; state.expenses.forEach(e=>{dep[e.nature]=(dep[e.nature]||0)+expenseUSD(e);});
    const c1=document.getElementById('dash-bar'); if(c1){ state.charts.dashBar=new Chart(c1,{type:'bar',data:{labels:Object.keys(dep),datasets:[{data:Object.values(dep),backgroundColor:ACCENT,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'#eeeeee'},ticks:{font:{size:11}}},y:{grid:{color:'#eeeeee'},ticks:{font:{size:11}}}}}}); }
    const enriched=enrichedProducts(); const mp=[Math.max(0,enriched.filter(p=>p.categorie==='Pneu').reduce((s,p)=>s+p.margeTotale,0)),Math.max(0,enriched.filter(p=>p.categorie==='Chambre a air').reduce((s,p)=>s+p.margeTotale,0))]; const c2=document.getElementById('dash-pie'); if(c2){state.charts.dashPie=new Chart(c2,{type:'doughnut',data:{labels:['Pneus','Chambres a air'],datasets:[{data:mp,backgroundColor:[ACCENT,INK_2],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:11}}}}}});}
  }

  function destroyCharts(){ Object.values(state.charts).forEach(c=>{try{c.destroy();}catch(_){}}); state.charts={}; }

  /* ============================== PRODUCTS ============================== */
  function renderProducts(){
    const enriched=enrichedProducts();
    return `<div class="flex flex-col gap-4">${pageHeader('Produits & stocks','Cout de revient et prix conseille calcules automatiquement',currentUserIsAdmin()?btn('Nouveau produit','primary','id="new-product-btn"','plus'): '')}
      ${card(`<div class="table-wrap"><table class="w-full text-sm"><thead><tr style="background:${PAPER}">${['Reference','Categorie','Achete','Vendu','Stock','Cout revient','Prix conseille','Prix reel moy.','% Marge',''].map(h=>`<th class="whitespace-nowrap px-3 py-2 text-left text-xs font-bold uppercase" style="color:#6B6B6B">${h}</th>`).join('')}</tr></thead><tbody>${enriched.map(p=>`<tr style="border-top:1px solid ${LINE}"><td class="px-3 py-2"><div class="font-semibold">${esc(p.ref)}</div><div class="text-xs" style="color:#6B6B6B">${esc(p.marque)} - ${esc(p.dimension)}</div></td><td class="px-3 py-2">${esc(p.categorie)}</td><td class="px-3 py-2">${fmt0(p.qteAchetee)}</td><td class="px-3 py-2">${fmt0(p.qteVendue)}</td><td class="px-3 py-2">${badge(fmt0(p.stockDispo),p.stockDispo<p.seuil?'bad':'neutral')}</td><td class="px-3 py-2">${fmt(p.coutRevient)}</td><td class="px-3 py-2 font-semibold" style="color:${ACCENT_DARK}">${fmt(p.prixConseille)}</td><td class="px-3 py-2">${fmt(p.prixReelMoyen)}</td><td class="px-3 py-2">${badge(pct(p.pctMarge),p.pctMarge<state.settings.margeCible?'bad':'good')}</td><td class="px-3 py-2 text-right">${currentUserIsAdmin()?`<div class="flex justify-end gap-1"><button data-edit-product="${p.id}" class="rounded p-1 hover:bg-black/5">${icon('pencil',14)}</button><button data-delete-product="${p.id}" class="rounded p-1 hover:bg-black/5">${icon('trash-2',14)}</button></div>`:''}</td></tr>`).join('')}</tbody></table></div>${!enriched.length?emptyState('Aucun produit. Ajoutez votre premiere reference.'):''}`, 'overflow-hidden')}
      ${card(`Le <b>cout de revient</b> = prix d'achat unitaire + frais attribues (transport, fret et marketing repartis automatiquement entre pneus et chambres a air, selon la methode choisie dans Parametres). Le <b>prix conseille</b> applique l'objectif de marge defini dans Parametres (${esc(pct(state.settings.margeCible))}).`, 'p-3 text-xs leading-relaxed')}
    </div>`;
  }

  function showProductModal(product=null){
    const p=product||{id:uid(),ref:'',marque:'',dimension:'',categorie:'Pneu',qteAchetee:0,prixAchatUnitaire:0};
    openModal(product?'Modifier le produit':'Nouveau produit', `<div class="grid-2">${field('Reference',input('pm-ref','text',p.ref,'PNEU-002'))}${field('Categorie',select('pm-cat',CAT_PRODUIT,p.categorie))}${field('Marque',input('pm-brand','text',p.marque))}${field('Dimension / type',input('pm-dim','text',p.dimension))}${field('Quantite achetee',input('pm-qty','number',p.qteAchetee))}${field("Prix d'achat unitaire (USD)",input('pm-price','number',p.prixAchatUnitaire,'', 'step="0.01"'))}</div><div class="mt-5 flex justify-end gap-2">${btn('Annuler','ghost','id="pm-cancel"')}${btn('Enregistrer','primary','id="pm-save"','save')}</div>`);
    document.getElementById('pm-cancel').addEventListener('click',closeModal);
    document.getElementById('pm-save').addEventListener('click',async()=>{const obj={...p,ref:document.getElementById('pm-ref').value.trim(),marque:document.getElementById('pm-brand').value.trim(),dimension:document.getElementById('pm-dim').value.trim(),categorie:document.getElementById('pm-cat').value,qteAchetee:Number(document.getElementById('pm-qty').value)||0,prixAchatUnitaire:Number(document.getElementById('pm-price').value)||0}; state.products=state.products.some(x=>x.id===obj.id)?state.products.map(x=>x.id===obj.id?obj:x):[...state.products,obj]; await persist('products',state.products); closeModal(); renderCurrentPage(); toast('Produit enregistre','good');});
  }

  /* ============================== EXPENSES ============================== */
  function renderExpenses(){
    const filter=state.uiExpenseFilter||'Toutes'; state.uiExpenseFilter=filter; const filtered=filter==='Toutes'?state.expenses:state.expenses.filter(e=>e.nature===filter); const total=filtered.reduce((s,e)=>s+expenseUSD(e),0);
    return `<div class="flex flex-col gap-4">${pageHeader('Achats & depenses','Approvisionnement, transport, marketing, fonctionnement et imprevus',btn('Nouvelle depense','primary','id="new-expense-btn"','plus'))}<div class="flex flex-wrap items-center gap-2"><span class="text-xs font-semibold" style="color:#6B6B6B">Filtrer :</span>${select('expense-filter',['Toutes',...NATURES],filter,'w-48')}<div class="ml-auto text-sm font-bold">Total : ${fmt(total)}</div></div>${card(`<div class="table-wrap"><table class="w-full text-sm"><thead><tr style="background:${PAPER}">${['Date','Nature','Description','Categorie liee','Montant','Montant USD','Type',''].map(h=>`<th class="whitespace-nowrap px-3 py-2 text-left text-xs font-bold uppercase" style="color:#6B6B6B">${h}</th>`).join('')}</tr></thead><tbody>${filtered.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(e=>`<tr style="border-top:1px solid ${LINE}"><td class="px-3 py-2 whitespace-nowrap">${esc(e.date)}</td><td class="px-3 py-2">${badge(e.nature)}</td><td class="px-3 py-2">${esc(e.description)}<div class="text-xs" style="color:#6B6B6B">${esc(e.fournisseur)} - ${esc(e.mode)}</div></td><td class="px-3 py-2">${esc(e.categorieLiee)}</td><td class="px-3 py-2 whitespace-nowrap">${fmt0(e.montant)} ${esc(e.devise)}</td><td class="px-3 py-2 font-semibold">${fmt(expenseUSD(e))}</td><td class="px-3 py-2">${esc(e.type)}</td><td class="px-3 py-2 text-right"><div class="flex justify-end gap-1"><button data-edit-exp="${e.id}" class="rounded p-1 hover:bg-black/5">${icon('pencil',14)}</button><button data-delete-exp="${e.id}" class="rounded p-1 hover:bg-black/5">${icon('trash-2',14)}</button></div></td></tr>`).join('')}</tbody></table></div>${!filtered.length?emptyState('Aucune depense pour ce filtre.'):''}`, 'overflow-hidden')}</div>`;
  }

  function showExpenseModal(expense=null){
    const e=expense||{id:uid(),date:todayISO(),nature:'Operationnel',categorieLiee:'Commun',description:'',montant:0,devise:'USD',fournisseur:'',mode:'Especes',type:'Variable'};
    openModal(expense?'Modifier la depense':'Nouvelle depense', `<div class="grid-3">${field('Date',input('em-date','date',e.date))}${field('Nature',select('em-nature',NATURES,e.nature))}${field('Categorie liee (repartition cout)',select('em-cat',CATEGORIES_LIEES,e.categorieLiee))}${field('Description',input('em-desc','text',e.description),'md:col-span-3')}${field('Montant',input('em-amount','number',e.montant,'','step="0.01"'))}${field('Devise',select('em-dev',DEVISES,e.devise))}${field('Type',select('em-type',['Fixe','Variable','Exceptionnelle','Attribuable produit'],e.type))}${field('Fournisseur',input('em-supplier','text',e.fournisseur))}${field('Mode de paiement',select('em-mode',MODES_PAIEMENT,e.mode))}</div><p class="mt-3 text-xs" style="color:#6B6B6B">Les depenses de nature Transport, Fret maritime ou Marketing sont automatiquement reparties dans le cout de revient des produits.</p><div class="mt-4 flex justify-end gap-2">${btn('Annuler','ghost','id="em-cancel"')}${btn('Enregistrer','primary','id="em-save"','save')}</div>`, true);
    document.getElementById('em-cancel').addEventListener('click',closeModal);
    document.getElementById('em-save').addEventListener('click',async()=>{const obj={...e,date:document.getElementById('em-date').value,nature:document.getElementById('em-nature').value,categorieLiee:document.getElementById('em-cat').value,description:document.getElementById('em-desc').value.trim(),montant:Number(document.getElementById('em-amount').value)||0,devise:document.getElementById('em-dev').value,type:document.getElementById('em-type').value,fournisseur:document.getElementById('em-supplier').value.trim(),mode:document.getElementById('em-mode').value};state.expenses=state.expenses.some(x=>x.id===obj.id)?state.expenses.map(x=>x.id===obj.id?obj:x):[...state.expenses,obj];await persist('expenses',state.expenses);closeModal();renderCurrentPage();toast('Depense enregistree','good');});
  }

  /* ============================== SALES ============================== */
  function renderSales(){
    const q=state.uiSalesSearch||''; state.uiSalesSearch=q; const clientName=id=>state.clients.find(c=>c.id===id)?.nom||'Client supprime'; const filtered=state.sales.filter(s=>(s.numero+clientName(s.clientId)).toLowerCase().includes(q.toLowerCase()));
    return `<div class="flex flex-col gap-4">${pageHeader('Ventes & factures','Encaissements, soldes clients et generation de factures',btn('Nouvelle vente','primary','id="new-sale-btn"','plus'))}<div class="flex items-center gap-2">${input('sales-search','text',q,'Rechercher facture ou client...','max-w-sm')}</div>${card(`<div class="table-wrap"><table class="w-full text-sm"><thead><tr style="background:${PAPER}">${['Facture','Date','Client','Total','Encaisse','Solde','Statut','Vendeur',''].map(h=>`<th class="whitespace-nowrap px-3 py-2 text-left text-xs font-bold uppercase" style="color:#6B6B6B">${h}</th>`).join('')}</tr></thead><tbody>${filtered.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(s=>{const total=saleTotal(s),solde=saleSolde(s),statut=saleStatut(s);return `<tr style="border-top:1px solid ${LINE}"><td class="px-3 py-2 font-semibold">${esc(s.numero)}</td><td class="px-3 py-2 whitespace-nowrap">${esc(s.date)}</td><td class="px-3 py-2">${esc(clientName(s.clientId))}</td><td class="px-3 py-2">${fmt(total)}</td><td class="px-3 py-2">${fmt(s.montantPaye)}</td><td class="px-3 py-2">${fmt(solde)}</td><td class="px-3 py-2">${badge(statut,statut==='Paye'?'good':statut==='Partiel'?'warn':'bad')}</td><td class="px-3 py-2">${esc(s.vendeur)}</td><td class="px-3 py-2 text-right"><div class="flex justify-end gap-1"><button title="Facture" data-invoice-sale="${s.id}" class="rounded p-1 hover:bg-black/5">${icon('file-text',14)}</button><button title="Modifier" data-edit-sale="${s.id}" class="rounded p-1 hover:bg-black/5">${icon('pencil',14)}</button><button title="Supprimer" data-delete-sale="${s.id}" class="rounded p-1 hover:bg-black/5">${icon('trash-2',14)}</button></div></td></tr>`}).join('')}</tbody></table></div>${!filtered.length?emptyState('Aucune vente trouvee.'):''}`, 'overflow-hidden')}</div>`;
  }

  function saleItemRow(it, idx){
    return `<div class="sale-item-row grid grid-cols-12 items-center gap-2" data-item-row="${idx}">${select(`sim-prod-${idx}`,state.products.map(p=>p.ref),state.products.find(p=>p.id===it.productId)?.ref||'','','col-span-4')}${input(`sim-qty-${idx}`,'number',it.qte,'Qte','col-span-2')}${input(`sim-price-${idx}`,'number',it.prix,'Prix','col-span-2 step="0.01"')}${input(`sim-rem-${idx}`,'number',it.remise,'Remise','col-span-2 step="0.01"')}<div id="sim-total-${idx}" class="col-span-1 text-right text-xs font-semibold">${fmt((Number(it.qte)||0)*(Number(it.prix)||0)-(Number(it.remise)||0))}</div><button type="button" data-del-item="${idx}" class="col-span-1 flex justify-center">${icon('trash-2',14)}</button></div>`;
  }

  function showSaleModal(sale=null){
    const isNew=!sale; const form=JSON.parse(JSON.stringify(sale||{id:uid(),numero:'',date:todayISO(),clientId:state.clients[0]?.id||'',items:[{productId:state.products[0]?.id||'',qte:1,prix:0,remise:0}],montantPaye:0,mode:'Especes',vendeur:state.session.username}));
    const body=`<form id="sale-form"><div class="grid-3">${field('Date',input('sm-date','date',form.date))}${field('Client',select('sm-client',state.clients.map(c=>c.nom),state.clients.find(c=>c.id===form.clientId)?.nom||''),'col-span-2')}</div><div class="mt-4"><div class="mb-1.5 flex items-center justify-between"><span class="text-xs font-semibold uppercase tracking-wide" style="color:#6B6B6B">Articles</span>${btn('Ajouter une ligne','ghost','type="button" id="sm-add"','plus',true)}</div><div id="sale-items" class="flex flex-col gap-2">${form.items.map((it,i)=>saleItemRow(it,i)).join('')}</div></div><div class="mt-4 grid-3">${field('Montant encaisse',input('sm-paid','number',form.montantPaye,'','step="0.01"'))}${field('Mode de paiement',select('sm-mode',MODES_PAIEMENT,form.mode))}${field('Vendeur',input('sm-seller','text',form.vendeur))}</div><div class="mt-4 flex items-center justify-between rounded-lg p-3" style="background:${PAPER}"><div class="text-sm">Total facture : <b id="sm-total"></b></div><div class="text-sm">Solde restant : <b id="sm-balance"></b></div></div><div class="mt-4 flex justify-end gap-2">${btn('Annuler','ghost','type="button" id="sm-cancel"')}${btn('Enregistrer','primary','type="submit"','save')}</div></form>`;
    openModal(isNew?'Nouvelle vente':`Modifier ${form.numero}`,body,true);
    const readRows=()=>Array.from(document.querySelectorAll('#sale-items [data-item-row]')).map((row,idx)=>({productId:state.products.find(p=>p.ref===row.querySelector(`#sim-prod-${idx}`)?.value)?.id||'',qte:Number(row.querySelector(`#sim-qty-${idx}`)?.value)||0,prix:Number(row.querySelector(`#sim-price-${idx}`)?.value)||0,remise:Number(row.querySelector(`#sim-rem-${idx}`)?.value)||0}));
    const updateTotals=()=>{const rows=readRows();const total=rows.reduce((s,i)=>s+i.qte*i.prix-i.remise,0);const paid=Number(document.getElementById('sm-paid').value)||0;document.getElementById('sm-total').textContent=fmt(total);document.getElementById('sm-balance').textContent=fmt(total-paid);document.getElementById('sm-balance').style.color=total-paid>0.009?BAD:GOOD;};
    const bindRows=()=>{document.querySelectorAll('[data-del-item]').forEach(b=>b.addEventListener('click',()=>{form.items=readRows();form.items.splice(Number(b.dataset.delItem),1);drawRows();})); document.querySelectorAll('#sale-items input,#sale-items select').forEach(el=>el.addEventListener('input',updateTotals)); document.querySelectorAll('#sale-items select').forEach(el=>el.addEventListener('change',updateTotals)); updateTotals();};
    const drawRows=()=>{document.getElementById('sale-items').innerHTML=form.items.map((it,i)=>saleItemRow(it,i)).join('');bindRows();refreshIcons();};
    document.getElementById('sm-add').addEventListener('click',()=>{form.items=readRows();form.items.push({productId:state.products[0]?.id||'',qte:1,prix:0,remise:0});drawRows();});
    document.getElementById('sm-paid').addEventListener('input',updateTotals); document.getElementById('sm-client').addEventListener('change',()=>{});
    document.getElementById('sm-cancel').addEventListener('click',closeModal); bindRows();
    document.getElementById('sale-form').addEventListener('submit',async e=>{e.preventDefault();form.items=readRows();form.date=document.getElementById('sm-date').value;form.clientId=state.clients.find(c=>c.nom===document.getElementById('sm-client').value)?.id||'';form.montantPaye=Number(document.getElementById('sm-paid').value)||0;form.mode=document.getElementById('sm-mode').value;form.vendeur=document.getElementById('sm-seller').value.trim(); if(isNew){const num=`FAC-${new Date(form.date).getFullYear()}-${pad4(state.settings.nextFactureNo)}`;form.numero=num;state.settings={...state.settings,nextFactureNo:state.settings.nextFactureNo+1};await persist('settings',state.settings);state.sales=[...state.sales,form];}else{state.sales=state.sales.map(s=>s.id===form.id?form:s);}await persist('sales',state.sales);closeModal();renderCurrentPage();toast('Vente enregistree','good');});
  }

  /* ============================== CLIENTS ============================== */
  function renderClients(){
    const expanded=state.expandedClient||null;
    return `<div class="flex flex-col gap-4">${pageHeader('Clients',"Coordonnees, historique d'achats et solde du",btn('Nouveau client','primary','id="new-client-btn"','plus'))}<div class="flex flex-col gap-3">${state.clients.map(c=>{const cs=state.sales.filter(s=>s.clientId===c.id),du=cs.reduce((s,sale)=>s+saleSolde(sale),0),open=expanded===c.id;return card(`<div class="flex items-center justify-between gap-3"><div class="cursor-pointer" data-expand-client="${c.id}"><div class="flex items-center gap-2 font-semibold">${icon('chevron-down',15,`transition-transform ${open?'rotate-0':'-rotate-90'}`)}${esc(c.nom)}</div><div class="pl-6 text-xs" style="color:#6B6B6B">${esc(c.telephone)} - ${esc(c.adresse)}</div></div><div class="flex items-center gap-3"><div class="text-right"><div class="text-xs" style="color:#6B6B6B">Solde du</div><div class="font-bold" style="color:${du>0.009?BAD:GOOD}">${fmt(du)}</div></div><button data-edit-client="${c.id}" class="rounded p-1.5 hover:bg-black/5">${icon('pencil',14)}</button><button data-delete-client="${c.id}" class="rounded p-1.5 hover:bg-black/5">${icon('trash-2',14)}</button></div></div>${open?`<div class="mt-3 border-t pt-3" style="border-color:${LINE}">${cs.length?`<div class="table-wrap"><table class="w-full text-xs"><thead><tr style="color:#6B6B6B"><th class="text-left">Facture</th><th class="text-left">Date</th><th class="text-left">Total</th><th class="text-left">Solde</th></tr></thead><tbody>${cs.map(s=>`<tr><td class="py-1">${esc(s.numero)}</td><td class="py-1">${esc(s.date)}</td><td class="py-1">${fmt(saleTotal(s))}</td><td class="py-1">${fmt(saleSolde(s))}</td></tr>`).join('')}</tbody></table></div>`:emptyState('Aucun achat enregistre.')}</div>`:''}`,'p-4');}).join('')}</div>${!state.clients.length?emptyState('Aucun client enregistre.'):''}</div>`;
  }

  function showClientModal(client=null){const c=client||{id:uid(),nom:'',telephone:'',adresse:''};openModal(client?'Modifier le client':'Nouveau client',`${field('Nom',input('cm-name','text',c.nom))}${field('Telephone',input('cm-phone','text',c.telephone))}${field('Adresse',input('cm-address','text',c.adresse))}<div class="mt-5 flex justify-end gap-2">${btn('Annuler','ghost','id="cm-cancel"')}${btn('Enregistrer','primary','id="cm-save"','save')}</div>`);document.getElementById('cm-cancel').addEventListener('click',closeModal);document.getElementById('cm-save').addEventListener('click',async()=>{const obj={...c,nom:document.getElementById('cm-name').value.trim(),telephone:document.getElementById('cm-phone').value.trim(),adresse:document.getElementById('cm-address').value.trim()};state.clients=state.clients.some(x=>x.id===obj.id)?state.clients.map(x=>x.id===obj.id?obj:x):[...state.clients,obj];await persist('clients',state.clients);closeModal();renderCurrentPage();toast('Client enregistre','good');});}

  /* ============================== REPORTS ============================== */
  function renderReports(){
    const range=state.uiRange||'mois';state.uiRange=range;const now=new Date();const inRange=dateStr=>{const d=new Date(dateStr);if(range==='jour')return dateStr===todayISO();if(range==='semaine'){const diff=(now-d)/86400000;return diff>=0&&diff<=7;}if(range==='mois')return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth();return true;};const salesR=state.sales.filter(s=>inRange(s.date)),expR=state.expenses.filter(e=>inRange(e.date));const ca=salesR.reduce((s,v)=>s+saleTotal(v),0),dep=expR.reduce((s,e)=>s+expenseUSD(e),0);const enriched=enrichedProducts();const byProduct=enriched.map(p=>{const qte=salesR.reduce((s,sale)=>s+sale.items.filter(i=>i.productId===p.id).reduce((a,i)=>a+i.qte,0),0);const montant=salesR.reduce((s,sale)=>s+sale.items.filter(i=>i.productId===p.id).reduce((a,i)=>a+i.qte*i.prix-i.remise,0),0);return{ref:p.ref,qte,montant};}).filter(p=>p.qte>0);const byClient=state.clients.map(c=>{const cs=salesR.filter(s=>s.clientId===c.id);return{nom:c.nom,ventes:cs.length,montant:cs.reduce((s,v)=>s+saleTotal(v),0)};}).filter(c=>c.ventes>0);return `<div class="flex flex-col gap-4">${pageHeader('Rapports','Ventes, depenses et benefices par periode, produit et client')}<div class="flex flex-wrap items-center gap-2">${[['jour',"Aujourd'hui"],['semaine','7 derniers jours'],['mois','Ce mois-ci'],['tout',"Tout l'historique"]].map(([k,l])=>`<button data-range="${k}" class="rounded-md px-3 py-1.5 text-xs font-semibold" style="background:${range===k?ACCENT:'#fff'};color:${range===k?'#fff':INK};border:1px solid ${LINE}">${l}</button>`).join('')}</div><div class="grid grid-cols-1 gap-4 md:grid-cols-3">${statCard("Chiffre d'affaires",fmt(ca),'wallet')}${statCard('Depenses',fmt(dep),'receipt')}${statCard('Benefice',fmt(ca-dep),'trending-up',ca-dep>=0?'good':'bad')}</div>${card(`<h4 class="mb-3 text-sm font-bold">Chiffre d'affaires par jour</h4><div class="chart-box"><canvas id="report-line"></canvas></div>`,'p-4')}<div class="grid grid-cols-1 gap-4 md:grid-cols-2">${card(`<h4 class="mb-3 text-sm font-bold">Ventes par produit</h4><div class="table-wrap"><table class="w-full text-sm"><thead><tr style="color:#6B6B6B"><th class="text-left text-xs font-bold uppercase">Produit</th><th class="text-left text-xs font-bold uppercase">Qte</th><th class="text-left text-xs font-bold uppercase">Montant</th></tr></thead><tbody>${byProduct.map(p=>`<tr style="border-top:1px solid ${LINE}"><td class="py-1.5">${esc(p.ref)}</td><td class="py-1.5">${fmt0(p.qte)}</td><td class="py-1.5">${fmt(p.montant)}</td></tr>`).join('')}</tbody></table></div>${!byProduct.length?emptyState('Aucune donnee.'):''}`,'overflow-hidden p-4')}${card(`<h4 class="mb-3 text-sm font-bold">Ventes par client</h4><div class="table-wrap"><table class="w-full text-sm"><thead><tr style="color:#6B6B6B"><th class="text-left text-xs font-bold uppercase">Client</th><th class="text-left text-xs font-bold uppercase">Ventes</th><th class="text-left text-xs font-bold uppercase">Montant</th></tr></thead><tbody>${byClient.map(c=>`<tr style="border-top:1px solid ${LINE}"><td class="py-1.5">${esc(c.nom)}</td><td class="py-1.5">${fmt0(c.ventes)}</td><td class="py-1.5">${fmt(c.montant)}</td></tr>`).join('')}</tbody></table></div>${!byClient.length?emptyState('Aucune donnee.'):''}`,'overflow-hidden p-4')}</div></div>`;
  }
  function mountReportChart(){destroyCharts();const range=state.uiRange||'mois',now=new Date();const inRange=dateStr=>{const d=new Date(dateStr);if(range==='jour')return dateStr===todayISO();if(range==='semaine'){const diff=(now-d)/86400000;return diff>=0&&diff<=7;}if(range==='mois')return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth();return true;};const m={};state.sales.filter(s=>inRange(s.date)).forEach(s=>{m[s.date]=(m[s.date]||0)+saleTotal(s);});const entries=Object.entries(m).sort((a,b)=>a[0].localeCompare(b[0]));const c=document.getElementById('report-line');if(c)state.charts.report=new Chart(c,{type:'line',data:{labels:entries.map(x=>x[0]),datasets:[{data:entries.map(x=>Number(x[1].toFixed(2))),borderColor:ACCENT,backgroundColor:'rgba(227,30,36,.08)',fill:true,tension:.25,pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'#eeeeee'},ticks:{font:{size:10}}},y:{grid:{color:'#eeeeee'},ticks:{font:{size:11}}}}}});}

  /* ============================== SETTINGS ============================== */
  function renderSettings(){
    const f=state.tempSettings?JSON.parse(JSON.stringify(state.tempSettings)):JSON.parse(JSON.stringify(state.settings));state.tempSettings=f;
    return `<div class="flex flex-col gap-5">${pageHeader('Parametres','Reglages financiers et informations de l’entreprise (acces administrateur)')}${card(`<h4 class="mb-3 text-sm font-bold">Parametres financiers</h4><div class="grid-2 md:grid-cols-4">${field('Taux de change CDF/USD',input('set-rate','number',f.tauxChange))}${field('Objectif de marge (%)',input('set-margin','number',f.margeCible,'','step="0.01"'))}${field('Seuil stock - Pneus',input('set-pneu-threshold','number',f.seuilPneu))}${field('Seuil stock - Chambres a air',input('set-cham-threshold','number',f.seuilChambre))}${field('Methode de repartition des couts communs',select('set-alloc',['quantite','valeur'],f.methodeRepartition))}${field('Methode de calcul du prix de vente',select('set-price',['marge','majoration'],f.methodePrix))}</div><p class="mt-2 text-xs" style="color:#6B6B6B">"marge" = Prix = Cout / (1 - objectif). "majoration" = Prix = Cout x (1 + objectif).</p>`,'p-4')}${card(`<h4 class="mb-3 text-sm font-bold">Entreprise (apparait sur les factures)</h4><div class="grid-2">${field("Nom de l'entreprise",input('set-company-name','text',f.entreprise.nom))}${field('Telephone',input('set-company-phone','text',f.entreprise.telephone))}${field('Adresse',input('set-company-address','text',f.entreprise.adresse))}${field('Conditions de paiement',input('set-company-conditions','text',f.entreprise.conditions))}${field('Logo',`<div class="flex items-center gap-3">${f.entreprise.logo?`<img src="${esc(f.entreprise.logo)}" class="h-10 w-10 rounded object-cover" style="border:1px solid ${LINE}">`:''}${btn('Choisir un logo','ghost','type="button" id="logo-btn"','upload',true)}<input id="logo-file" type="file" accept="image/*" class="hidden"></div>`,'col-span-2')}</div>`,'p-4')}<div>${btn('Enregistrer les parametres','primary','id="save-settings-btn"','save')}</div>${card(`<h4 class="mb-3 text-sm font-bold">Donnees</h4><div class="flex flex-wrap items-center gap-3">${btn('Exporter vers Excel','dark','id="export-excel-btn"','download')}${btn('Importer depuis Excel','ghost','id="import-excel-btn"','upload')}<input id="excel-file" type="file" accept=".xlsx,.xls" class="hidden"></div><div id="import-msg" class="mt-3"></div><p class="mt-3 text-xs leading-relaxed" style="color:#6B6B6B">L'import reconnait les feuilles "Produits et stocks" et "Depenses operationnelles" du classeur Excel de gestion financiere (memes en-tetes de colonnes). Il remplace les listes actuelles : exportez d'abord une sauvegarde si besoin.</p>`,'p-4')}</div>`;
  }

  function showSettingsBindings(){
    const get=(id)=>document.getElementById(id);const f=state.tempSettings;
    get('logo-btn')?.addEventListener('click',()=>get('logo-file').click());get('logo-file')?.addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{f.entreprise.logo=r.result;renderCurrentPage();};r.readAsDataURL(file);});
    get('save-settings-btn')?.addEventListener('click',async()=>{f.tauxChange=Number(get('set-rate').value)||0;f.margeCible=Number(get('set-margin').value)||0;f.seuilPneu=Number(get('set-pneu-threshold').value)||0;f.seuilChambre=Number(get('set-cham-threshold').value)||0;f.methodeRepartition=get('set-alloc').value;f.methodePrix=get('set-price').value;f.entreprise.nom=get('set-company-name').value.trim();f.entreprise.telephone=get('set-company-phone').value.trim();f.entreprise.adresse=get('set-company-address').value.trim();f.entreprise.conditions=get('set-company-conditions').value.trim();state.settings=f;await persist('settings',f);state.tempSettings=null;renderCurrentPage();renderAppShell();toast('Parametres enregistres','good');});
    get('export-excel-btn')?.addEventListener('click',exportExcel);get('import-excel-btn')?.addEventListener('click',()=>get('excel-file').click());get('excel-file')?.addEventListener('change',importExcel);
  }

  /* ============================== USERS ============================== */
  function renderUsers(){return `<div class="flex flex-col gap-4">${pageHeader('Utilisateurs','Comptes administrateur et vendeur',btn('Nouvel utilisateur','primary','id="new-user-btn"','plus'))}${card(`<div class="table-wrap"><table class="w-full text-sm"><thead><tr style="background:${PAPER}">${['Nom','Identifiant','Role',''].map(h=>`<th class="px-3 py-2 text-left text-xs font-bold uppercase" style="color:#6B6B6B">${h}</th>`).join('')}</tr></thead><tbody>${state.users.map(u=>`<tr style="border-top:1px solid ${LINE}"><td class="px-3 py-2 font-semibold">${esc(u.nom)}</td><td class="px-3 py-2">${esc(u.username)}</td><td class="px-3 py-2">${badge(u.role,u.role==='admin'?'warn':'neutral')}</td><td class="px-3 py-2 text-right"><div class="flex justify-end gap-1"><button data-edit-user="${u.id}" class="rounded p-1 hover:bg-black/5">${icon('pencil',14)}</button><button data-delete-user="${u.id}" class="rounded p-1 hover:bg-black/5">${icon('trash-2',14)}</button></div></td></tr>`).join('')}</tbody></table></div>`,'overflow-hidden p-0')}${card(`L'administrateur a acces complet (parametres financiers, achats, utilisateurs). Le vendeur peut creer des ventes et des factures et consulter les rapports, sans acces aux parametres sensibles.`,'p-3 text-xs')}</div>`;}
  function showUserModal(user=null){const u=user||{id:uid(),nom:'',username:'',password:'',role:'vendeur',question:'',reponse:''};openModal(user?"Modifier l'utilisateur":'Nouvel utilisateur',`${field('Nom complet',input('um-name','text',u.nom))}${field('Identifiant',input('um-user','text',u.username))}${field('Mot de passe',input('um-pass','text',u.password))}${field('Role',select('um-role',['admin','vendeur'],u.role))}<div class="mt-1 rounded-lg p-3" style="background:${PAPER}"><div class="mb-2 text-xs font-bold uppercase tracking-wide" style="color:#6B6B6B">Recuperation en cas de mot de passe oublie</div>${field('Question secrete',input('um-question','text',u.question,'Ex : Quel est le nom de votre ville de naissance ?'))}${field('Reponse secrete',input('um-answer','text',u.reponse))}</div><div class="mt-5 flex justify-end gap-2">${btn('Annuler','ghost','id="um-cancel"')}${btn('Enregistrer','primary','id="um-save"','save')}</div>`);document.getElementById('um-cancel').addEventListener('click',closeModal);document.getElementById('um-save').addEventListener('click',async()=>{const obj={...u,nom:document.getElementById('um-name').value.trim(),username:document.getElementById('um-user').value.trim(),password:document.getElementById('um-pass').value,role:document.getElementById('um-role').value,question:document.getElementById('um-question').value.trim(),reponse:document.getElementById('um-answer').value.trim()};state.users=state.users.some(x=>x.id===obj.id)?state.users.map(x=>x.id===obj.id?obj:x):[...state.users,obj];await persist('users',state.users);closeModal();renderCurrentPage();toast('Utilisateur enregistre','good');});}

  /* ============================== INVOICE ============================== */
  function showInvoiceModal(sale){
    const client=state.clients.find(c=>c.id===sale.clientId)||{nom:'Client',telephone:'',adresse:''};const total=saleTotal(sale),solde=saleSolde(sale);const content=`<div id="invoice-print-content" class="invoice-print"><div class="flex items-start justify-between"><div class="flex items-center gap-3">${state.settings.entreprise.logo?`<img src="${esc(state.settings.entreprise.logo)}" class="h-12 w-12 rounded object-cover">`:''}<div><h1 style="color:${INK}">${esc(state.settings.entreprise.nom)}</h1><div class="muted">${esc(state.settings.entreprise.adresse)}</div><div class="muted">${esc(state.settings.entreprise.telephone)}</div></div></div><div class="text-right"><h2>FACTURE</h2><div class="muted">N° ${esc(sale.numero)}</div><div class="muted">Date : ${esc(sale.date)}</div></div></div><div class="mt-5 flex justify-between rounded-lg p-3" style="background:${PAPER}"><div><div class="text-xs font-bold uppercase" style="color:#6B6B6B">Facture a</div><div class="font-semibold">${esc(client.nom)}</div><div class="muted">${esc(client.adresse)}</div><div class="muted">${esc(client.telephone)}</div></div><div class="text-right"><div class="text-xs font-bold uppercase" style="color:#6B6B6B">Statut</div>${badge(saleStatut(sale),saleStatut(sale)==='Paye'?'good':saleStatut(sale)==='Partiel'?'warn':'bad')}</div></div><table><thead><tr><th>Article</th><th class="right">Qte</th><th class="right">Prix unit.</th><th class="right">Remise</th><th class="right">Total</th></tr></thead><tbody>${sale.items.map(it=>{const p=state.products.find(x=>x.id===it.productId);return `<tr><td>${esc(p?`${p.ref} - ${p.dimension}`:'Produit')}</td><td class="right">${fmt0(it.qte)}</td><td class="right">${fmt(it.prix)}</td><td class="right">${fmt(it.remise)}</td><td class="right">${fmt(it.qte*it.prix-it.remise)}</td></tr>`}).join('')}</tbody></table><div class="mt-3 flex justify-end"><div class="w-64"><div class="flex justify-between py-1 text-sm"><span>Total facture</span><span class="tot">${fmt(total)}</span></div><div class="flex justify-between py-1 text-sm"><span>Montant encaisse</span><span>${fmt(sale.montantPaye)}</span></div><div class="flex justify-between border-t py-1 text-sm" style="border-color:${LINE}"><span>Solde restant</span><span class="tot" style="color:${solde>0.009?BAD:GOOD}">${fmt(solde)}</span></div></div></div><div class="mt-6 text-xs muted">Mode de paiement : ${esc(sale.mode)} - Vendeur : ${esc(sale.vendeur)}<br>${esc(state.settings.entreprise.conditions)}</div></div><div class="mt-5 flex flex-wrap justify-end gap-2 border-t pt-4" style="border-color:${LINE}">${btn('Fermer','ghost','id="inv-close"')}${btn('Partager par email','dark','id="inv-email"','arrow-left-right')}${btn('Imprimer / Telecharger PDF','primary','id="inv-print"','printer')}</div>`;
    openModal(`Facture ${sale.numero}`,content,true);document.getElementById('inv-close').addEventListener('click',closeModal);document.getElementById('inv-print').addEventListener('click',()=>printInvoice(sale));document.getElementById('inv-email').addEventListener('click',()=>{const body=`Bonjour ${client.nom}, veuillez trouver les informations de la facture ${sale.numero} d'un montant de ${fmt(total)}.`;window.location.href=`mailto:?subject=${encodeURIComponent(`Facture ${sale.numero}`)}&body=${encodeURIComponent(body)}`;});
  }

  function printInvoice(sale){const client=state.clients.find(c=>c.id===sale.clientId)||{nom:'Client',telephone:'',adresse:''};const content=document.getElementById('invoice-print-content').innerHTML;const w=window.open('','_blank','width=800,height=1000');if(!w){toast("Le navigateur a bloque la fenetre d'impression.",'bad');return;}w.document.write(`<!doctype html><html><head><title>${esc(sale.numero)}</title><style>body{font-family:Arial,Helvetica,sans-serif;color:#141B24;padding:32px}table{width:100%;border-collapse:collapse;margin-top:16px}th,td{padding:8px;text-align:left;border-bottom:1px solid #E4E0D6;font-size:13px}th{text-transform:uppercase;font-size:11px;color:#6B6B6B}.right{text-align:right}.tot{font-weight:bold;font-size:15px}.muted{color:#6B6B6B;font-size:12px}h1{font-size:20px;margin:0}h2{font-size:15px;margin:0 0 4px}</style></head><body>${content}</body></html>`);w.document.close();w.focus();setTimeout(()=>w.print(),300);}

  /* ============================== EXCEL ============================== */
  function exportExcel(){
    if(!window.XLSX){toast('Bibliotheque Excel indisponible.','bad');return;}
    const wb=XLSX.utils.book_new();const wsP=XLSX.utils.json_to_sheet(state.products);const wsC=XLSX.utils.json_to_sheet(state.clients);const wsE=XLSX.utils.json_to_sheet(state.expenses);const wsS=XLSX.utils.json_to_sheet(state.sales.map(s=>({...s,items:JSON.stringify(s.items),total:saleTotal(s),solde:saleSolde(s)})));XLSX.utils.book_append_sheet(wb,wsP,'Produits et stocks');XLSX.utils.book_append_sheet(wb,wsS,'Ventes');XLSX.utils.book_append_sheet(wb,wsE,'Depenses operationnelles');XLSX.utils.book_append_sheet(wb,wsC,'Clients');XLSX.writeFile(wb,`export_gestion_pneus_${todayISO()}.xlsx`);toast('Export Excel genere','good');
  }

  async function importExcel(e){
    const file=e.target.files[0];if(!file||!window.XLSX)return;const msg=document.getElementById('import-msg');try{const wb=XLSX.read(await file.arrayBuffer(),{type:'array'});let importedProducts=0,importedExpenses=0;const findSheet=needle=>wb.SheetNames.find(n=>n.toLowerCase().includes(needle));const prodSheet=findSheet('produit');if(prodSheet){const rows=XLSX.utils.sheet_to_json(wb.Sheets[prodSheet],{defval:''});const newProducts=rows.filter(r=>r['Reference']||r['Reference ']).map(r=>({id:uid(),ref:String(r['Reference']||'').trim(),marque:r['Marque']||'',dimension:r['Dimension / Type']||r['Dimension']||'',categorie:(r['Categorie']||'Pneu').includes('Chambre')?'Chambre a air':'Pneu',qteAchetee:Number(r['Qte achetee']||r['Quantite achetee']||0),prixAchatUnitaire:Number(r['Prix achat unitaire']||r["Prix d'achat unitaire"]||0)}));if(newProducts.length){state.products=newProducts;await persist('products',state.products);importedProducts=newProducts.length;}}
      const expSheet=findSheet('depense');if(expSheet){const rows=XLSX.utils.sheet_to_json(wb.Sheets[expSheet],{defval:''});const newExpenses=rows.filter(r=>r['Description']||r['Montant']).map(r=>({id:uid(),date:r['Date']?String(r['Date']).slice(0,10):todayISO(),nature:r['Categorie']||'Operationnel',categorieLiee:'Commun',description:r['Description']||'',montant:Number(r['Montant']||0),devise:r['Devise']||'USD',fournisseur:r['Fournisseur']||'',mode:r['Mode de paiement']||'Especes',type:r['Type']||'Variable'}));if(newExpenses.length){state.expenses=newExpenses;await persist('expenses',state.expenses);importedExpenses=newExpenses.length;}}
      if(msg)msg.innerHTML=`<div class="rounded-md p-2.5 text-xs" style="background:${PAPER};color:#4A4A4A">Import termine : ${importedProducts} produit(s), ${importedExpenses} depense(s). Rapprochez les references produits dans la feuille Ventes si besoin.</div>`;
    }catch(_){if(msg)msg.innerHTML=`<div class="rounded-md p-2.5 text-xs" style="background:#FBEAE9;color:${BAD}">Le fichier n'a pas pu etre lu. Verifiez qu'il s'agit bien d'un export du classeur de gestion financiere.</div>`;}}

  /* ============================== CURRENT PAGE / BINDINGS ============================== */
  function renderCurrentPage(){
    destroyCharts();const pc=document.getElementById('page-container');if(!pc)return;
    if(state.page==='dashboard'){pc.innerHTML=renderDashboard();mountDashboardCharts();}
    if(state.page==='produits'){pc.innerHTML=renderProducts();}
    if(state.page==='achats'&&currentUserIsAdmin()){pc.innerHTML=renderExpenses();}
    if(state.page==='ventes'){pc.innerHTML=renderSales();}
    if(state.page==='clients'){pc.innerHTML=renderClients();}
    if(state.page==='rapports'){pc.innerHTML=renderReports();mountReportChart();}
    if(state.page==='parametres'&&currentUserIsAdmin()){pc.innerHTML=renderSettings();showSettingsBindings();}
    if(state.page==='utilisateurs'&&currentUserIsAdmin()){pc.innerHTML=renderUsers();}
    bindPageEvents();refreshIcons();
  }

  function bindPageEvents(){
    document.getElementById('new-product-btn')?.addEventListener('click',()=>showProductModal());
    document.querySelectorAll('[data-edit-product]').forEach(b=>b.addEventListener('click',()=>showProductModal(state.products.find(p=>p.id===b.dataset.editProduct))));
    document.querySelectorAll('[data-delete-product]').forEach(b=>b.addEventListener('click',async()=>{const id=b.dataset.deleteProduct;if(confirm('Supprimer ce produit ?')){state.products=state.products.filter(x=>x.id!==id);await persist('products',state.products);renderCurrentPage();}}));

    document.getElementById('new-expense-btn')?.addEventListener('click',()=>showExpenseModal());
    document.getElementById('expense-filter')?.addEventListener('change',e=>{state.uiExpenseFilter=e.target.value;renderCurrentPage();});
    document.querySelectorAll('[data-edit-exp]').forEach(b=>b.addEventListener('click',()=>showExpenseModal(state.expenses.find(x=>x.id===b.dataset.editExp))));
    document.querySelectorAll('[data-delete-exp]').forEach(b=>b.addEventListener('click',async()=>{if(confirm('Supprimer cette depense ?')){state.expenses=state.expenses.filter(x=>x.id!==b.dataset.deleteExp);await persist('expenses',state.expenses);renderCurrentPage();}}));

    document.getElementById('new-sale-btn')?.addEventListener('click',()=>showSaleModal());
    document.getElementById('sales-search')?.addEventListener('input',e=>{state.uiSalesSearch=e.target.value;renderCurrentPage();});
    document.querySelectorAll('[data-edit-sale]').forEach(b=>b.addEventListener('click',()=>showSaleModal(state.sales.find(x=>x.id===b.dataset.editSale))));
    document.querySelectorAll('[data-delete-sale]').forEach(b=>b.addEventListener('click',async()=>{if(confirm('Supprimer cette vente ?')){state.sales=state.sales.filter(x=>x.id!==b.dataset.deleteSale);await persist('sales',state.sales);renderCurrentPage();}}));
    document.querySelectorAll('[data-invoice-sale]').forEach(b=>b.addEventListener('click',()=>showInvoiceModal(state.sales.find(x=>x.id===b.dataset.invoiceSale))));

    document.getElementById('new-client-btn')?.addEventListener('click',()=>showClientModal());
    document.querySelectorAll('[data-expand-client]').forEach(b=>b.addEventListener('click',()=>{state.expandedClient=state.expandedClient===b.dataset.expandClient?null:b.dataset.expandClient;renderCurrentPage();}));
    document.querySelectorAll('[data-edit-client]').forEach(b=>b.addEventListener('click',()=>showClientModal(state.clients.find(x=>x.id===b.dataset.editClient))));
    document.querySelectorAll('[data-delete-client]').forEach(b=>b.addEventListener('click',async()=>{if(confirm('Supprimer ce client ?')){state.clients=state.clients.filter(x=>x.id!==b.dataset.deleteClient);await persist('clients',state.clients);renderCurrentPage();}}));

    document.querySelectorAll('[data-range]').forEach(b=>b.addEventListener('click',()=>{state.uiRange=b.dataset.range;renderCurrentPage();}));

    document.getElementById('new-user-btn')?.addEventListener('click',()=>showUserModal());
    document.querySelectorAll('[data-edit-user]').forEach(b=>b.addEventListener('click',()=>showUserModal(state.users.find(x=>x.id===b.dataset.editUser))));
    document.querySelectorAll('[data-delete-user]').forEach(b=>b.addEventListener('click',async()=>{const id=b.dataset.deleteUser;const u=state.users.find(x=>x.id===id);if(u?.username===state.session.username){toast('Impossible de supprimer votre propre compte.','bad');return;}if(confirm('Supprimer cet utilisateur ?')){state.users=state.users.filter(x=>x.id!==id);await persist('users',state.users);renderCurrentPage();}}));
  }

  /* ============================== INIT ============================== */
  (async function init(){
    await loadCollections();
    renderRoot();
  })();
})();
