import pool from "../db/pool.js";

export async function getListedItems(req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT * FROM item_summary WHERE i.listed = 1",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  } finally {
    if (conn) conn.release();
  }
}

export async function getUnlistedItems(req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT * FROM item_summary WHERE i.listed = 0",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  } finally {
    if (conn) conn.release();
  }
}

export async function addItem(req, res) {
  let conn;
  try {
    const { itemname, color, condition } = req.body;

    conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO items (ItemName, Color, ItemCondition, listed, sold) VALUES (?, ?, ?, 0, 0)",
      [itemname, color, condition],
    );

    res.json({ message: "Item added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Insert failed" });
  } finally {
    if (conn) conn.release();
  }
}

export async function sellItem(req, res) {
  let conn;
  try {
    const { id } = req.params;

    conn = await pool.getConnection();
    await conn.query("UPDATE items SET listed = false WHERE id = ?", [id]);

    res.json({ message: "Item marked as sold" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  } finally {
    if (conn) conn.release();
  }
}
