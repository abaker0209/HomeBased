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

export async function updateItemFromSession(conn, item) { 
  const result = await conn.query( 
    `
    UPDATE items
    SET 
      ItemDescription = ?,
      Listed = 1
    WHERE ItemID = ?
    `,
    [ 
      item.itemDescription,
      item.itemID,
    ],
  ); 

  return result; 
}
