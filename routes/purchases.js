import express from "express";
import {
  getPurchases,
  createBulkPurchase,
} from "../controllers/purchaseController.js";

const router = express.Router();
router.get("/", getPurchases);
router.post("/", createBulkPurchase);

export default router;
