export async function findOrCreateStore(conn, storeName, storeAddress) {
  const [rows] = await conn.query(
    `
    SELECT StoreID 
      FROM stores
      WHERE StoreName = ? AND StoreAddress = ?
      LIMIT 1
      `,
    [storeName, storeAddress],
  );

  if (rows.length > 0) {
    return rows[0].StoreID;
  }

  const [result] = await conn.query(
    "INSERT INTO stores (StoreName, StoreAddress) VALUES (?, ?)",
    [storeName, storeAddress],
  );

  return result.insertId;
}
