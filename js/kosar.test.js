import { getProducts } from "./get.js";

test("getProducts visszaad egy tömböt", async () => {
  const products = await getProducts();
  expect(Array.isArray(products)).toBe(true);
});