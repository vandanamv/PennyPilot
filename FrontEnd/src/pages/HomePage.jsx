import { AddGoalUI } from "@/components/AddGoalUi";
import CombinedRhythmChart from "@/components/charts/CombinedRhythmChart";
import BasicGauges from "@/components/charts/Glory";
import { chartPalette, chartSurfaceClassName } from "@/components/charts/chartTheme";
import {
  PageMotion,
  RevealSection,
  StaggerGroup,
} from "@/components/ui/page-motion";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { ArrowUpRight, ShieldCheck, Sparkles, Target, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function calculateAverage(valuesArray) {
  if (valuesArray.length === 0) return 0;
  const sum = valuesArray.reduce((acc, curr) => acc + parseFloat(curr), 0);
  return parseInt(sum / valuesArray.length);
}

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
  });

const cardHoverClass =
  "transition-[box-shadow,border-color,background-color] duration-200 hover:border-slate-300 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]";

const subtleHoverClass =
  "transition-[box-shadow,border-color,background-color] duration-200 hover:border-slate-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]";

const HomePage = () => {
  const [totalSpent, setTotalSpent] = useState(0);
  const [transactionData, setTransactionData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [max, setMax] = useState(0);
  const [priorityData, setPriorityData] = useState(null);
  const [budgetSummary, setBudgetSummary] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get(
          "/transaction/getTransaction",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const transactions = response.data.transactions;
        const total = transactions.reduce(
          (acc, transaction) => acc + Math.abs(transaction.amount),
          0
        );

        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const month = date.toLocaleString("en-US", { month: "short" });
          const year = date.getFullYear();
          return `${month} ${year}`;
        };

        const formattedData = transactions.map((transaction) => ({
          category: transaction.category,
          amount: Math.abs(transaction.amount),
          date: formatDate(transaction.date),
        }));

        setTotalSpent(total);
        setAllTransactions(transactions);
        setTransactionData(formattedData);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get(
          "/user/getUser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get(
          "/goal/getgoal",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGoals(response.data.goal);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };
    fetchGoals();
  }, []);

  useEffect(() => {
    const fetchPriority = async () => {
      try {
        const response = await api.get(
          "/priority/getpriority",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setPriorityData(response.data.priority?.[0] || null);
      } catch (error) {
        console.error("Error fetching priority:", error);
      }
    };

    fetchPriority();
  }, []);

  useEffect(() => {
    const fetchBudgetSummary = async () => {
      try {
        const response = await api.get(
          "/budget/summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setBudgetSummary(response.data.summary || null);
      } catch (error) {
        console.error("Error fetching budget summary:", error);
      }
    };

    fetchBudgetSummary();
  }, [allTransactions.length]);

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        const dailyLimit = await api.get(
          "/priority/calculateDailyLimit",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const dailyBreakdown = dailyLimit.data.result?.daily;

        if (!dailyBreakdown || typeof dailyBreakdown !== "object") {
          setMax(0);
          localStorage.setItem("dailylimit", "0");
          return;
        }

        const valuesArray = [];

        for (const category in dailyBreakdown) {
          if (Object.prototype.hasOwnProperty.call(dailyBreakdown, category)) {
            valuesArray.push(dailyBreakdown[category]);
          }
        }

        const maxLimit = calculateAverage(valuesArray);

        setMax(maxLimit);
        Cookies.set("daily", maxLimit, {
          domain: ".localhost",
          expires: 7,
          sameSite: "None",
          secure: true,
        });
        localStorage.setItem("dailylimit", maxLimit);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDaily();
  }, [transactionData]);

  const recentTransactions = useMemo(
    () => allTransactions.slice(0, 5),
    [allTransactions]
  );

  const topCategory = useMemo(() => {
    if (!allTransactions.length) return "No data yet";

    const totals = allTransactions.reduce((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + Math.abs(transaction.amount || 0);
      return acc;
    }, {});

    return (
      Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] || "No data yet"
    );
  }, [allTransactions]);

  const categorySpendMap = useMemo(() => {
    return allTransactions.reduce((acc, transaction) => {
      const category = transaction.category || "Others";
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount || 0);
      return acc;
    }, {});
  }, [allTransactions]);

  const guardrailCards = useMemo(() => {
    if (!priorityData) return [];

    return ["Friends", "Food", "Entertainment", "Grocery", "Others"]
      .filter((category) => priorityData[category])
      .map((category) => {
        const allowed = Number(priorityData[category].allowed || 0);
        const spent = Number(categorySpendMap[category] || 0);
        const usage = allowed > 0 ? Math.min(100, Math.round((spent / allowed) * 100)) : 0;
        const remaining = Math.max(allowed - spent, 0);
        const tone =
          usage >= 90
            ? {
                chip: "border-rose-200 bg-rose-50 text-rose-700",
                bar: chartPalette.rose,
                panel: "border-rose-200/80 bg-[linear-gradient(180deg,#fff1f2_0%,#ffffff_100%)]",
              }
            : usage >= 75
            ? {
                chip: "border-amber-200 bg-amber-50 text-amber-700",
                bar: chartPalette.amber,
                panel: "border-amber-200/80 bg-[linear-gradient(180deg,#fffbeb_0%,#ffffff_100%)]",
              }
            : {
                chip: "border-emerald-200 bg-emerald-50 text-emerald-700",
                bar: chartPalette.emerald,
                panel: "border-emerald-200/70 bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_100%)]",
              };

        return {
          category,
          allowed,
          spent,
          usage,
          remaining,
          tone,
        };
      });
  }, [priorityData, categorySpendMap]);

  const balance = userData.balance || 0;
  const displayedDailyLimit = budgetSummary?.daily?.limit > 0 ? budgetSummary.daily.limit : max;
  const dailyLimitCaption =
    budgetSummary?.daily?.limit > 0 ? "Your saved daily budget cap" : "Suggested average pace";

  const budgetAlerts = useMemo(() => {
    if (!budgetSummary) return [];

    return ["daily", "weekly", "monthly"]
      .map((key) => budgetSummary[key])
      .filter((item) => item && item.limit > 0)
      .map((item) => ({
        ...item,
        tone:
          item.alertLevel === "critical"
            ? "border-rose-200 bg-rose-50 text-rose-700"
            : item.alertLevel === "warning"
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : item.alertLevel === "watch"
            ? "border-sky-200 bg-sky-50 text-sky-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700",
      }));
  }, [budgetSummary]);

  const monthlyGaugeMax =
    budgetSummary?.monthly?.limit > 0
      ? budgetSummary.monthly.limit
      : Math.max(totalSpent, displayedDailyLimit * 30, 1);
  const monthlyGaugeValue =
    budgetSummary?.monthly?.limit > 0 ? budgetSummary.monthly.spent : totalSpent;

  const dashboardHighlights = useMemo(
    () => [
      {
        label: "Balance ready",
        value: formatCurrency(balance),
        helper: "Available to protect goals and planned spending",
        tone: "emerald",
      },
      {
        label: "Monthly usage",
        value: `${Math.round((monthlyGaugeValue / Math.max(monthlyGaugeMax, 1)) * 100)}%`,
        helper:
          budgetSummary?.monthly?.limit > 0
            ? "Share of your current monthly ceiling"
            : "Running against live spend until a limit is saved",
        tone: "sky",
      },
      {
        label: "Guardrails active",
        value: `${guardrailCards.length || 0}`,
        helper: "Priority categories currently being tracked",
        tone: "amber",
      },
    ],
    [
      balance,
      budgetSummary?.monthly?.limit,
      guardrailCards.length,
      monthlyGaugeMax,
      monthlyGaugeValue,
    ]
  );

  const rhythmWeekSpend = useMemo(
    () =>
      recentTransactions.reduce(
        (acc, transaction) => acc + Math.abs(transaction.amount || 0),
        0
      ),
    [recentTransactions]
  );

  return (
    <PageMotion>
      <StaggerGroup className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-4 lg:px-6">
      <RevealSection className="overflow-hidden rounded-[1.85rem] border border-slate-200/70 bg-[linear-gradient(135deg,#020617_0%,#0f172a_48%,#134e4a_100%)] px-5 py-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-semibold uppercase tracking-[0.28em] text-emerald-200">
                Dashboard
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-slate-200">
                Welcome back, {userData.username || "Investor"}
              </span>
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">
              Keep the month steady, visible, and goal-friendly.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This dashboard pulls your pace, category pressure, and next actions into one cleaner control surface.
            </p>
            <div className="mt-5 grid gap-2.5 md:grid-cols-3">
              {dashboardHighlights.map((item) => (
                <HeroMetric key={item.label} {...item} />
              ))}
            </div>
          </div>

          <div className="surface-hover-dark rounded-[1.55rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">
                  Daily limit
                </p>
                <p className="mt-3 text-4xl font-semibold text-white">
                  {formatCurrency(displayedDailyLimit)}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{dailyLimitCaption}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-emerald-200">
                <ShieldCheck size={18} />
              </div>
            </div>
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              <div className="surface-hover-dark rounded-[1.2rem] border border-white/10 bg-slate-950/30 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Top category</p>
                <p className="mt-2 text-lg font-semibold text-white">{topCategory}</p>
              </div>
              <div className="surface-hover-dark rounded-[1.2rem] border border-white/10 bg-slate-950/30 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Budget watch</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {budgetAlerts.find((item) => item.alertLevel === "critical")
                    ? "Critical"
                    : budgetAlerts.find((item) => item.alertLevel === "warning")
                    ? "Warning"
                    : "Stable"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
        <div className={`rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${cardHoverClass}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Total spend
            </p>
            <Wallet className="text-emerald-600" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-950">
            {formatCurrency(totalSpent)}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Based on recent logged expenses
          </p>
        </div>

        <div className={`rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${cardHoverClass}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
              Budget pulse
            </p>
            <Sparkles className="text-sky-600" size={18} />
          </div>
          <div className="mt-2 flex items-center justify-center rounded-[1.25rem] bg-slate-50 py-2">
            <BasicGauges
              spent={monthlyGaugeValue}
              valueMax={monthlyGaugeMax}
              valueFormatter={(value) =>
                `${Math.round((value / Math.max(monthlyGaugeMax, 1)) * 100)}%`
              }
            />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {budgetSummary?.monthly?.limit > 0
              ? `${formatCurrency(monthlyGaugeValue)} used from your monthly ceiling`
              : "Using current total spend until a monthly limit is set"}
          </p>
        </div>

        <div className={`rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${cardHoverClass}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
              Top category
            </p>
            <Target className="text-amber-600" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-950">
            {topCategory}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Your highest concentration of recent spending
          </p>
        </div>
      </RevealSection>

      <RevealSection className="grid gap-5 xl:items-start xl:grid-cols-[1.15fr_0.85fr]">
        <div className={`rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${cardHoverClass}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">
                Spending rhythm
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Daily pace and category pressure
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Track your day-to-day spend and category pressure in one combined view.
              </p>
            </div>
            <div className="rounded-[1rem] border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">7-day read</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatCurrency(rhythmWeekSpend)}
              </p>
            </div>
          </div>

          <div className={`mt-4 ${chartSurfaceClassName}`}>
            <CombinedRhythmChart
              transactions={allTransactions}
              budgetDataset={guardrailCards}
              dailyLimit={displayedDailyLimit}
            />
          </div>
        </div>

        <div className="grid gap-5 xl:self-start">
          <div className={`rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${cardHoverClass}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-700">
                  Recent activity
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  The latest payments shaping your current picture.
                </p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-3 text-rose-600">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="mt-3 space-y-2.5">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={`${transaction._id || transaction.to}-${index}`}
                  className={`rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 ${subtleHoverClass}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {transaction.to}
                      </p>
                      <p className="text-sm text-slate-500">
                        {transaction.category} · {formatDate(transaction.date)}
                      </p>
                    </div>
                    <p className="font-semibold text-rose-600">
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection>
        <div className={`rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${cardHoverClass}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                Budget Guardrails
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Category budgets vs actuals
              </h2>
            </div>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-5">
            {guardrailCards.length ? (
              guardrailCards.map((item) => (
                <div
                  key={item.category}
                  className={`min-w-0 rounded-[1.2rem] border px-3 py-3 ${item.tone.panel} ${subtleHoverClass}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.category}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatCurrency(item.spent)} of {formatCurrency(item.allowed)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${item.tone.chip}`}
                    >
                      {item.usage}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(item.usage, 100)}%`,
                        backgroundColor: item.tone.bar,
                      }}
                    />
                  </div>
                  <div className="mt-3 grid gap-2">
                    <div className="rounded-lg border border-white/80 bg-white/80 px-3 py-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Remaining
                      </p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">
                        {formatCurrency(item.remaining)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/80 bg-white/80 px-3 py-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Status
                      </p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">
                        {item.usage >= 90
                          ? "Needs immediate attention"
                          : item.usage >= 75
                          ? "Keep a close eye"
                          : "Tracking well"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="xl:col-span-5 rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Set your spending priorities in Profile to unlock category guardrails.
              </div>
            )}
          </div>
        </div>

      </RevealSection>

      <RevealSection className={`rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${cardHoverClass}`}>
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-700">
            Limit Alerts
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Daily, weekly, and monthly budget watch
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {budgetAlerts.length ? (
            budgetAlerts.map((item) => (
              <div
                key={item.label}
                className={`rounded-[1.25rem] border px-4 py-4 ${item.tone}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{item.label} budget</p>
                  <p className="text-sm font-semibold">{item.usage}%</p>
                </div>
                <p className="mt-2 text-sm">
                  {formatCurrency(item.spent)} spent of {formatCurrency(item.limit)}
                </p>
                <p className="mt-1 text-sm">
                  Remaining: {formatCurrency(item.remaining)}
                </p>
              </div>
            ))
          ) : (
            <div className="md:col-span-3 rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Set budget limits in Profile to activate 50%, 75%, and 90% alerts.
            </div>
          )}
        </div>
      </RevealSection>

      <RevealSection className={`rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${cardHoverClass}`}>
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Goals
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Milestones in progress
          </h2>
        </div>
        <AddGoalUI goals={goals} />
      </RevealSection>
      </StaggerGroup>
    </PageMotion>
  );
};

const HeroMetric = ({ label, value, helper, tone }) => {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-400/20 bg-emerald-400/10"
      : tone === "sky"
      ? "border-sky-400/20 bg-sky-400/10"
      : "border-amber-400/20 bg-amber-400/10";

  return (
    <div className={`surface-hover-dark rounded-[1.35rem] border px-4 py-4 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{helper}</p>
    </div>
  );
};

export default HomePage;
