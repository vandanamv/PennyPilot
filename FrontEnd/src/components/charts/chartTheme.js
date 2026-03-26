export const chartPalette = {
  ink: "#0f172a",
  muted: "#64748b",
  grid: "rgba(148, 163, 184, 0.2)",
  emerald: "#10b981",
  sky: "#0ea5e9",
  amber: "#f59e0b",
  violet: "#8b5cf6",
  rose: "#f43f5e",
  cyan: "#06b6d4",
  slate: "#94a3b8",
};

export const chartSurfaceClassName =
  "overflow-hidden rounded-[1.5rem] border border-white/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(241,245,249,0.92)_55%,_rgba(226,232,240,0.75)_100%)] px-3 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]";

export const chartSx = {
  "& .MuiChartsAxis-line": {
    stroke: "rgba(148, 163, 184, 0.32)",
  },
  "& .MuiChartsAxis-tick": {
    stroke: "rgba(148, 163, 184, 0.3)",
  },
  "& .MuiChartsAxis-tickLabel": {
    fill: chartPalette.muted,
    fontSize: 12,
    fontWeight: 600,
  },
  "& .MuiChartsGrid-line": {
    stroke: chartPalette.grid,
    strokeDasharray: "5 7",
  },
  "& .MuiChartsLegend-series text": {
    fill: chartPalette.ink,
  },
};

export const axisLabelStyle = {
  fontSize: 12,
  fill: chartPalette.muted,
  fontWeight: 700,
};
