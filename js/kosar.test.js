/**
 * Jest tesztek a kosár végösszeg-számítási függvényre
 * A calcTotal() függvény szumálja a kosárban lévő termékek árát
 */

import { calcTotal } from "./kosar.js";

// ========== TESZT 1: Üres kosár ==========
describe("calcTotal - Üres kosár", () => {
    test("Üres kosár összege 0", () => {
        const emptyCart = [];
        const result = calcTotal(emptyCart);
        expect(result).toBe(0);
    });
});

// ========== TESZT 2: Egyetlen termék ==========
describe("calcTotal - Egyetlen termék", () => {
    test("Egyetlen termék helyes összeggel", () => {
        const cart = [
            { id: 1, title: "Termék A", priceUsd: 10, quantity: 1 }
        ];
        const result = calcTotal(cart);
        expect(result).toBe(10);
    });

    test("Egyetlen termék több mennyiséggel", () => {
        const cart = [
            { id: 1, title: "Termék A", priceUsd: 10, quantity: 5 }
        ];
        const result = calcTotal(cart);
        expect(result).toBe(50);
    });
});

// ========== TESZT 3: Több termék ==========
describe("calcTotal - Több termék", () => {
    test("Több termék helyes összeggel", () => {
        const cart = [
            { id: 1, title: "Termék A", priceUsd: 10, quantity: 2 },
            { id: 2, title: "Termék B", priceUsd: 20, quantity: 1 },
            { id: 3, title: "Termék C", priceUsd: 5, quantity: 4 }
        ];
        // (10 * 2) + (20 * 1) + (5 * 4) = 20 + 20 + 20 = 60
        const result = calcTotal(cart);
        expect(result).toBe(60);
    });
});

// ========== TESZT 4: Tizedes számok (realistic API response) ==========
describe("calcTotal - Tizedes számok", () => {
    test("Termékek tizedes árral", () => {
        const cart = [
            { id: 1, title: "Termék A", priceUsd: 9.99, quantity: 2 },
            { id: 2, title: "Termék B", priceUsd: 15.50, quantity: 1 }
        ];
        // (9.99 * 2) + (15.50 * 1) = 19.98 + 15.50 = 35.48
        const result = calcTotal(cart);
        expect(result).toBeCloseTo(35.48, 2);
    });
});

// ========== TESZT 5: Fallback - price helyett priceUsd ==========
describe("calcTotal - Fallback ár mezők", () => {
    test("Price mező fallback működése", () => {
        const cart = [
            { id: 1, title: "Termék A", price: 100, quantity: 1 }
        ];
        const result = calcTotal(cart);
        expect(result).toBe(100);
    });

    test("Mindkét ár mező megadva, priceUsd prioritás", () => {
        const cart = [
            { id: 1, title: "Termék A", priceUsd: 50, price: 100, quantity: 2 }
        ];
        // priceUsd-t kell használni (50 * 2 = 100, nem 100 * 2)
        const result = calcTotal(cart);
        expect(result).toBe(100);
    });
});

// ========== TESZT 6: Edge cases ==========
describe("calcTotal - Edge cases", () => {
    test("Nulla ár", () => {
        const cart = [
            { id: 1, title: "Ingyenes termék", priceUsd: 0, quantity: 5 }
        ];
        const result = calcTotal(cart);
        expect(result).toBe(0);
    });

    test("Negatív ár (hibaesetek kezelése)", () => {
        const cart = [
            { id: 1, title: "Termék", priceUsd: -10, quantity: 1 }
        ];
        // A függvény nem szűri meg az árakat, így negatív is lehet
        const result = calcTotal(cart);
        expect(result).toBe(-10);
    });

    test("Hiányzó vagy null ár - default 0", () => {
        const cart = [
            { id: 1, title: "Termék", priceUsd: null, quantity: 1 },
            { id: 2, title: "Termék", quantity: 1 }
        ];
        const result = calcTotal(cart);
        expect(result).toBe(0);
    });

    test("Nagyon nagy számok", () => {
        const cart = [
            { id: 1, title: "Drága termék", priceUsd: 999999.99, quantity: 10 }
        ];
        const result = calcTotal(cart);
        expect(result).toBeCloseTo(9999999.9, 1);
    });
});

// ========== TESZT 7: Valós API válasz szimuláció ==========
describe("calcTotal - Valós API szimuláció", () => {
    test("Valósszerű bevásárlás", () => {
        const cart = [
            { id: 1, title: "Laptop", priceUsd: 799.99, quantity: 1 },
            { id: 2, title: "Egér", priceUsd: 29.99, quantity: 2 },
            { id: 3, title: "Billentyűzet", priceUsd: 89.99, quantity: 1 }
        ];
        // (799.99 * 1) + (29.99 * 2) + (89.99 * 1) = 799.99 + 59.98 + 89.99 = 949.96
        const result = calcTotal(cart);
        expect(result).toBeCloseTo(949.96, 2);
    });
});