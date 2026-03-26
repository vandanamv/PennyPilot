import { Link } from "react-router-dom";

  const AuthShell = ({
  eyebrow,
  title,
  description,
  alternateLabel,
  alternateHref,
  alternateText,
  children,
}) => {
  const highlights = [
    {
      label: "Smart budget snapshots",
      value: "Track your income, balance, and fixed expenses in one place.",
    },
    {
      label: "Goal-driven planning",
      value: "Set savings targets early and keep your monthly plan realistic.",
    },
    {
      label: "Clean daily workflow",
      value: "Log in quickly and focus on actions, not setup friction.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.24),_transparent_32%),linear-gradient(135deg,_#020617_0%,_#0f172a_55%,_#111827_100%)]" />
        <div className="absolute left-[-8rem] top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-2rem] h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <section className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200/90">
              {eyebrow}
            </div>

            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Build better money habits with a calmer workflow.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                PennyPilot helps you understand where your cash is going,
                what deserves your attention, and how to grow with intention.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="surface-hover-dark rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur"
                >
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-300">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full">
            <div className="surface-hover-dark mx-auto w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/95 p-5 text-slate-900 shadow-[0_30px_80px_rgba(2,6,23,0.45)] sm:p-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                  {eyebrow}
                </p>
                <h2 className="text-3xl font-semibold text-slate-950">
                  {title}
                </h2>
                {description ? (
                  <p className="text-sm leading-6 text-slate-600">{description}</p>
                ) : null}
              </div>

              <div className="mt-6">{children}</div>

              <p className="mt-5 text-sm text-slate-600">
                {alternateLabel}{" "}
                <Link
                  to={alternateHref}
                  className="font-semibold text-emerald-700 transition hover:text-emerald-600"
                >
                  {alternateText}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
