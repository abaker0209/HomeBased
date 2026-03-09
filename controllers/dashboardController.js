// controllers/dashboardController.js

import pool from "../db/pool.js";

export async function getDashboardStats(req, res) {
  let conn;

  try {
    conn = await pool.getConnection();

    // Run queries in parallel for efficiency
    const [
      totalItems,
      listedItems,
      totalValue, 
      totalprofit
    ] = await Promise.all([
      conn.query("SELECT * FROM dashboard_stats"),
   
    ]);

    res.json({
      totalItems: totalItems[0].count,
      listedItems: listedItems[0].count,
      totalListedValue: totalValue[0].total || 0,
      totalProfit: totalprofit[0].total || 0
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard data" });
  } finally {
    if (conn) conn.release();
  }
}