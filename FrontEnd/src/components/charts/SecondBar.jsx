import { formatTransactionsForBarChart } from "@/components/utiles"; // Adjust the path accordingly
import { BarChart } from "@mui/x-charts";
import { useChartWidth } from "./useChartWidth";
import { axisLabelStyle, chartPalette, chartSx } from "./chartTheme";

export const SecondBar = ({ transactions, height, width, skipAnimation = false }) => {
  const { data, labels } = formatTransactionsForBarChart(transactions);
  const { containerRef, width: responsiveWidth } = useChartWidth(width || 420);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <BarChart
        series={[
          {
            data,
            color: chartPalette.emerald,
            highlightScope: { highlighted: "item", faded: "global" },
          },
        ]}
        xAxis={[
          {
            scaleType: "band",
            data: labels,
            tickLabelStyle: axisLabelStyle,
          },
        ]}
        yAxis={[{ tickLabelStyle: axisLabelStyle }]}
        margin={{ top: 18, right: 12, bottom: 42, left: 42 }}
        borderRadius={10}
        grid={{ horizontal: true }}
        slotProps={{ legend: { hidden: true } }}
        sx={chartSx}
        height={height}
        width={responsiveWidth}
        leftAxis={null}
        skipAnimation={skipAnimation}
      />
    </div>
  );
};
