export async function createMediaSpecialization(conn, itemId, media) {
  const result = await conn.query(
    `
    INSERT INTO media (
      itemID,
      mediaType,
      publisher,
      yearPublished
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      itemId,
      media.mediaType,
      media.publisher,
      media.yearPublished,
    ]
  );

  return result.insertId ?? itemId;
}

export async function updateMediaSpecialization(conn, itemId, media) {
  const result = await conn.query(
    `
    UPDATE media
    SET
      mediaType = ?,
      publisher = ?,
      yearPublished = ?
    WHERE itemID = ?
    `,
    [
      media.mediaType,
      media.publisher,
      media.yearPublished,
      itemId,
    ]
  );

  return result;
}

export async function getMediaSpecializationByItemId(conn, itemId) {
  const [rows] = await conn.query(
    `
    SELECT *
    FROM media
    WHERE itemID = ?
    LIMIT 1
    `,
    [itemId]
  );

  return rows[0] ?? null;
}