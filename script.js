    // --- Configuration & Données Mockées ---
    const TAUX_CONVERSION = 2800; // 1 USD = 2800 CDF
    let cart = []; // { product, quantity }
    
    // Base de données des produits
  const productsDB = [
    {
        id: 'p1', ref: 'FT-R-1207017', name: 'RoadMax Pro', category: 'arriere, route', 
        width: 120, ratio: 70, rim: 17, type: 'Tubeless', position: 'Arrière',
        index: '58W', usage: 'Route/Urbain', warranty: '6 mois', price_usd: 65,
        desc: 'Conçu pour la durabilité sur asphalte. Bande de roulement optimisée pour l\'évacuation d\'eau, garantissant une sécurité maximale même pendant la saison des pluies.',
        img_bg: 'RoadMax_1.png',
        img_iso: 'RoadMax_1.jpeg',

        idealFor: [
            { type: 'all-season', text: 'Toutes saisons' },
            { type: 'road', text: 'Route & urbain' },
            { type: 'grip', text: 'Bonne adhérence' }
        ]
    },

    {
        id: 'p2', ref: 'FT-A-909021', name: 'DirtCross X', category: 'avant, tout-terrain', 
        width: 90, ratio: 90, rim: 21, type: 'Tube Type', position: 'Avant',
        index: '54R', usage: 'Piste/Tout-Terrain', warranty: '3 mois', price_usd: 55,
        desc: 'Crampons espacés pour un débourrage parfait de la boue. Carcasse ultra-rigide pour résister aux chocs sur les pistes non aménagées du pays.',
        img_bg: 'DirtyCross.png',
        img_iso: 'Pneu_3-removebg-preview.png',

        idealFor: [
            { type: 'terrain', text: 'Tout-terrain' },
            { type: 'mud', text: 'Boue & pistes' },
            { type: 'durability', text: 'Résistant aux chocs' }
        ]
    },

    {
        id: 'p3', ref: 'FT-W-1109017', name: 'Wewa Force HD', category: 'arriere, motos-taxis, renforcés', 
        width: 110, ratio: 90, rim: 17, type: 'Tubeless', position: 'Arrière',
        index: '62P', usage: 'Intensif/Charge lourde', warranty: '6 mois', price_usd: 70,
        desc: 'Le pneu de référence pour les motos-taxis. Flancs renforcés (6 plis) pour supporter de lourdes charges et résister aux nids-de-poule sans déformation.',
        img_bg: 'pneu_1.jpg',
        img_iso: 'pneu_1-removebg-preview.png',

        idealFor: [
            { type: 'heavy', text: 'Charge lourde' },
            { type: 'durability', text: 'Usage intensif' },
            { type: 'reinforced', text: 'Flancs renforcés' }
        ]
    },

    {
        id: 'p4', ref: 'FT-C-27517', name: 'City Classic', category: 'avant, urbains', 
        width: 2.75, ratio: null, rim: 17, type: 'Tube Type', position: 'Avant',
        index: '41P', usage: 'Ville/Trajet court', warranty: '3 mois', price_usd: 35,
        desc: 'Profil classique, maniable et économique. Gomme dure assurant une très longue durée de vie pour les trajets quotidiens.',
        img_bg: 'Pneu_4.jpg',
        img_iso: 'Pneu_4.jpg',

        idealFor: [
            { type: 'urban', text: 'Usage urbain' },
            { type: 'durability', text: 'Longue durée' },
            { type: 'stability', text: 'Stabilité & confort' }
        ]
    }
];

    // Helpers
    const formatUSD = (amount) => `$${amount.toFixed(2)}`;
    const formatCDF = (amount) => `${(amount * TAUX_CONVERSION).toLocaleString('fr-FR')} CDF`;

    // --- DOM Elements ---
    const header = document.getElementById('main-header');
    
    // Toggles
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartPanel = document.getElementById('cart-panel');
    
    // Catalog & Modal
    const productGrid = document.getElementById('product-grid');
    const modal = document.getElementById('product-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    let currentSelectedProduct = null;

    // Checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');
    let currentStep = 1;
    let deliveryFee = 5;

    // --- UI Interactions ---

const heroCarousel = document.getElementById('hero-carousel');
const heroPagination = document.getElementById('hero-pagination');

const heroSlides = [
    {
        type: 'video',
        src: 'video.mp4',
        alt: 'FullTech Congo - Pneus moto'
    },
    {
        type: 'image',
        src: 'image_1.jpeg',
        alt: 'FullTech Congo - Performance et adhérence'
    },
     {
        type: 'image',
        src: 'image_2.jpeg',
        alt: 'FullTech Congo - Performance et adhérence'
    },
     {
        type: 'image',
        src: 'image_3.jpeg',
        alt: 'FullTech Congo - Performance et adhérence'
    },
     {
        type: 'image',
        src: 'image_4.jpeg',
        alt: 'FullTech Congo - Performance et adhérence'
    },
     {
        type: 'image',
        src: 'image_5.jpeg',
        alt: 'FullTech Congo - Performance et adhérence'
    },
     {
        type: 'image',
        src: 'image_6.jpeg',
        alt: 'FullTech Congo - Performance et adhérence'
    },
     {
        type: 'image',
        src: 'image_7.jpeg',
        alt: 'FullTech Congo - Performance et adhérence'
    },
     {
        type: 'image',
        src: 'image_8.jpeg',
        alt: 'FullTech Congo - Performance et adhérence'
    },
     {
        type: 'image',
        src: 'image_9.PNG',
        alt: 'FullTech Congo - Performance et adhérence'
    },
     {
        type: 'image',
        src: 'image_10.PNG',
        alt: 'FullTech Congo - Performance et adhérence'
    },
     {
        type: 'image',
        src: 'image_11.PNG',
        alt: 'FullTech Congo - Performance et adhérence'
    }
];

let currentHeroSlide = 0;
let heroCarouselInterval = null;

const renderHeroCarousel = () => {
    if (!heroCarousel || !heroPagination || heroSlides.length === 0) return;

    heroCarousel.innerHTML = '';
    heroPagination.innerHTML = '';

    heroSlides.forEach((slide, index) => {

        // Création du média
        let media;

        if (slide.type === 'video') {
            media = document.createElement('video');

            media.src = slide.src;
            media.autoplay = true;
            media.muted = true;
            media.loop = true;
            media.playsInline = true;
            media.preload = 'auto';
        } else {
            media = document.createElement('img');

            media.src = slide.src;
            media.alt = slide.alt || 'FullTech Congo';
        }
        media.className =
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000';

        media.dataset.heroSlide = index;

        // Premier média visible
        media.style.opacity = index === 0 ? '1' : '0';

        heroCarousel.appendChild(media);

        // Création de l'indicateur de pagination
        const indicator = document.createElement('button');

        indicator.type = 'button';
        indicator.dataset.heroIndex = index;
        indicator.setAttribute(
            'aria-label',
            `Afficher le média ${index + 1}`
        );

        indicator.className =
            index === 0
                ? 'w-12 h-1 bg-ft-red transition-colors'
                : 'w-12 h-1 bg-ft-gray transition-colors';

        indicator.addEventListener('click', () => {
            goToHeroSlide(index);
        });

        heroPagination.appendChild(indicator);
    });
};

const goToHeroSlide = (index) => {
    if (!heroSlides.length) return;

    currentHeroSlide =
        (index + heroSlides.length) % heroSlides.length;

    const medias = heroCarousel.querySelectorAll('[data-hero-slide]');
    const indicators = heroPagination.querySelectorAll('[data-hero-index]');

    medias.forEach((media, mediaIndex) => {

        media.style.opacity =
            mediaIndex === currentHeroSlide ? '1' : '0';

        if (media.tagName === 'VIDEO') {

            if (mediaIndex === currentHeroSlide) {
                media.currentTime = 0;

                const playPromise = media.play();

                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        // Le navigateur peut bloquer la lecture automatique.
                    });
                }

            } else {
                media.pause();
                media.currentTime = 0;
            }
        }
    });
    // Synchronisation de la pagination
    indicators.forEach((indicator, indicatorIndex) => {

        if (indicatorIndex === currentHeroSlide) {
            indicator.classList.remove('bg-ft-gray');
            indicator.classList.add('bg-ft-red');
        } else {
            indicator.classList.remove('bg-ft-red');
            indicator.classList.add('bg-ft-gray');
        }
    });
};

