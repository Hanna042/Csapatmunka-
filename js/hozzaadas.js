document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addProductForm');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('productName').value.trim();
        const price = Number(document.getElementById('productPrice').value);
        const description = document.getElementById('productDescription').value.trim();

        const product = {
            name,
            price,
            description
        };

        let products = [];

        try {
            products = JSON.parse(localStorage.getItem('products')) || [];
        } catch {
            products = [];
        }

        products.push(product);

        localStorage.setItem('products', JSON.stringify(products));

        window.location.href = 'index.html';
    });
});
