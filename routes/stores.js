import express from "express";
import {
  getStores,
  addStore,
  getStoreID,
  updateStore,
  getStoreDetails,
} from "../controllers/storesController.js";

const router = express.Router();

router.get("/myStores", getStores);
router.get("/getStoreID/:StoreName/:StoreAddress", getStoreID);
router.get("/getStoreDetails/:StoreID", getStoreDetails);
router.post("/", addStore);
router.put("/updateStore/:StoreID", updateStore);

export default router;
