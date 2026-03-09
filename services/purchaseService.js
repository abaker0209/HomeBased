export async function createPurchase(conn, itemID, item, storeID) {
  await conn.query(
    `
    INSERT INTO purchases (ItemID, PurchPrice, PurchDate, StoreID)
    VALUES (?, ?, ?, ?)
    `,
    [itemID, item.purchPrice, item.purchDate, storeID],
  );
}