/*
 * Passage automatique au média suivant
 */
const startHeroCarousel = () => {

    if (heroCarouselInterval) {
        clearInterval(heroCarouselInterval);
    }

    heroCarouselInterval = setInterval(() => {

        goToHeroSlide(currentHeroSlide + 1);

    }, 7000);
};

/*
 * Initialisation du Hero Carousel
 */
const initHeroCarousel = () => {

    if (!heroCarousel || !heroPagination || heroSlides.length === 0) {
        return;
    }

    renderHeroCarousel();

    goToHeroSlide(0);

    startHeroCarousel();
};

initHeroCarousel();

    // Scroll Header effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('shadow-lg');
            header.querySelector('.bg-ft-black\\/90').classList.add('border-ft-red');
        } else {
            header.classList.remove('shadow-lg');
            header.querySelector('.bg-ft-black\\/90').classList.remove('border-ft-red');
        }
    });

    // Search Toggle
    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.toggle('active');
        if(searchOverlay.classList.contains('active')) searchOverlay.querySelector('input').focus();
    });

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenu.classList.contains('active') ? 
            '<path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>' : 
            '<path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        mobileMenuBtn.querySelector('svg').innerHTML = icon;
    });
    
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('active'));
    });

    // Cart Toggle
    const toggleCart = (show) => {
        if (show) {
            cartOverlay.classList.add('active');
            cartPanel.classList.add('active');
        } else {
            cartOverlay.classList.remove('active');
            cartPanel.classList.remove('active');
        }
    };
    cartBtn.addEventListener('click', () => toggleCart(true));
    closeCartBtn.addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));

    // --- Catalog Logic ---
    
