// A kosár adatait a böngésző localStorage-ában tároljuk ezen a kulcson
const cartStorageKey = "kosar";

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

/**
 * Ár formázása magyar Ft pénznemre
 */
function formatPrice(value) {
    return `${value.toLocaleString("hu-HU")} Ft`;
}

/**
 * Kosár végösszegének kiszámítása
 * (ár * mennyiség minden termékre összeadva)
 */
function calcTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * HTML-ben megjelenített végösszeg frissítése
 */
function updateTotal(cart) {
    const totalNode = document.getElementById("KosarVegosszeg");

    if (!totalNode) {
        return;
    }

    totalNode.textContent = formatPrice(calcTotal(cart));
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
                    ${cart.map((item) => `
                        <tr>
                            <td>${item.title}</td>
                            <td>${formatPrice(item.price)}</td>

                            <!-- Mennyiség növelés/csökkentés gombok -->
                            <td>
                                <div class="btn-group btn-group-sm" role="group">
                                    <button class="btn btn-outline-secondary" data-action="decrease" data-id="${item.id}">-</button>
                                    <button class="btn btn-light" disabled>${item.quantity}</button>
                                    <button class="btn btn-outline-secondary" data-action="increase" data-id="${item.id}">+</button>
                                </div>
                            </td>

                            <!-- Részösszeg (ár * mennyiség) -->
                            <td>${formatPrice(item.price * item.quantity)}</td>

                            <!-- Törlés gomb -->
                            <td>
                                <button class="btn btn-danger btn-sm" data-action="remove" data-id="${item.id}">Törlés</button>
                            </td>
                        </tr>
                    `).join("")}
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
renderCart();