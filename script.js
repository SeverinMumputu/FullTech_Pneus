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
        img_bg: 'photo_1.jpeg',
        img_iso: 'photo_1.jpeg',

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
        img_bg: 'photo_2.jpeg',
        img_iso: 'photo_5.jpeg',

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
        img_bg: 'photo_3.jpeg',
        img_iso: 'photo_3.jpeg',

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
        img_bg: 'photo_4.jpeg',
        img_iso: 'photo_4.jpeg',

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

/* ============================================================
   INFORMATION COMMANDE — POPUP AVANT CHECKOUT
============================================================ */

const orderNoticeOverlay =
    document.getElementById(
        'order-notice-overlay'
    );

const orderNoticeTrack =
    document.getElementById(
        'order-notice-track'
    );

const orderNoticeConsent =
    document.getElementById(
        'order-notice-consent'
    );

const orderNoticeCloseBtn =
    document.getElementById(
        'close-order-notice-btn'
    );

const orderNoticeNoBtn =
    document.getElementById(
        'order-notice-no'
    );

const orderNoticeYesBtn =
    document.getElementById(
        'order-notice-yes'
    );

const orderNoticeSlides =
    Array.from(
        document.querySelectorAll(
            '.order-notice-slide'
        )
    );

const orderNoticeProgress =
    Array.from(
        document.querySelectorAll(
            '.order-notice-progress'
        )
    );

const orderNoticeNextButtons =
    Array.from(
        document.querySelectorAll(
            '[data-order-notice-next]'
        )
    );

const orderNoticePrevButtons =
    Array.from(
        document.querySelectorAll(
            '[data-order-notice-prev]'
        )
    );


let orderNoticeStep =
    0;


/* ============================================================
   MISE À JOUR DU POPUP
============================================================ */

function updateOrderNotice() {

    if (
        !orderNoticeTrack
    ) {
        return;
    }


    orderNoticeTrack.style.transform =
        `translateX(-${orderNoticeStep * 100}%)`;


    orderNoticeProgress.forEach(
        (
            element,
            index
        ) => {

            element.classList.toggle(
                'bg-ft-red',
                index <= orderNoticeStep
            );

            element.classList.toggle(
                'bg-ft-gray',
                index > orderNoticeStep
            );

        }
    );


    /*
     * Le consentement n'apparaît
     * qu'après la troisième étape.
     */

    if (
        orderNoticeConsent
    ) {

        orderNoticeConsent.classList.toggle(
            'hidden',
            orderNoticeStep !==
                orderNoticeSlides.length
        );

    }

}


/* ============================================================
   OUVERTURE
============================================================ */

function openOrderNotice() {

    if (
        !orderNoticeOverlay
    ) {
        return;
    }


    orderNoticeStep =
        0;


    updateOrderNotice();


    orderNoticeOverlay.classList.remove(
        'hidden'
    );


    orderNoticeOverlay.classList.add(
        'flex'
    );


    document.body.style.overflow =
        'hidden';

}


/* ============================================================
   FERMETURE
============================================================ */

function closeOrderNotice() {

    if (
        !orderNoticeOverlay
    ) {
        return;
    }


    orderNoticeOverlay.classList.add(
        'hidden'
    );


    orderNoticeOverlay.classList.remove(
        'flex'
    );


    document.body.style.overflow =
        'auto';

}


/* ============================================================
   ÉTAPE SUIVANTE
============================================================ */

orderNoticeNextButtons.forEach(
    button => {

        button.addEventListener(
            'click',
            () => {

                if (
                    orderNoticeStep <
                    orderNoticeSlides.length
                ) {

                    orderNoticeStep +=
                        1;

                    updateOrderNotice();

                }

            }
        );

    }
);


/* ============================================================
   ÉTAPE PRÉCÉDENTE
============================================================ */

orderNoticePrevButtons.forEach(
    button => {

        button.addEventListener(
            'click',
            () => {

                if (
                    orderNoticeStep >
                    0
                ) {

                    orderNoticeStep -=
                        1;

                    updateOrderNotice();

                }

            }
        );

    }
);


/* ============================================================
   FERMETURE PAR X
============================================================ */

orderNoticeCloseBtn?.addEventListener(
    'click',
    closeOrderNotice
);


/* ============================================================
   REFUS
============================================================ */

orderNoticeNoBtn?.addEventListener(
    'click',
    () => {

        /*
         * Le client refuse :
         * fermeture du popup + fermeture du panier.
         */

        closeOrderNotice();

        toggleCart(
            false
        );

    }
);


/* ============================================================
   ACCEPTATION
============================================================ */

orderNoticeYesBtn?.addEventListener(
    'click',
    () => {

        /*
         * Fermeture du popup.
         */

        closeOrderNotice();


        /*
         * Le checkout existant reprend
         * son fonctionnement normal.
         */

        toggleCart(
            false
        );


        openCheckout();

    }
);


/* ============================================================
   CLIC SUR L'OVERLAY
============================================================ */

orderNoticeOverlay?.addEventListener(
    'click',
    event => {

        if (
            event.target ===
            orderNoticeOverlay
        ) {

            closeOrderNotice();

        }

    }
);


    // Checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');

    // Mes commandes
