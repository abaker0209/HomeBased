// catch server / database errors
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

// necessary imports
import express from "express";
import * as mariadb from "mariadb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import itemsRoutes from "./routes/items.js";
import dashboardRoutes from "./routes/dashboard.js";
import purchasesRoutes from "./routes/purchases.js";
import storesRoutes from "./routes/stores.js";
import platformRoutes from "./routes/platforms.js";
import listingsRouter from "./routes/listings.js"; 

// connect to express
const app = express();
app.use(express.json());

// identify API routes
app.use("/api/items", itemsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/purchases", purchasesRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api/platforms", platformRoutes);
app.use("/api/listings", listingsRouter); 

dotenv.config();

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MariaDB pool
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
