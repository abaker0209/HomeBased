export async function createToySpecialization(conn, itemId, toy) {
  const result = await conn.query(
    `
    INSERT INTO toys(
      itemID,
      toyType,
      fandom,
      manufacturer,
      yrManufactured
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      itemId,
      toy.toyType,
      toy.fandom,
      toy.manufacturer,
      toy.yearProduced,
    ]
  );

  return result.insertId ?? itemId;
}

export async function updateToySpecialization(conn, itemId, toy) {
  const result = await conn.query(
    `
    UPDATE toysf
    SET
      toyType = ?,
      Fandom = ?,
      manufacturer = ?,
      yrManufactured = ?
    WHERE itemID = ?
    `,
    [
      toy.toyType,
      toy.fandom,
      toy.manufacturer,
      toy.yearProduced,
      itemId,
    ]
  );

  return result;
}

export async function getToySpecializationByItemId(conn, itemId) {
  const [rows] = await conn.query(
    `
    SELECT *
    FROM toys
    WHERE itemID = ?
    LIMIT 1
    `,
    [itemId]
  );

  return rows[0] ?? null;
}