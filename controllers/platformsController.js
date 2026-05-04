import pool from "../db/pool.js";

export async function getPlatforms(req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM platforms");

    res.json(rows); // return string values as rows
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

export async function addPlatform(req, res) {
  let conn;
  try {
    const { platformName, siteAddress } = req.body;
    conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO platforms (PlatformName, SiteAddress) VALUES (?, ?)",
      [platformName, siteAddress],
    );
    res.json({ message: "Platform added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

export async function updatePlatform(req, res) {
  let conn;
  try {
    const { platformName } = req.params;
    const { siteAddress } = req.body;
    conn = await pool.getConnection();

    await conn.query(
      "UPDATE platforms SET SiteAddress = ? WHERE PlatformName = ?",
      [siteAddress, platformName],
    );
    res.json({ message: "Platform updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error("Platform update unsuccessful.");
  } finally {
    if (conn) conn.release();
  }
}
