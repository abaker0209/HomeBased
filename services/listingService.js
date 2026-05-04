export async function createListing(conn, listing) {

    const listDate = new Date().toISOString().slice(0, 10); 
    const result = await conn.query( 
        ` 
        INSERT INTO listings (ItemID, PlatformName, ListDate, Original_ListPrice, Current_ListPrice, Sold)
        VALUES (?, ?, ?, ?, ?, 0)
        `, 
        [listing.itemID, listing.platformName, listDate, listing.listPrice, listing.listPrice]
    ); 
    return result.insertId; 
}