const getIdealForIcon = (type) => {

    const icons = {

        'all-season': `
            <svg class="w-7 h-7" fill="none" viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="5.5"
                    stroke="currentColor"
                    stroke-width="1.4"/>
                <path
                    d="M16 3.5V8M16 24V28.5M3.5 16H8M24 16H28.5
                       M7.15 7.15L10.35 10.35M21.65 21.65L24.85 24.85
                       M24.85 7.15L21.65 10.35M10.35 21.65L7.15 24.85"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                />
                <circle cx="16" cy="16" r="11.5"
                    stroke="currentColor"
                    stroke-width="0.7"
                    stroke-dasharray="1.5 3"
                    opacity="0.7"/>
            </svg>
        `,

        'road': `
            <svg class="w-7 h-7" fill="none" viewBox="0 0 32 32" aria-hidden="true">
                <path
                    d="M9.5 3.5L6 28.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                />
                <path
                    d="M22.5 3.5L26 28.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                />
                <path
                    d="M16 4V8"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                />
                <path
                    d="M16 12V16"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                />
                <path
                    d="M16 20V24"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                />
                <path
                    d="M11 7L8.5 10M21 7L23.5 10"
                    stroke="currentColor"
                    stroke-width="0.8"
                    opacity="0.6"
                />
            </svg>
        `,

        'grip': `
            <svg class="w-7 h-7" fill="none" viewBox="0 0 32 32" aria-hidden="true">
                <path
                    d="M16 3.5L25.5 7.8V14
                       C25.5 20.1 21.8 25.1 16 28
                       C10.2 25.1 6.5 20.1 6.5 14V7.8L16 3.5Z"
                    stroke="currentColor"
                    stroke-width="1.35"
                    stroke-linejoin="round"
                />
                <path
                    d="M11 15.5L14.2 18.7L21.5 11.5"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M10 8.8L16 6.1L22 8.8"
                    stroke="currentColor"
                    stroke-width="0.7"
                    opacity="0.6"
                />
            </svg>
        `,

        'terrain': `
            <svg class="w-7 h-7" fill="none" viewBox="0 0 32 32" aria-hidden="true">
                <path
                    d="M3.5 25.5L11.5 12L17 19L21 14L28.5 25.5H3.5Z"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linejoin="round"
                />
                <path
                    d="M9 16L13 9.5L17 16"
                    stroke="currentColor"
                    stroke-width="1.2"
                    stroke-linejoin="round"
                />
                <path
                    d="M7 22L11 18L14 21L18 17L24 23"
                    stroke="currentColor"
                    stroke-width="0.8"
                    opacity="0.65"
                />
                <circle
                    cx="24"
                    cy="8"
                    r="2"
                    stroke="currentColor"
                    stroke-width="1"
                />
            </svg>
        `,

        'mud': `
            <svg class="w-7 h-7" fill="none" viewBox="0 0 32 32" aria-hidden="true">
                <path
                    d="M4 12.5C7 9.5 10 9.5 13 12.5
                       C16 15.5 19 15.5 22 12.5
                       C25 9.5 28 9.5 30 11.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                />
                <path
                    d="M3 19C6 16 9 16 12 19
                       C15 22 18 22 21 19
                       C24 16 27 16 29 18"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                />
                <path
                    d="M7 25C9 23 11 23 13 25
                       M19 25C21 23 23 23 25 25"
                    stroke="currentColor"
                    stroke-width="1"
                    stroke-linecap="round"
                    opacity="0.65"
                />
            </svg>
        `,

        'durability': `
            <svg class="w-7 h-7" fill="none" viewBox="0 0 32 32" aria-hidden="true">
                <path
                    d="M16 3.5L25 7.5V14
                       C25 20.2 21.4 25.1 16 28.5
                       C10.6 25.1 7 20.2 7 14V7.5L16 3.5Z"
                    stroke="currentColor"
                    stroke-width="1.35"
                    stroke-linejoin="round"
                />
                <path
                    d="M16 8V22"
                    stroke="currentColor"
                    stroke-width="1.2"
                    stroke-linecap="round"
                />
                <path
                    d="M11.5 12.5H20.5M11.5 17H20.5"
                    stroke="currentColor"
                    stroke-width="1.2"
                    stroke-linecap="round"
                />
                <path
                    d="M12 24.5L16 27L20 24.5"
                    stroke="currentColor"
                    stroke-width="0.7"
                    opacity="0.6"
                />
            </svg>
        `,

        'heavy': `
            <svg class="w-7 h-7" fill="none" viewBox="0 0 32 32" aria-hidden="true">
                <path
                    d="M5 23.5H27"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                />
                <path
                    d="M7 23.5V12H21L26 17V23.5"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linejoin="round"
                />
                <path
                    d="M21 12V17H26"
                    stroke="currentColor"
                    stroke-width="1.1"
                />
                <circle
                    cx="10"
                    cy="24"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.3"
                />
                <circle
                    cx="23"
                    cy="24"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.3"
                />
                <path
                    d="M10 21V27M7 24H13M23 21V27M20 24H26"
                    stroke="currentColor"
                    stroke-width="0.7"
                    opacity="0.6"
                />
            </svg>
        `,

        'reinforced': `
            <svg class="w-7 h-7" fill="none" viewBox="0 0 32 32" aria-hidden="true">
                <path
                    d="M16 3.5L25 7.5V14
                       C25 20.3 21.3 25.1 16 28.5
                       C10.7 25.1 7 20.3 7 14V7.5L16 3.5Z"
                    stroke="currentColor"
                    stroke-width="1.35"
                    stroke-linejoin="round"
                />
                <path
                    d="M10.5 11H21.5M10.5 15H21.5M10.5 19H21.5"
                    stroke="currentColor"
                    stroke-width="1.2"
                    stroke-linecap="round"
                />
                <path
                    d="M13 7.5L16 6L19 7.5"
                    stroke="currentColor"
                    stroke-width="0.8"
                    opacity="0.6"
                />
            </svg>
        `,

        'urban': `
            <svg class="w-7 h-7" fill="none" viewBox="0 0 32 32" aria-hidden="true">
                <path
                    d="M5 27V11H12V27"
                    stroke="currentColor"
                    stroke-width="1.3"
                    stroke-linejoin="round"
                />
                <path
                    d="M12 27V5H20V27"
                    stroke="currentColor"
                    stroke-width="1.3"
                    stroke-linejoin="round"
                />
                <path
                    d="M20 27V15H27V27"
                    stroke="currentColor"
                    stroke-width="1.3"
                    stroke-linejoin="round"
                />
                <path
                    d="M8 15H9M8 19H9M15 9H17M15 13H17M15 17H17M23 19H24M23 23H24"
                    stroke="currentColor"
                    stroke-width="1"
                    stroke-linecap="round"
                    opacity="0.7"
                />
            </svg>
        `,

        'stability': `
            <svg class="w-7 h-7" fill="none" viewBox="0 0 32 32" aria-hidden="true">
                <path
                    d="M4 16H28"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                />
                <path
                    d="M9 10L4 16L9 22"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M23 10L28 16L23 22"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M12 12V20M20 12V20"
                    stroke="currentColor"
                    stroke-width="0.8"
                    opacity="0.6"
                />
            </svg>
        `
    };

    return icons[type] || icons.durability;
};

