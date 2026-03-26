import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageMotion, RevealSection, StaggerGroup } from "@/components/ui/page-motion";
import api from "@/lib/api";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  PlusCircle,
  Trash2,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const categories = [
  "Friends",
  "Food",
  "Entertainment",
  "Grocery",
  "Others",
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [expenseForm, setExpenseForm] = useState({
    to: "",
    amount: "",
    category: "Food",
  });
  const [depositAmount, setDepositAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    try {
      const response = await api.get(
        "/user/getUser",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBalance(response.data.user.balance || 0);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get(
        "/transaction/getTransaction",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchTransactions();
  }, []);

  const totalSpent = useMemo(
    () =>
      transactions.reduce(
        (acc, transaction) => acc + Math.abs(transaction.amount || 0),
        0
      ),
    [transactions]
  );

  const orderedTransactions = useMemo(
    () =>
      transactions
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions]
  );

  const latestExpense = orderedTransactions[0];
  const handleExpenseChange = (field, value) => {
    setExpenseForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmittingExpense(true);

    try {
      const response = await api.post(
        "/transaction/send",
        {
          to: expenseForm.to,
          amount: Number(expenseForm.amount),
          category: expenseForm.category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setBalance(response.data.balance);
      setExpenseForm({
        to: "",
        amount: "",
        category: "Food",
      });
      fetchTransactions();
    } catch (error) {
      const message =
        error.response?.data?.message || "Could not create the transaction.";
      setErrorMessage(message);
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmittingDeposit(true);

    try {
      const response = await api.put(
        "/transaction/deposit",
        {
          depositAmount: Number(depositAmount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setBalance(response.data.balance);
      setDepositAmount("");
    } catch (error) {
      const message =
        error.response?.data?.message || "Could not deposit the amount.";
      setErrorMessage(message);
    } finally {
      setIsSubmittingDeposit(false);
    }
  };

  const handleDelete = async (transactionId) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await api.delete(
        `/transaction/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setBalance(response.data.balance);
      fetchTransactions();
    } catch (error) {
      const message =
        error.response?.data?.message || "Could not delete the transaction.";
      setErrorMessage(message);
    }
  };

  return (
    <PageMotion>
      <StaggerGroup className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 lg:px-6">
        <RevealSection className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-slate-950 px-6 py-7 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
                Transactions
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                Log spending, add cash, and keep your ledger clean.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                This is the operational core of the app. Add expenses, deposit
                money, and remove mistakes without leaving the dashboard flow.
              </p>
            </div>

          <div className="surface-hover-dark rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
                Current balance
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {formatCurrency(balance)}
              </p>
              <p className="mt-1 text-sm text-slate-400">Live user wallet value</p>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="surface-hover rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                Balance
              </p>
              <Wallet size={18} className="text-emerald-600" />
            </div>
            <p className="mt-4 text-3xl font-semibold text-slate-950">
              {formatCurrency(balance)}
            </p>
            <p className="mt-2 text-sm text-slate-500">Available after tracked moves</p>
          </div>

          <div className="surface-hover rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-700">
                Total spent
              </p>
              <ArrowUpRight size={18} className="text-rose-600" />
            </div>
            <p className="mt-4 text-3xl font-semibold text-slate-950">
              {formatCurrency(totalSpent)}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Across {transactions.length} transaction entries
            </p>
          </div>

          <div className="surface-hover rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
                Latest expense
              </p>
              <ArrowDownLeft size={18} className="text-sky-600" />
            </div>
            <p className="mt-4 text-2xl font-semibold text-slate-950">
              {latestExpense ? latestExpense.to : "No entries yet"}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {latestExpense
                ? formatCurrency(Math.abs(latestExpense.amount))
                : "Start by adding your first transaction"}
            </p>
          </div>
        </RevealSection>

        {(errorMessage || successMessage) && (
          <RevealSection
            className={`rounded-[1.25rem] border px-4 py-3 text-sm ${
              errorMessage
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {errorMessage || successMessage}
          </RevealSection>
        )}

        <RevealSection className="grid gap-6 xl:items-start xl:grid-cols-[0.88fr_1.12fr]">
          <div className="grid gap-6 xl:self-start">
            <div className="surface-hover rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-rose-50 p-3 text-rose-600">
                  <PlusCircle size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-700">
                    Add Expense
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    Create a transaction
                  </h2>
                </div>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleExpenseSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="to">Paid To</Label>
                  <Input
                    id="to"
                    value={expenseForm.to}
                    onChange={(e) => handleExpenseChange("to", e.target.value)}
                    placeholder="Uber, Grocer, Friend"
                    className="rounded-xl border-slate-200 bg-slate-50"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={expenseForm.amount}
                      onChange={(e) =>
                        handleExpenseChange("amount", e.target.value)
                      }
                      placeholder="500"
                      className="rounded-xl border-slate-200 bg-slate-50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={expenseForm.category}
                      onChange={(e) =>
                        handleExpenseChange("category", e.target.value)
                      }
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl bg-rose-600 text-white hover:bg-rose-500"
                  disabled={isSubmittingExpense}
                >
                  {isSubmittingExpense ? "Saving..." : "Add Expense"}
                </Button>
              </form>
            </div>

            <div className="surface-hover rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                  <Landmark size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                    Deposit
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    Add money to balance
                  </h2>
                </div>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleDepositSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="depositAmount">Deposit Amount</Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="2000"
                    className="rounded-xl border-slate-200 bg-slate-50"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
                  disabled={isSubmittingDeposit}
                >
                  {isSubmittingDeposit ? "Depositing..." : "Add Deposit"}
                </Button>
              </form>
            </div>
          </div>

          <div className="surface-hover xl:self-start max-h-[40rem] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
                  Ledger
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  Recent transactions
                </h2>
              </div>
              <p className="text-sm text-slate-500">{transactions.length} items</p>
            </div>

            <div
              className="mt-5 max-h-[28rem] space-y-3 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {orderedTransactions.length ? (
                orderedTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="surface-hover-subtle rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {transaction.to}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {transaction.category} · {formatDate(transaction.date)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-rose-600">
                          {formatCurrency(Math.abs(transaction.amount))}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDelete(transaction._id)}
                          className="mt-2 inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-rose-600"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                  No transactions yet. Add an expense or deposit to begin.
                </div>
              )}
            </div>
          </div>
        </RevealSection>
      </StaggerGroup>
    </PageMotion>
  );
};

export default Transactions;
