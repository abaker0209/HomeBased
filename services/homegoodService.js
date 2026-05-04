export async function createHomegoodSpecialization(conn, itemId, homegood) {
  const result = await conn.query(
    `
    INSERT INTO homegoods (
      itemID,
      hgType,
      brand,
      yearProd,
      vintage
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      itemId,
      homegood.hgType,
      homegood.brand,
      homegood.yearProduced,
      homegood.vintage,
    ]
  );

  return result.insertId ?? itemId;
}

export async function updateHomegoodSpecialization(conn, itemId, homegood) {
  const result = await conn.query(
    `
    UPDATE homegoods
    SET
      hgType = ?,
      brand = ?,
      yearProd = ?,
      vintage = ?
    WHERE itemID = ?
    `,
    [
      homegood.hgType,
      homegood.brand,
      homegood.yearProduced,
      homegood.vintage,
      itemId,
    ]
  );

  return result;
}

export async function getHomegoodSpecializationByItemId(conn, itemId) {
  const [rows] = await conn.query(
    `
    SELECT *
    FROM homegoods
    WHERE ItemID = ?
    LIMIT 1
    `,
    [itemId]
  );

  return rows[0] ?? null;
}