import { getProducts } from "./get.js";

export async function TermekBetoltes() {
  try {
    const products = await getProducts();

    const container = document.getElementById('Termekkartya');
    container.innerHTML = "";

    products.forEach(product => {
      const col = document.createElement('div');
      col.classList.add('col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4');

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
          
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.title}</h5>
            
            <p class="card-text">${product.description}</p>
            
            <div class="mt-auto">
              <p class="fw-bold">${product.price} $</p>
              <button class="btn btn-primary w-100">
                Kosárba
              </button>
            </div>
          </div>
        </div>
      `;

      container.appendChild(col);
    });

  } catch (error) {
    console.error("Hiba történt:", error);
  }
}

// automatikus futtatás
TermekBetoltes();