import pool from "../db/pool.js";

export async function getStores(req, res) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM stores");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    } finally {
        if (conn) conn.release();
    }
}

export async function addStore(req, res) {
    let conn;
    try {
        const { name, address } = req.body;
        conn = await pool.getConnection();
        await conn.query("INSERT INTO stores (name, address) VALUES (?, ?)", [name, address]);
        res.json({ message: "Store added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Insert failed" });
    } finally {
        if (conn) conn.release();
    }  
} 