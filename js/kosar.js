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

function formatPrice(value) {
    return `${value.toLocaleString("hu-HU")} Ft`;
}

function calcTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateTotal(cart) {
    const totalNode = document.getElementById("KosarVegosszeg");
    if (!totalNode) {
        return;
    }

    totalNode.textContent = formatPrice(calcTotal(cart));
}

function renderCart() {
    const container = document.getElementById("KosarTartalom");
    if (!container) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                A kosár jelenleg üres.
            </div>
        `;
        updateTotal(cart);
        return;
    }

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
                            <td>
                                <div class="btn-group btn-group-sm" role="group">
                                    <button class="btn btn-outline-secondary" data-action="decrease" data-id="${item.id}">-</button>
                                    <button class="btn btn-light" disabled>${item.quantity}</button>
                                    <button class="btn btn-outline-secondary" data-action="increase" data-id="${item.id}">+</button>
                                </div>
                            </td>
                            <td>${formatPrice(item.price * item.quantity)}</td>
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

function mutateCart(productId, action) {
    const cart = getCart();
    const item = cart.find((product) => product.id === productId);

    if (!item) {
        return;
    }

    if (action === "increase") {
        item.quantity += 1;
    }

    if (action === "decrease") {
        item.quantity -= 1;
    }

    const nextCart = action === "remove"
        ? cart.filter((product) => product.id !== productId)
        : cart.filter((product) => product.quantity > 0);

    saveCart(nextCart);
    renderCart();
}

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

renderCart();