import pool from "../db/pool.js";

export async function getStores(req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    var rows = await conn.query("SELECT * FROM stores");

    const jsonString = JSON.stringify(rows, (key, value) => {
      if (typeof value === "bigint") {
        return Number(value);
      }
      return value;
    });
    res.json(JSON.parse(jsonString));
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

export async function addStore(req, res) {
  let conn;
  try {
    const { name, address } = req.body;
    conn = await pool.getConnection();
    await conn.query("INSERT INTO stores (name, address) VALUES (?, ?)", [
      name,
      address,
    ]);
    res.json({ message: "Store added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Insert failed" });
  } finally {
    if (conn) conn.release();
  }
}

export async function getStoreID(req, res) {
  let conn;
  try {
    const { StoreName, StoreAddress } = req.params;
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT StoreID FROM stores WHERE StoreName = ? AND StoreAddress = ?",
      [StoreName, StoreAddress],
    );
    res.json(rows);
    console.log("Existing store found: ", rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

export async function updateStore(req, res) {
  let conn;
  try {
    const { StoreID } = req.params;
    const { StoreName, StoreAddress } = req.body;
    conn = await pool.getConnection();
    await conn.query(
      "UPDATE stores SET StoreName = ?, StoreAddress = ? WHERE StoreID = ?",
      [StoreName, StoreAddress, StoreID],
    );
    res.json({ message: "Store updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

export async function getStoreDetails(req, res) {
  let conn;
  console.log("Requesting params: ", req.params);

  try {
    const { StoreID } = req.params;
    conn = await pool.getConnection();

    const [rows] = await conn.query(
      "SELECT * FROM stores WHERE StoreID = ?",
      [StoreID],
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Store not found" });
    }
    const jsonString = JSON.stringify(rows, (key, value) => {
      if (typeof value === "bigint") {
        return Number(value);
      }
      return value;
    });
    console.log("Fetch successful for store: ", rows[0]);
    res.json(JSON.parse(jsonString));
  } catch (err) {
    console.error("getStoreDetails error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}
