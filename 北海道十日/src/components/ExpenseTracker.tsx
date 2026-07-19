import React, { useState, useEffect } from "react";
import { Expense } from "../types";
import {
  Plus,
  Trash2,
  RefreshCw,
  Wallet,
  Users,
  AlertCircle,
  PiggyBank,
  JapaneseYen,
  X,
  Edit2,
  Eye
} from "lucide-react";

interface ExpenseTrackerProps {
  currentDay: number;
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ currentDay }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State for creating a new expense
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<"交通" | "餐飲" | "景點/門票" | "購物" | "其他">("餐飲");
  const [day, setDay] = useState<number>(currentDay);
  const [note, setNote] = useState<string>("");
  const [createdBy, setCreatedBy] = useState<string>(() => {
    return localStorage.getItem("hokkaido_nickname") || "Olivia";
  });

  // Selected expense detail and edit state
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editAmount, setEditAmount] = useState<string>("");
  const [editCategory, setEditCategory] = useState<"交通" | "餐飲" | "景點/門票" | "購物" | "其他">("餐飲");
  const [editDay, setEditDay] = useState<number>(1);
  const [editNote, setEditNote] = useState<string>("");
  const [editCreatedBy, setEditCreatedBy] = useState<string>("");

  // Fetch expenses from Express API
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/expenses");
      if (!response.ok) {
        throw new Error("無法連接記帳伺服器");
      }
      const data = await response.json();
      setExpenses(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "讀取資料時發生錯誤");
    } finally {
      setLoading(false);
    }
  };

  // Sync expenses in background
  const syncExpensesSilently = async () => {
    try {
      const response = await fetch("/api/expenses");
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch {
      // Ignore background fetch errors
    }
  };

  // Poll for background cloud sync every 5 seconds
  useEffect(() => {
    fetchExpenses();

    const interval = setInterval(() => {
      syncExpensesSilently();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Update day state when currentDay changes from props
  useEffect(() => {
    setDay(currentDay);
  }, [currentDay]);

  // Persist nickname
  useEffect(() => {
    localStorage.setItem("hokkaido_nickname", createdBy);
  }, [createdBy]);

  // Add a new expense
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) {
      alert("請填寫正確的品項名稱與金額");
      return;
    }

    setSubmitting(true);
    try {
      const parsedAmount = Number(amount);

      const bodyData = {
        day: Number(day),
        title: title.trim(),
        amount: parsedAmount,
        currency: "JPY",
        category,
        note: note.trim(),
        createdBy: createdBy.trim() || "訪客",
        timestamp: Date.now()
      };

      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        throw new Error("送出記帳失敗");
      }

      const newExp = await response.json();
      setExpenses((prev) => [...prev, newExp]);

      // Reset Form
      setTitle("");
      setAmount("");
      setNote("");
      setIsOpenForm(false);
    } catch (err: any) {
      alert(err.message || "記帳失敗，請重試");
    } finally {
      setSubmitting(false);
    }
  };

  // Open the detail view overlay
  const handleOpenDetail = (exp: Expense) => {
    setSelectedExpense(exp);
    setIsEditing(false);
    setEditTitle(exp.title);
    setEditAmount(exp.amount.toString());
    // Fallback safe category cast
    setEditCategory((exp.category === "住宿" as any ? "其他" : exp.category) as any);
    setEditDay(exp.day);
    setEditNote(exp.note || "");
    setEditCreatedBy(exp.createdBy);
  };

  // Update an existing expense
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpense) return;
    if (!editTitle.trim() || !editAmount || Number(editAmount) <= 0) {
      alert("請填寫正確的品項名稱與金額");
      return;
    }

    setSubmitting(true);
    try {
      const parsedAmount = Number(editAmount);
      const bodyData = {
        day: Number(editDay),
        title: editTitle.trim(),
        amount: parsedAmount,
        currency: "JPY",
        category: editCategory,
        note: editNote.trim(),
        createdBy: editCreatedBy.trim() || "訪客"
      };

      const response = await fetch(`/api/expenses/${selectedExpense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        throw new Error("更新記帳項目失敗");
      }

      const updatedExp = await response.json();
      
      // Update local expenses list
      setExpenses((prev) =>
        prev.map((item) => (item.id === selectedExpense.id ? updatedExp : item))
      );

      // Reset state
      setSelectedExpense(updatedExp);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "更新失敗，請重試");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete an expense
  const handleDeleteExpense = async (id: string) => {
    if (!confirm("確定要刪除這筆花費紀錄嗎？")) return;

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("刪除失敗");
      }

      setExpenses((prev) => prev.filter((e) => e.id !== id));
      if (selectedExpense?.id === id) {
        setSelectedExpense(null);
      }
    } catch (err: any) {
      alert(err.message || "刪除失敗");
    }
  };

  // Filter & Stats calculations
  const [filterDay, setFilterDay] = useState<number | "all">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredExpenses = expenses.filter((e) => {
    const matchesDay = filterDay === "all" || e.day === filterDay;
    // Map existing '住宿' to '其他' silently to avoid mismatch in list filters
    const currentCategory = e.category === ("住宿" as any) ? "其他" : e.category;
    const matchesCategory = filterCategory === "all" || currentCategory === filterCategory;
    return matchesDay && matchesCategory;
  });

  // Sort: latest first
  const sortedExpenses = [...filteredExpenses].sort((a, b) => b.timestamp - a.timestamp);

  // Sum total spent in JPY
  const totalJpy = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Sum JPY spent on current day
  const todayJpy = expenses
    .filter((e) => e.day === currentDay)
    .reduce((sum, e) => sum + e.amount, 0);

  // Group by category for visual percentage list (Removes '住宿' by mapping any existing '住宿' to '其他')
  const categoryTotals = expenses.reduce((acc, e) => {
    const cat = e.category === ("住宿" as any) ? "其他" : e.category;
    acc[cat] = (acc[cat] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryColors: Record<string, string> = {
    交通: "bg-blue-500",
    餐飲: "bg-orange-500",
    "景點/門票": "bg-emerald-500",
    購物: "bg-purple-500",
    其他: "bg-stone-500"
  };

  return (
    <div className="flex flex-col gap-2.5 h-full overflow-hidden" id="expenses-section">
      {/* Overview Stats Cards - Fixed at top, ultra-slim */}
      <div className="grid grid-cols-2 gap-2.5 shrink-0">
        {/* Total Wallet Card */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white p-2.5 px-3 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-center">
          <div className="absolute right-[-10px] bottom-[-10px] text-white/5 pointer-events-none">
            <Wallet className="w-16 h-16" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-stone-400 text-[10px] font-medium leading-none">
              <JapaneseYen className="w-3 h-3" />
              <span>總支出 (JPY)</span>
            </div>
            <h3 className="text-lg font-bold font-mono tracking-tight mt-1 leading-none">
              ¥{totalJpy.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Today Spending Card */}
        <div className="bg-white border border-stone-200 p-2.5 px-3 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-center">
          <div className="absolute right-[-10px] bottom-[-10px] text-stone-100/50 pointer-events-none">
            <JapaneseYen className="w-16 h-16" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-stone-500 text-[10px] font-medium leading-none">
              <JapaneseYen className="w-3 h-3 text-rose-500" />
              <span>本日支出 (Day {currentDay})</span>
            </div>
            <h3 className="text-lg font-bold font-mono tracking-tight text-stone-900 mt-1 leading-none">
              ¥{todayJpy.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Main ledger and Form Trigger - Scrollable in the middle */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-3.5 flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-4.5 h-4.5 text-rose-600" />
            <h3 className="font-semibold text-stone-900 text-xs sm:text-sm">行程開支細目</h3>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-semibold rounded border border-emerald-100 shrink-0">
              <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>連線中</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpenForm(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-medium shadow-sm transition-colors cursor-pointer"
            id="add-expense-trigger"
          >
            <Plus className="w-3 h-3" />
            <span>記一筆花費</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <div className="flex-1">
            <select
              value={filterDay}
              onChange={(e) =>
                setFilterDay(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              className="w-full text-[11px] bg-stone-50 border border-stone-200 text-stone-700 px-2 py-1.5 rounded-lg focus:outline-none focus:border-stone-400"
            >
              <option value="all">所有天數 (Day 1 - 10)</option>
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={`opt-day-${i + 1}`} value={i + 1}>
                  第 {i + 1} 天 (8/{(16 + i).toString().padStart(2, "0")})
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full text-[11px] bg-stone-50 border border-stone-200 text-stone-700 px-2 py-1.5 rounded-lg focus:outline-none focus:border-stone-400"
            >
              <option value="all">所有類別</option>
              <option value="交通">交通</option>
              <option value="餐飲">餐飲</option>
              <option value="景點/門票">景點/門票</option>
              <option value="購物">購物</option>
              <option value="其他">其他</option>
            </select>
          </div>
        </div>

        {/* Ledger List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 animate-fade-in mb-3" id="expenses-ledger-list">
          {loading && expenses.length === 0 ? (
            <div className="py-10 text-center text-stone-400 text-xs flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>載入雲端帳本中...</span>
            </div>
          ) : sortedExpenses.length === 0 ? (
            <div className="py-12 border border-dashed border-stone-100 rounded-xl text-center text-stone-400 text-xs flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5 text-stone-300" />
              <span>在此條件下尚無花費紀錄</span>
            </div>
          ) : (
            sortedExpenses.map((exp) => {
              const displayCategory = exp.category === ("住宿" as any) ? "其他" : exp.category;
              return (
                <div
                  key={exp.id}
                  onClick={() => handleOpenDetail(exp)}
                  className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-100 hover:border-stone-300 hover:bg-stone-50/80 rounded-xl transition-all group relative cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Category bullet with visual feedback */}
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        categoryColors[displayCategory] || "bg-stone-400"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-stone-950 truncate group-hover:text-rose-600 transition-colors">
                        {exp.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] text-stone-500 mt-0.5">
                        <span className="font-semibold text-rose-600 bg-rose-50 px-1 rounded">
                          D{exp.day}
                        </span>
                        <span>•</span>
                        <span>{displayCategory}</span>
                        <span>•</span>
                        <span className="bg-stone-100 px-1.5 py-0.5 rounded-sm max-w-[65px] truncate" title={`紀錄者: ${exp.createdBy}`}>
                          {exp.createdBy}
                        </span>
                        {exp.note && (
                          <>
                            <span>•</span>
                            <span className="italic text-stone-400 truncate max-w-[100px]" title={exp.note}>
                              {exp.note}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pl-1 shrink-0">
                    <div className="text-right">
                      <p className="text-[11px] font-bold font-mono text-stone-900">
                        ¥{exp.amount.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteExpense(exp.id);
                      }}
                      className="p-1.5 hover:bg-rose-50 hover:text-rose-600 text-stone-300 rounded-lg transition-colors cursor-pointer"
                      title="刪除紀錄"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Categories Bar Chart (Moved to the bottom of the ledger) */}
        {expenses.length > 0 && (
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/60 shrink-0">
            <h4 className="text-[10px] font-bold text-stone-500 mb-1.5 font-mono uppercase tracking-wider">
              各類別開支比例
            </h4>
            <div className="flex h-1.5 rounded-full overflow-hidden bg-stone-200">
              {Object.entries(categoryColors).map(([cat, color]) => {
                const amount = categoryTotals[cat] || 0;
                if (amount === 0) return null;
                const percentage = (amount / totalJpy) * 100;
                return (
                  <div
                    key={`bar-segment-${cat}`}
                    className={`${color} h-full`}
                    style={{ width: `${percentage}%` }}
                    title={`${cat}: ${Math.round(percentage)}%`}
                  />
                );
              })}
            </div>
            {/* Legend indicators */}
            <div className="grid grid-cols-3 gap-1.5 mt-2 text-[9px] text-stone-500">
              {Object.entries(categoryColors).map(([cat, color]) => {
                const amount = categoryTotals[cat] || 0;
                if (amount === 0) return null;
                const percentage = (amount / totalJpy) * 100;
                return (
                  <div key={`legend-ind-${cat}`} className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
                    <span className="truncate">{cat}</span>
                    <span className="font-mono font-semibold ml-auto text-[9px]">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Floating Add Expense Modal Form overlay */}
      {isOpenForm && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50 animate-fade-in" id="expense-modal-backdrop">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-xl overflow-hidden animate-slide-up">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-rose-600" />
                <h3 className="font-semibold text-stone-900">新增日幣開支</h3>
              </div>
              <button
                onClick={() => setIsOpenForm(false)}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="p-5 space-y-4">
              {/* Day Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  行程天數
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <button
                      key={`form-day-${i + 1}`}
                      type="button"
                      onClick={() => setDay(i + 1)}
                      className={`py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer border ${
                        day === i + 1
                          ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                          : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      D{i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  項目名稱 *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如: 薰衣草冰淇淋 / 狸小路大國藥妝"
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-600"
                />
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  費用分類
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["交通", "餐飲", "景點/門票", "購物", "其他"] as const).map(
                    (cat) => (
                      <button
                        key={`form-cat-${cat}`}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
                          category === cat
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  金額 (日圓 ¥) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-stone-400 text-xs font-mono">¥</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="輸入日圓消費金額"
                    className="w-full text-xs pl-7 pr-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-600 font-mono"
                  />
                </div>
              </div>

              {/* Note / Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  備註說明 (選填)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="例如: 刷卡 / 與同行友人平分"
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-600"
                />
              </div>

              {/* Submitting Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenForm(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  id="submit-expense-btn"
                >
                  {submitting ? "存檔中..." : "確認新增"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Overlay / View & Edit Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50 animate-fade-in" id="expense-detail-backdrop">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-xl overflow-hidden animate-slide-up">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-rose-600" />
                <h3 className="font-semibold text-stone-900">
                  {isEditing ? "編輯開支項目" : "檢視開支明細"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedExpense(null)}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            {isEditing ? (
              // Edit Mode Form
              <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
                {/* Day Selector */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    行程天數
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <button
                        key={`edit-form-day-${i + 1}`}
                        type="button"
                        onClick={() => setEditDay(i + 1)}
                        className={`py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer border ${
                          editDay === i + 1
                            ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        D{i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    項目名稱 *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="請輸入項目名稱"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-600"
                  />
                </div>

                {/* Category Selector */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    費用分類
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["交通", "餐飲", "景點/門票", "購物", "其他"] as const).map(
                      (cat) => (
                        <button
                          key={`edit-form-cat-${cat}`}
                          type="button"
                          onClick={() => setEditCategory(cat)}
                          className={`py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
                            editCategory === cat
                              ? "bg-stone-900 text-white border-stone-900"
                              : "bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400"
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    金額 (日圓 ¥) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-stone-400 text-xs font-mono">¥</span>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      placeholder="輸入日圓消費金額"
                      className="w-full text-xs pl-7 pr-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-600 font-mono"
                    />
                  </div>
                </div>

                {/* Created By / Identity */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    記帳人姓名 *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCreatedBy}
                    onChange={(e) => setEditCreatedBy(e.target.value)}
                    placeholder="記帳者姓名"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-600"
                  />
                </div>

                {/* Note / Description */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    備註說明 (選填)
                  </label>
                  <input
                    type="text"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="備註說明"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-600"
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                  >
                    返回明細
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "存檔中..." : "儲存修改"}
                  </button>
                </div>
              </form>
            ) : (
              // View Mode Detail Sheet
              <div className="p-5 space-y-5">
                {/* Visual Header card */}
                <div className="bg-stone-50 border border-stone-100 p-4 rounded-2xl text-center space-y-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
                    categoryColors[selectedExpense.category === ("住宿" as any) ? "其他" : selectedExpense.category] || "bg-stone-500"
                  }`}>
                    {selectedExpense.category === ("住宿" as any) ? "其他" : selectedExpense.category}
                  </span>
                  <h4 className="text-base font-bold text-stone-900 mt-1">
                    {selectedExpense.title}
                  </h4>
                  <p className="text-3xl font-black text-rose-600 font-mono pt-1">
                    ¥{selectedExpense.amount.toLocaleString()}
                  </p>
                </div>

                {/* Informative Table Lists */}
                <div className="space-y-3.5 text-xs text-stone-700">
                  <div className="flex justify-between items-center border-b border-stone-50 pb-2.5">
                    <span className="font-medium text-stone-500">行程天數</span>
                    <span className="font-mono font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md text-[11px]">
                      Day {selectedExpense.day}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-stone-50 pb-2.5">
                    <span className="font-medium text-stone-500">記帳人員</span>
                    <span className="font-semibold bg-stone-100 px-2.5 py-0.5 rounded-md text-[11px] text-stone-800">
                      {selectedExpense.createdBy}
                    </span>
                  </div>
                  <div className="flex justify-between items-start border-b border-stone-50 pb-2.5">
                    <span className="font-medium text-stone-500 shrink-0">備註說明</span>
                    <span className="font-normal text-right text-stone-600 break-words max-w-[240px]">
                      {selectedExpense.note || "（無額外備註）"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-stone-500">記錄時間</span>
                    <span className="font-mono text-stone-400 text-[11px]">
                      {new Date(selectedExpense.timestamp).toLocaleString("zh-TW", {
                        hour12: false,
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>

                {/* View Actions buttons */}
                <div className="flex gap-2.5 pt-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>編輯修改</span>
                  </button>
                  <button
                    onClick={() => handleDeleteExpense(selectedExpense.id)}
                    className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>刪除項目</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Styled animation support */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @media (min-width: 640px) {
          @keyframes slideUp {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
