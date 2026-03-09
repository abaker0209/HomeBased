import pool from "../db/pool.js";
import { createStore } from "../services/storeService.js";
import { createItem } from "../services/itemService.js";
import { createPurchase } from "../services/purchaseService.js";

export async function getPurchases(req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM purchases");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  } finally {
    if (conn) conn.release();
  }
}

export async function createBulkPurchase(req, res) {
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const { storeName, storeAddress, items } = req.body;

    const storeID = await createStore(conn, storeName, storeAddress);

    for (const item of items) {
      const itemID = await createItem(conn, item);
      await createPurchase(conn, itemID, item, storeID);
    }

    await conn.commit();

    res.status(201).json({ message: "Bulk purchase created successfully" });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("FULL ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}
