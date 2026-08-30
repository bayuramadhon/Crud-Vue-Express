import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { runMigrations } from "./db";
import productRoutes from "./routes/product.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Product CRUD API is running" });
});

app.use("/api/products", productRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Terjadi kesalahan pada server", error: err.message });
});

runMigrations();

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});