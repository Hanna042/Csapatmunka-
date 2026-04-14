import { getProducts } from "./get.js";

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
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: 1
        });
    }

    saveCart(cart);
}

function renderProducts(products) {
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
                        <strong>${product.price} $</strong>
                        <button class="btn btn-primary btn-sm" data-product-id="${product.id}">Kosárba</button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    container.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) {
            return;
        }

        const id = Number(target.dataset.productId);
        const selected = products.find((item) => item.id === id);
        if (!selected) {
            return;
        }

        addToCart(selected);
        target.textContent = "Hozzáadva";
        setTimeout(() => {
            target.textContent = "Kosárba";
        }, 800);
    });
}

async function init() {
    const alertBox = document.getElementById("uzenet");

    try {
        const products = await getProducts();
        renderProducts(products);
    } catch {
        if (alertBox) {
            alertBox.classList.remove("d-none");
            alertBox.textContent = "Nem sikerült betölteni a termékeket.";
        }
    }
}

init();