import express from "express";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const IS_PROD = process.env.NODE_ENV === "production";

const DATA_DIR = IS_PROD ? "/tmp" : path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "expenses.json");

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
  },
  {
    id: "exp-2",
    day: 1,
    title: "札幌美居酒店 2晚住宿費",
    amount: 24000,
    currency: "JPY",
    category: "其他",
    note: "札幌市中心住宿，步行可達狸小路",
    timestamp: Date.now() - 8 * 24 * 3600 * 1000,
    createdBy: "Olivia"
  },
  {
    id: "exp-3",
    day: 2,
    title: "宗谷岬最北端紀念碑拉麵",
    amount: 1200,
    currency: "JPY",
    category: "餐飲食",
    note: "日本最北端之地的海膽拉麵",
    timestamp: Date.now() - 7 * 24 * 3600 * 1000,
    createdBy: "Olivia"
  },
  {
    id: "exp-4",
    day: 3,
    title: "禮文島 Heartland Ferry 渡輪船票",
    amount: 5800,
    currency: "JPY",
    category: "交通",
    note: "稚內往返禮文島二等甲板船票",
    timestamp: Date.now() - 6 * 24 * 3600 * 1000,
    createdBy: "Olivia"
  },
  {
    id: "exp-5",
    day: 5,
    title: "富田農場薰衣草霜淇淋",
    amount: 450,
    currency: "JPY",
    category: "餐飲",
    note: "必吃招牌薰衣草霜淇淋",
    timestamp: Date.now() - 4 * 24 * 3600 * 1000,
    createdBy: "Olivia"
  },
  {
    id: "exp-6",
    day: 7,
    title: "登別尼克斯海洋公園門票 (含企鵝遊行)",
    amount: 3800,
    currency: "JPY",
    category: "景點/門票",
    note: "看可愛企鵝散步、海豚表演",
    timestamp: Date.now() - 2 * 24 * 3600 * 1000,
    createdBy: "Olivia"
  },
  {
    id: "exp-7",
    day: 8,
    title: "函館山纜車往返乘車券",
    amount: 1800,
    currency: "JPY",
    category: "交通",
    note: "欣賞百萬夜景的纜車車票",
    timestamp: Date.now() - 1 * 24 * 3600 * 1000,
    createdBy: "Olivia"
  },
  {
    id: "exp-8",
    day: 10,
    title: "函館幸運小丑漢堡午餐",
    amount: 980,
    currency: "JPY",
    category: "餐飲",
    note: "北海道限定！中華炸雞漢堡套餐",
    timestamp: Date.now(),
    createdBy: "Olivia"
  }
];

// Ensure data directory and file exist
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
    console.error("Failed to add expense:", error);
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

const startServer = async () => {
  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
};

startServer();

export default app;
