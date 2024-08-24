import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
dotenv.config();
connectDB();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10kb" }));

// Serve static files from the 'uploads/products' directory
// app.use("/uploads/products", express.static(path.join(__dirname, "public")));
app.use(express.static("uploads/products"));
fs.readdirSync("./routes").map(async (route) => {
  const { router } = await import(`./routes/${route}`);
  app.use(`/api/${route.replace(".js", "")}`, router);
});

app.listen(process.env.PORT, () =>
  console.log(`Server Running on port ${process.env.PORT}`)
);
