import { LineChart } from "@mui/x-charts/LineChart";
import { useChartWidth } from "./useChartWidth";
import { axisLabelStyle, chartPalette, chartSx } from "./chartTheme";

const buildTrend = (spendingData = []) => {
  const totals = spendingData.reduce((acc, item) => {
    const label = item?.date || "";
    if (!label) return acc;
    acc[label] = (acc[label] || 0) + Math.abs(Number(item.amount) || 0);
    return acc;
  }, {});

  const entries = Object.entries(totals).slice(-10);

  return {
    dates: entries.map(([date]) => date),
    amounts: entries.map(([, amount]) => Math.round(amount)),
  };
};

export default function BasicLineChart({
  spendingData,
  skipAnimation = false,
  height = 300,
}) {
  const { containerRef, width } = useChartWidth(420);
  const { dates, amounts } = buildTrend(spendingData);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <LineChart
        xAxis={[{ data: dates, scaleType: "point", tickLabelStyle: axisLabelStyle }]}
        yAxis={[{ tickLabelStyle: axisLabelStyle }]}
        series={[
          {
            data: amounts,
            color: chartPalette.cyan,
            area: true,
            showMark: false,
            curve: "monotoneX",
          },
        ]}
        margin={{ top: 18, right: 16, bottom: 24, left: 42 }}
        grid={{ horizontal: true }}
        sx={chartSx}
        width={width}
        height={height}
        skipAnimation={skipAnimation}
      />
    </div>
  );
}
