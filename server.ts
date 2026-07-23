import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initDb, getExpenses, addExpense, deleteExpense, updateExpense } from "./db.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize the database (Firestore or local fallback JSON file)
initDb().catch((err) => {
  console.error("Failed to initialize database:", err);
});

// API Endpoints
app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await getExpenses();
    res.json(expenses);
  } catch (error) {
    console.error("Failed to get expenses:", error);
    res.status(500).json({ error: "Failed to read expenses database" });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const newExpense = await addExpense(req.body);
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Failed to add expense:", error);
    res.status(500).json({ error: "Failed to save expense" });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteExpense(id);
    res.json({ success: true, message: `Deleted expense ${id}` });
  } catch (error) {
    console.error("Failed to delete expense:", error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

// Update an expense
app.put("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateExpense(id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Failed to update expense:", error);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

// Vite Middleware for development, static assets for production
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
