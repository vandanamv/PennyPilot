import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  HoverCard,
  HoverItem,
  PageMotion,
  RevealSection,
  StaggerGroup,
} from "@/components/ui/page-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RocketIcon } from "@radix-ui/react-icons";
import { BookOpen, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { TitleCard } from "./components/titleCard";
import { Button } from "./components/ui/button";
import data from "./data.json";

export const ReadSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [query, setQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categoryOptions = useMemo(
    () => [...new Set(data.map((item) => item.category).filter(Boolean))],
    []
  );

  const riskOptions = useMemo(
    () => [...new Set(data.map((item) => item.risk).filter(Boolean))],
    []
  );

  const periodOptions = useMemo(
    () => [...new Set(data.map((item) => item.period).filter(Boolean))],
    []
  );

  const filteredData = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    return data.filter((item) => {
      const categoryMatch = selectedCategory ? item.category === selectedCategory : true;
      const riskMatch = selectedRisk ? item.risk === selectedRisk : true;
      const periodMatch = selectedPeriod ? item.period === selectedPeriod : true;
      const queryMatch = searchText
        ? `${item.title} ${item.category} ${item.risk} ${item.period}`
            .toLowerCase()
            .includes(searchText)
        : true;

      return categoryMatch && riskMatch && periodMatch && queryMatch;
    });
  }, [query, selectedCategory, selectedRisk, selectedPeriod]);

  const activeFilterCount = useMemo(
    () => [selectedCategory, selectedRisk, selectedPeriod].filter(Boolean).length,
    [selectedCategory, selectedRisk, selectedPeriod]
  );

  const readingStats = useMemo(
    () => ({
      total: data.length,
      visible: filteredData.length,
      lowRisk: data.filter((item) => item.risk === "Low").length,
    }),
    [filteredData.length]
  );

  const handleCardClick = (id) => {
    const article = data.find((item) => item.id === id);
    setSelectedArticle(article);
  };

  useEffect(() => {
    if (!filteredData.length) {
      setSelectedArticle(null);
      return;
    }

    setSelectedArticle((current) => {
      if (current && filteredData.some((item) => item.id === current.id)) {
        return current;
      }

      return filteredData[0];
    });
  }, [filteredData]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedRisk("");
    setSelectedPeriod("");
    setQuery("");
  };

  return (
    <PageMotion>
      <StaggerGroup className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 lg:px-6 xl:flex-row">
        <RevealSection className="surface-hover rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] xl:w-[23rem] xl:shrink-0">
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-[linear-gradient(135deg,#020617_0%,#0f172a_50%,#164e63_120%)] px-5 py-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
              MoneyMind
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight">
              Find the right thing to read before the next money move.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Browse by topic, risk, and time horizon, then open a guide in a cleaner reading layout.
            </p>

            <div className="mt-5 grid gap-3 grid-cols-1 sm:grid-cols-3">
              <HoverCard className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur transition duration-300 hover:bg-white/10">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Library</p>
                <p className="mt-2 text-xl font-semibold text-white">{readingStats.total}</p>
              </HoverCard>
              <HoverCard className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur transition duration-300 hover:bg-white/10">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Visible</p>
                <p className="mt-2 text-xl font-semibold text-white">{readingStats.visible}</p>
              </HoverCard>
              <HoverCard className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur transition duration-300 hover:bg-white/10">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Low risk</p>
                <p className="mt-2 text-xl font-semibold text-white">{readingStats.lowRisk}</p>
              </HoverCard>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <label className="relative block">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, risk, or category..."
                className="w-full rounded-[1.1rem] border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  {riskOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button className="rounded-xl" variant="outline" onClick={clearFilters}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>

            <HoverCard className="rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 transition duration-300 hover:border-slate-300 hover:bg-white">
              <p className="text-sm font-semibold text-slate-900">
                {filteredData.length} articles available
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {activeFilterCount
                  ? `${activeFilterCount} active filters are shaping your library view.`
                  : "Start with category, risk, or period to narrow the library."}
              </p>
            </HoverCard>
          </div>

          <div className="mt-6 flex max-h-[65vh] flex-col gap-3 overflow-y-auto pr-1">
            {filteredData.map((item) => (
              <TitleCard
                key={item.id}
                title={item.title}
                category={item.category}
                risk={item.risk}
                period={item.period}
                isActive={selectedArticle?.id === item.id}
                onClick={() => handleCardClick(item.id)}
              />
            ))}
          </div>
        </RevealSection>

        <RevealSection className="surface-hover min-h-[32rem] flex-1 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          {selectedArticle ? (
            <div className="flex h-full flex-col">
              <div className="flex flex-col gap-5 rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <HoverItem className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
                        {selectedArticle.category}
                      </HoverItem>
                      <HoverItem className="rounded-full bg-sky-100 px-3 py-1 font-semibold text-sky-700">
                        {selectedArticle.risk} risk
                      </HoverItem>
                      <HoverItem className="rounded-full bg-violet-100 px-3 py-1 font-semibold text-violet-700">
                        {selectedArticle.period}
                      </HoverItem>
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                      {selectedArticle.title}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                      Stay in reading mode, scan the key labels above, and return to the library any time.
                    </p>
                  </div>

                  <Button variant="outline" onClick={() => setSelectedArticle(null)}>
                    Back to Library
                  </Button>
                </div>

                <Alert className="border-emerald-200 bg-emerald-50">
                  <RocketIcon className="h-4 w-4" />
                  <AlertTitle>Strong habit</AlertTitle>
                  <AlertDescription>
                    Reading consistently sharpens the quality of the decisions you make elsewhere in the app.
                  </AlertDescription>
                </Alert>
              </div>

              <HoverCard className="mt-5 flex-1">
                <ReactMarkdown className="prose prose-slate max-w-none h-full overflow-y-auto rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 prose-headings:text-slate-950 prose-p:text-slate-700 prose-strong:text-slate-950 prose-li:text-slate-700 transition duration-300 hover:border-slate-300 hover:bg-white">
                  {selectedArticle.content}
                </ReactMarkdown>
              </HoverCard>

              <div className="mt-5 flex justify-end">
                <Button size="lg">Finish Reading</Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[65vh] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-8 text-center">
              <div className="float-soft flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <BookOpen className="h-7 w-7 text-emerald-600" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-slate-900">
                Pick an article to start reading
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                Use the library on the left to find something that matches your current goals, then open it here in a cleaner reading view.
              </p>
            </div>
          )}
        </RevealSection>
      </StaggerGroup>
    </PageMotion>
  );
};
