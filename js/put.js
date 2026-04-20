export async function putData(url, data) {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response.json();
}

/**
 * Update a product on the API using PUT.
 * @param {number|string} id
 * @param {Object} updateFields
 * @returns {Promise<Object>} parsed JSON response
 */
export async function updateProductOnAPI(id, updateFields) {
  const url = `https://dummyjson.com/products/${id}`;
  return putData(url, updateFields);
}
export async function putData(url, data) {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response.json();
}

/**
 * Update a product on the API using PUT.
 * @param {number|string} id
 * @param {Object} updateFields
 * @returns {Promise<Object>} parsed JSON response
 */
export async function updateProductOnAPI(id, updateFields) {
  const url = `https://dummyjson.com/products/${id}`;
  return putData(url, updateFields);
}
