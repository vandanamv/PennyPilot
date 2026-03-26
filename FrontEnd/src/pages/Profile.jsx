import axios from "axios";
import {
  ChevronDown,
  BellRing,
  CheckCircle2,
  Mail,
  Plus,
  Trash2,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageMotion, RevealSection, StaggerGroup } from "@/components/ui/page-motion";

const categories = [
  {
    key: "Friends",
    accent: "text-rose-600",
    bg: "from-rose-500/15 to-orange-300/10",
    hint: "Trips, gifting, and social plans.",
  },
  {
    key: "Food",
    accent: "text-amber-600",
    bg: "from-amber-500/15 to-yellow-300/10",
    hint: "Meals, snacks, coffee, and delivery.",
  },
  {
    key: "Entertainment",
    accent: "text-violet-600",
    bg: "from-violet-500/15 to-fuchsia-300/10",
    hint: "Streaming, games, movies, and fun money.",
  },
  {
    key: "Grocery",
    accent: "text-emerald-600",
    bg: "from-emerald-500/15 to-lime-300/10",
    hint: "Weekly essentials and household basics.",
  },
  {
    key: "Others",
    accent: "text-sky-600",
    bg: "from-sky-500/15 to-cyan-300/10",
    hint: "Anything outside your main spending buckets.",
  },
];

const fieldBaseClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

const emptyCategoryState = { exp: "", priority: "", allowed: "" };

const priorityPresets = [
  { label: "Low", value: 25 },
  { label: "Medium", value: 50 },
  { label: "High", value: 75 },
  { label: "Critical", value: 100 },
];

