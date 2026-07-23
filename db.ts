import fs from "fs/promises";
import path from "path";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Local JSON fallback paths - using process.cwd() is safe in both ESM and CJS bundle formats
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "expenses.json");

// Default initial expenses if database is empty
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
    category: "餐飲",
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

// Determine if we should use Firebase Firestore
let isFirebaseEnabled = false;
let db: Firestore | null = null;

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (privateKey) {
  // 1. 去除首尾的多餘空白與換行
  privateKey = privateKey.trim();
  // 2. 自動過濾外層不小心包覆的單雙引號（避免 Render / Vercel 貼上金鑰時的格式解析錯誤）
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  } else if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
    privateKey = privateKey.slice(1, -1);
  }
  // 3. 將文字 "\\n" 轉義為真正的換行字元 "\n"，這是 Firebase 私鑰解析最重要的部分
  privateKey = privateKey.replace(/\\n/g, "\n").trim();
}

if (projectId && clientEmail && privateKey) {
  try {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
    db = getFirestore();
    isFirebaseEnabled = true;
    console.log("🔥 [Firebase] Successfully connected to Google Cloud Firestore database!");
  } catch (error) {
    console.error("❌ [Firebase] Failed to initialize Firebase Admin SDK:", error);
    console.log("⚠️ [Firebase] Falling back to local JSON file storage.");
  }
} else {
  console.log("ℹ [Firebase] Credentials not configured. Using local JSON file fallback.");
  console.log("💡 [Firebase] To persist data permanently on Render, set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your environment variables.");
}

// Ensure local fallback file is ready if needed
async function initLocalFallback() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultExpenses, null, 2), "utf-8");
      console.log("Initialized default expenses in local JSON database fallback.");
    }
  } catch (err) {
    console.error("Error initializing database fallback file:", err);
  }
}

// Initialize database
export async function initDb() {
  if (isFirebaseEnabled && db) {
    try {
      const snapshot = await db.collection("expenses").limit(1).get();
      if (snapshot.empty) {
        console.log("🔥 [Firebase] Firestore collection is empty. Seeding default expenses...");
        const batch = db.batch();
        defaultExpenses.forEach((exp) => {
          const docRef = db!.collection("expenses").doc(exp.id);
          batch.set(docRef, exp);
        });
        await batch.commit();
        console.log("🔥 [Firebase] Seeded default expenses successfully!");
      }
    } catch (error) {
      console.error("❌ [Firebase] Error checking/seeding Firestore collection:", error);
    }
  } else {
    await initLocalFallback();
  }
}

// Get all expenses
export async function getExpenses(): Promise<any[]> {
  if (isFirebaseEnabled && db) {
    try {
      const snapshot = await db.collection("expenses").get();
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ ...doc.data() });
      });
      return list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (error) {
      console.error("❌ [Firebase] Failed to fetch from Firestore:", error);
      await initLocalFallback();
      const data = await fs.readFile(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } else {
    try {
      const data = await fs.readFile(DATA_FILE, "utf-8");
      return JSON.parse(data);
    } catch {
      return defaultExpenses;
    }
  }
}

// Add an expense
export async function addExpense(expenseData: any): Promise<any> {
  const newExpense = {
    id: expenseData.id || "exp-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    day: Number(expenseData.day) || 1,
    title: expenseData.title || "未命名花費",
    amount: Number(expenseData.amount) || 0,
    currency: expenseData.currency || "JPY",
    category: expenseData.category || "其他",
    note: expenseData.note || "",
    timestamp: expenseData.timestamp || Date.now(),
    createdBy: expenseData.createdBy || "訪客"
  };

  if (isFirebaseEnabled && db) {
    try {
      await db.collection("expenses").doc(newExpense.id).set(newExpense);
      return newExpense;
    } catch (error) {
      console.error("❌ [Firebase] Failed to save to Firestore:", error);
    }
  }

  await initLocalFallback();
  const data = await fs.readFile(DATA_FILE, "utf-8");
  const expenses = JSON.parse(data);
  expenses.push(newExpense);
  await fs.writeFile(DATA_FILE, JSON.stringify(expenses, null, 2), "utf-8");
  return newExpense;
}

// Delete an expense
export async function deleteExpense(id: string): Promise<boolean> {
  if (isFirebaseEnabled && db) {
    try {
      await db.collection("expenses").doc(id).delete();
      return true;
    } catch (error) {
      console.error("❌ [Firebase] Failed to delete from Firestore:", error);
    }
  }

  await initLocalFallback();
  const data = await fs.readFile(DATA_FILE, "utf-8");
  const expenses = JSON.parse(data);
  const updatedExpenses = expenses.filter((e: any) => e.id !== id);
  await fs.writeFile(DATA_FILE, JSON.stringify(updatedExpenses, null, 2), "utf-8");
  return true;
}

// Update an expense
export async function updateExpense(id: string, updates: any): Promise<any> {
  if (isFirebaseEnabled && db) {
    try {
      const docRef = db.collection("expenses").doc(id);
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error("Expense not found");
      }
      const current = doc.data() || {};
      const updated = {
        ...current,
        day: updates.day !== undefined ? Number(updates.day) : current.day,
        title: updates.title !== undefined ? updates.title : current.title,
        amount: updates.amount !== undefined ? Number(updates.amount) : current.amount,
        currency: updates.currency !== undefined ? updates.currency : current.currency,
        category: updates.category !== undefined ? updates.category : current.category,
        note: updates.note !== undefined ? updates.note : current.note,
        createdBy: updates.createdBy !== undefined ? updates.createdBy : current.createdBy
      };
      await docRef.set(updated);
      return updated;
    } catch (error) {
      console.error("❌ [Firebase] Failed to update in Firestore:", error);
    }
  }

  await initLocalFallback();
  const data = await fs.readFile(DATA_FILE, "utf-8");
  const expenses = JSON.parse(data);
  const index = expenses.findIndex((e: any) => e.id === id);
  if (index === -1) {
    throw new Error("Expense not found");
  }
  expenses[index] = {
    ...expenses[index],
    day: updates.day !== undefined ? Number(updates.day) : expenses[index].day,
    title: updates.title !== undefined ? updates.title : expenses[index].title,
    amount: updates.amount !== undefined ? Number(updates.amount) : expenses[index].amount,
    currency: updates.currency !== undefined ? updates.currency : expenses[index].currency,
    category: updates.category !== undefined ? updates.category : expenses[index].category,
    note: updates.note !== undefined ? updates.note : expenses[index].note,
    createdBy: updates.createdBy !== undefined ? updates.createdBy : expenses[index].createdBy
  };
  await fs.writeFile(DATA_FILE, JSON.stringify(expenses, null, 2), "utf-8");
  return expenses[index];
}
