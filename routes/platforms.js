import express from "express";

import {
  getPlatforms,
  addPlatform,
  updatePlatform,
} from "../controllers/platformsController.js";

const router = express.Router();

router.get("/myPlatforms", getPlatforms);
router.post("/", addPlatform);
router.put("/updatePlatform/:PlatformName", updatePlatform);

export default router;
