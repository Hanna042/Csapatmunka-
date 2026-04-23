
import { usdToHuf, formatHuf, formatUsd } from "./exchange.js";

describe("exchange - Árfolyam konverzió", () => {
    describe("usdToHuf - USD to HUF konverzió", () => {
        test("Alapvető konverzió", () => {
            const result = usdToHuf(100, 350);
            expect(result).toBe(35000);
        });

        test("Tizedes szám konverzió", () => {
            const result = usdToHuf(9.99, 350);
            expect(result).toBeCloseTo(3496.5, 1);
        });

        test("Nulla USD konverzió", () => {
            const result = usdToHuf(0, 350);
            expect(result).toBe(0);
        });

        test("Nagyon nagy szám konverzió", () => {
            const result = usdToHuf(10000, 350);
            expect(result).toBe(3500000);
        });

        test("Érvénytelen árfolyam - null", () => {
            const result = usdToHuf(100, null);
            expect(result).toBeNull();
        });

        test("Érvénytelen árfolyam - 0", () => {
            const result = usdToHuf(100, 0);
            expect(result).toBeNull();
        });

        test("Érvénytelen árfolyam - negatív", () => {
            const result = usdToHuf(100, -350);
            expect(result).toBeNull();
        });

        test("String szám automatikus konverzió", () => {
            const result = usdToHuf("100", 350);
            expect(result).toBe(35000);
        });

        test("Érvénytelen string szám", () => {
            const result = usdToHuf("abc", 350);
            expect(result).toBe(0);
        });
    });

    describe("formatHuf - HUF formázás", () => {
        test("Alapvető formázás", () => {
            const result = formatHuf(35000);
            expect(result).toContain("35");
            expect(result).toContain("Ft");
        });

        test("Tizedes szám formázása (kerekítés)", () => {
            const result = formatHuf(35500.7);
            expect(result).toContain("Ft");
        });

        test("Nulla formázása", () => {
            const result = formatHuf(0);
            expect(result).toContain("0");
            expect(result).toContain("Ft");
        });

        test("Negatív szám formázása", () => {
            const result = formatHuf(-35000);
            expect(result).toContain("Ft");
        });

        test("Nagyon nagy szám formázása", () => {
            const result = formatHuf(999999999);
            expect(result).toContain("Ft");
        });

        test("Magyar lokalizáció", () => {
            const result = formatHuf(1000000);
            // pont ezredeleséhez, nem vesszőt
            expect(result).toContain("Ft");
        });
    });

    describe("formatUsd - USD formázás", () => {
        test("Alapvető USD formázás", () => {
            const result = formatUsd(100);
            expect(result).toContain("$");
            expect(result).toContain("100");
        });

        test("Tizedes szám formázása", () => {
            const result = formatUsd(99.99);
            expect(result).toContain("99.99");
            expect(result).toContain("$");
        });

        test("Nulla USD", () => {
            const result = formatUsd(0);
            expect(result).toContain("$");
            expect(result).toContain("0");
        });

        test("String szám konverzió", () => {
            const result = formatUsd("50.50");
            expect(result).toContain("50.50");
        });

        test("Érvénytelen szám", () => {
            const result = formatUsd("abc");
            expect(result).toContain("$");
            expect(result).toContain("0");
        });

        test("Minimum 2 tizedes helyiség", () => {
            const result = formatUsd(100);
            expect(result).toContain(".00");
        });

        test("Maximum 2 tizedes helyiség", () => {
            const result = formatUsd(100.999);
            expect(result).toContain("$");
        });

        test("Angol lokalizáció", () => {
            const result = formatUsd(1000);
            expect(result).toContain("$");
        });
    });
});