const renderProductCard = (product) => {
    const dimStr = product.ratio
        ? `${product.width}/${product.ratio}-${product.rim}`
        : `${product.width}-${product.rim}`;

    const idealForHTML = product.idealFor.map(item => `
    <div class="group/ideal flex items-center gap-2.5 min-w-0 px-2.5 py-2 border border-white/10 bg-white/[0.025] backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]">

        <div class="shrink-0 flex items-center justify-center text-white opacity-90 transition-transform duration-300 group-hover/ideal:scale-105">
            ${getIdealForIcon(item.type)}
        </div>

        <span class="font-sans text-[9px] leading-[1.15] tracking-wide text-white/75">
            ${item.text}
        </span>

    </div>
`).join('');

    return `
        <div class="product-card group relative h-[450px] w-full overflow-hidden border border-ft-gray bg-ft-dark" data-id="${product.id}">
            
            <!-- État 1: Cover avec image de fond -->
            <div class="state-cover absolute inset-0 z-20 flex flex-col justify-end p-6 transition-transform duration-500 bg-ft-black">
                
                <!-- IMAGE : suppression de l'opacité et des filtres sombres -->
                <img 
                    src="${product.img_bg}" 
                    class="absolute inset-0 w-full h-full object-cover"
                    alt="${product.name}"
                >

                <div class="absolute inset-0 bg-gradient-to-t from-ft-black via-ft-black/60 to-transparent"></div>

                <div class="relative z-10 flex flex-col h-full justify-end">
                    <h3 class="font-heading text-2xl uppercase tracking-wider text-white mb-2">
                        ${product.name}
                    </h3>

                    <p class="font-mono text-sm text-ft-white/50 mb-6">
                        ${product.category.split(',')[1] || product.category.split(',')[0]}
                    </p>

                    <button class="btn-decouvrir w-full border border-white text-white font-heading uppercase text-sm tracking-widest py-3 hover:bg-white hover:text-ft-black transition-colors">
                        Découvrir
                    </button>
                </div>
            </div>

            <!-- État 2: Reveal technique -->
            <div class="state-reveal absolute inset-0 z-10 bg-ft-dark flex flex-col p-6 opacity-0 transition-opacity duration-300">
                
                <!-- Background pattern subtil -->
                <div
                    class="absolute inset-0 opacity-5"
                    style="background-image: linear-gradient(#f4f4f5 1px, transparent 1px), linear-gradient(90deg, #f4f4f5 1px, transparent 1px); background-size: 20px 20px;"
                ></div>

                <!-- En-tête -->
                <div class="relative z-10 flex justify-between items-start w-full shrink-0">
                    <div>
                        <h3 class="font-heading text-xl uppercase tracking-wider text-white leading-none">
                            ${product.name}
                        </h3>

                        <p class="font-mono text-xs text-ft-gray mt-1">
                            ${product.ref}
                        </p>
                    </div>
                </div>

                <!-- Pneu isolé au centre -->
                <div class="flex-1 min-h-0 flex items-center justify-center relative py-3">
                    <img
                        src="${product.img_iso}"
                        alt="${product.name}"
                        class="max-h-full max-w-full object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                    >
                </div>

                <!-- NOUVEAU : Idéal pour -->
                <div class="relative z-10 shrink-0 mb-4">
                    
                    <p class="font-heading text-[10px] tracking-[0.2em] text-ft-white/50 mb-2">
                        Idéal pour
                    </p>

                    <div class="grid grid-cols-3 gap-2">
                        ${idealForHTML}
                    </div>

                </div>

                <!-- Informations + bouton Détail -->
                <div class="relative z-10 flex justify-between items-end w-full shrink-0">
                    <div>
                        <p class="font-heading text-xl text-ft-red">
                            ${dimStr}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="btn-detail shrink-0 flex items-center gap-2 text-white font-heading text-sm tracking-widest hover:text-ft-red transition-colors group/btn"
                    >
                        Détail
                        <svg
                            class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="square"
                                stroke-linejoin="miter"
                                stroke-width="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            ></path>
                        </svg>
                    </button>
                </div>

            </div>
        </div>
    `;
};

    const renderCatalog = (filter = 'all') => {
        productGrid.innerHTML = '';
        const filtered = filter === 'all' ? productsDB : productsDB.filter(p => p.category.includes(filter));
        
        if(filtered.length === 0) {
            productGrid.innerHTML = '<p class="col-span-full text-center text-ft-white/50 py-10 font-sans">Aucun produit trouvé pour ce filtre.</p>';
            return;
        }

        filtered.forEach(product => {
            productGrid.innerHTML += renderProductCard(product);
        });

        // Add Event Listeners for new cards
        document.querySelectorAll('.product-card').forEach(card => {
            const btnDecouvrir = card.querySelector('.btn-decouvrir');
            const stateCover = card.querySelector('.state-cover');
            const stateReveal = card.querySelector('.state-reveal');
            const btnDetail = card.querySelector('.btn-detail');
            const productId = card.getAttribute('data-id');

            // Animation Reveal
            btnDecouvrir.addEventListener('click', (e) => {
                // Slide up the cover
                stateCover.style.transform = 'translateY(-100%)';
                // Show reveal behind it
                stateReveal.style.opacity = '1';
                stateReveal.style.zIndex = '30';
            });

            // Reset state if mouse leaves (optional, maybe keep it open for mobile friendliness, let's keep it open until click elsewhere, or just let them click detail)
            // But for desktop a reset is nice. Let's make a simple toggle if they click the card background.
            
            // Ouvrir le modal Detail
            btnDetail.addEventListener('click', () => {
                openProductModal(productId);
            });
        });
    };

    // Filter Buttons logic
    document.querySelectorAll('#catalog-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active classes
            document.querySelectorAll('#catalog-filters .filter-btn').forEach(b => {
                b.classList.remove('bg-white', 'text-ft-black', 'border-white', 'active');
                b.classList.add('bg-transparent', 'text-white', 'border-ft-gray');
            });
            // Set active class
            e.target.classList.remove('bg-transparent', 'text-white', 'border-ft-gray');
            e.target.classList.add('bg-white', 'text-ft-black', 'border-white', 'active');
            
            renderCatalog(e.target.getAttribute('data-category'));
        });
    });

    // --- Product Modal Logic ---
    const openProductModal = (id) => {
        const p = productsDB.find(prod => prod.id === id);
        if(!p) return;
        currentSelectedProduct = p;

        const dimStr = p.ratio ? `${p.width}/${p.ratio}-${p.rim}` : `${p.width}-${p.rim}`;
        
        document.getElementById('modal-img').src = p.img_iso;
        document.getElementById('modal-name').textContent = p.name;
        document.getElementById('modal-ref').textContent = `REF: ${p.ref}`;
        document.getElementById('modal-dim').textContent = dimStr;
        document.getElementById('modal-pos').textContent = p.position;
        document.getElementById('modal-type').textContent = p.type;
        document.getElementById('modal-usage').textContent = p.usage;
        document.getElementById('modal-index').textContent = p.index;
        document.getElementById('modal-desc').textContent = p.desc;
        document.getElementById('modal-price-usd').textContent = formatUSD(p.price_usd);
        document.getElementById('modal-price-cdf').textContent = formatCDF(p.price_usd);

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // prevent background scroll
    };

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    // Add to Cart from Modal
    document.getElementById('modal-add-btn').addEventListener('click', () => {
        if(currentSelectedProduct) {
            addToCart(currentSelectedProduct);
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            
            // Show feedback
            const btn = document.getElementById('modal-add-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Ajouté ! <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            btn.classList.replace('bg-ft-red', 'bg-green-600');
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.replace('bg-green-600', 'bg-ft-red');
                toggleCart(true); // Open cart panel
            }, 500);
        }
    });

    // --- Cart Logic ---
    const updateCartUI = () => {
        const cartItemsContainer = document.getElementById('cart-items');
        const countEl = document.getElementById('cart-count');
        
        let totalUSD = 0;
        let totalItems = 0;
        
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-ft-gray text-center font-sans mt-10">Votre panier est vide.</p>';
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
            cart.forEach((item, index) => {
                totalUSD += item.product.price_usd * item.quantity;
                totalItems += item.quantity;
                const dimStr = item.product.ratio ? `${item.product.width}/${item.product.ratio}-${item.product.rim}` : `${item.product.width}-${item.product.rim}`;
                
                cartItemsContainer.innerHTML += `
                    <div class="flex gap-4 bg-ft-black p-4 border border-ft-gray">
                        <div class="w-16 h-16 bg-ft-dark flex-shrink-0 border border-ft-gray flex items-center justify-center p-1">
                            <img src="${item.product.img_iso}" class="h-full object-contain grayscale">
                        </div>
                        <div class="flex-1 flex flex-col justify-between">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-heading uppercase text-sm tracking-wider text-white leading-tight">${item.product.name}</h4>
                                    <span class="text-[10px] font-mono text-ft-white/50">${dimStr}</span>
                                </div>
                                <button onclick="removeFromCart(${index})" class="text-ft-gray hover:text-ft-red transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                            <div class="flex justify-between items-end mt-2">
                                <div class="flex items-center gap-2 border border-ft-gray bg-ft-dark">
                                    <button onclick="updateQty(${index}, -1)" class="w-6 h-6 flex items-center justify-center text-white hover:bg-ft-lightgray">-</button>
                                    <span class="font-mono text-xs w-4 text-center">${item.quantity}</span>
                                    <button onclick="updateQty(${index}, 1)" class="w-6 h-6 flex items-center justify-center text-white hover:bg-ft-lightgray">+</button>
                                </div>
                                <div class="text-right">
                                    <div class="font-heading text-ft-red">${formatUSD(item.product.price_usd * item.quantity)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        countEl.textContent = totalItems;
        document.getElementById('cart-total-usd').textContent = formatUSD(totalUSD);
        document.getElementById('cart-total-cdf').textContent = formatCDF(totalUSD);
        
        // Update checkout totals as well
        document.getElementById('co-subtotal').textContent = formatUSD(totalUSD);
        updateCheckoutTotal();
    };

    const addToCart = (product) => {
        const existing = cart.find(i => i.product.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ product, quantity: 1 });
        }
        updateCartUI();
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCartUI();
    };

    window.updateQty = (index, delta) => {
        const item = cart[index];
        item.quantity += delta;
        if (item.quantity <= 0) cart.splice(index, 1);
        updateCartUI();
    };

    // --- Checkout Logic ---
    checkoutBtn.addEventListener('click', () => {
        toggleCart(false);
        openCheckout();
    });

    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    const openCheckout = () => {
        checkoutModal.classList.remove('hidden');
        checkoutModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        currentStep = 1;
        updateStepperUI();
        
        // Populate Step 1 (Cart Review)
        const coItemsContainer = document.getElementById('checkout-cart-items');
        coItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const dimStr = item.product.ratio ? `${item.product.width}/${item.product.ratio}-${item.product.rim}` : `${item.product.width}-${item.product.rim}`;
            coItemsContainer.innerHTML += `
                <div class="flex justify-between items-center border-b border-ft-gray pb-4">
                    <div>
                        <div class="font-heading uppercase tracking-wider">${item.product.name}</div>
                        <div class="text-xs font-mono text-ft-white/50">${dimStr} - Qté: ${item.quantity}</div>
                    </div>
                    <div class="font-mono">${formatUSD(item.product.price_usd * item.quantity)}</div>
                </div>
            `;
        });
    };

    const updateStepperUI = () => {
        // Update Steps sidebar
        document.querySelectorAll('.step-item').forEach(el => {
            const stepNum = parseInt(el.getAttribute('data-step'));
            el.classList.remove('active', 'completed');
            if (stepNum < currentStep) {
                el.classList.add('completed');
            } else if (stepNum === currentStep) {
                el.classList.add('active');
            }
        });

        // Show/Hide Content
        document.querySelectorAll('.step-content').forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('block');
        });
        const currentContent = document.getElementById(`step-content-${currentStep}`);
        if(currentContent) {
            currentContent.classList.remove('hidden');
            currentContent.classList.add('block');
        }
    };

    // Nav Buttons
    document.querySelectorAll('.next-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Basic validation
            if (currentStep === 2) {
                const name = document.getElementById('co-name').value;
                const phone = document.getElementById('co-phone').value;
                const commune = document.getElementById('co-commune').value;
                if(!name || !phone || !commune) {
                    alert('Veuillez remplir les champs obligatoires.'); // Only use if strictly necessary, but requested not to.
                    // Better approach: highlight inputs
                    document.getElementById('co-name').classList.add('border-ft-red');
                    return;
                }
            }

            if (currentStep === 4) {
                // Simulate payment processing before step 5
                processPayment();
                return;
            }

            if (currentStep < 5) {
                currentStep++;
                updateStepperUI();
            }
        });
    });

    document.querySelectorAll('.prev-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStepperUI();
            }
        });
    });

    // Delivery Fee update
    window.updateDeliveryFee = (fee) => {
        deliveryFee = fee;
        updateCheckoutTotal();
    };

    const updateCheckoutTotal = () => {
        let subtotalUSD = cart.reduce((sum, item) => sum + (item.product.price_usd * item.quantity), 0);
        let totalUSD = subtotalUSD + deliveryFee;
        
        const totUsdEl = document.getElementById('co-total-usd');
        const totCdfEl = document.getElementById('co-total-cdf');
        if(totUsdEl) totUsdEl.textContent = formatUSD(totalUSD);
        if(totCdfEl) totCdfEl.textContent = formatCDF(totalUSD);

        const finalTotUsdEl = document.getElementById('co-final-total-usd');
        if(finalTotUsdEl) finalTotUsdEl.textContent = formatUSD(totalUSD);
        
        const payBtnAmt = document.getElementById('pay-btn-amount');
        if(payBtnAmt) payBtnAmt.textContent = formatUSD(totalUSD);
    };

    // Mobile Money selection logic
    const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    const mmPrompt = document.getElementById('mm-prompt');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Reset borders
            document.querySelectorAll('input[name="payment_method"]').forEach(r => r.parentElement.style.borderColor = '');
            e.target.parentElement.style.borderColor = 'white';

            if (e.target.value !== 'cash') {
                mmPrompt.classList.remove('hidden');
                mmPrompt.classList.add('block');
            } else {
                mmPrompt.classList.add('hidden');
                mmPrompt.classList.remove('block');
            }
        });
    });

    // Simulation Paiement & Facture
    const processPayment = () => {
        const method = document.querySelector('input[name="payment_method"]:checked').value;
        const navBtns = document.getElementById('payment-nav-btns');
        const processing = document.getElementById('payment-processing');
        const formContent = mmPrompt.parentElement; // the container of methods

        // Hide methods, show loader
        Array.from(formContent.children).forEach(c => {
            if(c.id !== 'payment-processing') c.style.display = 'none';
        });
        processing.classList.remove('hidden');
        processing.classList.add('flex');

        setTimeout(() => {
            // Generate Invoice Data
            generateInvoice(method);
            
            currentStep = 5;
            updateStepperUI();
            
            // Empty cart
            cart = [];
            updateCartUI();
        }, 2000);
    };

    // Déclenchement du paiement depuis le bouton "Payer"
const triggerPaymentBtn = document.getElementById('trigger-payment');

if (triggerPaymentBtn) {
    triggerPaymentBtn.addEventListener('click', () => {
        processPayment();
    });
}

    const generateInvoice = (methodMethod) => {
        const clientName = document.getElementById('co-name').value || 'Client';
        const clientCommune = document.getElementById('co-commune').value || 'Kinshasa';
        const clientAddress = document.getElementById('co-address').value || '';
        
        let subtotalUSD = 0;
        const invItemsBody = document.getElementById('inv-items');
        invItemsBody.innerHTML = '';
        
        cart.forEach(item => {
            const lineTotal = item.product.price_usd * item.quantity;
            subtotalUSD += lineTotal;
            invItemsBody.innerHTML += `
                <tr class="border-b border-gray-100">
                    <td class="py-2">
                        <div class="font-bold">${item.product.name}</div>
                        <div class="text-xs text-gray-500">${item.product.ref}</div>
                    </td>
                    <td class="py-2 text-center">${item.quantity}</td>
                    <td class="py-2 text-right font-mono">${formatUSD(lineTotal)}</td>
                </tr>
            `;
        });

        const totalUSD = subtotalUSD + deliveryFee;
        
        document.getElementById('inv-date').textContent = new Date().toLocaleDateString('fr-FR');
        document.getElementById('inv-client-name').textContent = clientName;
        document.getElementById('inv-client-address').textContent = `${clientCommune}, ${clientAddress.substring(0,20)}...`;
        
        document.getElementById('inv-subtotal').textContent = formatUSD(subtotalUSD);
        document.getElementById('inv-shipping').textContent = formatUSD(deliveryFee);
        document.getElementById('inv-total').textContent = formatUSD(totalUSD);
        
        const methodNames = {
            'orange': 'Orange Money', 'airtel': 'Airtel Money', 'mpesa': 'M-Pesa', 'africell': 'Africell Money', 'cash': 'Paiement à la livraison'
        };
        document.getElementById('inv-payment-method').textContent = methodNames[methodMethod];
    };

    // Quick Search logic (just scrolls to catalog for demo)
    document.getElementById('btn-quick-search').addEventListener('click', () => {
        document.getElementById('catalog').scrollIntoView({behavior: 'smooth'});
        // In a real app, this would apply filters based on dropdowns.
    });

    // Init
    renderCatalog();
    updateCartUI();
