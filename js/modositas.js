import { updateProductOnAPI } from "./put.js";
import { getProducts } from "./get.js";
import { formatHuf, getUsdToHufRate, usdToHuf } from "./exchange.js";

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function showError(msg) {
  const box = document.getElementById('uzenet');
  if (!box) return;
  box.classList.remove('d-none');
  box.textContent = msg;
}

async function fetchProduct(id) {
  const resp = await fetch(`https://dummyjson.com/products/${id}`);
  if (!resp.ok) throw new Error('Nem található a termék');
  return resp.json();
}

async function init() {
  const id = getQueryParam('id');
  const usdHufRate = await getUsdToHufRate();

  const editCard = document.getElementById('edit-card');
  const productListContainer = document.getElementById('product-list');

  
  if (!id) {
    if (editCard) editCard.classList.add('d-none');
    try {
      const products = await getProducts();
      if (!productListContainer) return;
      productListContainer.innerHTML = products.map(p => `
        <div class="col-12 col-sm-6 col-lg-4">
          <div class="card shadow-sm">
            <img src="${p.thumbnail}" class="card-img-top" alt="${p.title}">
            <div class="card-body">
              <h5 class="card-title">${p.title}</h5>
              <p class="card-text text-muted small">${p.description}</p>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <div>${Number.isFinite(usdHufRate) ? `
                  <strong>${formatHuf(usdToHuf(p.price, usdHufRate))}</strong>
                  <div class="small text-muted">(${p.price} USD)</div>
                ` : ""}</div>
                <a class="btn btn-sm btn-outline-primary" href="modositas.html?id=${p.id}">Szerkeszt</a>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.error(err);
      showError('Hiba a terméklista betöltésekor.');
    }
    return;
  }

  
  let product;
  try {
    product = await fetchProduct(id);
  } catch (err) {
    console.error(err);
    showError('Hiba a termék betöltésekor.');
    return;
  }

  if (productListContainer) productListContainer.classList.add('d-none');

  const titleEl = document.getElementById('prod-title');
  const priceInput = document.getElementById('price-input');
  const priceHufPreview = document.getElementById('price-huf-preview');
  const okBtn = document.getElementById('ok-btn');
  const cancelBtn = document.getElementById('cancel-btn');

  if (titleEl) titleEl.textContent = product.title ?? '';
  if (priceInput) priceInput.value = product.price ?? '';
  if (priceHufPreview && Number.isFinite(usdHufRate)) {
    priceHufPreview.textContent = `Jelenlegi átváltott ár: ${formatHuf(usdToHuf(product.price ?? 0, usdHufRate))}`;
  } else if (priceHufPreview) {
    priceHufPreview.textContent = '';
  }

  priceInput?.addEventListener('input', () => {
    if (!Number.isFinite(usdHufRate)) {
      if (priceHufPreview) priceHufPreview.textContent = '';
      return;
    }

    const priceUsd = Number(priceInput.value) || 0;
    if (priceHufPreview) {
      priceHufPreview.textContent = `Átváltott ár: ${formatHuf(usdToHuf(priceUsd, usdHufRate))}`;
    }
  });

  cancelBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'index.html';
  });

  okBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    const rawVal = priceInput.value;
    const newPrice = parseFloat(rawVal);
    if (Number.isNaN(newPrice) || newPrice < 0) {
      alert('Kérlek érvényes, 0-nál nagyobb számot adj meg.');
      return;
    }

    try {
      await updateProductOnAPI(id, { price: newPrice });

      try {
        const rawOv = localStorage.getItem('priceOverrides');
        const overrides = rawOv ? JSON.parse(rawOv) : {};
        overrides[id] = newPrice;
        localStorage.setItem('priceOverrides', JSON.stringify(overrides));
      } catch (err) {
        console.warn('Nem sikerült elmenteni a helyi felülírást:', err);
      }

      window.location.href = 'index.html';
    } catch (err) {
      console.error('Update failed', err);
      alert('Hiba történt a módosítás során. Ellenőrizd a konzolt.');
    }
  });
}

init();
