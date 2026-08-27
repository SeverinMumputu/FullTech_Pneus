
        // --- 1. CONFIGURATION & DONNÉES MOCK ---
        const RATE_USD_CDF = 2850; // Taux de change fictif
        
        // Configuration du Carousel (Images et Vidéos)
        const carouselData = [
            {
                type: 'image',
                src: 'Carrousel_1.jpg',
                alt: 'Moto sur asphalte'
            },
              {
                type: 'image',
                src: 'Carroussel_4.jpg',
                alt: 'Moto sur asphalte'
            },
              {
                type: 'image',
                src: 'Carrousel_3.jpg',
                alt: 'Moto sur asphalte'
            },
            {
                type: 'video',
                src: 'video.mp4',
                poster: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=2070'
            },
            {
                type: 'image',
                src: 'FullTech.jpeg',
                alt: 'Motard en ville'
            }
        ];

        // Base de données des pneus FullTech
        const productsDB = [
            {
                id: 'p01',
                name: 'FT-URBAN GRIP',
                ref: 'FT-UG-27517',
                category: 'taxi',
                position: 'arriere',
                width: '2.75',
                profile: '-',
                diameter: '17',
                type: 'Tube Type',
                usage: 'ville',
                loadSpeedIndex: '47P',
                structure: 'Renforcée (6 PR)',
                priceUSD: 22.00,
                stock: 45,
                image: 'pneu_1-removebg-preview.png',
                desc: 'Spécialement conçu pour les motos-taxis (Wewa). Résistance accrue aux crevaisons et excellente longévité sur asphalte dégradé.'
            },
            {
                id: 'p02',
                name: 'FT-PRO RIDER',
                ref: 'FT-PR-909018',
                category: 'route',
                position: 'avant',
                width: '90',
                profile: '90',
                diameter: '18',
                type: 'Tubeless',
                usage: 'route',
                loadSpeedIndex: '51S',
                structure: 'Standard',
                priceUSD: 35.50,
                stock: 20,
                image:  'PNEU_2.png',
                desc: 'Adhérence maximale sur route sèche et mouillée. Profil directionnel pour une maniabilité optimale.'
            },
            {
                id: 'p03',
                name: 'FT-DIRT CROSS',
                ref: 'FT-DX-41018',
                category: 'tout-terrain',
                position: 'arriere',
                width: '4.10',
                profile: '-',
                diameter: '18',
                type: 'Tube Type',
                usage: 'piste',
                loadSpeedIndex: '59M',
                structure: 'Crampons (8 PR)',
                priceUSD: 42.00,
                stock: 15,
                image:  'pneu_1-removebg-preview.png',
                desc: 'Le pneu ultime pour les routes en terre de RDC. Crampons agressifs pour une traction exceptionnelle dans la boue.'
            },
            {
                id: 'p04',
                name: 'FT-CITY FRONT',
                ref: 'FT-CF-25017',
                category: 'avant',
                position: 'avant',
                width: '2.50',
                profile: '-',
                diameter: '17',
                type: 'Tube Type',
                usage: 'ville',
                loadSpeedIndex: '38P',
                structure: 'Standard (4 PR)',
                priceUSD: 18.00,
                stock: 60,
                image: 'Pneu_3-removebg-preview.png',
                desc: 'Pneu avant idéal pour la circulation urbaine dense. Très bonne évacuation de l\'eau.'
            },
            {
                id: 'p05',
                name: 'FT-HEAVY DUTY',
                ref: 'FT-HD-1109016',
                category: 'taxi',
                position: 'arriere',
                width: '110',
                profile: '90',
                diameter: '16',
                type: 'Tubeless',
                usage: 'ville',
                loadSpeedIndex: '59P',
                structure: 'Renforcée',
                priceUSD: 38.00,
                stock: 30,
                image: 'Pneu_4-removebg-preview.png',
                desc: 'Pour supporter de lourdes charges. Profil large assurant stabilité et sécurité lors du transport de colis ou de multiples passagers.'
            },
            {
                id: 'p06',
                name: 'TUBE FT-17',
                ref: 'FT-TUB-17',
                category: 'chambre',
                position: 'toutes',
                width: '2.75/3.00',
                profile: '-',
                diameter: '17',
                type: 'Chambre à air',
                usage: 'tous',
                loadSpeedIndex: '-',
                structure: 'Caoutchouc naturel épais',
                priceUSD: 5.50,
                stock: 150,
                image: 'Pneu_4-removebg-preview.png',
                desc: 'Chambre à air premium, épaisseur renforcée pour limiter les crevaisons.'
            }
        ];

        // État de l'application
        let cart = [];
        let currentDeliveryFee = 0;
        let checkoutOrderData = {};

        // --- 2. UTILITAIRES ---
        const formatUSD = (price) => `$${price.toFixed(2)}`;
        const formatCDF = (priceUSD) => new Intl.NumberFormat('fr-FR').format(Math.round(priceUSD * RATE_USD_CDF)) + ' CDF';

        function showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            const bgColor = type === 'success' ? 'bg-green-600' : (type === 'error' ? 'bg-red-600' : 'bg-gray-800');
            toast.className = `${bgColor} text-white px-6 py-3 rounded-sm shadow-lg font-oswald tracking-wide animate-slide-in-right flex items-center`;
            toast.innerHTML = `
                ${type === 'success' ? '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
                ${message}
            `;
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // --- 3. INITIALISATION & UI HEADER/HERO ---
        
        // Mobile Menu
        const mobileMenu = document.getElementById('mobile-menu');
        function toggleMobileMenu() {
            mobileMenu.classList.toggle('hidden');
        }
        document.getElementById('btn-mobile-menu').addEventListener('click', toggleMobileMenu);

        // Search Bar Toggle
        const searchBar = document.getElementById('search-bar-container');
        function toggleSearchBar() {
            if(searchBar.classList.contains('hidden')) {
                searchBar.classList.remove('hidden');
                setTimeout(() => searchBar.classList.remove('opacity-0'), 10);
                document.getElementById('global-search-input').focus();
            } else {
                closeSearchBar();
            }
        }
        function closeSearchBar() {
            searchBar.classList.add('opacity-0');
            setTimeout(() => searchBar.classList.add('hidden'), 300);
        }
        document.getElementById('btn-search-toggle').addEventListener('click', toggleSearchBar);

        // Hero Carousel Logic
        let currentSlide = 0;
        let carouselInterval;

    function initCarousel() {
    const container = document.getElementById('hero-carousel');
    const indicatorsContainer = document.getElementById('carousel-indicators');

    container.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    carouselData.forEach((item, index) => {
        // Créer le slide
        const slide = document.createElement('div');
        slide.className = `carousel-slide absolute inset-0 ${index === 0 ? 'opacity-100' : 'opacity-0'}`;
        slide.id = `slide-${index}`;

        let mediaContent = '';

        if (item.type === 'video') {
            // Vidéo : adaptée au format mobile et PC
            mediaContent = `
                <video
                    src="${item.src}"
                    poster="${item.poster || ''}"
                    autoplay
                    muted
                    loop
                    playsinline
                    class="carousel-media"
                ></video>
            `;
        } else {
            // Image : adaptée au format mobile et PC
            mediaContent = `
                <img
                    src="${item.src}"
                    alt="${item.alt || ''}"
                    class="carousel-media"
                />
            `;
        }

        slide.innerHTML = `
            <div class="absolute inset-0 bg-black/60 z-10 pointer-events-none"></div>
            ${mediaContent}
        `;

        container.appendChild(slide);

        // Créer l'indicateur
        const indicator = document.createElement('button');
        indicator.className = `w-12 h-1 transition-all ${index === 0 ? 'bg-ft-red' : 'bg-gray-600 hover:bg-gray-400'}`;
        indicator.id = `ind-${index}`;
        indicator.onclick = () => goToSlide(index);

        indicatorsContainer.appendChild(indicator);
    });

    startCarousel();
}

        function switchSlide() {
            const nextSlide = (currentSlide + 1) % carouselData.length;
            goToSlide(nextSlide);
        }

        function goToSlide(index) {
            // Cacher le slide actuel
            document.getElementById(`slide-${currentSlide}`).classList.remove('opacity-100');
            document.getElementById(`slide-${currentSlide}`).classList.add('opacity-0');
            document.getElementById(`ind-${currentSlide}`).classList.replace('bg-ft-red', 'bg-gray-600');
            
            // Afficher le nouveau slide
            currentSlide = index;
            document.getElementById(`slide-${currentSlide}`).classList.remove('opacity-0');
            document.getElementById(`slide-${currentSlide}`).classList.add('opacity-100');
            document.getElementById(`ind-${currentSlide}`).classList.replace('bg-gray-600', 'bg-ft-red');

            // Relancer le timer
            startCarousel();
        }

        function startCarousel() {
            clearInterval(carouselInterval);
            carouselInterval = setInterval(switchSlide, 6000);
        }

        // --- 4. CATALOGUE & RECHERCHE ---
        
        function populateSearchSelects() {
            const widths = [...new Set(productsDB.map(p => p.width))];
            const heights = [...new Set(productsDB.map(p => p.profile).filter(h => h !== '-'))];
            const diameters = [...new Set(productsDB.map(p => p.diameter))];

            const fillSelect = (id, options) => {
                const select = document.getElementById(id);
                options.sort().forEach(opt => {
                    select.insertAdjacentHTML('beforeend', `<option value="${opt}">${opt}</option>`);
                });
            };
            fillSelect('search-width', widths);
            fillSelect('search-height', heights);
            fillSelect('search-diameter', diameters);
        }

        function getProductImage(product) {
    // Si une vraie image existe, elle est prioritaire
    if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
        return `
            <img
                src="${product.image}"
                alt="${product.name || 'Produit FullTech Congo'}"
                class="w-full h-full object-contain drop-shadow-2xl"
                loading="lazy"
            >
        `;
    }

    // Si aucune image n'est disponible, utiliser le SVG de secours
    if (product.imageSvg) {
        return product.imageSvg;
    }

    // Aucun visuel disponible
    return `
        <div class="w-full h-full flex items-center justify-center text-gray-600 text-xs font-oswald uppercase text-center">
            Image indisponible
        </div>
    `;
}

        function createProductCard(product) {
            return `
                <div class="product-card bg-ft-lightgray border border-ft-gray hover:border-ft-red transition-all duration-300 flex flex-col relative group overflow-hidden">
                    <!-- Top Info -->
                    <div class="p-4 z-10 relative">
                        <h3 class="font-oswald text-xl text-white uppercase leading-tight">${product.name}</h3>
                        <p class="text-xs text-gray-500 font-mono mt-1">${product.ref}</p>
                    </div>
                    
                    <!-- Image -->
                    <div class="w-32 h-32 product-image">
                        ${getProductImage(product)}
                    </div>
                        <!-- Hover Overlay action -->
                        <div class="absolute inset-0 bg-ft-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-[2px]">
                            <button onclick="openProductDetail('${product.id}')" class="bg-ft-red text-white px-6 py-2 font-oswald uppercase tracking-wider text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                Détail &rarr;
                            </button>
                        </div>
                    </div>

                    <!-- Bottom Info -->
                    <div class="p-4 mt-auto border-t border-ft-gray bg-ft-black z-10 relative flex justify-between items-end">
                        <div>
                            <span class="text-ft-red font-bold font-oswald text-xl">${product.width}${product.profile !== '-' ? '/'+product.profile : ''}-${product.diameter}</span>
                        </div>
                        <div class="text-right">
                            <div class="text-white font-oswald text-lg">${formatUSD(product.priceUSD)}</div>
                            <div class="text-xs text-gray-500">${formatCDF(product.priceUSD)}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderCatalog(filter = 'all') {
            const grid = document.getElementById('catalog-grid');
            grid.innerHTML = '';
            
            let filtered = productsDB;
            if (filter !== 'all') {
                filtered = productsDB.filter(p => p.category === filter || p.position === filter);
            }

            if(filtered.length === 0) {
                grid.innerHTML = `<div class="col-span-full text-center text-gray-500 font-oswald text-xl py-10">Aucun produit trouvé dans cette catégorie.</div>`;
                return;
            }

            filtered.forEach(p => {
                grid.insertAdjacentHTML('beforeend', createProductCard(p));
            });
        }

        // Event listeners pour les filtres
        document.querySelectorAll('.cat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.cat-btn').forEach(b => {
                    b.classList.remove('bg-ft-red', 'text-white', 'border-ft-red');
                    b.classList.add('bg-ft-gray', 'text-gray-400', 'border-transparent');
                });
                e.target.classList.remove('bg-ft-gray', 'text-gray-400', 'border-transparent');
                e.target.classList.add('bg-ft-red', 'text-white', 'border-ft-red');
                renderCatalog(e.target.dataset.filter);
            });
        });

        // Logique Formulaire de recherche
        document.getElementById('quick-search-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const w = document.getElementById('search-width').value;
            const h = document.getElementById('search-height').value;
            const d = document.getElementById('search-diameter').value;
            const u = document.getElementById('search-usage').value;

            const results = productsDB.filter(p => {
                return (!w || p.width === w) &&
                       (!h || p.profile === h) &&
                       (!d || p.diameter === d) &&
                       (!u || p.usage === u);
            });

            const resContainer = document.getElementById('search-results-container');
            const resGrid = document.getElementById('search-results-grid');
            resContainer.classList.remove('hidden');
            resGrid.innerHTML = '';

            if(results.length > 0) {
                results.forEach(p => resGrid.insertAdjacentHTML('beforeend', createProductCard(p)));
            } else {
                resGrid.innerHTML = `<div class="col-span-full text-gray-400 py-4 font-inter">Aucun pneu ne correspond à ces critères. Ajustez votre recherche.</div>`;
            }
        });

        // --- 5. FICHE PRODUIT DETAIL ---
        
        const productModal = document.getElementById('product-modal');
        const modalContent = document.getElementById('product-modal-content');

        function openProductDetail(id) {
            const product = productsDB.find(p => p.id === id);
            if(!product) return;

            modalContent.innerHTML = `
                <!-- Left : Image -->
                <div class="bg-ft-lightgray p-10 flex items-center justify-center relative">
                     <!-- Texture bg -->
                    <div class="absolute inset-0 bg-pattern opacity-10 pointer-events-none"></div>
                    <div class="w-64 h-64 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-10">
                        ${getProductImage(product)}
                    </div>
                </div>
                <!-- Right : Details -->
                <div class="p-8 md:p-10 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-start mb-2">
                            <h2 class="font-oswald text-4xl text-white uppercase">${product.name}</h2>
                            <span class="bg-ft-red text-white text-xs font-bold px-2 py-1 uppercase rounded-sm">${product.stock > 0 ? 'En Stock' : 'Rupture'}</span>
                        </div>
                        <p class="text-gray-500 font-mono text-sm mb-6 pb-4 border-b border-ft-gray">REF: ${product.ref}</p>
                        
                        <p class="text-gray-300 text-sm leading-relaxed mb-6">${product.desc}</p>
                        
                        <div class="grid grid-cols-2 gap-y-3 text-sm mb-8">
                            <div class="text-gray-500">Marque: <span class="text-white">FULLTECH CONGO</span></div>
                            <div class="text-gray-500">Position: <span class="text-white capitalize">${product.position}</span></div>
                            <div class="text-gray-500">Dimension: <span class="text-ft-red font-bold">${product.width}${product.profile !== '-' ? '/'+product.profile : ''}-${product.diameter}</span></div>
                            <div class="text-gray-500">Type: <span class="text-white">${product.type}</span></div>
                            <div class="text-gray-500">Indice: <span class="text-white">${product.loadSpeedIndex}</span></div>
                            <div class="text-gray-500">Structure: <span class="text-white">${product.structure}</span></div>
                        </div>
                    </div>

                    <div class="mt-auto">
                        <div class="flex justify-between items-end mb-6">
                            <div>
                                <div class="text-gray-500 text-sm">Prix unitaire</div>
                                <div class="font-oswald text-4xl text-white">${formatUSD(product.priceUSD)}</div>
                                <div class="text-gray-400 text-sm">${formatCDF(product.priceUSD)}</div>
                            </div>
                        </div>
                        
                        <button onclick="addToCart('${product.id}')" class="w-full bg-ft-red hover:bg-ft-redhover text-white py-4 font-oswald text-xl uppercase tracking-wider transition-colors flex justify-center items-center">
                            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            Ajouter au panier
                        </button>
                    </div>
                </div>
            `;
            productModal.classList.remove('hidden');
        }

        function closeProductModal() {
            productModal.classList.add('hidden');
        }

        // --- 6. GESTION DU PANIER ---
        
        const cartSidebar = document.getElementById('cart-sidebar');
        function toggleCart() {
            if(cartSidebar.classList.contains('translate-x-full')) {
                cartSidebar.classList.remove('translate-x-full');
            } else {
                cartSidebar.classList.add('translate-x-full');
            }
        }
        document.getElementById('btn-cart-toggle').addEventListener('click', toggleCart);

        function updateCartUI() {
            const container = document.getElementById('cart-items-container');
            const badge = document.getElementById('cart-count-badge');
            let subtotalUSD = 0;
            let count = 0;

            if(cart.length === 0) {
                container.innerHTML = `<div class="text-gray-500 text-center mt-10 font-oswald text-lg">Votre panier est vide.</div>`;
                document.getElementById('btn-checkout').disabled = true;
            } else {
                container.innerHTML = '';
                cart.forEach((item, index) => {
                    const itemTotal = item.product.priceUSD * item.quantity;
                    subtotalUSD += itemTotal;
                    count += item.quantity;

                    container.insertAdjacentHTML('beforeend', `
                        <div class="flex items-center gap-4 border-b border-ft-gray py-4">
                            <div class="w-16 h-16 bg-ft-black border border-ft-gray flex items-center justify-center p-1">
                                ${getProductImage(item.product)}
                            </div>
                            <div class="flex-1">
                                <div class="font-oswald text-white leading-tight">${item.product.name}</div>
                                <div class="text-xs text-gray-500 mb-2">${item.product.width}-${item.product.diameter}</div>
                                <div class="flex items-center space-x-3">
                                    <button onclick="updateQty(${index}, -1)" class="w-6 h-6 bg-ft-gray text-white flex items-center justify-center hover:bg-ft-red">-</button>
                                    <span class="text-white text-sm font-bold">${item.quantity}</span>
                                    <button onclick="updateQty(${index}, 1)" class="w-6 h-6 bg-ft-gray text-white flex items-center justify-center hover:bg-ft-red">+</button>
                                </div>
                            </div>
                            <div class="text-right flex flex-col justify-between h-full">
                                <button onclick="removeFromCart(${index})" class="text-gray-600 hover:text-ft-red self-end">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                                <div class="font-oswald text-ft-red mt-2">${formatUSD(itemTotal)}</div>
                            </div>
                        </div>
                    `);
                });
                document.getElementById('btn-checkout').disabled = false;
            }

            badge.textContent = count;
            document.getElementById('cart-subtotal').textContent = formatUSD(subtotalUSD);
            document.getElementById('cart-total-usd').textContent = formatUSD(subtotalUSD);
            document.getElementById('cart-total-cdf').textContent = '~ ' + formatUSD(subtotalUSD).replace('$','') * RATE_USD_CDF + ' CDF';
            
            // Si le checkout est ouvert, on met à jour aussi la vue du step 1
            if(!document.getElementById('checkout-modal').classList.contains('hidden')) {
                renderCheckoutCart();
            }
        }

        function addToCart(productId) {
            const product = productsDB.find(p => p.id === productId);
            if(!product) return;

            const existingIndex = cart.findIndex(item => item.product.id === productId);
            if(existingIndex >= 0) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({ product, quantity: 1 });
            }
            
            updateCartUI();
            closeProductModal();
            
            // Ouvrir le panier pour feedback
            if(cartSidebar.classList.contains('translate-x-full')) {
                toggleCart();
            }
            showToast(`${product.name} ajouté au panier`);
        }

        function updateQty(index, delta) {
            cart[index].quantity += delta;
            if(cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            updateCartUI();
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCartUI();
        }

        // --- 7. CHECKOUT (STEPPER) ---
        
        const checkoutModal = document.getElementById('checkout-modal');
        let currentCheckoutStep = 1;

        function openCheckout() {
            if(cart.length === 0) return;
            toggleCart(); // Fermer sidebar
            checkoutModal.classList.remove('hidden');
            renderCheckoutCart();
            showStep(1);
        }

        function closeCheckout() {
            checkoutModal.classList.add('hidden');
            // reset stepper visuel (pas les données)
        }

        function getCartTotal() {
            return cart.reduce((sum, item) => sum + (item.product.priceUSD * item.quantity), 0);
        }

        function renderCheckoutCart() {
            const container = document.getElementById('checkout-cart-summary');
            container.innerHTML = '';
            cart.forEach((item, idx) => {
                container.insertAdjacentHTML('beforeend', `
                    <div class="flex justify-between items-center bg-ft-black p-3 border border-ft-gray">
                        <div class="flex items-center gap-4">
                            <span class="text-ft-red font-bold px-2 py-1 bg-ft-dark border border-ft-red text-sm">${item.quantity}x</span>
                            <div>
                                <div class="text-white font-oswald tracking-wide">${item.product.name}</div>
                                <div class="text-gray-500 text-xs">${item.product.width}-${item.product.diameter}</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-6">
                            <div class="text-right">
                                <div class="text-white font-oswald">${formatUSD(item.product.priceUSD * item.quantity)}</div>
                            </div>
                            <button onclick="removeFromCart(${idx})" class="text-gray-500 hover:text-ft-red">✕</button>
                        </div>
                    </div>
                `);
            });
            document.getElementById('checkout-total').textContent = formatUSD(getCartTotal());
            if(cart.length === 0) closeCheckout();
        }

        function updateDeliveryFee() {
            const val = document.querySelector('input[name="delivery"]:checked').value;
            currentDeliveryFee = (val === 'domicile') ? 5.00 : 0.00;
            const finalTotal = getCartTotal() + currentDeliveryFee;
            document.getElementById('checkout-total-with-delivery').textContent = formatUSD(finalTotal);
            
            // Update step 4 text
            document.getElementById('final-pay-amount').textContent = formatUSD(finalTotal);
        }

        function showStep(step) {
            // Hide all
            for(let i=1; i<=5; i++) {
                document.getElementById(`step-${i}`).classList.add('hidden');
                const ind = document.getElementById(`indicator-${i}`);
                if(i < step) {
                    ind.className = "step-indicator completed w-10 h-10 rounded-full flex items-center justify-center font-oswald text-sm z-10";
                    ind.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
                } else if (i === step) {
                    ind.className = "step-indicator active w-10 h-10 rounded-full border-2 bg-ft-dark flex items-center justify-center font-oswald text-sm z-10";
                    ind.innerHTML = i;
                } else {
                    ind.className = "step-indicator w-10 h-10 rounded-full border-2 border-ft-gray text-gray-500 bg-ft-dark flex items-center justify-center font-oswald text-sm z-10";
                    ind.innerHTML = i;
                }
            }
            // Show target
            document.getElementById(`step-${step}`).classList.remove('hidden');
            currentCheckoutStep = step;
            
            if(step === 3) updateDeliveryFee();
        }

        function nextStep(step) {
            showStep(step);
        }
        function prevStep(step) {
            showStep(step);
        }

        function validateStep2() {
            const name = document.getElementById('c_name').value;
            const phone = document.getElementById('c_phone').value;
            const commune = document.getElementById('c_commune').value;
            const address = document.getElementById('c_address').value;

            if(!name || !phone || !commune || !address) {
                showToast("Veuillez remplir tous les champs obligatoires (*)", "error");
                return;
            }
            
            checkoutOrderData.client = { name, phone, commune, address };
            nextStep(3);
        }

        // Toggle phone input visibility based on payment method
        document.querySelectorAll('input[name="payment"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const instructions = document.getElementById('mobile-money-instructions');
                const phoneInput = document.getElementById('pay_phone');
                if(e.target.value === 'cash') {
                    instructions.classList.add('hidden');
                    document.getElementById('pay-btn-text').innerHTML = `Confirmer la commande <span id="final-pay-amount">${formatUSD(getCartTotal() + currentDeliveryFee)}</span>`;
                } else {
                    instructions.classList.remove('hidden');
                    // Pre-fill phone if possible
                    if(!phoneInput.value && checkoutOrderData.client) phoneInput.value = checkoutOrderData.client.phone;
                    document.getElementById('pay-btn-text').innerHTML = `Payer via ${e.target.value.toUpperCase()} <span id="final-pay-amount">${formatUSD(getCartTotal() + currentDeliveryFee)}</span>`;
                }
            });
        });

        function processPayment() {
            const method = document.querySelector('input[name="payment"]:checked').value;
            if(method !== 'cash') {
                const phone = document.getElementById('pay_phone').value;
                if(!phone) {
                    showToast("Numéro de téléphone requis pour le paiement Mobile Money", "error");
                    return;
                }
            }

            // Simulate API Call
            const btn = document.getElementById('btn-process-pay');
            const loader = document.getElementById('pay-loader');
            const text = document.getElementById('pay-btn-text');
            
            btn.disabled = true;
            loader.classList.remove('hidden');
            
            setTimeout(() => {
                // Success Simulation
                generateInvoice(method);
                cart = []; // Empty cart
                updateCartUI();
                showStep(5);
                btn.disabled = false;
                loader.classList.add('hidden');
            }, 2000);
        }

        function generateInvoice(method) {
            const date = new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR');
            document.getElementById('inv-date').textContent = date;
            document.getElementById('inv-client').textContent = checkoutOrderData.client.name + ' (' + checkoutOrderData.client.phone + ') - ' + checkoutOrderData.client.commune;
            
            let methodText = "Paiement à la livraison";
            if(method === 'mpesa') methodText = "M-PESA";
            if(method === 'airtel') methodText = "Airtel Money";
            if(method === 'orange') methodText = "Orange Money";
            document.getElementById('inv-method').textContent = methodText;

            const itemsContainer = document.getElementById('inv-items');
            itemsContainer.innerHTML = '';
            let total = 0;
            
            cart.forEach(item => {
                const lineTotal = item.quantity * item.product.priceUSD;
                total += lineTotal;
                itemsContainer.insertAdjacentHTML('beforeend', `
                    <div class="flex justify-between">
                        <span>${item.quantity}x ${item.product.name}</span>
                        <span>${formatUSD(lineTotal)}</span>
                    </div>
                `);
            });

            if(currentDeliveryFee > 0) {
                 itemsContainer.insertAdjacentHTML('beforeend', `
                    <div class="flex justify-between border-t border-gray-800 mt-2 pt-2 text-gray-400">
                        <span>Frais de livraison</span>
                        <span>${formatUSD(currentDeliveryFee)}</span>
                    </div>
                `);
                total += currentDeliveryFee;
            }

            document.getElementById('inv-total').textContent = formatUSD(total);
        }

        function finishOrder() {
            closeCheckout();
            window.scrollTo(0,0);
        }

        // --- INIT CALLS ---
        initCarousel();
        populateSearchSelects();
        renderCatalog();
        updateCartUI();