export async function createStore(conn, storeName, storeAddress) {
  const result = await conn.query(
    "INSERT INTO stores (StoreName, StoreAddress) VALUES (?, ?)",
    [storeName, storeAddress],
  );

  return result.insertId;
}