const defaultProfileSettings = {
  budgetAlerts: true,
  goalReminders: true,
  highlightInsights: true,
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const getPriorityLabel = (value) => {
  const priority = Number(value || 0);

  if (priority >= 100) return "Critical";
  if (priority >= 75) return "High";
  if (priority >= 50) return "Medium";
  if (priority > 0) return "Low";
  return "Not set";
};

const Profile = () => {
  const [friendsExp, setFriendsExp] = useState("");
  const [friendsPriority, setFriendsPriority] = useState("");
  const [friendsAllowed, setFriendsAllowed] = useState("");
  const [foodExp, setFoodExp] = useState("");
  const [foodPriority, setFoodPriority] = useState("");
  const [foodAllowed, setFoodAllowed] = useState("");
  const [entertainmentExp, setEntertainmentExp] = useState("");
  const [entertainmentPriority, setEntertainmentPriority] = useState("");
  const [entertainmentAllowed, setEntertainmentAllowed] = useState("");
  const [groceryExp, setGroceryExp] = useState("");
  const [groceryPriority, setGroceryPriority] = useState("");
  const [groceryAllowed, setGroceryAllowed] = useState("");
  const [othersExp, setOthersExp] = useState("");
  const [othersPriority, setOthersPriority] = useState("");
  const [othersAllowed, setOthersAllowed] = useState("");
  const [wellnessScore, setWellnessScore] = useState(0);
  const [budgetLimits, setBudgetLimits] = useState({
    daily: "",
    weekly: "",
    monthly: "",
  });
  const [prioritySaved, setPrioritySaved] = useState(false);
  const [budgetSaved, setBudgetSaved] = useState(false);
  const [priorityError, setPriorityError] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [isSavingPriority, setIsSavingPriority] = useState(false);
  const [isSavingBudget, setIsSavingBudget] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [profileSettings, setProfileSettings] = useState(defaultProfileSettings);

  useEffect(() => {
    const storedSettings = localStorage.getItem("profile_settings");
    if (!storedSettings) return;

    try {
      setProfileSettings({
        ...defaultProfileSettings,
        ...JSON.parse(storedSettings),
      });
    } catch (error) {
      console.error("Error reading profile settings:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("profile_settings", JSON.stringify(profileSettings));
  }, [profileSettings]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/pennypilot/user/getUser",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUserProfile(response.data.user || null);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);
  useEffect(() => {
    const fetchWellnessScore = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/pennypilot/priority/wellness",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setWellnessScore(response.data.wellnessScore || 0);
      } catch (error) {
        console.error("Error fetching wellness score:", error);
      }
    };
    fetchWellnessScore();
  }, [prioritySaved]);

  useEffect(() => {
    const fetchBudgetLimits = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/pennypilot/budget",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const budget = response.data.budget || {};
        setBudgetLimits({
          daily: budget.daily || "",
          weekly: budget.weekly || "",
          monthly: budget.monthly || "",
        });
        setBudgetSaved(Boolean(budget.daily || budget.weekly || budget.monthly));
      } catch (error) {
        console.error("Error fetching budget limits:", error);
      }
    };

    fetchBudgetLimits();
  }, []);
  // Fetch data from API on component mount
  useEffect(() => {
    const fetchPriority = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:3002/pennypilot/priority/getpriority",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const existingPriority = response.data.priority[0];
        const { Friends, Food, Entertainment, Grocery, Others } =
          existingPriority || {};
        if (Friends) {
          setFriendsExp(Friends.exp);
          setFriendsPriority(Friends.priority);
          setFriendsAllowed(Friends.allowed);
        }
        if (Food) {
          setFoodExp(Food.exp);
          setFoodPriority(Food.priority);
          setFoodAllowed(Food.allowed);
        }
        if (Entertainment) {
          setEntertainmentExp(Entertainment.exp);
          setEntertainmentPriority(Entertainment.priority);
          setEntertainmentAllowed(Entertainment.allowed);
        }
        if (Grocery) {
          setGroceryExp(Grocery.exp);
          setGroceryPriority(Grocery.priority);
          setGroceryAllowed(Grocery.allowed);
        }
        if (Others) {
          setOthersExp(Others.exp);
          setOthersPriority(Others.priority);
          setOthersAllowed(Others.allowed);
        }

        const activeCategories = categories
          .filter(({ key }) => {
            const entry = existingPriority?.[key];
            return entry && (Number(entry.exp) > 0 || Number(entry.priority) > 0 || Number(entry.allowed) > 0);
          })
          .map(({ key }) => key);

        setSelectedCategories(activeCategories);

        setPrioritySaved(Boolean(existingPriority));
      } catch (error) {
        console.error("Error fetching priority:", error);
      }
    };

    fetchPriority();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSavingPriority(true);
    setPrioritySaved(false);
    setPriorityError("");

    if (!selectedCategories.length) {
      setPriorityError("Choose at least one category to configure.");
      setIsSavingPriority(false);
      return;
    }

    const formData = categories.reduce((acc, { key }) => {
      const current = budgetData[key] || emptyCategoryState;
      const isSelected = selectedCategories.includes(key);

      acc[key] = {
        exp: isSelected ? Number(current.exp || 0) : 0,
        priority: isSelected ? Number(current.priority || 0) : 0,
        allowed: isSelected ? Number(current.allowed || 0) : 0,
      };

      return acc;
    }, {});

    try {
      await axios.post(
        "http://localhost:3002/pennypilot/priority/postpriority",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      await axios.post(
        "http://localhost:3002/pennypilot/budget",
        {
          daily: Number(budgetLimits.daily || 0),
          weekly: Number(budgetLimits.weekly || 0),
          monthly: Number(budgetLimits.monthly || 0),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPrioritySaved(true);
      setBudgetSaved(true);
    } catch (error) {
      console.error("Error adding/updating priority:", error);
      setPriorityError(
        error.response?.data?.message || "We could not save your priorities right now."
      );
    } finally {
      setIsSavingPriority(false);
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    setIsSavingBudget(true);
    setBudgetSaved(false);
    setBudgetError("");

    try {
      await axios.post(
        "http://localhost:3002/pennypilot/budget",
        {
          daily: Number(budgetLimits.daily || 0),
          weekly: Number(budgetLimits.weekly || 0),
          monthly: Number(budgetLimits.monthly || 0),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setBudgetSaved(true);
    } catch (error) {
      console.error("Error saving budget limits:", error);
      setBudgetError(
        error.response?.data?.message || "We could not save your budget limits right now."
      );
    } finally {
      setIsSavingBudget(false);
    }
  };

  const budgetData = {
    Friends: {
      exp: friendsExp,
      priority: friendsPriority,
      allowed: friendsAllowed,
      setters: [setFriendsExp, setFriendsPriority, setFriendsAllowed],
    },
    Food: {
      exp: foodExp,
      priority: foodPriority,
      allowed: foodAllowed,
      setters: [setFoodExp, setFoodPriority, setFoodAllowed],
    },
    Entertainment: {
      exp: entertainmentExp,
      priority: entertainmentPriority,
      allowed: entertainmentAllowed,
      setters: [
        setEntertainmentExp,
        setEntertainmentPriority,
        setEntertainmentAllowed,
      ],
    },
    Grocery: {
      exp: groceryExp,
      priority: groceryPriority,
      allowed: groceryAllowed,
      setters: [setGroceryExp, setGroceryPriority, setGroceryAllowed],
    },
    Others: {
      exp: othersExp,
      priority: othersPriority,
      allowed: othersAllowed,
      setters: [setOthersExp, setOthersPriority, setOthersAllowed],
    },
  };

  const highlightCards = useMemo(
    () => [
      {
        label: "Wellness score",
        value: wellnessScore,
        note: "Shows how well your allowed spend aligns with your priorities.",
      },
      {
        label: "Monthly cap",
        value: formatCurrency(budgetLimits.monthly),
        note: "Your top-level limit for dashboard alerts and pacing.",
      },
      {
        label: "Priority mode",
        value: selectedCategories.length ? `${selectedCategories.length} selected` : "No categories",
        note: prioritySaved
          ? "Your category plan is saved and powering recommendations."
          : "Choose only the categories you want PennyPilot to manage.",
      },
    ],
    [budgetLimits.monthly, prioritySaved, selectedCategories.length, wellnessScore]
  );

  const accountStats = useMemo(
    () => [
      {
        label: "Monthly income",
        value: formatCurrency(userProfile?.income),
      },
      {
        label: "Current balance",
        value: formatCurrency(userProfile?.balance),
      },
      {
        label: "Fixed expenses",
        value: formatCurrency(userProfile?.fixedExpense),
      },
      {
        label: "Expected savings",
        value: formatCurrency(userProfile?.expectedSaving),
      },
    ],
    [
      userProfile?.balance,
      userProfile?.expectedSaving,
      userProfile?.fixedExpense,
      userProfile?.income,
    ]
  );

  const selectedCategoryCards = useMemo(
    () => categories.filter((category) => selectedCategories.includes(category.key)),
    [selectedCategories]
  );

  const handleBudgetLimitChange = (key, value) => {
    setBudgetSaved(false);
    setBudgetError("");
    setBudgetLimits((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const toggleCategorySelection = (key) => {
    setPrioritySaved(false);
    setPriorityError("");
    setSelectedCategories((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  const toggleProfileSetting = (key) => {
    setProfileSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const addPriorityRow = () => {
    const nextCategory = categories.find(
      ({ key }) => !selectedCategories.includes(key)
    )?.key;

    if (!nextCategory) return;

    setPrioritySaved(false);
    setPriorityError("");
    setSelectedCategories((current) => [...current, nextCategory]);
  };

  const removePriorityRow = (key) => {
    setPrioritySaved(false);
    setPriorityError("");
    setSelectedCategories((current) => current.filter((item) => item !== key));
  };

  const changeSelectedCategory = (currentKey, nextKey) => {
    if (!nextKey || currentKey === nextKey || selectedCategories.includes(nextKey)) {
      return;
    }

    setPrioritySaved(false);
    setPriorityError("");
    setSelectedCategories((current) =>
      current.map((item) => (item === currentKey ? nextKey : item))
    );
  };

  const updateCategoryField = (categoryKey, fieldIndex, value) => {
    const current = budgetData[categoryKey];
    if (!current) return;

    setPrioritySaved(false);
    setPriorityError("");
    current.setters[fieldIndex](value);
  };

  return (
    <PageMotion>
      <StaggerGroup className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 lg:px-6">
      <RevealSection className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-[linear-gradient(135deg,#020617_0%,#0f172a_50%,#14532d_120%)] px-6 py-7 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-semibold uppercase tracking-[0.3em] text-emerald-200">
                Profile
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-slate-200">
                Account, settings, and planning
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">
              Shape your money workspace around how you actually spend.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Keep your account baseline clear, switch the experience on your terms, and build guardrails only for the categories that matter to you.
            </p>
            <div className="mt-5 grid gap-2.5 md:grid-cols-3">
              {highlightCards.map((item) => (
                <div
                  key={item.label}
                  className="surface-hover-dark rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-hover-dark rounded-[1.7rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-white/10 text-white">
                <UserCircle2 size={30} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-200">
                  Workspace identity
                </p>
                <p className="mt-2 truncate text-2xl font-semibold text-white">
                  {userProfile?.username || "PennyPilot user"}
                </p>
                <p className="mt-1 truncate text-sm text-slate-300">
                  {userProfile?.mailId || "No email available"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-white/10 bg-slate-950/25 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Active categories
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {selectedCategories.length}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-slate-950/25 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Wellness score
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {wellnessScore || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="grid gap-6 xl:items-start xl:grid-cols-[1.15fr_0.85fr]">
        <form
          className="surface-hover xl:self-start rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                Spending Priorities
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Planning setup
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add a row, choose a category, pick a priority from the dropdown, and enter the amounts you want to guide.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <SlidersHorizontal size={16} />
              {prioritySaved ? "Priorities saved" : "Editing draft"}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="surface-hover-subtle rounded-[1.15rem] border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Selected categories
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {selectedCategories.length}
              </p>
            </div>
            <div className="surface-hover-subtle rounded-[1.15rem] border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Priority status
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {prioritySaved ? "Saved" : "Draft"}
              </p>
            </div>
            <div className="surface-hover-subtle rounded-[1.15rem] border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Strongest focus
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {selectedCategoryCards.length
                  ? selectedCategoryCards
                      .map((category) => ({
                        key: category.key,
                        value: Number(budgetData[category.key]?.priority || 0),
                      }))
                      .sort((a, b) => b.value - a.value)[0]?.key || "None"
                  : "None"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">
                  Priority rows
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Add only the categories you want PennyPilot to actively protect.
                </p>
              </div>
              <button
                type="button"
                onClick={addPriorityRow}
                disabled={selectedCategories.length >= categories.length}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={16} />
                Add category
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {selectedCategoryCards.map((category) => {
              const current = budgetData[category.key] || emptyCategoryState;
              const availableCategories = categories.filter(
                ({ key }) => key === category.key || !selectedCategories.includes(key)
              );

              return (
                <div
                  key={category.key}
                  className={`surface-hover rounded-[1.45rem] border border-slate-200 bg-gradient-to-br ${category.bg} p-4`}
                >
                  <div className="grid gap-3 md:grid-cols-[1.15fr_0.9fr_0.8fr_0.8fr_auto] md:items-end">
                    <label className="text-sm font-medium text-slate-600">
                      Category
                      <div className="relative mt-2">
                        <select
                          value={category.key}
                          onChange={(e) => changeSelectedCategory(category.key, e.target.value)}
                          className="w-full appearance-none rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 pr-10 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                        >
                          {availableCategories.map((option) => (
                            <option key={option.key} value={option.key}>
                              {option.key}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    </label>

                    <label className="text-sm font-medium text-slate-600">
                      Priority
                      <div className="relative mt-2">
                        <select
                          value={current.priority || ""}
                          onChange={(e) => updateCategoryField(category.key, 1, e.target.value)}
                          className="w-full appearance-none rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 pr-10 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                        >
                          <option value="">Choose priority</option>
                          {priorityPresets.map((preset) => (
                            <option key={preset.value} value={preset.value}>
                              {preset.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    </label>

                    <label className="text-sm font-medium text-slate-600">
                      Expected
                      <input
                        type="number"
                        min="0"
                        value={current.exp}
                        onChange={(e) => updateCategoryField(category.key, 0, e.target.value)}
                        className={fieldBaseClass}
                        placeholder="0"
                      />
                    </label>

                    <label className="text-sm font-medium text-slate-600">
                      Allowed
                      <input
                        type="number"
                        min="0"
                        value={current.allowed}
                        onChange={(e) => updateCategoryField(category.key, 2, e.target.value)}
                        className={fieldBaseClass}
                        placeholder="0"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => removePriorityRow(category.key)}
                      className="inline-flex h-12 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-600 transition hover:border-rose-300 hover:bg-rose-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-white/75 px-3 py-1 font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {getPriorityLabel(current.priority)}
                    </span>
                    <span className="text-slate-500">{category.hint}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {!selectedCategories.length ? (
            <div className="mt-6 rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Choose one or more categories above to start building your priority plan.
            </div>
          ) : null}

          <div className="mt-6 rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-700">
                  Limits
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Set the daily, weekly, and monthly caps that support the same plan.
                </p>
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {budgetSaved ? "Limits saved" : "Limits draft"}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="text-sm font-medium text-slate-600">
                Daily limit
                <input
                  type="number"
                  min="0"
                  value={budgetLimits.daily}
                  onChange={(e) => handleBudgetLimitChange("daily", e.target.value)}
                  className={fieldBaseClass}
                />
              </label>

              <label className="text-sm font-medium text-slate-600">
                Weekly limit
                <input
                  type="number"
                  min="0"
                  value={budgetLimits.weekly}
                  onChange={(e) => handleBudgetLimitChange("weekly", e.target.value)}
                  className={fieldBaseClass}
                />
              </label>

              <label className="text-sm font-medium text-slate-600">
                Monthly limit
                <input
                  type="number"
                  min="0"
                  value={budgetLimits.monthly}
                  onChange={(e) => handleBudgetLimitChange("monthly", e.target.value)}
                  className={fieldBaseClass}
                />
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isSavingPriority}
              className="rounded-2xl bg-emerald-600 px-6 py-3 font-medium text-white shadow-[0_14px_30px_rgba(16,185,129,0.25)] transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSavingPriority ? "Saving plan..." : "Save planning setup"}
            </button>
            {prioritySaved ? (
              <p className="inline-flex items-center gap-2 text-sm text-emerald-600">
                <CheckCircle2 size={16} />
                Planning setup saved successfully.
              </p>
            ) : null}
            {priorityError ? <p className="text-sm text-rose-600">{priorityError}</p> : null}
            {budgetError ? <p className="text-sm text-rose-600">{budgetError}</p> : null}
          </div>
        </form>

        <div className="space-y-6 xl:self-start">
          <section className="surface-hover rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  Account
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Your money profile
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Identity and baseline numbers currently driving your workspace.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                <UserCircle2 size={18} />
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-[1.35rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
                  <UserCircle2 size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-slate-950">
                    {userProfile?.username || "PennyPilot user"}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <Mail size={14} />
                    <span className="truncate">{userProfile?.mailId || "Email not available"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {accountStats.map((item) => (
                  <div
                    key={item.label}
                    className="surface-hover-subtle rounded-[1rem] border border-slate-200 bg-white px-4 py-3"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="surface-hover rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">
                  Settings
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Preferences
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tune the experience and session behavior for this account.
                </p>
              </div>
              <div className="rounded-2xl bg-violet-50 p-3 text-violet-600">
                <Settings2 size={18} />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  key: "budgetAlerts",
                  title: "Budget alerts",
                  description: "Keep budget watch and limit alert messaging enabled.",
                  icon: ShieldCheck,
                },
                {
                  key: "goalReminders",
                  title: "Goal reminders",
                  description: "Keep savings and goal-oriented reminders visible in the app.",
                  icon: BellRing,
                },
                {
                  key: "highlightInsights",
                  title: "Insight emphasis",
                  description: "Keep key summary insights prominent across the workspace.",
                  icon: Sparkles,
                },
              ].map((item) => {
                const Icon = item.icon;
                const enabled = profileSettings[item.key];

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleProfileSetting(item.key)}
                    className={`surface-hover-subtle flex w-full items-center justify-between gap-4 rounded-[1.2rem] border px-4 py-4 text-left ${
                      enabled
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-2xl bg-white p-2 text-slate-700 shadow-sm">
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {enabled ? "On" : "Off"}
                      </span>
                      <span
                        className={`relative inline-flex h-7 w-12 rounded-full transition ${
                          enabled ? "bg-emerald-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                            enabled ? "left-6" : "left-1"
                          }`}
                        />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

          </section>

          <section className="surface-hover rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">
              Guidance
            </p>
            <div className="mt-4 space-y-3">
              <div className="surface-hover-subtle rounded-[1.25rem] border border-violet-100 bg-violet-50 px-4 py-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 text-violet-600" size={18} />
                  <div>
                    <p className="font-semibold text-slate-900">Priority tip</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Use the presets to tell PennyPilot which selected categories deserve protection first.
                    </p>
                  </div>
                </div>
              </div>
              <div className="surface-hover-subtle rounded-[1.25rem] border border-emerald-100 bg-emerald-50 px-4 py-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 text-emerald-600" size={18} />
                  <div>
                    <p className="font-semibold text-slate-900">Limit strategy</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Start with a realistic monthly ceiling, then set weekly and
                      daily pacing so alerts stay useful.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </RevealSection>
      </StaggerGroup>
    </PageMotion>
  );
};

export default Profile;
