# Mini Webáruház Projekt

Ez a projekt egy egyszerű webáruház alkalmazás, amely API-ból tölti be a termékeket, lehetővé teszi kosár kezelését, valamint új termék létrehozását és módosítását.

---

## Használt technológiák

- HTML5  
- CSS3  
- JavaScript (ES6)  
- Bootstrap 5  
- Fetch API  
- Jest (tesztelés)  
- GitHub (verziókezelés)

---

## API

Az alkalmazás a következő API-t használja:
    https://dummyjson.com/products

Fontos: az API válasza objektum, a termékek a `products` tömbben találhatók.

---

## Projekt struktúra

```
CSAPATMUNKA-
|   .gitignore
|   hozzaadas.html
|   index.html
|   kosar.html
|   modositas.html
|   package-lock.json
|   package.json
|   README.md
|
+---css
|       hozzaadas.css
|       kosar.css
|       modositas.css
|       style.css
|
+---dokumentumok
|       AI Napló.docx
|       AI Napló.md
|       Daly_stand-up.docx
|       Daly_stand-up.md
|       Projekt naplo.docx
|       Projekt naplo.md
|       sotet.hatter.jpg
|       TELJES_TESZT_NAPLO.md
|       TESZTNAPLOF.md
|       vilagos.hatter.jpg
|
\---js
        exchange.js
        exchange.test.js
        get.js
        hozzaadas.js
        hozzaadas.test.js
        kosar.js
        kosar.test.js
        main.js
        modositas.js
        post.js
        put.js
        theme.js
        
```
        


---

## Funkciók

### 1. Termékek megjelenítése (GET)
- API hívás segítségével betölti a termékeket  
- Bootstrap kártyákban jeleníti meg:
  - kép  
  - név  
  - ár  
  - leírás  
  - „Kosárba” gomb  

---

### 2. Kosár funkció
- Termékek kosárba helyezése  
- Ugyanaz a termék többször hozzáadható  
- Megjelenítés:
  - név  
  - darabszám  
  - részösszeg  

---

### 3. Kosár végösszeg
- Külön függvény számolja ki a teljes összeget  

---

### 4. Új termék létrehozása (POST)
- Űrlap segítségével új termék felvétele  
- API POST kérés használata  

---

### 5. Termék módosítása (PUT)
- Termék árának módosítása  
- API PUT kérés használata  

---

### 6. Reszponzivitás
- Mobil: 1 kártya  
- Tablet: 2 kártya  
- Kis laptop: 3 kártya  
- Desktop: 4 kártya  

---

### 7. Tesztelés
- Jest teszt a kosár végösszeg számítására  

---

## Futtatás

 Fontos: a projekt nem fut megfelelően `file://` módban!

---
## Dokumentáció

- projekt-napló  
- AI-napló  
- önértékelés 

---

## Állapot

- A projekt jelenleg fejlesztés alatt áll
