import pool from "../db/pool.js";
import { findOrCreateStore } from "../services/storeService.js";
import { createItem } from "../services/itemService.js";
import { createPurchase } from "../services/purchaseService.js";

// not implemented in the UI yet
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

// implemented and functioning
export async function createBulkPurchase(req, res) {
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    let { storeID, storeName, storeAddress, items } = req.body;

    console.log("Incoming purchase payload:", req.body);

    // if no item data was included, return an error
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }
    if (!storeID && (!storeName || !storeAdress)) {
      return res.status(400).json({
        error: "Must provide either storeID or storeName + storeAddress",
      });
    }
    if (!storeID) {
      storeID = await findOrCreateStore(conn, storeName, storeAddress);
    }

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
