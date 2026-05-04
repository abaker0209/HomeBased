import pool from "../db/pool.js";
import { updateItemFromSession } from "../services/itemService.js";
import { createToySpecialization } from "../services/toyService.js";
import { createMediaSpecialization } from "../services/mediaService.js";
import { createHomegoodSpecialization } from "../services/homegoodService.js";
import { createListing } from "../services/listingService.js"; 

export async function getListedItems(req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    const data = await conn.query(
      "SELECT * FROM item_summary WHERE Listed = 1",
    );
    const jsonString = JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") {
        return Number(value);
      }
      return value;
    });
    res.json(JSON.parse(jsonString));
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
    var rows = await conn.query("SELECT * FROM item_summary WHERE Listed = 0");
    const jsonString = JSON.stringify(rows, (key, value) => {
      if (typeof value === "bigint") {
        return Number(value);
      }
      return value;
    });

    res.json(JSON.parse(jsonString));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
}

export async function sellItem(req, res) {
  let conn;
  try {
    const { ItemID } = req.params;

    conn = await pool.getConnection();
    await conn.query("UPDATE items SET listed = 0, Sold = 1 WHERE id = ?", [ItemID]);

    res.json({ message: "Item marked as sold" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  } finally {
    if (conn) conn.release();
  }
}

export async function getItemDetails(req, res) {
  let conn;
  console.log("Requesting params: ", req.params);
  try {
    const { ItemID } = req.params;

    conn = await pool.getConnection();

    const [rows] = await conn.query(
      "SELECT * FROM item_summary WHERE ItemID = ?",
      [ItemID],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const jsonString = JSON.stringify(rows, (key, value) => {
      if (typeof value === "bigint") {
        return Number(value);
      }
      return value;
    });

    res.json(JSON.parse(jsonString));
    console.log("Fetch successful for item details:", req.params);
  } catch (err) {
    console.error("Error fetching item details:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

export async function completeListing(req, res) {
  let conn;

  try {
    const item = req.body;

    if (!item?.itemID) {
      return res.status(400).json({ error: "Missing itemID in request body" });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    // update the existing item record with the new information 
    await updateItemFromSession(conn, item);

    // add the item to the appropriate specialization table 
    switch (item.itemType) {
      case "toy":
        await createToySpecialization(conn, item.itemID, item.specialization);
        break;
      case "media":
        await createMediaSpecialization(conn, item.itemID, item.specialization);
        break;
      case "homegoods":
        await createHomegoodSpecialization(conn, item.itemID, item.specialization);
        break;
      default:
        throw new Error(`Unknown itemType: ${item.itemType}`);
    }

    // add a listing record for each platform 
    for (const platform of item.platforms) { 
      await createListing(conn, { 
          itemID: item.itemID,
          platformName: platform,
          listDate: item.listDate,
          listPrice: item.listPrice,
      });
    }

    await conn.commit();
    res.json({ message: "Listing saved successfully", itemID: item.itemID });
  } catch (err) {
    if (conn) {
      await conn.rollback();
    }
    console.error("Error saving listing:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}