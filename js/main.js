import { getProducts } from "./get.js";
import { formatHuf, getUsdToHufRate, usdToHuf } from "./exchange.js";

const cartStorageKey = "kosar";

function getCart() {
    const raw = localStorage.getItem(cartStorageKey);
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function addToCart(product) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            priceUsd: product.price,
            thumbnail: product.thumbnail,
            quantity: 1
        });
    }

    saveCart(cart);
}

function renderProducts(products, usdHufRate) {
    const container = document.getElementById("Termekkartya");
    if (!container) {
        return;
    }

    container.innerHTML = products.map((product) => `
        <div class="col-12 col-sm-6 col-lg-4">
            <div class="card product-card shadow-sm">
                <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div>${Number.isFinite(usdHufRate) ? `
                            <strong>${formatHuf(usdToHuf(product.price, usdHufRate))}</strong>
                            <div class="small text-muted">(${product.price} USD)</div>
                        ` : ""}</div>
                        <div>
                            <button class="btn btn-primary btn-sm me-2" data-product-id="${product.id}" data-action="add">Kosárba</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    container.addEventListener("click", async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) {
            return;
        }

        const id = Number(target.dataset.productId);
        const action = target.dataset.action;
        const selected = products.find((item) => item.id === id);
        if (!selected) {
            return;
        }

        if (action === "add") {
            addToCart(selected);
            const prev = target.textContent;
            target.textContent = "Hozzáadva";
            setTimeout(() => {
                target.textContent = prev;
            }, 800);
            return;
        }
    });
}

async function init() {
    const alertBox = document.getElementById("uzenet");

    try {
        const [products, usdHufRate] = await Promise.all([
            getProducts(),
            getUsdToHufRate()
        ]);

      
        const raw = localStorage.getItem('priceOverrides');
        let overrides = {};
        try {
            overrides = raw ? JSON.parse(raw) : {};
        } catch {}

        const productsWithOverrides = products.map(p => {
            if (overrides && overrides[String(p.id)] !== undefined) {
                return { ...p, price: Number(overrides[String(p.id)]) };
            }
            return p;
        });

        const localProducts = getLocalProducts();
    // Minden mező biztosan szerepeljen
    const sanitizedLocalProducts = localProducts.map(p => ({
        id: p.id,
        title: p.title || 'Új termék',
        price: Number(p.price) || 0,
        description: p.description || '',
        thumbnail: p.thumbnail || "https://via.placeholder.com/400x300?text=Új+termék"
    }));
    const allProducts = [...productsWithOverrides, ...sanitizedLocalProducts];
    renderProducts(allProducts, usdHufRate);
    } catch {
        if (alertBox) {
            alertBox.classList.remove("d-none");
            alertBox.textContent = "Nem sikerült betölteni a termékeket.";
        }
    }
}
function getLocalProducts() {
    try {
        const raw = localStorage.getItem('products');
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return arr.map((p, i) => ({
            id: -(i + 1),
            title: p.name || 'Új termék',
            price: Number(p.price) || 0,
            description: p.description || '',
            thumbnail: "https://via.placeholder.com/400x300?text=Új+termék"
        }));
    } catch {
        return [];
    }
}
init();