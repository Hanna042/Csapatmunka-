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

 * @param {number|string} id
 * @param {Object} updateFields 
 */
export async function updateProductOnAPI(id, updateFields) {
  const url = `https://dummyjson.com/products/${id}`;
  return putData(url, updateFields);
}

