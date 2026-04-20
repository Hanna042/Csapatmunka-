export function addProduct(product, storage = localStorage) {
    const existing = JSON.parse(storage.getItem("products") || "[]");
    existing.push(product);
    storage.setItem("products", JSON.stringify(existing));
}

export function getLocalProducts(storage = localStorage) {
    return JSON.parse(storage.getItem("products") || "[]");
}

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("addProductForm");

        if (!form) {
            return;
        }

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const title = document.getElementById("productName").value.trim();
            const price = document.getElementById("productPrice").value;
            const description = document.getElementById("productDescription").value.trim();

            addProduct({ title, price, description });
            window.location.href = "index.html";
        });
    });
}