const ordersBtn = document.getElementById('orders-btn');
const ordersOverlay = document.getElementById('orders-overlay');
const ordersPanel = document.getElementById('orders-panel');
const closeOrdersBtn = document.getElementById('close-orders-btn');
const myOrdersList = document.getElementById('my-orders-list');
const ordersCount = document.getElementById('orders-count');
 

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
        src: 'image_6.jpeg',
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

    const headerSecondary =
        header?.querySelector('[class~="bg-ft-dark/95"]');

    if (window.scrollY > 50) {

        header?.classList.add('shadow-lg');

        headerSecondary?.classList.add(
            'border-ft-red'
        );

    } else {

        header?.classList.remove(
            'shadow-lg'
        );

        headerSecondary?.classList.remove(
            'border-ft-red'
        );

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

checkoutBtn.addEventListener(
    'click',
    () => {

        if (
            cart.length === 0
        ) {
            return;
        }

        openOrderNotice();

    }
);



closeCheckoutBtn.addEventListener('click', () => {
    closeCheckout();
});



let currentStep = 1;
let deliveryFee = 0;

let checkoutOrder = null;
let checkoutPaymentConfirmed = false;

/*
 * Gestion en mémoire uniquement.
 *
 * Aucune donnée de commande n'est conservée
 * dans le navigateur avec LocalStorage.
 *
 * La persistance définitive appartient à
 * la plateforme de gestion.
 */
let orderSequence = 0;
let pendingOrders = [];


/* ============================================================
   HELPERS CHECKOUT
============================================================ */

const getCheckoutSubtotal = () => {
    return cart.reduce(
        (sum, item) =>
            sum + (item.product.price_usd * item.quantity),
        0
    );
};

const generateOrderId = () => {

    const currentYear =
        new Date().getFullYear();

    orderSequence += 1;

    return `CMD-${currentYear}-${String(orderSequence).padStart(5, '0')}`;
};


/*
 * Empreinte courte du contenu de la commande.
 *
 * Elle permet de créer un code plus difficile à deviner
 * tout en restant suffisamment court pour être saisi
 * manuellement.
 *
 * La donnée métier complète reste dans checkoutOrder.
 */
const generateOrderFingerprint = (input) => {

    let hash = 2166136261;

    for (let i = 0; i < input.length; i++) {

        hash ^= input.charCodeAt(i);

        hash +=
            (hash << 1) +
            (hash << 4) +
            (hash << 7) +
            (hash << 8) +
            (hash << 24);
    }

    return (
        hash >>> 0
    )
        .toString(36)
        .toUpperCase()
        .padStart(7, '0')
        .slice(-7);
};

/*
 * Génération du code unique de rapprochement.
 *
 * Le code est lié à :
 * - l'identifiant de commande
 * - l'identité du client
 * - l'adresse email du client
 * - la date/heure
 * - le montant
 *
 * L'email est intégré à la source de calcul
 * du fingerprint afin que le code soit lié
 * à cette donnée client.
 *
 * Exemple :
 * CMD-2026-00012-7F8A21B
 */
const generateUniqueOrderCode = ({
    orderId,
    name,
    email,
    createdAt,
    amount
}) => {

    const normalizedEmail =
        String(email || '')
            .trim()
            .toLowerCase();

    const fingerprintSource =
        `${orderId}|${name}|${normalizedEmail}|${createdAt}|${amount.toFixed(2)}`;

    const fingerprint =
        generateOrderFingerprint(
            fingerprintSource
        );

    return `${orderId}-${fingerprint}`;
};

/* ============================================================
   RÉCAPITULATIF PANIER
============================================================ */

const renderCheckoutCart = () => {

    const coItemsContainer =
        document.getElementById(
            'checkout-cart-items'
        );

    if (!coItemsContainer) {
        return;
    }

    coItemsContainer.innerHTML = '';

    if (cart.length === 0) {

        coItemsContainer.innerHTML = `
            <p class="text-ft-gray text-center font-sans mt-10">
                Votre panier est vide.
            </p>
        `;

        return;
    }


    cart.forEach(item => {

        const dimStr = item.product.ratio
            ? `${item.product.width}/${item.product.ratio}-${item.product.rim}`
            : `${item.product.width}-${item.product.rim}`;

        coItemsContainer.innerHTML += `
            <div class="flex justify-between items-center border-b border-ft-gray pb-4">

                <div>

                    <div class="font-heading uppercase tracking-wider">
                        ${item.product.name}
                    </div>

                    <div class="text-xs font-mono text-ft-white/50">
                        ${dimStr} - Qté: ${item.quantity}
                    </div>

                </div>

                <div class="font-mono">
                    ${formatUSD(
                        item.product.price_usd * item.quantity
                    )}
                </div>

            </div>
        `;
    });
};



/* ============================================================
   TOTAUX CHECKOUT
============================================================ */

const updateCheckoutTotal = () => {

    const subtotalUSD =
        getCheckoutSubtotal();

    /*
     * La nouvelle architecture ne prévoit plus
     * de frais de livraison dans le stepper.
     */
    const totalUSD =
        subtotalUSD;


    const subtotalEl =
        document.getElementById(
            'co-subtotal'
        );

    if (subtotalEl) {
        subtotalEl.textContent =
            formatUSD(subtotalUSD);
    }


    const totalUsdEl =
        document.getElementById(
            'co-total-usd'
        );

    if (totalUsdEl) {
        totalUsdEl.textContent =
            formatUSD(totalUSD);
    }


    const totalCdfEl =
        document.getElementById(
            'co-total-cdf'
        );

    if (totalCdfEl) {
        totalCdfEl.textContent =
            formatCDF(totalUSD);
    }
};



/* ============================================================
   LECTURE DES INFOS CLIENT
============================================================ */

const getClientCheckoutData = () => {

    return {

        name:
            document.getElementById(
                'co-name'
            ).value.trim(),

        phone:
            document.getElementById(
                'co-phone'
            ).value.trim(),

        email:
            document.getElementById(
                'co-email'
            ).value.trim(),

        commune:
            document.getElementById(
                'co-commune'
            ).value.trim(),

        quartier:
            document.getElementById(
                'co-quartier'
            ).value.trim(),

        reference:
            document.getElementById(
                'co-reference'
            ).value.trim()

    };
};

/* ============================================================
   TICKETS DE COMMANDE
============================================================ */

/*
 * Génération déterministe des tickets liés à la commande.
 *
 * Aucun élément aléatoire n'est utilisé.
 *
 * La preuve du ticket est calculée à partir de :
 * - l'identifiant unique de la commande
 * - le code unique de rapprochement
 * - la date/heure de création
 * - le montant de la commande
 *
 * La plateforme de gestion pourra recalculer
 * exactement cette même preuve.
 */
const generateOrderTicketOptions = ({
    orderId,
    uniqueCode,
    createdAt,
    amount
}) => {

    const cleanOrderId =
        String(orderId)
            .replace(/[^A-Z0-9]/gi, '')
            .toUpperCase();


    /*
     * Source indépendante de liaison du ticket
     * avec la commande.
     */
    const ticketBindingSource =
        `${orderId}|${uniqueCode}|${createdAt}|${Number(amount).toFixed(2)}`;


    /*
     * Preuve déterministe du ticket.
     *
     * La même commande produira toujours
     * la même preuve.
     */
    const ticketProof =
        generateOrderFingerprint(
            ticketBindingSource
        );


    /*
     * Base commune aux 5 tickets.
     */
    const base =
        `TCK-${cleanOrderId}-${ticketProof}`;


    /*
     * Les 5 tickets restent disponibles pour
     * l'étape 3, mais aucun n'est généré
     * avec une valeur aléatoire.
     */
    return Array.from(
        { length: 5 },
        (_, index) =>
            `${base}-${String(index + 1).padStart(2, '0')}`
    );

};

/* ============================================================
   GÉNÉRATION DU DOSSIER DE COMMANDE
============================================================ */

const generateCheckoutOrder = (
    reservedOrderId = null
) => {

    const client =
        getClientCheckoutData();

    const createdAt =
        new Date().toISOString();

    const amount =
        getCheckoutSubtotal();

    const orderId =
    reservedOrderId ||
    generateOrderId();

const uniqueCode =
    generateUniqueOrderCode({

        orderId,

        name:
            client.name,

        email:
            client.email,

        createdAt,

        amount

    });

const ticketOptions =
    generateOrderTicketOptions({
        orderId,
        uniqueCode,
        createdAt,
        amount
    });

checkoutOrder = {

    orderId,

    uniqueCode,

    ticketOptions,

    createdAt,

        amount_usd:
            Number(amount.toFixed(2)),

        amount_cdf:
            amount * TAUX_CONVERSION,

        client: {
            ...client
        },

        items:
            cart.map(item => ({
                product_id:
                    item.product.id,

                reference:
                    item.product.ref,

                name:
                    item.product.name,

                quantity:
                    item.quantity,

                unit_price_usd:
                    item.product.price_usd,

                line_total_usd:
                    Number(
                        (
                            item.product.price_usd *
                            item.quantity
                        ).toFixed(2)
                    )
            })),

        payment: {

            status:
                'PENDING_VERIFICATION',

            channel:
                null,

            ticket:
                null

        }

    };

/* ============================================================
   REMPLISSAGE DES OPTIONS DE TICKET — ÉTAPE 3
============================================================ */

const ticketStep3 =
    document.getElementById(
        'co-ticket-step3'
    );

const ticketOptionsHTML = `
    <option value="">
        Sélectionner un numéro de ticket...
    </option>

    ${checkoutOrder.ticketOptions.map(ticket => `
        <option value="${ticket}">
            ${ticket}
        </option>
    `).join('')}
`;

if (ticketStep3) {
    ticketStep3.innerHTML =
        ticketOptionsHTML;
}

    /*
     * Affichage étape 3
     */
    document.getElementById(
        'generated-order-code'
    ).textContent =
        checkoutOrder.uniqueCode;


    document.getElementById(
        'generated-order-id'
    ).textContent =
        checkoutOrder.orderId;


    document.getElementById(
        'generated-order-client'
    ).textContent =
        checkoutOrder.client.name;


    document.getElementById(
        'generated-order-date'
    ).textContent =
        new Date(
            checkoutOrder.createdAt
        ).toLocaleString(
            'fr-FR',
            {
                dateStyle: 'long',
                timeStyle: 'short'
            }
        );


    document.getElementById(
        'generated-order-amount'
    ).textContent =
        formatUSD(
            checkoutOrder.amount_usd
        );
};

/* ============================================================
   PAYLOAD DESTINÉ À LA PLATEFORME DE GESTION
============================================================ */

/*
 * Construit exclusivement l'objet JSON
 * attendu par la plateforme de gestion.
 *
 * Les données internes au frontend comme
 * ticketOptions ne sont pas transmises.
 */
const buildManagementOrderPayload = (order) => {

    return {

        orderId:
            order.orderId,

        uniqueCode:
            order.uniqueCode,

        createdAt:
            order.createdAt,

        amount_usd:
            order.amount_usd,

        amount_cdf:
            order.amount_cdf,

        client: {

            name:
                order.client?.name || '',

            phone:
                order.client?.phone || '',

            email:
                order.client?.email || '',

            commune:
                order.client?.commune || '',

            quartier:
                order.client?.quartier || '',

            reference:
                order.client?.reference || ''

        },

        items:
            Array.isArray(order.items)
                ? order.items
                : [],

        payment: {

            status:
                order.payment?.status ||
                'PENDING_VERIFICATION',

            channel:
                order.payment?.channel ?? null,

            ticket:
                order.payment?.ticket ?? null

        }

    };
};

/* ============================================================
   STEPPER
============================================================ */

const updateStepperUI = () => {

    /*
     * Sidebar
     */
    document.querySelectorAll(
        '.step-item'
    ).forEach(el => {

        const stepNum =
            parseInt(
                el.getAttribute('data-step'),
                10
            );

        el.classList.remove(
            'active',
            'completed'
        );


        if (stepNum < currentStep) {

            el.classList.add(
                'completed'
            );

        } else if (
            stepNum === currentStep
        ) {

            el.classList.add(
                'active'
            );
        }

    });


    /*
     * Contenus
     */
    document.querySelectorAll(
        '.step-content'
    ).forEach(el => {

        el.classList.add(
            'hidden'
        );

        el.classList.remove(
            'block'
        );

    });


    const currentContent =
        document.getElementById(
            `step-content-${currentStep}`
        );


    if (currentContent) {

        currentContent.classList.remove(
            'hidden'
        );

        currentContent.classList.add(
            'block'
        );
    }
};



/* ============================================================
   OUVERTURE DU CHECKOUT
============================================================ */

const openCheckout = () => {

    if (cart.length === 0) {
        return;
    }

    checkoutModal.classList.remove(
        'hidden'
    );

    checkoutModal.classList.add(
        'flex'
    );

    document.body.style.overflow =
        'hidden';


    currentStep = 1;

    checkoutOrder = null;

    checkoutPaymentConfirmed =
        false;


    /*
     * Réinitialisation de l'étape 4
     */
    const paymentStart =
        document.getElementById(
            'payment-confirmation-start'
        );

    const paymentForm =
        document.getElementById(
            'payment-confirmation-form'
        );

    const paymentSuccess =
        document.getElementById(
            'payment-confirmation-success'
        );


    paymentStart.classList.remove(
        'hidden'
    );


    paymentForm.classList.add(
        'hidden'
    );

    paymentForm.classList.remove(
        'flex'
    );


    paymentSuccess.classList.add(
        'hidden'
    );
const ticketStep3 =
    document.getElementById(
        'co-ticket-step3'
    );

if (ticketStep3) {
    ticketStep3.value = '';
}

const ticketStep4 =
    document.getElementById(
        'co-ticket-step4'
    );

if (ticketStep4) {
    ticketStep4.value = '';
}

const paymentChannel =
    document.getElementById(
        'co-payment-channel'
    );

if (paymentChannel) {
    paymentChannel.value = 'mpesa';
}

const confirmationCode =
    document.getElementById(
        'co-confirmation-code'
    );

if (confirmationCode) {
    confirmationCode.value = '';
}
    renderCheckoutCart();

    updateCheckoutTotal();

    updateStepperUI();
};



/* ============================================================
   FERMETURE DU CHECKOUT
============================================================ */

const closeCheckout = () => {

    checkoutModal.classList.add(
        'hidden'
    );

    checkoutModal.classList.remove(
        'flex'
    );

    document.body.style.overflow =
        'auto';
};



/* ============================================================
   NAVIGATION — NEXT
============================================================ */

document.querySelectorAll(
    '.next-step-btn'
).forEach(btn => {

    btn.addEventListener(
        'click',
        async () => {

            /*
             * STEP 1
             */
            if (currentStep === 1) {

                if (cart.length === 0) {
                    return;
                }

                currentStep = 2;

                updateStepperUI();

                return;
            }


            /*
             * STEP 2
             */
            if (currentStep === 2) {

                const clientForm =
                    document.getElementById(
                        'client-info-form'
                    );


                if (!clientForm.reportValidity()) {
                    return;
                }
/*
 * Réservation de l'identifiant de commande
 * directement auprès du backend.
 */
try {

    const reservedOrderId =
        await reserveManagementOrderId();


    /*
     * Création du dossier de commande
     * avec l'identifiant réservé.
     */
    generateCheckoutOrder(
        reservedOrderId
    );


    currentStep = 3;

    updateStepperUI();

} catch (error) {

    console.error(
        '[FULLTECH] Impossible de préparer la commande :',
        error
    );


    alert(
        'Impossible de préparer la commande. Vérifiez que la plateforme de gestion est démarrée.'
    );

}

return;
            }


/*
 * STEP 3
 */
if (currentStep === 3) {

    if (!checkoutOrder) {
        generateCheckoutOrder();
    }

    const ticketStep3 =
        document.getElementById(
            'co-ticket-step3'
        );

    if (!ticketStep3) {
        return;
    }

    if (!ticketStep3.reportValidity()) {
        return;
    }

    const selectedTicket =
        ticketStep3.value.trim();

    if (!selectedTicket) {
        return;
    }

    /*
     * Conservation du ticket sélectionné
     * pour l'étape 4.
     */
    checkoutOrder.payment.ticket =
        selectedTicket;

    /*
     * L'étape 4 demande maintenant
     * au client de saisir le ticket
     * qu'il vient de copier.
     */
    const ticketStep4 =
        document.getElementById(
            'co-ticket-step4'
        );

    if (ticketStep4) {
        ticketStep4.value = '';
    }

    const confirmationCode =
        document.getElementById(
            'co-confirmation-code'
        );

    if (confirmationCode) {
        confirmationCode.value = '';
    }

    currentStep = 4;

    updateStepperUI();

    return;
}

        }
    );

});



/* ============================================================
   NAVIGATION — PREVIOUS
============================================================ */

document.querySelectorAll(
    '.prev-step-btn'
).forEach(btn => {

    btn.addEventListener(
        'click',
        () => {

            if (currentStep > 1) {

                currentStep--;

                updateStepperUI();

            }

        }
    );

});



/* ============================================================
   BOUTON "J'AI DÉJÀ PAYÉ"
============================================================ */

const alreadyPaidBtn =
    document.getElementById(
        'already-paid-btn'
    );


if (alreadyPaidBtn) {

    alreadyPaidBtn.addEventListener(
        'click',
        () => {

            if (!checkoutOrder) {
                return;
            }


            const paymentStart =
                document.getElementById(
                    'payment-confirmation-start'
                );

            const paymentForm =
                document.getElementById(
                    'payment-confirmation-form'
                );


            paymentStart.classList.add(
                'hidden'
            );


            paymentForm.classList.remove(
                'hidden'
            );

            paymentForm.classList.add(
                'flex'
            );


            document.getElementById(
                'co-confirmation-code'
            ).focus();

        }
    );

}



/* ============================================================
   COPIE DU CODE UNIQUE
============================================================ */

const copyOrderCodeBtn =
    document.getElementById(
        'copy-order-code-btn'
    );


if (copyOrderCodeBtn) {

    copyOrderCodeBtn.addEventListener(
        'click',
        async () => {

            if (
                !checkoutOrder ||
                !checkoutOrder.uniqueCode
            ) {
                return;
            }


            try {

                await navigator.clipboard.writeText(
                    checkoutOrder.uniqueCode
                );


                const originalText =
                    copyOrderCodeBtn.textContent;


                copyOrderCodeBtn.textContent =
                    'Code copié';


                setTimeout(() => {

                    copyOrderCodeBtn.textContent =
                        originalText;

                }, 1500);


            } catch (error) {

                console.error(
                    'Impossible de copier le code :',
                    error
                );

            }

        }
    );

}

/* ============================================================
   COPIE DU NUMÉRO DE TICKET
============================================================ */

const copyTicketBtn = document.getElementById(
    'copy-ticket-btn'
);

if (copyTicketBtn) {

    copyTicketBtn.addEventListener(
        'click',
        async () => {

            const ticketInput = document.getElementById(
                'co-ticket-step3'
            );

            if (!ticketInput) {
                return;
            }

            const ticket = ticketInput.value.trim();

            if (!ticket) {
                ticketInput.focus();
                ticketInput.reportValidity();
                return;
            }

            try {

                await navigator.clipboard.writeText(
                    ticket
                );

                const originalText =
                    copyTicketBtn.textContent;

                copyTicketBtn.textContent =
                    'Ticket copié';

                setTimeout(() => {

                    copyTicketBtn.textContent =
                        originalText;

                }, 1500);

            } catch (error) {

                console.error(
                    'Impossible de copier le ticket :',
                    error
                );

            }

        }
    );

}

/* ============================================================
   TRANSFERT VERS LA PLATEFORME DE GESTION
============================================================ */

const FT_MANAGEMENT_PLATFORM_ENDPOINT =
    'http://localhost:3000/api/orders';

const FT_MANAGEMENT_ORDER_ID_ENDPOINT =
    'http://localhost:3000/api/orders/reserve-id';

/* ============================================================
   RÉSERVATION DE L'ID DE COMMANDE
============================================================ */

const reserveManagementOrderId = async () => {

    try {

        const response =
            await fetch(
                FT_MANAGEMENT_ORDER_ID_ENDPOINT,
                {
                    method:
                        'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    }
                }
            );


        let data =
            null;


        try {

            data =
                await response.json();

        } catch (error) {

            data =
                null;

        }


        if (
            !response.ok
        ) {

            throw new Error(
                data?.message ||
                `Erreur HTTP ${response.status}`
            );

        }


        if (
            !data?.orderId
        ) {

            throw new Error(
                'Le backend n’a pas retourné d’identifiant de commande.'
            );

        }


        console.log(
            '[FULLTECH] ID de commande réservé par le backend :',
            data.orderId
        );


        return data.orderId;

    } catch (error) {

        console.error(
            '[FULLTECH] Impossible de réserver l’identifiant de commande :',
            error
        );


        throw error;

    }

};


const transferOrderToManagementPlatform = async (
    order
) => {

    const payload =
        buildManagementOrderPayload(
            order
        );

    if (
        !FT_MANAGEMENT_PLATFORM_ENDPOINT
    ) {

        console.info(
            'Payload de commande prêt pour la plateforme de gestion :',
            payload
        );

        return {

            success:
                true,

            transferred:
                false,

            payload

        };
    }


    try {

        const response =
            await fetch(
                FT_MANAGEMENT_PLATFORM_ENDPOINT,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                `Erreur HTTP ${response.status}`
            );

        }


        let responseData =
            null;

        try {

            responseData =
                await response.json();

        } catch (error) {

            responseData =
                null;

        }


        return {

            success:
                true,

            transferred:
                true,

            payload,

            response:
                responseData

        };

    } catch (error) {

        console.error(
            'Erreur lors du transfert vers la plateforme de gestion :',
            error
        );


        return {

            success:
                false,

            transferred:
                false,

            payload,

            error

        };

    }

};

