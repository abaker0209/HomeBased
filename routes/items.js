import express from "express";
import {
  getListedItems,
  getUnlistedItems,
  addItem,
  sellItem
} from "../controllers/itemsController.js";

const router = express.Router();

router.get("/listed", getListedItems);
router.get("/unlisted", getUnlistedItems);
router.post("/", addItem);
router.put("/:id/sell", sellItem);

export default router;