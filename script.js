 // --- DONNÉES SIMULÉES ---
        const productsDB = [
            { id: 1, brand: 'Michelin', name: 'Primacy 4', size: '205/55 R16', type: 'Été', vehicle: 'Auto', price: 85.90, image: 'pneu_1.jpg', rating: 4.8 },
            { id: 2, brand: 'Continental', name: 'PremiumContact 6', size: '225/45 R17', type: 'Été', vehicle: 'Auto', price: 92.50, image: 'pneu_1.jpg', rating: 4.6 },
            { id: 3, brand: 'Pirelli', name: 'Scorpion Verde', size: '235/60 R18', type: '4 Saisons', vehicle: '4x4', price: 145.00, image: 'pneu_1.jpg', rating: 4.5 },
            { id: 4, brand: 'Goodyear', name: 'EfficientGrip', size: '195/65 R15', type: 'Été', vehicle: 'Auto', price: 65.20, image: 'PNEU_2.png', rating: 4.3 },
            { id: 5, brand: 'Bridgestone', name: 'Turanza T005', size: '215/55 R17', type: 'Été', vehicle: 'Auto', price: 105.00, image: 'PNEU_2.png', rating: 4.7 },
            { id: 6, brand: 'Michelin', name: 'CrossClimate 2', size: '225/50 R17', type: '4 Saisons', vehicle: 'Auto', price: 130.00, image: 'PNEU_2.png', rating: 4.9 },
            { id: 7, brand: 'Continental', name: 'CrossContact LX', size: '265/70 R16', type: '4 Saisons', vehicle: '4x4', price: 160.00, image: 'PNEU_2.png', rating: 4.4 },
            { id: 8, brand: 'Pirelli', name: 'Cinturato P7', size: '205/60 R16', type: 'Été', vehicle: 'Auto', price: 88.00, image: 'pneu_1.jpg', rating: 4.6 },
            { id: 9, brand: 'Goodyear', name: 'UltraGrip 9', size: '185/65 R15', type: 'Hiver', vehicle: 'Auto', price: 72.00, image: 'pneu_1.jpg', rating: 4.5 }
        ];

        const sellersDB = [
            { name: 'Congo Auto Parts', stock: 'En stock', delivery: '24-48h', priceAdj: 0 },
            { name: 'Kinshasa Pneus Moteur', stock: 'Dernières pièces', delivery: 'Immédiate', priceAdj: 5 },
            { name: 'Garage Express', stock: 'En stock', delivery: '3 jours', priceAdj: -2 }
        ];

        // --- ÉTAT DE L'APPLICATION ---
        let appState = {
            currentView: 'home',
            cart: [],
            checkoutStep: 1,
            selectedProduct: null,
            currentPage: 1,
            itemsPerPage: 3,
            filteredProducts: []
        };

        function initApp() {
            renderProductGrid('popular-tires-grid', productsDB.slice(0, 4));
            appState.filteredProducts = [...productsDB];
            renderPaginatedResults();
            updateCartUI();
        }

        function createProductCard(product) {
            return `
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition cursor-pointer flex flex-col h-full" onclick="showProductDetails(${product.id})">
                    <div class="p-6 bg-slate-50 flex justify-center items-center h-48 relative">
                        <span class="absolute top-3 left-3 bg-white px-2 py-1 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">${product.brand}</span>
                        <img src="${product.image}" alt="${product.name}" class="max-h-full object-contain drop-shadow-md">
                    </div>
                    <div class="p-5 flex flex-col flex-grow">
                        <div class="text-xs text-ftc-green font-semibold mb-1">${product.type} • ${product.vehicle}</div>
                        <h4 class="font-bold text-slate-800 text-lg mb-1 line-clamp-1">${product.name}</h4>
                        <p class="text-slate-500 text-sm font-medium mb-3">${product.size}</p>
                        
                        <div class="flex items-center mb-4 text-yellow-400 text-xs">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i>
                            <span class="text-slate-400 ml-1">(${product.rating})</span>
                        </div>
                        
                        <div class="mt-auto flex items-center justify-between">
                            <div>
                                <span class="text-xs text-slate-400 block">À partir de</span>
                                <span class="font-bold text-xl text-slate-800">$${product.price.toFixed(2)}</span>
                            </div>
                            <button class="w-10 h-10 rounded-full bg-slate-100 text-ftc-green hover:bg-ftc-green hover:text-white transition flex items-center justify-center" onclick="event.stopPropagation(); showProductDetails(${product.id})">
                                <i class="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderProductGrid(containerId, products) {
            const container = document.getElementById(containerId);
            if(container) {
                container.innerHTML = products.map(p => createProductCard(p)).join('');
            }
        }

        function navigate(viewName) {
            // Cacher toutes les vues
            document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
            
            // Afficher la vue demandée
            const view = document.getElementById(`view-${viewName}`);
            if(view) {
                view.classList.remove('hidden');
                appState.currentView = viewName;
                window.scrollTo(0, 0);
            }
            
            if(viewName === 'checkout') {
                goToStep(1); // Reset stepper to step 1
                renderCart();
            }
        }

        function showProductDetails(id) {
            const product = productsDB.find(p => p.id === id);
            if(!product) return;
            
            appState.selectedProduct = product;
            
            // Remplir le HTML du produit
            const container = document.getElementById('product-detail-container');
            container.innerHTML = `
                <!-- Gallery -->
                <div class="w-full md:w-1/2">
                    <div class="bg-slate-50 rounded-xl p-8 flex justify-center items-center mb-4">
                        <img src="${product.image}" alt="${product.name}" class="w-full max-w-sm drop-shadow-xl">
                    </div>
                    <div class="flex gap-2 justify-center">
                        <div class="w-16 h-16 bg-slate-50 rounded border-2 border-ftc-green p-1 cursor-pointer"><img src="${product.image}" class="w-full h-full object-contain"></div>
                        <div class="w-16 h-16 bg-slate-50 rounded border border-slate-200 p-1 cursor-pointer"><img src="${product.image}" class="w-full h-full object-contain opacity-50"></div>
                    </div>
                </div>
                <!-- Info -->
                <div class="w-full md:w-1/2 flex flex-col">
                    <span class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">${product.brand}</span>
                    <h2 class="text-3xl font-bold text-slate-800 mb-2">${product.name}</h2>
                    <p class="text-xl text-slate-600 mb-4">${product.size}</p>
                    
                    <div class="flex items-center gap-4 mb-6">
                        <div class="flex items-center text-yellow-400">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i>
                        </div>
                        <span class="text-sm text-slate-500 underline cursor-pointer">128 Avis</span>
                    </div>

                    <div class="bg-ftc-green-light/30 border border-ftc-green-light rounded-lg p-4 mb-8">
                        <p class="text-sm text-slate-700 mb-2"><i class="fa-solid fa-check text-ftc-green mr-2"></i> Compatible avec votre sélection</p>
                        <ul class="text-sm text-slate-500 space-y-1 ml-6 list-disc">
                            <li>Saison : ${product.type}</li>
                            <li>Type : ${product.vehicle}</li>
                            <li>Consommation : C | Adhérence : A</li>
                        </ul>
                    </div>
                    
                    <div class="mt-auto">
                        <p class="text-sm text-slate-500 mb-1">Meilleur prix trouvé :</p>
                        <div class="flex items-end gap-4 mb-4">
                            <span class="text-4xl font-bold text-slate-800">$${product.price.toFixed(2)}</span>
                            <span class="text-sm text-slate-500 mb-1">TTC / pneu</span>
                        </div>
                        <button onclick="addToCart(${product.id}, '${sellersDB[0].name}', ${product.price})" class="w-full py-4 bg-ftc-green hover:bg-ftc-green-dark text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition flex items-center justify-center text-lg">
                            <i class="fa-solid fa-cart-plus mr-2"></i> Ajouter au panier
                        </button>
                    </div>
                </div>
            `;
            
            // Remplir le tableau des offres (Marketplace)
            const tbody = document.getElementById('offers-table-body');
            tbody.innerHTML = sellersDB.map(seller => {
                const finalPrice = product.price + seller.priceAdj;
                return `
                <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td class="p-4 font-medium text-slate-800 flex items-center">
                        <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mr-3 text-xs"><i class="fa-solid fa-store"></i></div>
                        ${seller.name}
                    </td>
                    <td class="p-4"><span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">${seller.stock}</span></td>
                    <td class="p-4 text-sm">${seller.delivery}</td>
                    <td class="p-4 font-bold text-slate-800 text-lg">$${finalPrice.toFixed(2)}</td>
                    <td class="p-4">
                        <button onclick="addToCart(${product.id}, '${seller.name}', ${finalPrice})" class="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded hover:bg-slate-800 transition">
                            Choisir
                        </button>
                    </td>
                </tr>
            `}).join('');

            navigate('product');
        }

        function addToCart(productId, sellerName, price) {
            const product = productsDB.find(p => p.id === productId);
            if(!product) return;
            
            // Vérifier si déjà dans le panier avec ce vendeur
            const existing = appState.cart.find(i => i.product.id === productId && i.seller === sellerName);
            if(existing) {
                existing.qty += 1;
            } else {
                appState.cart.push({
                    product: product,
                    seller: sellerName,
                    price: price,
                    qty: 1
                });
            }
            
            updateCartUI();
            
            // Feedback visuel simple
            alert(`${product.name} ajouté au panier !`);
        }

        function updateCartUI() {
            const badge = document.getElementById('cart-badge');
            const totalItems = appState.cart.reduce((sum, item) => sum + item.qty, 0);
            
            if(totalItems > 0) {
                badge.textContent = totalItems;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }

        function renderCart() {
            const container = document.getElementById('cart-content');
            let total = 0;
            
            if(appState.cart.length === 0) {
                container.innerHTML = `<div class="text-center py-10 text-slate-500">Votre panier est vide.</div>`;
                document.getElementById('cart-total').textContent = "$0.00";
                return;
            }
            
            container.innerHTML = appState.cart.map((item, index) => {
                const lineTotal = item.price * item.qty;
                total += lineTotal;
                return `
                <div class="flex items-center gap-4 p-4 border border-slate-100 rounded-xl mb-4 bg-slate-50/50 relative">
                    <img src="${item.product.image}" class="w-16 h-16 object-contain bg-white rounded-lg border border-slate-200">
                    <div class="flex-grow">
                        <h4 class="font-bold text-slate-800">${item.product.brand} ${item.product.name}</h4>
                        <p class="text-xs text-slate-500 mb-1">${item.product.size} • Vendu par : <span class="font-semibold text-ftc-green">${item.seller}</span></p>
                        <div class="font-bold text-slate-700">$${item.price.toFixed(2)} / unité</div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="flex items-center bg-white border border-slate-200 rounded-lg">
                            <button onclick="updateQty(${index}, -1)" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800">-</button>
                            <span class="w-8 text-center font-medium text-sm">${item.qty}</span>
                            <button onclick="updateQty(${index}, 1)" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800">+</button>
                        </div>
                        <div class="font-bold text-lg text-slate-800 w-20 text-right">$${lineTotal.toFixed(2)}</div>
                    </div>
                    <button onclick="removeFromCart(${index})" class="absolute top-2 right-2 text-slate-400 hover:text-red-500"><i class="fa-solid fa-times"></i></button>
                </div>
                `;
            }).join('');
            
            document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
            document.getElementById('summary-subtotal').textContent = `$${total.toFixed(2)}`;
            document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
        }

        function updateQty(index, change) {
            appState.cart[index].qty += change;
            if(appState.cart[index].qty <= 0) {
                appState.cart.splice(index, 1);
            }
            updateCartUI();
            renderCart();
        }

        function removeFromCart(index) {
            appState.cart.splice(index, 1);
            updateCartUI();
            renderCart();
        }

        function goToStep(stepNumber) {
            // Empecher d'aller à la validation si panier vide
            if(stepNumber > 1 && appState.cart.length === 0) {
                alert("Votre panier est vide");
                return;
            }

            appState.checkoutStep = stepNumber;
            
            // Cacher toutes les steps
            document.querySelectorAll('.checkout-step').forEach(el => el.classList.add('hidden'));
            
            // Afficher la step actuelle
            const stepEl = document.getElementById(`checkout-step-${stepNumber}`);
            if(stepEl) {
                stepEl.classList.remove('hidden');
                stepEl.classList.add('block');
            }
            
            // Mettre à jour l'UI du Stepper
            const progressWidth = ((stepNumber - 1) / 3) * 100;
            document.getElementById('stepper-progress').style.width = `${progressWidth}%`;
            
            document.querySelectorAll('.step-item').forEach(item => {
                const s = parseInt(item.getAttribute('data-step'));
                const icon = item.querySelector('.step-icon');
                const text = item.querySelector('.step-text');
                
                if(s < stepNumber) {
                    // Completed
                    icon.className = 'w-10 h-10 rounded-full bg-ftc-green text-white flex items-center justify-center font-bold step-icon';
                    icon.innerHTML = '<i class="fa-solid fa-check"></i>';
                    text.className = 'text-xs font-semibold mt-2 text-ftc-green step-text';
                } else if(s === stepNumber) {
                    // Current
                    icon.className = 'w-10 h-10 rounded-full bg-ftc-green text-white flex items-center justify-center font-bold shadow-md shadow-green-200 step-icon';
                    icon.innerHTML = s;
                    text.className = 'text-xs font-semibold mt-2 text-ftc-green step-text';
                } else {
                    // Pending
                    icon.className = 'w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold step-icon';
                    if(s===4) icon.innerHTML = '<i class="fa-solid fa-check"></i>';
                    else icon.innerHTML = s;
                    text.className = 'text-xs font-semibold mt-2 text-slate-400 step-text';
                }
            });
            
            window.scrollTo(0, 0);
        }

        function processOrder() {
            // Simulation de processing
            goToStep(4);
        }

        function finishCheckout() {
            appState.cart = [];
            updateCartUI();
            navigate('home');
        }

        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            const icon = document.querySelector('#mobile-menu-btn i');
            if (menu) {
                menu.classList.toggle('hidden');
                if (icon) {
                    if (menu.classList.contains('hidden')) {
                        icon.className = 'fa-solid fa-bars text-2xl';
                    } else {
                        icon.className = 'fa-solid fa-xmark text-2xl';
                    }
                }
            }
        }

        function handleSearchKey(event, value) {
            if (event.key === 'Enter') {
                performSearch(value);
            }
        }

        function triggerHeaderSearch(inputId) {
            const input = document.getElementById(inputId);
            if (input && input.value.trim() !== '') {
                performSearch(input.value.trim());
            }
        }

        function startConfiguratorSearch() {
            const vehicle = document.getElementById('cfg-vehicle')?.value || '';
            const season = document.getElementById('cfg-season')?.value || '';
            const width = document.getElementById('cfg-width')?.value || '';
            const height = document.getElementById('cfg-height')?.value || '';
            const diameter = document.getElementById('cfg-diameter')?.value || '';

            let queryParts = [];
            if (width || height || diameter) {
                let sizeStr = `${width || ''}${height ? '/' + height : ''} ${diameter}`.trim();
                if (sizeStr) queryParts.push(sizeStr);
            }
            if (season) queryParts.push(season);
            if (vehicle) queryParts.push(vehicle);

            const searchTerms = queryParts.join(' ');
            performSearch(searchTerms, { vehicle, season, width, height, diameter });
        }

        function performSearch(query = '', filters = null) {
            const overlay = document.getElementById('search-loading-overlay');
            if (overlay) {
                overlay.classList.remove('hidden');
            }

            setTimeout(() => {
                let results = [...productsDB];
                const q = query.toLowerCase().trim();

                if (filters) {
                    if (filters.vehicle) results = results.filter(p => p.vehicle.toLowerCase().includes(filters.vehicle.toLowerCase()));
                    if (filters.season) results = results.filter(p => p.type.toLowerCase().includes(filters.season.toLowerCase()));
                    if (filters.width) results = results.filter(p => p.size.includes(filters.width));
                    if (filters.height) results = results.filter(p => p.size.includes(filters.height));
                    if (filters.diameter) results = results.filter(p => p.size.toLowerCase().includes(filters.diameter.toLowerCase()));
                } else if (q) {
                    results = results.filter(p => 
                        p.name.toLowerCase().includes(q) ||
                        p.brand.toLowerCase().includes(q) ||
                        p.size.toLowerCase().includes(q) ||
                        p.type.toLowerCase().includes(q) ||
                        p.vehicle.toLowerCase().includes(q)
                    );
                }

                appState.filteredProducts = results;
                appState.currentPage = 1;

                const summaryEl = document.getElementById('search-results-summary');
                if (summaryEl) {
                    const label = query.trim() !== '' ? `"${query.trim()}"` : '"Tous les pneus"';
                    summaryEl.innerHTML = `<span class="font-bold text-slate-800">${results.length}</span> résultats pour <span class="font-semibold">${label}</span>`;
                }

                renderPaginatedResults();

                if (overlay) {
                    overlay.classList.add('hidden');
                }

                navigate('search');
            }, 800);
        }

        function renderPaginatedResults() {
            const total = appState.filteredProducts.length;
            const totalPages = Math.ceil(total / appState.itemsPerPage) || 1;
            
            if (appState.currentPage > totalPages) appState.currentPage = totalPages;
            if (appState.currentPage < 1) appState.currentPage = 1;

            const startIndex = (appState.currentPage - 1) * appState.itemsPerPage;
            const endIndex = startIndex + appState.itemsPerPage;
            const pageProducts = appState.filteredProducts.slice(startIndex, endIndex);

            renderProductGrid('search-results-grid', pageProducts);
            renderPagination(totalPages);
        }

        function renderPagination(totalPages) {
            const container = document.getElementById('pagination-container');
            if (!container) return;

            if (totalPages <= 1) {
                container.innerHTML = `
                    <button disabled class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-300 cursor-not-allowed">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <button class="w-10 h-10 rounded-lg bg-ftc-green text-white font-bold flex items-center justify-center">1</button>
                    <button disabled class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-300 cursor-not-allowed">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                `;
                return;
            }

            let html = '';
            
            // Prev Button
            const isPrevDisabled = appState.currentPage === 1;
            html += `
                <button onclick="goToPage(${appState.currentPage - 1})" ${isPrevDisabled ? 'disabled' : ''} 
                    class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center ${isPrevDisabled ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-ftc-green-light hover:text-ftc-green transition cursor-pointer'}" aria-label="Page précédente">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
            `;

            // Page numbers
            for (let page = 1; page <= totalPages; page++) {
                if (page === appState.currentPage) {
                    html += `<button class="w-10 h-10 rounded-lg bg-ftc-green text-white font-bold flex items-center justify-center shadow-md">${page}</button>`;
                } else {
                    html += `<button onclick="goToPage(${page})" class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-medium transition cursor-pointer">${page}</button>`;
                }
            }

            // Next Button
            const isNextDisabled = appState.currentPage === totalPages;
            html += `
                <button onclick="goToPage(${appState.currentPage + 1})" ${isNextDisabled ? 'disabled' : ''} 
                    class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center ${isNextDisabled ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-ftc-green-light hover:text-ftc-green transition cursor-pointer'}" aria-label="Page suivante">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            `;

            container.innerHTML = html;
        }

        function goToPage(pageNumber) {
            const totalPages = Math.ceil(appState.filteredProducts.length / appState.itemsPerPage) || 1;
            if (pageNumber < 1 || pageNumber > totalPages) return;
            
            appState.currentPage = pageNumber;
            renderPaginatedResults();

            const searchView = document.getElementById('view-search');
            if (searchView) {
                searchView.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Init application
        document.addEventListener('DOMContentLoaded', initApp);
