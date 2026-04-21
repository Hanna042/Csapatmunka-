import { formatHuf, formatUsd, getUsdToHufRate, usdToHuf } from "./exchange.js";

// A kosár adatait a böngésző localStorage-ában tároljuk ezen a kulcson
const cartStorageKey = "kosar";
let usdHufRate = null;

/**
 * Kosár betöltése a localStorage-ból
 * Ha nincs adat vagy hibás, üres tömböt ad vissza
 */
function getCart() {
    const raw = localStorage.getItem(cartStorageKey);

    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);

        // Csak akkor használjuk, ha tényleg tömb
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

/**
 * Kosár mentése a localStorage-ba JSON formátumban
 */
function saveCart(cart) {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function formatPrice(value) {
    return value === null ? "" : formatHuf(value);
}

function formatCartAmount(usdValue, quantity = 1) {
    const numericUsd = (Number(usdValue) || 0) * quantity;
    const converted = usdToHuf(numericUsd, usdHufRate);

    if (Number.isFinite(converted)) {
        return {
            primary: formatPrice(converted),
            secondary: `(${formatUsd(numericUsd)})`
        };
    }

    return {
        primary: formatUsd(numericUsd),
        secondary: "Az árfolyam most nem elérhető."
    };
}

function calcTotal(cart) {
    return cart.reduce((sum, item) => {
        const unitPriceUsd = Number(item.priceUsd ?? item.price) || 0;
        return sum + unitPriceUsd * item.quantity;
    }, 0);
}

function updateTotal(cart) {
    const totalNode = document.getElementById("KosarVegosszeg");

    if (!totalNode) {
        return;
    }

    const totalUsd = calcTotal(cart);
    const converted = usdToHuf(totalUsd, usdHufRate);
    totalNode.textContent = Number.isFinite(converted)
        ? formatHuf(converted)
        : formatUsd(totalUsd);
}

/**
 * Kosár teljes kirajzolása a DOM-ba
 * - táblázatot generál
 * - vagy üres kosár üzenetet mutat
 */
function renderCart() {
    const container = document.getElementById("KosarTartalom");

    if (!container) {
        return;
    }

    const cart = getCart();

    // Ha üres a kosár, info üzenet
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                A kosár jelenleg üres.
            </div>
        `;

        updateTotal(cart);
        return;
    }

    // Kosár táblázat kirajzolása
    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Termék</th>
                        <th>Ár</th>
                        <th>Mennyiség</th>
                        <th>Részösszeg</th>
                        <th>Művelet</th>
                    </tr>
                </thead>
                <tbody>
                    ${cart.map((item) => {
                        const unitAmount = formatCartAmount(item.priceUsd ?? item.price);
                        const subtotalAmount = formatCartAmount(item.priceUsd ?? item.price, item.quantity);

                        return `
                            <tr>
                                <td>${item.title}</td>
                                <td>
                                    ${unitAmount.primary}
                                    <div class="small text-muted kosar">${unitAmount.secondary}</div>
                                </td>

                                <!-- Mennyiség növelés/csökkentés gombok -->
                                <td>
                                    <div class="btn-group btn-group-sm" role="group kosar">
                                        <button class="btn btn-outline-secondary" data-action="decrease" data-id="${item.id}">-</button>
                                        <button class="btn btn-light" disabled>${item.quantity}</button>
                                        <button class="btn btn-outline-secondary" data-action="increase" data-id="${item.id}">+</button>
                                    </div>
                                </td>

                                <!-- Részösszeg (ár * mennyiség) -->
                                <td>
                                    ${subtotalAmount.primary}
                                    <div class="small text-muted kosar">${subtotalAmount.secondary}</div>
                                </td>

                                <!-- Törlés gomb -->
                                <td>
                                    <button class="btn btn-danger btn-sm" data-action="remove" data-id="${item.id}">Törlés</button>
                                </td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;

    updateTotal(cart);
}

/**
 * Kosár módosítása (növelés, csökkentés, törlés)
 */
function mutateCart(productId, action) {
    const cart = getCart();

    // Megkeressük a terméket a kosárban
    const item = cart.find((product) => product.id === productId);

    if (!item) {
        return;
    }

    // Mennyiség növelése
    if (action === "increase") {
        item.quantity += 1;
    }

    // Mennyiség csökkentése
    if (action === "decrease") {
        item.quantity -= 1;
    }

    // Új kosár:
    // - ha remove → töröljük az elemet
    // - különben csak a 0-nál nagyobb mennyiségűek maradnak
    const nextCart = action === "remove"
        ? cart.filter((product) => product.id !== productId)
        : cart.filter((product) => product.quantity > 0);

    saveCart(nextCart);
    renderCart();
}

/**
 * Globális kattintásfigyelő
 * A gombok data-action és data-id alapján működnek
 */
document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLButtonElement)) {
        return;
    }

    const action = target.dataset.action;
    const id = Number(target.dataset.id);

    if (!action || Number.isNaN(id)) {
        return;
    }

    mutateCart(id, action);
});

/**
 * Első renderelés betöltéskor
 */
async function init() {
    usdHufRate = await getUsdToHufRate();
    renderCart();
}

init();