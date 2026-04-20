// js/hozzaadas.js

/**
 * Új terméket ad hozzá a localStorage 'products' listájához.
 * @param {{ title: string, price: string|number, description: string }} product
 * @param {Storage} [storage] - tesztelhetőség miatt felülírható
 */
export function addProduct(product, storage = localStorage) {
    const existing = JSON.parse(storage.getItem('products') || '[]');
    existing.push(product);
    storage.setItem('products', JSON.stringify(existing));
}

/**
 * Visszaadja az összes localStorage-ban tárolt terméket.
 * @param {Storage} [storage]
 * @returns {Array}
 */
export function getLocalProducts(storage = localStorage) {
    return JSON.parse(storage.getItem('products') || '[]');
}

// DOM inicializálás – csak böngészőben fut
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('addProductForm');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const title = document.getElementById('productName').value.trim();
            const price = document.getElementById('productPrice').value;
            const description = document.getElementById('productDescription').value.trim();
            addProduct({ title, price, description });
            window.location.href = 'index.html';
        });
    });
}