/* ============================================================
   ENREGISTREMENT TEMPORAIRE EN MÉMOIRE
============================================================ */

const registerPendingOrder = async (
    order
) => {

    try {

        /*
         * Conservation uniquement pendant
         * la session actuelle.
         */
        pendingOrders.push(
            order
        );


        /*
         * Préparation / transfert éventuel
         * vers la plateforme de gestion.
         */
        const transferResult =
            await transferOrderToManagementPlatform(
                order
            );


        return {

            success:
                transferResult.success,

            transferred:
                transferResult.transferred,

            payload:
                transferResult.payload

        };

    } catch (error) {

        console.error(
            'Erreur lors de l’enregistrement de la commande :',
            error
        );

        return {

            success: false,

            transferred: false,

            payload: null

        };

    }

};

/* ============================================================
   MES COMMANDES
============================================================ */

const escapeHTML = (value = '') => {

    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

};


const getStoredOrders = () => {

    return Array.isArray(
        pendingOrders
    )
        ? [...pendingOrders]
        : [];

};

/* ============================================================
   SUPPRESSION INDIVIDUELLE D'UNE COMMANDE
============================================================ */

const deleteOrder = (
    orderId
) => {

    if (!orderId) {
        return;
    }


    const confirmed =
        window.confirm(
            'Voulez-vous supprimer cette commande de votre suivi ?'
        );


    if (!confirmed) {
        return;
    }


    try {

        pendingOrders =
            pendingOrders.filter(
                order =>
                    order.orderId !== orderId
            );


        renderMyOrders();

    } catch (error) {

        console.error(
            'Impossible de supprimer la commande :',
            error
        );

    }

};

