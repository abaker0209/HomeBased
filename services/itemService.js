export async function createItem(conn, item) {
  const result = await conn.query(
    `
    INSERT INTO items (ItemName, Color, ItemCondition, Listed, Sold)
    VALUES (?, ?, ?, 0, 0)
    `,
    [item.itemName, item.color, item.condition],
  );

  return result.insertId;
}
