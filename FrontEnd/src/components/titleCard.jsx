import { HoverItem } from "@/components/ui/page-motion";

export const TitleCard = ({
  title,
  category,
  risk,
  period,
  isActive = false,
  onClick,
}) => {
  return (
    <HoverItem>
      <div
        className={`cursor-pointer rounded-[1.25rem] border p-4 transition duration-300 hover:border-emerald-300 hover:bg-white hover:shadow-[0_18px_45px_rgba(16,185,129,0.12)] ${
          isActive
            ? "border-emerald-300 bg-emerald-50/60 shadow-[0_18px_45px_rgba(16,185,129,0.12)]"
            : "border-slate-200 bg-slate-50"
        }`}
        onClick={onClick}
      >
        <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
          <span className="rounded-full bg-white px-2.5 py-1 text-slate-500 transition duration-300 group-hover:bg-emerald-50">
            {category}
          </span>
          <span className="rounded-full bg-white px-2.5 py-1 text-slate-500">
            {risk}
          </span>
          <span className="rounded-full bg-white px-2.5 py-1 text-slate-500">
            {period}
          </span>
        </div>
        <h2 className="mt-3 text-base font-semibold leading-6 text-slate-900">
          {title}
        </h2>
      </div>
    </HoverItem>
  );
};
