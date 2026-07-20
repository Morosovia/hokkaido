import express from "express";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// 核心修正：生產環境下，新平台會自動分配 process.env.PORT 程式碼，必須優先讀取
const PORT = process.env.PORT || 3000;

app.use(express.json());

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "expenses.json");

// Default initial expenses
const defaultExpenses = [
  {
    id: "exp-1",
    day: 1,
    title: "星宇航空 JX850 機票 (TPE-CTS)",
    amount: 68000,
    currency: "JPY",
    category: "交通",
    note: "台北桃園到新千歲來回機票",
    timestamp: Date.now() - 9 * 24 * 3600 * 1000,
    createdBy: "Olivia"
  }
];

async function initDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultExpenses, null, 2), "utf-8");
      console.log("Initialized default expenses in database.");
    }
  } catch (err) {
    console.error("Error initializing database file:", err);
  }
}

initDataFile();

// API Endpoints
app.get("/api/expenses", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to read expenses database" });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const expenses = JSON.parse(data);
    const newExpense = {
      id: "exp-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      day: Number(req.body.day) || 1,
      title: req.body.title || "未命名花費",
      amount: Number(req.body.amount) || 0,
      currency: req.body.currency || "JPY",
      category: req.body.category || "其他",
      note: req.body.note || "",
      timestamp: req.body.timestamp || Date.now(),
      createdBy: req.body.createdBy || "訪客"
    };
    expenses.push(newExpense);
    await fs.writeFile(DATA_FILE, JSON.stringify(expenses, null, 2), "utf-8");
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: "Failed to save expense" });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const expenses = JSON.parse(data);
    const updatedExpenses = expenses.filter((e: any) => e.id !== id);
    await fs.writeFile(DATA_FILE, JSON.stringify(updatedExpenses, null, 2), "utf-8");
    res.json({ success: true, message: `Deleted expense ${id}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

app.put("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const expenses = JSON.parse(data);
    const index = expenses.findIndex((e: any) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Expense not found" });
    }
    expenses[index] = {
      ...expenses[index],
      day: Number(req.body.day) ?? expenses[index].day,
      title: req.body.title ?? expenses[index].title,
      amount: Number(req.body.amount) ?? expenses[index].amount,
      currency: req.body.currency ?? expenses[index].currency,
      category: req.body.category ?? expenses[index].category,
      note: req.body.note ?? expenses[index].note,
      createdBy: req.body.createdBy ?? expenses[index].createdBy
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(expenses, null, 2), "utf-8");
    res.json(expenses[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update expense" });
  }
});

// 核心修正：新平台需要 Express 在生產環境下也提供靜態網頁與接聽服務
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

  // 確保無論在本地還是雲端，程式碼都會啟動監聽監聽埠
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
