import { Gauge } from "@mui/x-charts/Gauge";
import { useChartWidth } from "./useChartWidth";
import { chartPalette } from "./chartTheme";

export default function BasicGauges({
  spent,
  valueMax,
  valueFormatter = (value) => `${Math.round(value || 0)}`,
  maxSize = 220,
}) {
  const { containerRef, width } = useChartWidth(maxSize);
  const size = Math.min(width, maxSize);
  const safeMax = Math.max(Number(valueMax) || 0, 1);
  const safeValue = Math.max(0, Math.min(Number(spent) || 0, safeMax));
  const progress = Math.round((safeValue / safeMax) * 100);

  return (
    <div
      ref={containerRef}
      className="flex w-full justify-center overflow-hidden"
    >
      <Gauge
        width={size}
        height={size}
        value={safeValue}
        startAngle={-110}
        endAngle={110}
        valueMin={0}
        valueMax={safeMax}
        innerRadius="72%"
        outerRadius="100%"
        cornerRadius="50%"
        text={({ value }) => valueFormatter(value)}
        sx={{
          "& .MuiGauge-valueArc": {
            fill:
              progress > 90
                ? chartPalette.rose
                : progress > 70
                ? chartPalette.amber
                : chartPalette.emerald,
          },
          "& .MuiGauge-referenceArc": {
            fill: "rgba(148, 163, 184, 0.18)",
          },
          "& .MuiGauge-valueText": {
            fill: chartPalette.ink,
            fontSize: 28,
            fontWeight: 700,
          },
        }}
      />
    </div>
  );
}
