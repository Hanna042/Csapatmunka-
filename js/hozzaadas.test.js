/**
 * @jest-environment jsdom
 *
 * Tesztek: hozzaadas.html → localStorage → index.html megjelenítés teljes folyamat
 */

import { addProduct, getLocalProducts } from "./hozzaadas.js";
import { renderProducts } from "./main.js";

// ------------------------------------------------------------------
// Segéd: localStorage reset minden teszt előtt
// ------------------------------------------------------------------
beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
});

// ------------------------------------------------------------------
// 1. addProduct – helyes tárolás
// ------------------------------------------------------------------
describe("addProduct()", () => {
    test("új terméket ment a localStorage-ba", () => {
        addProduct({ title: "Teszt cipő", price: "5000", description: "Kényelmes" });

        const saved = JSON.parse(localStorage.getItem("products"));
        expect(saved).toHaveLength(1);
        expect(saved[0].title).toBe("Teszt cipő");
        expect(saved[0].price).toBe("5000");
        expect(saved[0].description).toBe("Kényelmes");
    });

    test("több terméket is ment egymás után", () => {
        addProduct({ title: "Termék A", price: "1000", description: "Leírás A" });
        addProduct({ title: "Termék B", price: "2000", description: "Leírás B" });

        const saved = getLocalProducts();
        expect(saved).toHaveLength(2);
        expect(saved[1].title).toBe("Termék B");
    });

    test("üres localStorage-nál is helyesen ment", () => {
        expect(localStorage.getItem("products")).toBeNull();
        addProduct({ title: "Első", price: "100", description: "Első termék" });
        expect(getLocalProducts()).toHaveLength(1);
    });
});

// ------------------------------------------------------------------
// 2. getLocalProducts – visszaolvasás
// ------------------------------------------------------------------
describe("getLocalProducts()", () => {
    test("üres tömböt ad vissza, ha még nincs semmi mentve", () => {
        expect(getLocalProducts()).toEqual([]);
    });

    test("visszaadja a korábban mentett termékeket", () => {
        addProduct({ title: "X", price: "99", description: "X leírás" });
        const products = getLocalProducts();
        expect(products[0].title).toBe("X");
    });
});

// ------------------------------------------------------------------
// 3. renderProducts – DOM megjelenítés
// ------------------------------------------------------------------
describe("renderProducts()", () => {
    beforeEach(() => {
        document.body.innerHTML = `<div class="row g-3" id="Termekkartya"></div>`;
    });

    test("az API-ból jövő termék megjelenik az index.html #Termekkartya konténerében", () => {
        const mockProducts = [
            { id: 1, title: "API Termék", description: "Leírás", price: 10, thumbnail: "img.jpg" }
        ];
        renderProducts(mockProducts, null); // árfolyam null → nincs ár

        const container = document.getElementById("Termekkartya");
        expect(container.innerHTML).toContain("API Termék");
    });

    test("a hozzáadott local termék (localStorage) is megjelenik a terméklistában", () => {
        // Szimuláljuk: hozzaadas.html form beküldése
        addProduct({ title: "Helyi Termék", price: "3500", description: "Lokálisan mentett" });

        // getLocalProducts()-ot manuálisan mergeljük (ahogy main.js is teszi)
        const localProds = getLocalProducts();
        const apiProds = [
            { id: 1, title: "API Termék", description: "API leírás", price: 12, thumbnail: "img.jpg" }
        ];
        const allProds = [...apiProds, ...localProds];

        renderProducts(allProds, null);

        const container = document.getElementById("Termekkartya");
        expect(container.innerHTML).toContain("Helyi Termék");
        expect(container.innerHTML).toContain("API Termék");
    });

    test("több local termék esetén mindegyik kártya megjelenik", () => {
        addProduct({ title: "Termék 1", price: "100", description: "D1" });
        addProduct({ title: "Termék 2", price: "200", description: "D2" });

        const allProds = [...getLocalProducts()];
        renderProducts(allProds, null);

        const cards = document.querySelectorAll(".card");
        expect(cards.length).toBe(2);
    });

    test("minden kártya tartalmaz Kosárba gombot", () => {
        addProduct({ title: "Gomb teszt", price: "50", description: "Teszt" });
        renderProducts([...getLocalProducts()], null);

        const btn = document.querySelector("[data-action='add']");
        expect(btn).not.toBeNull();
        expect(btn.textContent.trim()).toBe("Kosárba");
    });
});

// ------------------------------------------------------------------
// 4. Teljes E2E folyamat: form beküldés → megjelenítés
// ------------------------------------------------------------------
describe("Teljes folyamat: hozzáadás → megjelenítés", () => {
    test("form adatai után a termék kártyán jelenik meg az indexen", () => {
        // 1. hozzaadas.html form beküldés szimulálása
        const formData = { title: "Új Hátizsák", price: "8990", description: "Vízálló anyag" };
        addProduct(formData);

        // 2. index.html DOM szimulálása
        document.body.innerHTML = `<div class="row g-3" id="Termekkartya"></div>`;

        // 3. renderProducts meghívása (ahogy main.js init()-je teszi)
        renderProducts(getLocalProducts(), null);

        // 4. ellenőrzés
        const container = document.getElementById("Termekkartya");
        expect(container.innerHTML).toContain("Új Hátizsák");
        expect(container.innerHTML).toContain("Vízálló anyag");
    });
});
