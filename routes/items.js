import express from "express";
import {
  getListedItems,
  getUnlistedItems,
  sellItem,
  getItemDetails,
  completeListing,
} from "../controllers/itemsController.js";

const router = express.Router();

router.get("/listed", getListedItems);
router.get("/unlisted", getUnlistedItems);
router.get("/getUnlisted/:ItemID", getItemDetails);
router.put("/:ItemID/sell", sellItem);

router.post("/", completeListing); 

export default router;
