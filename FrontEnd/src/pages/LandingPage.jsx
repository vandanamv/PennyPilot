import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-6 py-12 antialiased">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.02)_50%,rgba(255,255,255,0.02)_75%,transparent_75%,transparent)] bg-[length:40px_40px] opacity-20" />
      <div className="surface-hover-dark relative mx-auto flex w-full max-w-5xl flex-col items-center gap-6 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.35)] backdrop-blur sm:px-10 sm:py-14">
        <div className="flex flex-col items-center gap-4">
          <img src="/Group1.svg" alt="PennyPilot" className="h-20 w-20" />
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            PennyPilot
          </h1>
          <p className="text-lg font-medium tracking-normal text-emerald-200 sm:text-xl">
            Empower your finances. Learn, save, and grow.
          </p>
          <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Welcome to PennyPilot! We are your trusted partner in financial
            empowerment, helping you take control of your finances with ease and
            confidence. Our app offers intuitive tools to analyze your spending,
            set achievable financial goals, and provide personalized advice on
            savings and investments. Dive into our wealth of resources and
            unlock your financial potential today. With PennyPilot, mastering
            your money has never been more accessible or fun!
          </p>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="button"
            className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold tracking-[0.18em] text-white shadow-[0_18px_40px_rgba(16,185,129,0.28)]"
            onClick={() => navigate("/signup")}
          >
            GET STARTED
          </button>
        </div>
      </div>
    </div>
  );
};