const getOrderStatusLabel = (order) => {

    const status =
        order?.payment?.status ||
        order?.status ||
        'PENDING_VERIFICATION';

    if (status === 'VALIDATED') {
        return 'COMMANDE VALIDÉE';
    }

    if (status === 'REJECTED') {
        return 'PAIEMENT REFUSÉ';
    }

    return 'EN ATTENTE DE VÉRIFICATION';

};


const renderMyOrders = () => {

    if (
        !myOrdersList ||
        !ordersCount
    ) {
        return;
    }

    const orders = getStoredOrders()
        .sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );

    ordersCount.textContent =
        orders.length;

    if (orders.length === 0) {

        myOrdersList.innerHTML = `
            <div class="text-center text-ft-white/50 py-12">

                <svg
                    class="w-12 h-12 mx-auto mb-4 opacity-40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="square"
                        stroke-linejoin="miter"
                        stroke-width="1.5"
                        d="M7 3h10v18H7zM9.5 7h5M9.5 11h5M9.5 15h3"
                    ></path>
                </svg>

                <p class="font-heading tracking-wider">
                    Aucune commande enregistrée.
                </p>

            </div>
        `;

        return;
    }


    myOrdersList.innerHTML =
        orders.map(order => {

            const status =
                getOrderStatusLabel(order);

            const createdAt =
                new Date(
                    order.createdAt
                ).toLocaleString(
                    'fr-FR',
                    {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                    }
                );

            const itemsHTML =
                Array.isArray(order.items)
                    ? order.items.map(item => `
                        <div class="flex justify-between gap-4 py-2 border-b border-ft-gray/50">

                            <div>
                                <div class="font-sans text-sm">
                                    ${escapeHTML(item.name)}
                                </div>

                                <div class="text-xs text-ft-white/40">
                                    Qté : ${escapeHTML(item.quantity)}
                                </div>
                            </div>

                            <div class="font-mono text-xs text-right">
                                ${formatUSD(
                                    Number(item.line_total_usd || 0)
                                )}
                            </div>

                        </div>
                    `).join('')
                    : '';


            return `
                <article class="bg-ft-black border border-ft-gray p-6">

                <div class="flex justify-between items-start gap-4 mb-5">

    <div>
        <div class="text-xs uppercase tracking-widest text-ft-white/40">
            Commande
        </div>

        <div class="font-mono text-sm text-ft-red mt-1">
            ${escapeHTML(order.orderId)}
        </div>
    </div>


    <div class="flex items-start gap-3">

        <span class="text-[10px] uppercase tracking-widest text-yellow-400 text-right">
            ${status}
        </span>


        <button
            type="button"
            class="delete-order-btn text-ft-white hover:text-ft-red transition-colors p-1"
            data-order-id="${escapeHTML(order.orderId)}"
            aria-label="Supprimer la commande ${escapeHTML(order.orderId)}"
            title="Supprimer cette commande"
        >
            <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    stroke-linecap="square"
                    stroke-linejoin="miter"
                    stroke-width="1.8"
                    d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
                ></path>
            </svg>
        </button>

    </div>

</div>


                    <div class="space-y-3">

                        <div class="flex justify-between gap-4">
                            <span class="text-xs text-ft-white/40 uppercase tracking-widest">
                                Date
                            </span>

                            <span class="text-xs font-mono text-right">
                                ${escapeHTML(createdAt)}
                            </span>
                        </div>


                        <div class="flex justify-between gap-4">
                            <span class="text-xs text-ft-white/40 uppercase tracking-widest">
                                Client
                            </span>

                            <span class="text-xs text-right">
                                ${escapeHTML(order.client?.name || '—')}
                            </span>
                        </div>


                        <div class="flex justify-between gap-4">
                            <span class="text-xs text-ft-white/40 uppercase tracking-widest">
                                Téléphone
                            </span>

                            <span class="text-xs font-mono text-right">
                                ${escapeHTML(order.client?.phone || '—')}
                            </span>
                        </div>


                        <div class="flex justify-between gap-4">
                            <span class="text-xs text-ft-white/40 uppercase tracking-widest">
                                Localisation
                            </span>

                            <span class="text-xs text-right">
                                ${escapeHTML(
                                    `${order.client?.commune || '—'} · ${order.client?.quartier || '—'}`
                                )}
                            </span>
                        </div>


                        <div class="flex justify-between gap-4">
                            <span class="text-xs text-ft-white/40 uppercase tracking-widest">
                                Montant
                            </span>

                            <span class="text-xs font-mono text-right">
                                ${formatUSD(
                                    Number(order.amount_usd || 0)
                                )}
                                <br>
                                <span class="text-ft-white/40">
                                    ${Number(order.amount_cdf || 0).toLocaleString('fr-FR')} CDF
                                </span>
                            </span>
                        </div>


                        <div class="flex justify-between gap-4">
                            <span class="text-xs text-ft-white/40 uppercase tracking-widest">
                                Canal
                            </span>

                            <span class="text-xs text-right">
                                M-Pesa
                            </span>
                        </div>


                        <div class="flex justify-between gap-4">
                            <span class="text-xs text-ft-white/40 uppercase tracking-widest">
                                Ticket
                            </span>

                            <span class="text-xs font-mono text-right break-all">
                                ${escapeHTML(
                                    order.payment?.ticket || '—'
                                )}
                            </span>
                        </div>


                        <div class="flex justify-between gap-4">
                            <span class="text-xs text-ft-white/40 uppercase tracking-widest">
                                Code unique
                            </span>

                            <span class="text-xs font-mono text-ft-red text-right break-all">
                                ${escapeHTML(
                                    order.uniqueCode || '—'
                                )}
                            </span>
                        </div>

                    </div>


                    <div class="mt-6 pt-5 border-t border-ft-gray">

                        <div class="text-xs uppercase tracking-widest text-ft-white/40 mb-3">
                            Articles
                        </div>

                        <div>
                            ${itemsHTML}
                        </div>

                    </div>


                    <div class="mt-5 border-l-2 border-yellow-400 bg-ft-dark p-4">

                        <p class="text-xs text-ft-white/60 leading-relaxed">
                            Votre demande a été enregistrée.
                            Elle reste en attente de vérification
                            par le gestionnaire.
                        </p>

                    </div>

                </article>
            `;

        }).join('');

        /* ============================================================
   ACTIONS DE SUPPRESSION
============================================================ */

