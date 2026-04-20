export async function getProducts() {
  const response = await fetch('https://dummyjson.com/products');
  if (!response.ok) {
    throw new Error('Nem sikerült betölteni a termékeket.');
  }

  const data = await response.json();
  return Array.isArray(data.products) ? data.products : [];
}