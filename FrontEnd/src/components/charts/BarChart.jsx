import { BarChart } from "@mui/x-charts/BarChart";
import { useChartWidth } from "./useChartWidth";
import { axisLabelStyle, chartPalette, chartSx } from "./chartTheme";

const buildDailySpending = (transactions = [], dailyLimit = 0) => {
  const formatter = new Intl.DateTimeFormat("en-IN", { weekday: "short" });
  const dailyTotals = transactions.reduce((acc, transaction) => {
    const rawDate = transaction?.date;
    if (!rawDate) return acc;

    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return acc;

    const key = date.toISOString().slice(0, 10);
    acc[key] = (acc[key] || 0) + Math.abs(Number(transaction.amount) || 0);
    return acc;
  }, {});

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    const amount = dailyTotals[key] || 0;

    return {
      label: formatter.format(date),
      spend: Math.round(amount),
      target:
        dailyLimit > 0
          ? Math.round(dailyLimit)
          : Math.max(Math.round(amount * 1.18), amount + 800, 1500),
    };
  });

  return {
    labels: lastSevenDays.map((day) => day.label),
    spent: lastSevenDays.map((day) => day.spend),
    targets: lastSevenDays.map((day) => day.target),
  };
};

export default function BasicBars({ transactions = [], dailyLimit = 0 }) {
  const { containerRef, width } = useChartWidth(360);
  const { labels, spent, targets } = buildDailySpending(transactions, dailyLimit);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: labels,
            tickLabelStyle: axisLabelStyle,
          },
        ]}
        series={[
          {
            id: "target",
            label: "Target",
            data: targets,
            color: chartPalette.slate,
            highlightScope: { highlighted: "item", faded: "global" },
          },
          {
            id: "spent",
            label: "Spent",
            data: spent,
            color: chartPalette.violet,
            highlightScope: { highlighted: "item", faded: "global" },
          },
        ]}
        yAxis={[{ tickLabelStyle: axisLabelStyle }]}
        margin={{ top: 18, right: 16, bottom: 24, left: 42 }}
        borderRadius={10}
        grid={{ horizontal: true }}
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "top", horizontal: "middle" },
          },
        }}
        sx={chartSx}
        width={width}
        height={280}
      />
    </div>
  );
}
