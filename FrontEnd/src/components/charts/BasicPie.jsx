import { formatTransactionsForPieChart } from "@/components/utiles";
import { PieChart } from "@mui/x-charts/PieChart";
import { useChartWidth } from "./useChartWidth";
import { chartPalette, chartSx } from "./chartTheme";

const pieColors = [
  chartPalette.emerald,
  chartPalette.sky,
  chartPalette.amber,
  chartPalette.violet,
  chartPalette.rose,
  chartPalette.cyan,
  chartPalette.slate,
];

export default function BasicPie({
  height,
  width,
  transactions,
  skipAnimation = false,
}) {
  const data = formatTransactionsForPieChart(transactions);
  const { containerRef, width: responsiveWidth } = useChartWidth(width || 320);

  return (
    <div ref={containerRef} className="flex w-full justify-center overflow-hidden">
      <PieChart
        colors={pieColors}
        series={[
          {
            data,
            innerRadius: 54,
            outerRadius: 102,
            paddingAngle: 2,
            cornerRadius: 6,
            highlightScope: { highlighted: "item", faded: "global" },
            faded: { innerRadius: 48, additionalRadius: -6, color: "#cbd5e1" },
          },
        ]}
        slotProps={{ legend: { hidden: true } }}
        sx={chartSx}
        width={responsiveWidth}
        height={height}
        skipAnimation={skipAnimation}
      />
    </div>
  );
}
