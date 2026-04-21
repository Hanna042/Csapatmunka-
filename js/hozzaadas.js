export function addProduct(product, storage = localStorage) {
    const existing = JSON.parse(storage.getItem("products") || "[]");

    if (!product.id) {
        product.id = Date.now().toString();
    }

    existing.push(product);
    storage.setItem("products", JSON.stringify(existing));
}

export function getLocalProducts(storage = localStorage) {
    let products = JSON.parse(storage.getItem("products") || "[]");

    let changed = false;

    products = products.map((p, i) => {
        if (!p.id) {
            changed = true;
            return {
                ...p,
                id: `local-${i}-${Date.now()}`
            };
        }
        return p;
    });

    if (changed) {
        storage.setItem("products", JSON.stringify(products));
    }

    return products;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("addProductForm");

        if (!form) return;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const title = document.getElementById("productName").value.trim();
            const price = document.getElementById("productPrice").value;
            const description = document.getElementById("productDescription").value.trim();
            const imageInput = document.getElementById("productImage");

            let thumbnail = null;

            if (imageInput && imageInput.files.length > 0) {
                try {
                    thumbnail = await fileToBase64(imageInput.files[0]);
                } catch (err) {
                    console.error("Kép hiba:", err);
                }
            }

            addProduct({
                id: Date.now().toString(),
                title,
                price,
                description,
                thumbnail
            });

            window.location.href = "index.html";
        });
    });
}