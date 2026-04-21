# Jest Teszt Napló

## Projekt: Mini Webáruház
## Dátum: 2026.04.21
## Tesztelt függvény: `calcTotal()`

---

## 📋 Teszt Összefoglalás

| Teszt Suite | Tesztek száma | Állapot |
|------------|--------------|--------|
| calcTotal - Üres kosár | 1 | ✅ PASS |
| calcTotal - Egyetlen termék | 2 | ✅ PASS |
| calcTotal - Több termék | 1 | ✅ PASS |
| calcTotal - Tizedes számok | 1 | ✅ PASS |
| calcTotal - Fallback ár mezők | 2 | ✅ PASS |
| calcTotal - Edge cases | 4 | ✅ PASS |
| calcTotal - Valós API szimuláció | 1 | ✅ PASS |
| **ÖSSZESEN** | **12** | **✅ PASS** |

---

## 🧪 Részletes Teszt Specifikációk

### 1. Üres Kosár
**Cél:** Üres kosár esetén az összeg 0 legyen.
```javascript
const emptyCart = [];
expect(calcTotal(emptyCart)).toBe(0);
```
**Eredmény:** ✅ PASS

---

### 2. Egyetlen Termék
#### 2.1 Egységes Mennyiség
**Cél:** Egyetlen termék helyes árral.
```javascript
const cart = [{ id: 1, title: "Termék A", priceUsd: 10, quantity: 1 }];
expect(calcTotal(cart)).toBe(10);
```
**Eredmény:** ✅ PASS

#### 2.2 Több Mennyiség
**Cél:** Egy termék több mennyiséggel helyesen szorzódik.
```javascript
const cart = [{ id: 1, title: "Termék A", priceUsd: 10, quantity: 5 }];
expect(calcTotal(cart)).toBe(50);
```
**Eredmény:** ✅ PASS

---

### 3. Több Termék
**Cél:** Több termék összege helyes.
```javascript
const cart = [
  { id: 1, title: "Termék A", priceUsd: 10, quantity: 2 },
  { id: 2, title: "Termék B", priceUsd: 20, quantity: 1 },
  { id: 3, title: "Termék C", priceUsd: 5, quantity: 4 }
];
// Várható: (10*2) + (20*1) + (5*4) = 20 + 20 + 20 = 60
expect(calcTotal(cart)).toBe(60);
```
**Eredmény:** ✅ PASS

---

### 4. Tizedes Számok (Valós API Válasz)
**Cél:** Tizedes árakat helyesen kezel.
```javascript
const cart = [
  { id: 1, title: "Termék A", priceUsd: 9.99, quantity: 2 },
  { id: 2, title: "Termék B", priceUsd: 15.50, quantity: 1 }
];
// Várható: (9.99*2) + (15.50*1) = 19.98 + 15.50 = 35.48
expect(calcTotal(cart)).toBeCloseTo(35.48, 2);
```
**Eredmény:** ✅ PASS

---

### 5. Fallback Ár Mezők

#### 5.1 Price Mező Fallback
**Cél:** Ha nincs `priceUsd`, a `price` mező használódik.
```javascript
const cart = [{ id: 1, title: "Termék A", price: 100, quantity: 1 }];
expect(calcTotal(cart)).toBe(100);
```
**Eredmény:** ✅ PASS

#### 5.2 priceUsd Prioritás
**Cél:** Ha mindkét mező van, `priceUsd` prioritást kap.
```javascript
const cart = [{ id: 1, title: "Termék A", priceUsd: 50, price: 100, quantity: 2 }];
// Várható: 50 * 2 = 100 (nem 100 * 2)
expect(calcTotal(cart)).toBe(100);
```
**Eredmény:** ✅ PASS

---

### 6. Edge Cases

#### 6.1 Nulla Ár
**Cél:** Ingyenes termékek kezelése.
```javascript
const cart = [{ id: 1, title: "Ingyenes", priceUsd: 0, quantity: 5 }];
expect(calcTotal(cart)).toBe(0);
```
**Eredmény:** ✅ PASS

#### 6.2 Negatív Ár
**Cél:** Negatív árakat (pl. kedvezmény) a függvény nem szűri meg.
```javascript
const cart = [{ id: 1, title: "Termék", priceUsd: -10, quantity: 1 }];
expect(calcTotal(cart)).toBe(-10);
```
**Eredmény:** ✅ PASS

#### 6.3 Hiányzó/Null Ár
**Cél:** Null vagy hiányzó ár 0-ként kezelődik.
```javascript
const cart = [
  { id: 1, title: "Termék", priceUsd: null, quantity: 1 },
  { id: 2, title: "Termék", quantity: 1 }
];
expect(calcTotal(cart)).toBe(0);
```
**Eredmény:** ✅ PASS

#### 6.4 Nagyon Nagy Számok
**Cél:** Nagy árak kezelése.
```javascript
const cart = [{ id: 1, title: "Drága", priceUsd: 999999.99, quantity: 10 }];
expect(calcTotal(cart)).toBeCloseTo(9999999.9, 1);
```
**Eredmény:** ✅ PASS

---

### 7. Valós API Szimuláció
**Cél:** Valósszerű bevásárlás forgatókönyv.
```javascript
const cart = [
  { id: 1, title: "Laptop", priceUsd: 799.99, quantity: 1 },
  { id: 2, title: "Egér", priceUsd: 29.99, quantity: 2 },
  { id: 3, title: "Billentyűzet", priceUsd: 89.99, quantity: 1 }
];
// Várható: 799.99 + (29.99*2) + 89.99 = 799.99 + 59.98 + 89.99 = 949.96
expect(calcTotal(cart)).toBeCloseTo(949.96, 2);
```
**Eredmény:** ✅ PASS

---

## 📊 Teszt Pokemék

### Fedettség (Coverage)
- **Üres adatok:** ✅ Tesztelve
- **Egyes elemek:** ✅ Tesztelve
- **Több elem:** ✅ Tesztelve
- **Tizedes számok:** ✅ Tesztelve
- **Fallback logika:** ✅ Tesztelve
- **Edge cases:** ✅ Tesztelve
- **Valós forgatókönyvek:** ✅ Tesztelve

### Futási Eredmény
```
Test Suites: 2 passed, 2 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        2.427 s
```

---

## 🎯 Konklúzió

A `calcTotal()` függvény **teljes mértékben működőképes** és megfelelően kezeli:
- ✅ Üres kosár
- ✅ Egyes és több terméket
- ✅ Tizedes számokat
- ✅ Fallback ár mezőket
- ✅ Edge case-eket (null, 0, nagy számok)
- ✅ Valós API válaszokat

A tesztek 100%-osan zöldek, a függvény produkció-ready.

---

## 📝 Tanulságok

1. **Jest konfigurálás:** Node.js modulokkal (`--experimental-vm-modules`) működik
2. **DOM-mentes tesztetek:** A böngészős kódot `typeof document !== "undefined"` checkkel kellett körülvenni
3. **Modularitás:** Az exportált függvények könnyen tesztelhetőek
4. **Floatingpoint:** A `toBeCloseTo()` matcher szükséges tizedes számoknál

