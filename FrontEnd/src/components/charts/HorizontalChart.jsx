import { BarChart } from "@mui/x-charts/BarChart";
import { useChartWidth } from "./useChartWidth";
import { axisLabelStyle, chartPalette, chartSx } from "./chartTheme";

const buildCategoryTotals = (dataset = [], budgetDataset = []) => {
  const spendTotals = dataset.reduce((acc, item) => {
    const category = item?.category || "Others";
    const amount = Math.abs(Number(item?.amount) || 0);
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  const budgetTotals = budgetDataset.reduce((acc, item) => {
    const category = item?.category || "Others";
    acc[category] = Math.round(Number(item?.allowed) || 0);
    return acc;
  }, {});

  return Array.from(
    new Set([...Object.keys(spendTotals), ...Object.keys(budgetTotals)])
  )
    .map((category) => ({
      category,
      spent: Math.round(spendTotals[category] || 0),
      allowed: Math.round(budgetTotals[category] || 0),
    }))
    .sort((a, b) => Math.max(b.spent, b.allowed) - Math.max(a.spent, a.allowed))
    .slice(0, 6);
};

export default function HorizontalGrid({ dataset, budgetDataset = [] }) {
  const { containerRef, width } = useChartWidth(520);
  const chartData = buildCategoryTotals(dataset, budgetDataset);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <BarChart
        dataset={chartData}
        yAxis={[
          {
            scaleType: "band",
            dataKey: "category",
            tickLabelStyle: axisLabelStyle,
          },
        ]}
        xAxis={[
          {
            label: "Spend by category",
            tickLabelStyle: axisLabelStyle,
            labelStyle: axisLabelStyle,
          },
        ]}
        series={[
          {
            dataKey: "allowed",
            label: "Allowed",
            color: chartPalette.emerald,
            highlightScope: { highlighted: "item", faded: "global" },
          },
          {
            dataKey: "spent",
            label: "Spent",
            color: chartPalette.sky,
            highlightScope: { highlighted: "item", faded: "global" },
          },
        ]}
        layout="horizontal"
        grid={{ vertical: true }}
        margin={{ top: 18, right: 16, bottom: 28, left: 88 }}
        borderRadius={10}
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "top", horizontal: "middle" },
          },
        }}
        sx={chartSx}
        width={width}
        height={300}
      />
    </div>
  );
}
