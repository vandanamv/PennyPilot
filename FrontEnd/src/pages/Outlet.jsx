import { Route, Routes, useLocation } from "react-router-dom";
import { ReadSection } from "../ReadSection";
import Article from "../components/article";
import HomePage from "../pages/HomePage";
import { Analytics } from "./Analytics";
import { NavBar } from "./NavBar";
import Profile from "./Profile";
import Transactions from "./Transactions";
import MutualFunds from "./mutualfunds";
const Outlet = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_20%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_18%),linear-gradient(180deg,_#f8fafc_0%,_#eef4ff_50%,_#f8fafc_100%)]">
      <NavBar />
      <div className="sticky top-0 z-40 border-b border-white/50 bg-white/65 px-4 py-4 backdrop-blur-xl lg:ml-[18rem] lg:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              PennyPilot
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Spending clarity, budgets, goals, and insights in one workspace.
            </p>
          </div>
          <div className="surface-hover-subtle rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
            Live workspace
          </div>
        </div>
      </div>
      <div className="min-h-[calc(100vh-81px)] px-2 pb-6 pt-4 sm:px-4 lg:ml-[18rem] lg:px-6">
        <div key={location.pathname}>
          <Routes location={location}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/read" element={<ReadSection />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/funds" element={<MutualFunds />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Outlet;
