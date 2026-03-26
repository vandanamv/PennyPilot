import { useMemo } from "react";
import Cookies from "js-cookie";
import { ChevronRight, LogOut } from "lucide-react";
import { AiOutlineStock } from "react-icons/ai";
import { HiOutlineArrowsRightLeft } from "react-icons/hi2";
import { FaChartSimple } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { TbBooks } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("dailylimit");
    Cookies.remove("daily");
    navigate("/signin");
  };

  const navItems = useMemo(
    () => [
      {
        id: 1,
        component: <MdOutlineDashboard className="h-5 w-5" />,
        name: "Dashboard",
        path: "/home",
      },
      {
        id: 2,
        component: <FaChartSimple className="h-5 w-5" />,
        name: "Analytics",
        path: "/analytics",
      },
      {
        id: 3,
        component: <HiOutlineArrowsRightLeft className="h-5 w-5" />,
        name: "Transactions",
        path: "/transactions",
      },
      {
        id: 4,
        component: <TbBooks className="h-5 w-5" />,
        name: "Library",
        path: "/read",
      },
      {
        id: 5,
        component: <AiOutlineStock className="h-5 w-5" />,
        name: "Funds",
        path: "/funds",
      },
    ],
    []
  );

  const profileItem = {
    id: 6,
    component: <IoPerson className="h-5 w-5" />,
    name: "Profile",
    path: "/profile",
    helper: "Account and settings",
  };

  const getHelperText = (name) =>
    name === "Dashboard"
      ? "Overview and budgets"
      : name === "Analytics"
      ? "Trends and focus"
      : name === "Transactions"
      ? "Track money movement"
      : name === "Library"
      ? "Read and learn"
      : name === "Funds"
      ? "Explore investments"
      : "Account and settings";

  return (
    <aside className="fixed left-4 top-4 z-50 hidden h-[calc(100vh-2rem)] w-[17rem] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.97)_55%,rgba(3,7,18,0.98)_100%)] px-3 py-4 text-white shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:flex">
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/5 px-3 py-3 text-left transition-[box-shadow,border-color,background-color] duration-200 hover:border-white/20 hover:bg-white/8 hover:shadow-[0_18px_40px_rgba(15,23,42,0.32)]"
        onClick={() => navigate("/home")}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-2">
          <img src="/Group2.svg" alt="PennyPilot" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            PennyPilot
          </p>
          <p className="mt-1 text-sm text-slate-300">
            Money workspace
          </p>
        </div>
      </button>

      <div className="mt-4 flex w-full flex-1 flex-col gap-2">
        {navItems.map((icon) => {
          const isActive = location.pathname === icon.path;

          return (
            <button
              key={icon.id}
              type="button"
              className={`group flex w-full items-center gap-3 rounded-[1.35rem] px-3 py-3 text-left transition-[box-shadow,background-color,color] duration-200 ${
                isActive
                  ? "bg-emerald-500 text-white shadow-[0_14px_30px_rgba(16,185,129,0.3)]"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:shadow-[0_16px_35px_rgba(15,23,42,0.24)]"
              }`}
              onClick={() => navigate(icon.path)}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                  isActive ? "bg-white/15 text-white" : "bg-white/5 text-slate-300"
                }`}
              >
                {icon.component}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{icon.name}</p>
                <p
                  className={`mt-0.5 text-xs ${
                    isActive ? "text-emerald-50/90" : "text-slate-400"
                  }`}
                >
                  {getHelperText(icon.name)}
                </p>
              </div>
              <ChevronRight
                size={16}
                className={`${isActive ? "text-white" : "text-slate-500"}`}
              />
            </button>
          );
        })}
      </div>

      <div className="space-y-2 border-t border-white/10 pt-3">
        <button
          type="button"
          onClick={() => navigate(profileItem.path)}
          className={`group flex w-full items-center gap-3 rounded-[1.35rem] px-3 py-3 text-left transition-[box-shadow,background-color,color] duration-200 ${
            location.pathname === profileItem.path
              ? "bg-emerald-500 text-white shadow-[0_14px_30px_rgba(16,185,129,0.3)]"
              : "bg-white/5 text-slate-300 hover:bg-white/10 hover:shadow-[0_16px_35px_rgba(15,23,42,0.24)]"
          }`}
        >
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
              location.pathname === profileItem.path
                ? "bg-white/15 text-white"
                : "bg-white/5 text-slate-300"
            }`}
          >
            {profileItem.component}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{profileItem.name}</p>
            <p
              className={`mt-0.5 text-xs ${
                location.pathname === profileItem.path
                  ? "text-emerald-50/90"
                  : "text-slate-400"
              }`}
            >
              {profileItem.helper}
            </p>
          </div>
          <ChevronRight
            size={16}
            className={`${location.pathname === profileItem.path ? "text-white" : "text-slate-500"}`}
          />
        </button>

        <button
          type="button"
          onClick={handleSignOut}
          className="group flex w-full items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-slate-300 transition-[box-shadow,border-color,background-color,color] duration-200 hover:border-rose-400/40 hover:bg-rose-500/12 hover:text-rose-100 hover:shadow-[0_16px_35px_rgba(127,29,29,0.28)]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 transition-colors duration-200 group-hover:bg-rose-500/18 group-hover:text-rose-200">
              <LogOut size={16} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Sign out</p>
              <p className="text-xs text-slate-400 transition-colors duration-200 group-hover:text-rose-200/80">
                End this session safely
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-500 transition-colors duration-200 group-hover:text-rose-200" />
        </button>
      </div>
    </aside>
  );
};
