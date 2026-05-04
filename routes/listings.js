import express from "express"; 
import { getActiveListings, getPlatformsByItem } from "../controllers/listingController.js"; 

const router = express.Router(); 
router.get("/", getActiveListings); 
router.get("/:ItemID/platforms", getPlatformsByItem); 

export default router; 