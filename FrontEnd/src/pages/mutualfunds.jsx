import PropTypes from "prop-types";
import { forwardRef } from "react";
import {
  HoverCard,
  HoverItem,
  PageMotion,
  RevealSection,
  StaggerGroup,
} from "@/components/ui/page-motion";
import { ArrowUpDown, Check, ChevronDown, Search, SlidersHorizontal, Sparkles, Target, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const FILTER_CONFIG = [
  { key: "scheme_type", label: "Scheme Type", dataKey: "Scheme Type" },
  { key: "scheme_category", label: "Scheme Category", dataKey: "Scheme Category" },
  { key: "risk_level", label: "Risk Level", dataKey: "Risk Level" },
  { key: "age_group", label: "Age Group", dataKey: "Age Group" },
  { key: "investment_duration", label: "Duration", dataKey: "Investment Duration" },
];

const EMPTY_FILTERS = {
  scheme_type: [],
  scheme_category: [],
  risk_level: [],
  age_group: [],
  investment_duration: [],
};

const PAGE_SIZE = 24;

const normalizeText = (value) => (value || "").toString().trim().toLowerCase();

const parseTags = (rawTags) =>
  (rawTags || "")
    .replace(/[\[\]']/g, "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const riskToneMap = {
  "High-Risk": "border-rose-200 bg-rose-50 text-rose-700",
  "Moderate to High": "border-amber-200 bg-amber-50 text-amber-700",
  "Moderate": "border-sky-200 bg-sky-50 text-sky-700",
  "Low-Risk": "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const sortFunds = (funds, sortBy) => {
  const sorted = [...funds];

  sorted.sort((a, b) => {
    if (sortBy === "risk") {
      return normalizeText(a["Risk Level"]).localeCompare(
        normalizeText(b["Risk Level"])
      );
    }

    if (sortBy === "duration") {
      return normalizeText(a["Investment Duration"]).localeCompare(
        normalizeText(b["Investment Duration"])
      );
    }

    if (sortBy === "category") {
      return normalizeText(a["Scheme Category"]).localeCompare(
        normalizeText(b["Scheme Category"])
      );
    }

    return normalizeText(a.AMC).localeCompare(normalizeText(b.AMC));
  });

  return sorted;
};

const MutualFunds = () => {
  const [fundsData, setFundsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState(EMPTY_FILTERS);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("amc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortMenuRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadFunds = async () => {
      try {
        const module = await import("./csvtojson.json");
        if (!isMounted) return;

        const nextFunds = Array.isArray(module.default) ? module.default : [];
        setFundsData(
          nextFunds.map((fund) => ({
            ...fund,
            _tags: parseTags(fund.Tags),
            _searchText: [
              fund.AMC,
              fund["Scheme Category"],
              fund["Scheme Type"],
              fund["Risk Level"],
              fund["Age Group"],
              fund["Investment Duration"],
              ...parseTags(fund.Tags),
            ]
              .join(" ")
              .toLowerCase(),
          }))
        );
      } catch (error) {
        console.error("Error loading fund dataset:", error);
        if (isMounted) {
          setFundsData([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFunds();

    return () => {
      isMounted = false;
    };
  }, []);

  const filterOptions = useMemo(
    () =>
      FILTER_CONFIG.reduce((acc, filter) => {
        acc[filter.key] = Array.from(
          new Set(fundsData.map((item) => item[filter.dataKey]).filter(Boolean))
        );
        return acc;
      }, {}),
    [fundsData]
  );

  const filteredFunds = useMemo(() => {
    const searchQuery = normalizeText(query);

    const matchingFunds = fundsData.filter((fund) => {
      const matchesFilters = FILTER_CONFIG.every((filter) => {
        const selected = selectedFilters[filter.key];
        if (!selected.length) return true;
        return selected.includes(fund[filter.dataKey]);
      });

      if (!matchesFilters) return false;

      if (!searchQuery) return true;

      return fund._searchText.includes(searchQuery);
    });

    return sortFunds(matchingFunds, sortBy);
  }, [fundsData, query, selectedFilters, sortBy]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, selectedFilters, sortBy]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!sortMenuRef.current?.contains(event.target)) {
        setIsSortMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibleFunds = useMemo(
    () => filteredFunds.slice(0, visibleCount),
    [filteredFunds, visibleCount]
  );

  const activeFilterCount = useMemo(
    () =>
      Object.values(selectedFilters).reduce(
        (count, values) => count + values.length,
        0
      ),
    [selectedFilters]
  );

  const uniqueAmcs = new Set(filteredFunds.map((fund) => fund.AMC)).size;
  const riskMix = filteredFunds.reduce((acc, fund) => {
    const risk = fund["Risk Level"] || "Unknown";
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {});
  const topRisk =
    Object.entries(riskMix).sort((a, b) => b[1] - a[1])[0]?.[0] || "No data";

  const toggleFilter = (key, value) => {
    setSelectedFilters((current) => {
      const nextValues = current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value];

      return {
        ...current,
        [key]: nextValues,
      };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters(EMPTY_FILTERS);
    setQuery("");
    setSortBy("amc");
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <PageMotion>
      <StaggerGroup className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 lg:px-6">
      <RevealSection className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-[linear-gradient(135deg,#020617_0%,#0f172a_55%,#14532d_120%)] px-6 py-7 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
              Fund Explorer
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Find mutual funds that fit how long, how boldly, and why you want to invest.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Search by AMC, scan category intent, and mix filters without fighting the UI.
              This page now leans into comparison instead of just listing records.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <HeroStat
              label="Visible funds"
              value={isLoading ? "..." : filteredFunds.length}
              helper="Current matches after filters"
              icon={Target}
            />
            <HeroStat
              label="Fund houses"
              value={isLoading ? "..." : uniqueAmcs}
              helper="Different AMCs in view"
              icon={Sparkles}
            />
            <HeroStat
              label="Leading risk"
              value={isLoading ? "..." : topRisk}
              helper="Most common risk profile"
              icon={SlidersHorizontal}
            />
          </div>
        </div>
      </RevealSection>

      <RevealSection className="surface-hover rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                Filters
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Build your shortlist
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Use horizontal multi-select dropdowns to narrow the list faster.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {activeFilterCount} active
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Reset all
              </button>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[1.25fr_repeat(5,minmax(0,0.9fr))_0.9fr]">
            <label className="relative block">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search AMC, category, duration, tags..."
                className="surface-hover-subtle w-full rounded-[1.1rem] border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:bg-white"
              />
            </label>

            {FILTER_CONFIG.map((filter) => (
              <MultiSelectDropdown
                key={filter.key}
                label={filter.label}
                options={filterOptions[filter.key] || []}
                selected={selectedFilters[filter.key]}
                onToggle={(value) => toggleFilter(filter.key, value)}
                onClear={() =>
                  setSelectedFilters((current) => ({
                    ...current,
                    [filter.key]: [],
                  }))
                }
              />
            ))}

            <ForwardedSortToggle
              ref={sortMenuRef}
              isOpen={isSortMenuOpen}
              onToggle={() => setIsSortMenuOpen((current) => !current)}
              sortBy={sortBy}
              onSelect={(value) => {
                setSortBy(value);
                setIsSortMenuOpen(false);
              }}
            />
          </div>

          {activeFilterCount ? (
            <div className="flex flex-wrap gap-2">
              {FILTER_CONFIG.flatMap((filter) =>
                selectedFilters[filter.key].map((value) => (
                  <button
                    type="button"
                    key={`${filter.key}-${value}`}
                    onClick={() => toggleFilter(filter.key, value)}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                  >
                    <span>{value}</span>
                    <X size={14} />
                  </button>
                ))
              )}
            </div>
          ) : null}
        </div>
      </RevealSection>

      <RevealSection className="surface-hover rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">
              Results
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Recommended mutual funds
            </h2>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {isLoading ? "Loading..." : `${filteredFunds.length} matches`}
          </div>
        </div>

        <FundList funds={visibleFunds} isLoading={isLoading} />

        {!isLoading && filteredFunds.length > visibleFunds.length ? (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((current) => current + PAGE_SIZE)
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
            >
              Load more funds
            </button>
          </div>
        ) : null}
      </RevealSection>
      </StaggerGroup>
    </PageMotion>
  );
};

const HeroStat = ({ label, value, helper, icon: Icon }) => (
  <HoverCard className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur transition duration-300 hover:bg-white/10">
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-200">{label}</p>
      <Icon size={18} className="text-white/80" />
    </div>
    <p className="mt-5 text-2xl font-semibold text-white">{value}</p>
    <p className="mt-2 text-sm text-slate-300">{helper}</p>
  </HoverCard>
);

HeroStat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  helper: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

const MultiSelectDropdown = ({ label, options, selected, onToggle, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const preview =
    selected.length === 0
      ? "All"
      : selected.length === 1
      ? selected[0]
      : `${selected.length} selected`;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={label}
        className="surface-hover-subtle flex w-full items-center justify-between gap-3 rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-left"
      >
        <p className="min-w-0 truncate text-sm font-medium text-slate-800">
          {selected.length === 0 ? label : preview}
        </p>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full min-w-[18rem] rounded-[1.15rem] border border-slate-200 bg-white p-3 shadow-[0_22px_60px_rgba(15,23,42,0.16)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            {selected.length ? (
              <button
                type="button"
                onClick={onClear}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-700"
              >
                Clear
              </button>
            ) : null}
          </div>

          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
            {options.map((option) => {
              const isActive = selected.includes(option);

              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => onToggle(option)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <span className="leading-5">{option}</span>
                  {isActive ? <Check size={16} className="shrink-0" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

MultiSelectDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

const sortLabels = {
  amc: "AMC",
  risk: "Risk",
  duration: "Duration",
  category: "Category",
};

const SortToggle = ({ isOpen, onToggle, sortBy, onSelect }, ref) => (
  <div ref={ref} className="relative">
    <button
      type="button"
      onClick={onToggle}
      aria-label="Sort results"
      className="surface-hover-subtle flex w-full items-center justify-between gap-3 rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-left"
    >
      <p className="min-w-0 truncate text-sm font-medium text-slate-800">
        {sortLabels[sortBy] || "AMC"}
      </p>
      <ArrowUpDown size={16} className="shrink-0 text-slate-500" />
    </button>

    {isOpen ? (
      <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-48 rounded-[1.15rem] border border-slate-200 bg-white p-2 shadow-[0_22px_60px_rgba(15,23,42,0.16)]">
        {Object.entries(sortLabels).map(([value, label]) => {
          const isActive = sortBy === value;

          return (
            <button
              type="button"
              key={value}
              onClick={() => onSelect(value)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>{label}</span>
              {isActive ? <Check size={16} /> : null}
            </button>
          );
        })}
      </div>
    ) : null}
  </div>
);

const ForwardedSortToggle = forwardRef(SortToggle);

ForwardedSortToggle.displayName = "SortToggle";

ForwardedSortToggle.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const FundList = ({ funds, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-[1.5rem] border border-slate-200 bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (!funds.length) {
    return (
      <div className="mt-5 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-900">No funds match this combination.</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Try removing one or two filters, or search with a broader AMC/category term.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {funds.map((fund, index) => {
        const tags = (fund._tags || []).slice(0, 4);
        const riskTone =
          riskToneMap[fund["Risk Level"]] ||
          "border-slate-200 bg-slate-100 text-slate-700";

        return (
          <HoverCard
            key={`${fund.Code}-${index}`}
            className="group rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  AMC
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  {fund.AMC}
                </h3>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskTone}`}>
                {fund["Risk Level"]}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {fund["Scheme Category"]}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MetaPill label="Type" value={fund["Scheme Type"]} />
              <MetaPill label="Duration" value={fund["Investment Duration"]} />
              <MetaPill label="Age Group" value={fund["Age Group"]} />
              <MetaPill label="Code" value={fund.Code} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={`${fund.Code}-${tag}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </HoverCard>
        );
      })}
    </div>
  );
};

const MetaPill = ({ label, value }) => (
  <HoverItem className="rounded-[1rem] border border-slate-200 bg-white px-3 py-3 transition duration-300 hover:border-slate-300 hover:bg-slate-50">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
      {label}
    </p>
    <p className="mt-2 text-sm font-medium text-slate-700">{value}</p>
  </HoverItem>
);

MetaPill.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

FundList.propTypes = {
  funds: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
};

export default MutualFunds;
