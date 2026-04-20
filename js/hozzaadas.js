// js/hozzaadas.js
// Ez a script elküldi a termékadatokat a main.html-nek (pl. localStorage-on keresztül)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addProductForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const description = document.getElementById('productDescription').value;
        // Termék objektum
        const product = { name, price, description };
        // Termékek tömb betöltése vagy új létrehozása
        let products = JSON.parse(localStorage.getItem('products') || '[]');
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        // Átirányítás a főoldalra (index.html)
        window.location.href = 'index.html';
    });
});