myOrdersList
    .querySelectorAll('.delete-order-btn')
    .forEach(button => {

        button.addEventListener(
            'click',
            () => {

                const orderId =
                    button.getAttribute(
                        'data-order-id'
                    );

                deleteOrder(orderId);

            }
        );

    });

};


const openOrders = () => {

    if (
        !ordersPanel ||
        !ordersOverlay
    ) {
        return;
    }

    renderMyOrders();

    ordersOverlay.classList.remove(
        'hidden'
    );

    ordersPanel.classList.remove(
        'hidden'
    );

    ordersPanel.classList.add(
        'flex'
    );

    requestAnimationFrame(() => {

        ordersPanel.classList.remove(
            'translate-x-full'
        );

    });

    document.body.style.overflow =
        'hidden';

};


const closeOrders = () => {

    if (
        !ordersPanel ||
        !ordersOverlay
    ) {
        return;
    }

    ordersPanel.classList.add(
        'translate-x-full'
    );

    ordersPanel.classList.remove(
        'flex'
    );

    setTimeout(() => {

        ordersPanel.classList.add(
            'hidden'
        );

        ordersOverlay.classList.add(
            'hidden'
        );

    }, 300);

    document.body.style.overflow =
        'auto';

};


if (ordersBtn) {

    ordersBtn.addEventListener(
        'click',
        openOrders
    );

}


