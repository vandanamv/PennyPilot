import BasicPie from "@/components/charts/BasicPie";
import BasicGauges from "@/components/charts/Glory";
import BasicLineChart from "@/components/charts/LineChart";
import { SecondBar } from "@/components/charts/SecondBar";
import { chartSurfaceClassName } from "@/components/charts/chartTheme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { ArrowUpRight, BarChart3, ScanSearch, Sparkles, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const formattedDay = day < 10 ? `0${day}` : `${day}`;

  return formattedDay;
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const cardHoverClass =
  "transition-[box-shadow,border-color,background-color] duration-200 hover:border-slate-300 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]";

const subtleHoverClass =
  "transition-[box-shadow,border-color,background-color] duration-200 hover:border-slate-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]";

export const Analytics = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formattedData, setFormattedData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/pennypilot/transaction/getTransaction",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const fetchedTransactions = response.data.transactions;

        const normalizedData = fetchedTransactions.map((transaction) => ({
          category: transaction.category,
          amount: Math.abs(transaction.amount),
          date: formatDate(transaction.date),
        }));

        setFormattedData(normalizedData);
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const categoryOptions = useMemo(() => {
    const categories = [...new Set(transactions.map((item) => item.category))];
    return categories.filter(Boolean);
  }, [transactions]);

  const totalSpent = useMemo(
    () =>
      transactions.reduce(
        (acc, transaction) => acc + Math.abs(transaction.amount || 0),
        0
      ),
    [transactions]
  );

  const topCategory = useMemo(() => {
    if (!transactions.length) {
      return { name: "No data yet", total: 0 };
    }

    const totals = transactions.reduce((acc, transaction) => {
      const category = transaction.category || "Other";
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount || 0);
      return acc;
    }, {});

    const [name, total] =
      Object.entries(totals).sort((a, b) => b[1] - a[1])[0] || [];

    return { name, total };
  }, [transactions]);

  const averageSpend = useMemo(() => {
    if (!transactions.length) return 0;
    return Math.round(totalSpent / transactions.length);
  }, [totalSpent, transactions]);

  const filteredTransactions = useMemo(() => {
    const scopedTransactions =
      selectedCategory === "all"
        ? transactions
        : transactions.filter(
            (transaction) => transaction.category === selectedCategory
          );

    return scopedTransactions.slice(0, 6);
  }, [selectedCategory, transactions]);

  const selectedCategorySpend = useMemo(() => {
    const scopedTransactions =
      selectedCategory === "all"
        ? transactions
        : transactions.filter(
            (transaction) => transaction.category === selectedCategory
          );

    return scopedTransactions.reduce(
      (acc, transaction) => acc + Math.abs(transaction.amount || 0),
      0
    );
  }, [selectedCategory, transactions]);

  const categoryShare =
    totalSpent > 0
      ? Math.min(100, Math.round((selectedCategorySpend / totalSpent) * 100))
      : 0;

  const spendByCategory = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      const category = transaction.category || "Other";
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount || 0);
      return acc;
    }, {});
  }, [transactions]);

  const sortedCategories = useMemo(
    () => Object.entries(spendByCategory).sort((a, b) => b[1] - a[1]),
    [spendByCategory]
  );

  const leadingCategory = sortedCategories[0];
  const runnerUpCategory = sortedCategories[1];

  const averageDailySpend = useMemo(() => {
    if (!formattedData.length) return 0;

    const totals = formattedData.reduce((acc, item) => {
      acc[item.date] = (acc[item.date] || 0) + Math.abs(item.amount || 0);
      return acc;
    }, {});

    const values = Object.values(totals);
    if (!values.length) return 0;

    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  }, [formattedData]);

  const focusInsights = useMemo(() => {
    const items = [];

    if (leadingCategory) {
      items.push({
        title: "Primary spending lane",
        value: leadingCategory[0],
        helper: `${formatCurrency(leadingCategory[1])} tracked here`,
        tone: "emerald",
      });
    }

    if (runnerUpCategory) {
      items.push({
        title: "Second strongest lane",
        value: runnerUpCategory[0],
        helper: `${formatCurrency(runnerUpCategory[1])} spent`,
        tone: "sky",
      });
    }

    items.push({
      title: "Average day",
      value: formatCurrency(averageDailySpend),
      helper: "Typical daily expense pace from your logs",
      tone: "amber",
    });

    return items;
  }, [averageDailySpend, leadingCategory, runnerUpCategory]);

  const insightCards = [
    {
      label: "Total spend tracked",
      value: formatCurrency(totalSpent),
      helper: `${transactions.length} transactions recorded`,
      icon: Wallet,
      accent: "from-emerald-500/20 to-emerald-500/5",
    },
    {
      label: "Average transaction",
      value: formatCurrency(averageSpend),
      helper: "A quick read on your usual expense size",
      icon: Sparkles,
      accent: "from-sky-500/20 to-sky-500/5",
    },
    {
      label: "Top spending category",
      value: topCategory.name,
      helper: formatCurrency(topCategory.total),
      icon: BarChart3,
      accent: "from-amber-500/20 to-amber-500/5",
    },
  ];

  const analyticsHighlights = useMemo(
    () => [
      {
        label: "Focus category",
        value: selectedCategory === "all" ? topCategory.name : selectedCategory,
        helper:
          selectedCategory === "all"
            ? "Current strongest lane in your data"
            : "The category currently under inspection",
      },
      {
        label: "Category share",
        value: `${categoryShare}%`,
        helper: "Portion of spend carried by the selected lane",
      },
      {
        label: "Average day",
        value: formatCurrency(averageDailySpend),
        helper: "Typical daily pace from your current logs",
      },
    ],
    [averageDailySpend, categoryShare, selectedCategory, topCategory.name]
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_48%,#f8fafc_100%)] px-4 py-4 text-slate-900 lg:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <section className="overflow-hidden rounded-[1.85rem] border border-slate-200/70 bg-[linear-gradient(135deg,#020617_0%,#0f172a_50%,#172554_100%)] px-5 py-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 font-semibold uppercase tracking-[0.28em] text-sky-200">
                  Analytics
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-slate-200">
                  Live category intelligence
                </span>
              </div>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">
                See which categories are driving the month.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Read category concentration, compare bursts, and scan the latest entries without digging through raw logs.
              </p>
              <div className="mt-5 grid gap-2.5 md:grid-cols-3">
                {analyticsHighlights.map((item) => (
                  <AnalyticsHeroStat key={item.label} {...item} />
                ))}
              </div>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {insightCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className={`surface-hover-dark rounded-3xl border border-white/10 bg-gradient-to-br ${card.accent} p-4 backdrop-blur`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-200">{card.label}</p>
                      <Icon size={18} className="text-white/80" />
                    </div>
                    <p className="mt-5 text-2xl font-semibold text-white">
                      {card.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">{card.helper}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label="Total spend"
            value={formatCurrency(totalSpent)}
            helper="Full spend tracked across your available logs"
            tone="emerald"
            icon={<Wallet className="text-emerald-600" size={18} />}
          />
          <MetricCard
            label="Focus share"
            value={`${categoryShare}%`}
            helper="Current share captured by the selected category lens"
            tone="sky"
            icon={<BarChart3 className="text-sky-600" size={18} />}
          />
          <MetricCard
            label="Average day"
            value={formatCurrency(averageDailySpend)}
            helper="Typical day-level spend based on your current entries"
            tone="amber"
            icon={<Sparkles className="text-amber-600" size={18} />}
          />
        </section>

        <section className="grid gap-5 xl:items-start xl:grid-cols-[1.15fr_0.85fr]">
          <div className={`rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${cardHoverClass}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
                  Category Focus
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Spending bursts by category
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Filter to inspect your latest five entries in any category.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-[1.2rem] border border-slate-200 bg-slate-50 px-3 py-2">
                <ScanSearch className="text-slate-400" size={18} />
                <Select onValueChange={setSelectedCategory} defaultValue="all">
                  <SelectTrigger className="w-full border-0 bg-transparent px-0 shadow-none sm:w-48">
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className={`mt-4 ${chartSurfaceClassName}`}>
              <SecondBar
                transactions={
                  selectedCategory === "all" ? transactions : filteredTransactions
                }
                height={420}
                width={760}
                skipAnimation
              />
            </div>
          </div>

          <div className={`rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${cardHoverClass}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-700">
                  Recent Activity
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  The latest entries inside your current category lens.
                </p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-3 text-rose-600">
                <Wallet size={18} />
              </div>
            </div>

            <div className="mt-3 space-y-2.5">
              {filteredTransactions.length ? (
                filteredTransactions.map((transaction, index) => (
                  <div
                    key={`${transaction._id || transaction.to}-${index}`}
                    className={`rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 ${subtleHoverClass}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-900">
                          {transaction.to}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {transaction.category} · {new Date(transaction.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-semibold text-rose-600">
                          {formatCurrency(Math.abs(transaction.amount))}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
                          Expense
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  No transactions available for this category yet.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:items-start xl:grid-cols-[0.9fr_1.1fr]">
          <div className={`rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${cardHoverClass}`}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Portfolio Split
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Category mix
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              See how concentrated your spending is across categories.
            </p>
            <div className={`mt-3 ${chartSurfaceClassName} ${subtleHoverClass}`}>
              <BasicPie transactions={transactions} height={280} width={420} skipAnimation />
            </div>
            <div className="mt-3 grid gap-2.5 md:grid-cols-2 xl:grid-cols-1">
              {focusInsights.map((item) => (
                <InsightCard
                  key={item.title}
                  title={item.title}
                  value={item.value}
                  helper={item.helper}
                  tone={item.tone}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className={`rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${cardHoverClass}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">
                    Focus Meter
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    {selectedCategory === "all"
                      ? "All spending share"
                      : `${selectedCategory} share`}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatCurrency(selectedCategorySpend)} of {formatCurrency(totalSpent)}
                  </p>
                </div>
                <ArrowUpRight className="text-violet-500" size={22} />
              </div>
              <div className={`mt-3 rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-3 ${subtleHoverClass}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Focus intensity
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {categoryShare >= 45
                        ? "One category is dominating the picture."
                        : categoryShare >= 25
                        ? "This category is meaningful but not overwhelming."
                        : "Your spend is still fairly distributed."}
                    </p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-violet-700">
                    {categoryShare}%
                  </div>
                </div>
              </div>
              <div className={`mt-2 flex items-center justify-center py-1 ${chartSurfaceClassName} ${subtleHoverClass}`}>
                <BasicGauges
                  spent={categoryShare}
                  valueMax={100}
                  valueFormatter={(value) => `${Math.round(value || 0)}%`}
                  skipAnimation
                  maxSize={172}
                />
              </div>
            </div>

            <div className={`rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${cardHoverClass}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
                Momentum
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Daily spending rhythm
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                A day-by-day trend line to spot bursts and calmer periods.
              </p>
              <div className={`mt-3 ${chartSurfaceClassName}`}>
                <BasicLineChart
                  spendingData={formattedData}
                  skipAnimation
                  height={240}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const InsightCard = ({ title, value, helper, tone }) => {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "sky"
      ? "border-sky-200 bg-sky-50 text-sky-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <div className={`surface-hover-subtle rounded-[1.35rem] border px-4 py-4 ${toneClass}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-4 text-xl font-semibold">{value}</p>
      <p className="mt-2 text-sm opacity-80">{helper}</p>
    </div>
  );
};

const AnalyticsHeroStat = ({ label, value, helper }) => (
  <div className="surface-hover-dark rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-4">
    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">{label}</p>
    <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    <p className="mt-2 text-sm leading-6 text-slate-300">{helper}</p>
  </div>
);

const MetricCard = ({ label, value, helper, tone, icon }) => {
  const toneClass =
    tone === "emerald"
      ? ""
      : tone === "sky"
      ? ""
      : "";

  return (
    <div className={`rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${toneClass} ${cardHoverClass}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-700">{label}</p>
        {icon}
      </div>
      <p className="mt-4 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </div>
  );
};



