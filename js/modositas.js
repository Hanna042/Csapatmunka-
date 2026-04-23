import { updateProductOnAPI } from "./put.js";
import { getProducts } from "./get.js";
import { getLocalProducts } from "./hozzaadas.js";
import { formatHuf, getUsdToHufRate, usdToHuf } from "./exchange.js";

export function getQueryParam(name) {
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
  const idRaw = getQueryParam('id');
  const id = idRaw && idRaw !== "null" && idRaw !== "undefined" && idRaw !== "" ? idRaw : null;

  console.log("ID:", id);

  const usdHufRate = await getUsdToHufRate();

  const editCard = document.getElementById('edit-card');
  const productListContainer = document.getElementById('product-list');

  if (!id) {
    if (editCard) editCard.classList.add('d-none');

    try {
      const apiProducts = await getProducts();
      const localProducts = getLocalProducts();

      const allProducts = [...apiProducts, ...localProducts];

      if (!productListContainer) return;

      productListContainer.innerHTML = allProducts.map((p) => `
        <div class="col-12 col-sm-6 col-lg-4">
          <div class="card shadow-sm">
            <img src="${p.thumbnail || 'https://via.placeholder.com/300'}" class="card-img-top">
            <div class="card-body">
              <h5>${p.title || p.name}</h5>
              <p class="text-muted small">${p.description || ''}</p>
              <div class="d-flex justify-content-between">
                <div>
                  ${Number.isFinite(usdHufRate) ? `
                    <strong>${formatHuf(usdToHuf(Number(p.price) || 0, usdHufRate))}</strong>
                    <div class="small text-muted">(${p.price || 0} USD)</div>
                  ` : ""}
                </div>
                <a href="modositas.html?id=${p.id}" class="btn btn-sm btn-outline-primary">
                  Szerkeszt
                </a>
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

  if (editCard) editCard.classList.remove('d-none');
  if (productListContainer) productListContainer.classList.add('d-none');

  let product;
  let isLocal = false;

  const localProducts = getLocalProducts();
  product = localProducts.find(p => String(p.id) === String(id));

  if (product) {
    isLocal = true;
  } else {
    try {
      product = await fetchProduct(id);
    } catch (err) {
      console.error(err);
      showError('Hiba a termék betöltésekor.');
      return;
    }
  }

  const titleEl = document.getElementById('prod-title');
  const priceInput = document.getElementById('price-input');
  const preview = document.getElementById('price-huf-preview');

  titleEl.textContent = product.title || product.name || '';
  priceInput.value = product.price || 0;

  if (Number.isFinite(usdHufRate)) {
    preview.textContent = formatHuf(
      usdToHuf(Number(product.price) || 0, usdHufRate)
    );
  }

  priceInput.addEventListener('input', () => {
    const val = Number(priceInput.value) || 0;

    if (Number.isFinite(usdHufRate)) {
      preview.textContent = formatHuf(usdToHuf(val, usdHufRate));
    }
  });

  document.getElementById('cancel-btn').onclick = () => {
    location.href = 'index.html';
  };

  document.getElementById('ok-btn').onclick = async () => {
    const newPrice = Number(priceInput.value);

    if (newPrice < 0 || isNaN(newPrice)) {
      alert("Rossz ár");
      return;
    }

    try {
      if (isLocal) {
        const updated = localProducts.map(p =>
          String(p.id) === String(id)
            ? { ...p, price: newPrice }
            : p
        );

        localStorage.setItem('products', JSON.stringify(updated));

      } else {
        await updateProductOnAPI(id, { price: newPrice });
      }

      location.href = 'index.html';

    } catch (err) {
      console.error(err);
      alert('Hiba mentéskor');
    }
  };
}

if (typeof document !== "undefined") {
    init();
}