if (closeOrdersBtn) {

    closeOrdersBtn.addEventListener(
        'click',
        closeOrders
    );

}


if (ordersOverlay) {

    ordersOverlay.addEventListener(
        'click',
        closeOrders
    );

}

/* ============================================================
   CONFIRMATION DU PAIEMENT
============================================================ */

const paymentConfirmationForm =
    document.getElementById(
        'payment-confirmation-form'
    );


if (paymentConfirmationForm) {

    paymentConfirmationForm.addEventListener(
        'submit',
        async (event) => {

            event.preventDefault();


            if (!checkoutOrder) {
                return;
            }

const paymentChannel =
    document.getElementById(
        'co-payment-channel'
    ).value.trim();

const ticketStep4 =
    document.getElementById(
        'co-ticket-step4'
    );

const confirmationCode =
    document.getElementById(
        'co-confirmation-code'
    ).value.trim().toUpperCase();


if (
    !paymentChannel ||
    !ticketStep4 ||
    !ticketStep4.reportValidity() ||
    !confirmationCode
) {

    paymentConfirmationForm.reportValidity();

    return;
}


const enteredTicket =
    ticketStep4.value.trim();


const selectedTicket =
    checkoutOrder.payment.ticket;


/*
 * Le ticket saisi à l'étape 4 doit
 * correspondre exactement à celui
 * sélectionné à l'étape 3.
 */
if (
    !selectedTicket ||
    enteredTicket !== selectedTicket
) {

    ticketStep4.setCustomValidity(
        'Le numéro de ticket doit correspondre à celui sélectionné et copié à l’étape 3.'
    );

    ticketStep4.reportValidity();

    ticketStep4.setCustomValidity('');

    return;
}


            /*
             * Mise à jour des données de paiement
             */
          checkoutOrder.payment.channel =
            paymentChannel;

    checkoutOrder.payment.ticket =
    enteredTicket;

            checkoutOrder.payment.confirmedAt =
                new Date().toISOString();

            checkoutOrder.payment.status =
                'PENDING_VERIFICATION';


            /*
             * Enregistrement
             */
            const result =
                await registerPendingOrder(
                    checkoutOrder
                );


            if (!result.success) {

                alert(
                    'Impossible d’enregistrer la confirmation. Veuillez réessayer.'
                );

                return;
            }


            checkoutPaymentConfirmed =
                true;


            /*
             * Affichage succès
             */
  document.getElementById(
    'success-order-id'
).textContent =
    checkoutOrder.orderId;


document.getElementById(
    'success-order-ticket'
).textContent =
    checkoutOrder.payment.ticket;

            document.getElementById(
                'payment-confirmation-start'
            ).classList.add(
                'hidden'
            );


            document.getElementById(
                'payment-confirmation-form'
            ).classList.add(
                'hidden'
            );


            document.getElementById(
                'payment-confirmation-form'
            ).classList.remove(
                'flex'
            );


            document.getElementById(
                'payment-confirmation-success'
            ).classList.remove(
                'hidden'
            );


            /*
             * Le panier est vidé seulement après
             * l'enregistrement réussi de la demande.
             */
            cart = [];

            updateCartUI();

        }
    );

}



