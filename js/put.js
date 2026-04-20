// Sends a PUT request with JSON body and returns parsed JSON response.
export async function putData(url, data) {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  // Let caller handle non-OK responses if they want; still parse JSON.
  return response.json();
}

/**
 * Convenience helper: update a product by id using the API.
 * @param {number|string} id
 * @param {Object} updateFields
 * @returns {Promise<Object>} parsed JSON response from the API
 */
export async function updateProductOnAPI(id, updateFields) {
  const url = `https://dummyjson.com/products/${id}`;
  return putData(url, updateFields);
}
