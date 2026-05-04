import pool from "../db/pool.js"; 
import { createListing } from "../services/listingService.js"; 


export async function getActiveListings(req, res) { 
    let conn; 
    try { 
        conn = await pool.getConnection(); 
        var rows = await conn.query("SELECT * FROM listings WHERE Sold = 0"); 
        const jsonString = JSON.stringify(rows, (key, value) => { 
            if (typeof value === "bigint") { 
                return Number(value); 
            }
            return value; 
        }); 
        res.json(JSON.parse(jsonString)); 
    } catch (err) { 
        return res.status(500).json({error: err.message}); 
    } finally { 
        if (conn) conn.release();
    }
}

export async function getPlatformsByItem(req, res) {
  let conn;
  try {
    const { ItemID } = req.params;
    conn = await pool.getConnection();

    const [rows] = await conn.query(
      `
      SELECT PlatformName
      FROM listings
      WHERE ItemID = ? AND Sold = 0
      `,
      [ItemID]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching platforms:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}