/* ============================================================
   RETOUR DEPUIS LE FORMULAIRE DE PAIEMENT
============================================================ */

const cancelPaymentConfirmationBtn =
    document.getElementById(
        'cancel-payment-confirmation-btn'
    );


if (cancelPaymentConfirmationBtn) {

    cancelPaymentConfirmationBtn.addEventListener(
        'click',
        () => {

            currentStep = 3;

            updateStepperUI();

        }
    );

}



/* ============================================================
   FERMETURE APRÈS ENREGISTREMENT
============================================================ */

const finishCheckoutBtn =
    document.getElementById(
        'finish-checkout-btn'
    );


if (finishCheckoutBtn) {

    finishCheckoutBtn.addEventListener(
        'click',
        () => {

            closeCheckout();

            renderMyOrders();

            openOrders();

        }
    );

}
   
    // Quick Search logic (just scrolls to catalog for demo)
    document.getElementById('btn-quick-search').addEventListener('click', () => {
        document.getElementById('catalog').scrollIntoView({behavior: 'smooth'});
        // In a real app, this would apply filters based on dropdowns.
    });

    /* ============================================================
   DISTRIBUTEURS — GOOGLE MAP INTERACTIVE
============================================================ */

const ftDistributorData = [
    {
        id: "limete",
        number: "01",
        commune: "Limete",
        type: "Point Relais",

        name: "Garage Pro-Moto Limete",

        address:
            "7eme rue limete Industriel, Avenue kasuku",

        landmark:
            "7eme rue limete Industriel",

        phone:
            "+243 81 234 5678",

        coverage:
            "Limete",

        /*
         * Coordonnées cartographiques indicatives.
         * Remplace-les par les coordonnées GPS exactes
         * du véritable point de vente.
         */
        position: {
            lat: -4.350554691594185,
            lng: 15.336598576879075
        }
    },

    {
        id: "kalamu",
        number: "02",
        commune: "Kalamu",
        type: "Livreur Wewa",

        name: "Papa LeBlanc (Kalamu)",

        address:
            "Zone de distribution Kalamu, Kasa-Vubu et Bandalungwa.",

        landmark:
            "Stationnement : Rond-point Victoire",

        phone:
            "+243 89 987 6543",

        coverage:
            "Kalamu · Kasa-Vubu · Bandalungwa",

        position: {
            lat: -4.3331394358291355, 
            lng: 15.280747136799926
        }
    },

    {
        id: "gombe",
        number: "03",
        commune: "Gombe",
        type: "Dépôt Central",

        name: "FullTech Gombe",

        address:
            "Quartier Socimat, Boulevard du 30 Juin.",

        landmark:
            "En face du supermarché",

        phone:
            "+243 82 000 1122",

        coverage:
            "Gombe",

        position: {
            lat: -4.3215062138074956, 
            lng: 15.276176146490073
        }
    }
];


let ftDistributorMap = null;
let ftDistributorMarkers = [];
let ftDistributorActiveMarker = null;

const ftDistributorMapCenter = {
    lat: -4.3275,
    lng: 15.3150
};


/* ============================================================
   INITIALISATION GOOGLE MAPS
============================================================ */

