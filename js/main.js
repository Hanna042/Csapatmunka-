import { getProducts } from "./get.js";
import { formatHuf, formatUsd, getUsdToHufRate, usdToHuf } from "./exchange.js";
import { getLocalProducts as getStoredProducts } from "./hozzaadas.js";

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

function mapLocalProducts(products) {
    return products.map((product, index) => ({
        id: Number.isFinite(Number(product.id)) ? Number(product.id) : -(index + 1),
        title: product.title || product.name || "Új termék",
        price: Number(product.price) || 0,
        description: product.description || "",
        thumbnail: product.thumbnail || "https://via.placeholder.com/400x300?text=Új+termék"
    }));
}

function renderPriceBlock(priceUsd, usdHufRate) {
    const numericPrice = Number(priceUsd) || 0;
    const converted = usdToHuf(numericPrice, usdHufRate);

    if (Number.isFinite(converted)) {
        return `
            <strong>${formatHuf(converted)}</strong>
            <div class="small text-muted">(${formatUsd(numericPrice)})</div>
        `;
    }

    return `
        <strong>${formatUsd(numericPrice)}</strong>
        <div class="small text-muted">Az árfolyam most nem elérhető.</div>
    `;
}

export function renderProducts(products, usdHufRate) {
    const container = document.getElementById("Termekkartya");
    if (!container) {
        return;
    }

    if (!Array.isArray(products) || products.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info mb-0">Jelenleg nincs megjeleníthető termék.</div>
            </div>
        `;
        container.onclick = null;
        return;
    }

    container.innerHTML = products.map((product) => `
        <div class="col-12 col-sm-6 col-lg-4">
            <div class="card product-card shadow-sm">
                <img src="${product.thumbnail || "https://via.placeholder.com/400x300?text=Termék"}" class="card-img-top" alt="${product.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div>${renderPriceBlock(product.price, usdHufRate)}</div>
                        <div>
                            <button class="btn btn-primary btn-sm me-2" data-product-id="${product.id}" data-action="add">Kosárba</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    container.onclick = (event) => {
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
    };
}

async function init() {
    const alertBox = document.getElementById("uzenet");
    const localProducts = mapLocalProducts(getStoredProducts());

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

        renderProducts([...productsWithOverrides, ...localProducts], usdHufRate);
    } catch {
        if (localProducts.length > 0) {
            renderProducts(localProducts, null);
        }

        if (alertBox) {
            alertBox.classList.remove("d-none");
            alertBox.textContent = localProducts.length > 0
                ? "Az API termékek betöltése nem sikerült, de a helyi termékek megjelennek."
                : "Nem sikerült betölteni a termékeket.";
        }
    }
}

init();