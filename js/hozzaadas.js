import { postData } from "./post.js";

export async function addProduct(product, storage = localStorage) {
    try {
        // POST az API-hoz
        const apiResponse = await postData("https://dummyjson.com/products/add", {
            title: product.title,
            price: Number(product.price),
            description: product.description,
            thumbnail: product.thumbnail
        });

        // API response validálása
        if (!apiResponse || typeof apiResponse !== "object") {
            throw new Error("Érvénytelen API válasz");
        }

        // Mentés localStorage-ba is
        const productToStore = {
            id: apiResponse.id || Date.now().toString(),
            title: product.title,
            price: Number(product.price),
            description: product.description,
            thumbnail: product.thumbnail
        };

        const existing = JSON.parse(storage.getItem("products") || "[]");
        existing.push(productToStore);
        storage.setItem("products", JSON.stringify(existing));

        return apiResponse;
    } catch (error) {
        console.error("Hiba a termék hozzáadásakor:", error);
        throw error;
    }
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

            try {
                await addProduct({
                    title,
                    price,
                    description,
                    thumbnail
                });

                alert("Termék sikeresen hozzáadva!");
                window.location.href = "index.html";
            } catch (error) {
                alert("Hiba: A termék hozzáadása sikertelen. Kérjük, próbálja újra!");
                console.error("Hozzáadás hiba:", error);
            }
        });
    });
}