async function initFtDistributorMap() {

    const mapElement =
        document.getElementById("ft-distributors-map");

    if (!mapElement) {
        return;
    }

    try {

        const [
            { Map }
            ,
            { AdvancedMarkerElement }
        ] = await Promise.all([
            google.maps.importLibrary("maps"),
            google.maps.importLibrary("marker")
        ]);


        ftDistributorMap = new Map(mapElement, {

            center: ftDistributorMapCenter,

            zoom: 12,

            minZoom: 10,

            maxZoom: 17,

            mapId: "c7535d4652077645cfe9e067", 

            gestureHandling: "cooperative",

            clickableIcons: false,

            streetViewControl: false,

            mapTypeControl: false,

            fullscreenControl: false,

            zoomControl: true,

            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },

            styles: [

                {
                    elementType: "geometry",
                    stylers: [
                        { color: "#101010" }
                    ]
                },

                {
                    elementType: "labels.text.fill",
                    stylers: [
                        { color: "#8a8a8a" }
                    ]
                },

                {
                    elementType: "labels.text.stroke",
                    stylers: [
                        {
                            color: "#101010"
                        }
                    ]
                },

                {
                    featureType: "administrative",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#2d2d2d"
                        }
                    ]
                },

                {
                    featureType: "administrative.locality",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#d0d0d0"
                        }
                    ]
                },

                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#292929"
                        }
                    ]
                },

                {
                    featureType: "road",
                    elementType: "geometry.stroke",
                    stylers: [
                        {
                            color: "#181818"
                        }
                    ]
                },

                {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#3c3c3c"
                        }
                    ]
                },

                {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [
                        {
                            color: "#1d1d1d"
                        }
                    ]
                },

                {
                    featureType: "road",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#6f6f6f"
                        }
                    ]
                },

                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#050505"
                        }
                    ]
                },

                {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#3e3e3e"
                        }
                    ]
                },

                {
                    featureType: "poi",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#151515"
                        }
                    ]
                },

                {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#5c5c5c"
                        }
                    ]
                },

                {
                    featureType: "transit",
                    stylers: [
                        {
                            visibility: "off"
                        }
                    ]
                }

            ]

        });


        /*
         * Création des marqueurs
         */
        ftDistributorData.forEach(
            (distributor, index) => {

                const markerElement =
                    document.createElement("button");

                markerElement.type = "button";

                markerElement.className =
                    "ft-map-marker";

                markerElement.setAttribute(
                    "aria-label",
                    `${distributor.name}, ${distributor.commune}`
                );

                markerElement.innerHTML = `
                    <span class="ft-map-marker-core"></span>
                    <span class="ft-map-marker-number">
                        ${distributor.number}
                    </span>
                `;


                const marker =
                    new AdvancedMarkerElement({

                        map: ftDistributorMap,

                        position: distributor.position,

                        content: markerElement,

                        title:
                            `${distributor.name} — ${distributor.commune}`,

                        gmpClickable: true,

                        zIndex: 10 + index

                    });


                marker.addEventListener(
                    "gmp-click",
                    () => {

                        ftOpenDistributor(
                            distributor,
                            marker,
                            markerElement
                        );

                    }
                );


                ftDistributorMarkers.push({
                    marker,
                    element: markerElement,
                    distributor
                });

            }
        );


        /*
         * Compteur dynamique
         */
        const countElement =
            document.getElementById(
                "ft-distributor-count"
            );

        if (countElement) {

            countElement.textContent =
                String(ftDistributorData.length)
                    .padStart(2, "0");

        }

        /*
         * Bouton recentrage
         */
        const resetButton =
            document.getElementById(
                "ft-map-reset"
            );

        if (resetButton) {

            resetButton.addEventListener(
                "click",
                () => {

                    ftDistributorMap.panTo(
                        ftDistributorMapCenter
                    );

                    ftDistributorMap.setZoom(12);

                }
            );

        }


        /*
         * Fermeture du popup
         */
        const closeButton =
            document.getElementById(
                "ft-distributor-popup-close"
            );

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                ftCloseDistributor
            );

        }


    } catch (error) {

        console.error(
            "Erreur d'initialisation de la carte des distributeurs :",
            error
        );

        mapElement.innerHTML = `
            <div style="
                height:100%;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:30px;
                text-align:center;
                background:#070707;
                color:rgba(244,244,245,.48);
                font-size:14px;
                line-height:1.6;
            ">
                Impossible de charger la carte interactive.
            </div>
        `;

    }

}

function ftOpenDistributor(
    distributor,
    marker,
    markerElement,
    centerMap = true
) {

    /*
     * Réinitialisation de tous les marqueurs
     */
    ftDistributorMarkers.forEach(item => {

        item.element.classList.remove(
            "ft-marker-selected"
        );

    });


    /*
     * Active le marqueur sélectionné
     */
    markerElement.classList.add(
        "ft-marker-selected"
    );

    ftDistributorActiveMarker = marker;


    /*
     * Déplacement caméra
     */
    if (
        centerMap &&
        ftDistributorMap
    ) {

        ftDistributorMap.panTo(
            distributor.position
        );

        /*
         * Sur mobile on évite un zoom excessif.
         */
        if (
            window.innerWidth <= 640
        ) {

            ftDistributorMap.setZoom(14);

        } else {

            ftDistributorMap.setZoom(13.8);

        }

    }


    /*
     * Récupération du popup
     */
    const popup =
        document.getElementById(
            "ft-distributor-popup"
        );

    if (!popup) {
        return;
    }


    /*
     * Remplissage
     */

    const type =
        document.getElementById(
            "ft-popup-type"
        );

    const commune =
        document.getElementById(
            "ft-popup-commune"
        );

    const name =
        document.getElementById(
            "ft-popup-name"
        );

    const address =
        document.getElementById(
            "ft-popup-address"
        );

    const landmark =
        document.getElementById(
            "ft-popup-landmark"
        );

    const phone =
        document.getElementById(
            "ft-popup-phone"
        );

    const coverage =
        document.getElementById(
            "ft-popup-coverage"
        );

    const index =
        document.getElementById(
            "ft-popup-index"
        );

    const directions =
        document.getElementById(
            "ft-popup-directions"
        );


    if (type) {
        type.textContent =
            distributor.type.toUpperCase();
    }

    if (commune) {
        commune.textContent =
            distributor.commune.toUpperCase();
    }

    if (name) {
        name.textContent =
            distributor.name;
    }

    if (address) {
        address.textContent =
            distributor.address;
    }

    if (landmark) {
        landmark.textContent =
            distributor.landmark;
    }

    if (phone) {

        phone.textContent =
            distributor.phone;

        phone.href =
            `tel:${distributor.phone
                .replace(/[^\d+]/g, "")}`;

    }

    if (coverage) {

        coverage.textContent =
            distributor.coverage;

    }

    if (index) {

        index.textContent =
            distributor.number;

    }

    if (directions) {

        directions.href =
            `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                `${distributor.position.lat},${distributor.position.lng}`
            )}`;

    }

    popup.classList.add(
        "is-open"
    );

    popup.setAttribute(
        "aria-hidden",
        "false"
    );

}

function ftCloseDistributor() {

    const popup =
        document.getElementById(
            "ft-distributor-popup"
        );

    if (!popup) {
        return;
    }

    popup.classList.remove(
        "is-open"
    );

    popup.setAttribute(
        "aria-hidden",
        "true"
    );


    ftDistributorMarkers.forEach(item => {

        item.element.classList.remove(
            "ft-marker-selected"
        );

    });

    ftDistributorActiveMarker = null;

}

    // Init
    renderCatalog();
    updateCartUI();
