import { BarChart } from "@mui/x-charts/BarChart";
import PropTypes from "prop-types";
import { useChartWidth } from "./useChartWidth";
import { axisLabelStyle, chartPalette, chartSx } from "./chartTheme";

const shortenLabel = (value = "") => {
  if (value.length <= 10) return value;

  const words = value.split(" ");
  if (words.length > 1) {
    return words[0];
  }

  return `${value.slice(0, 8)}...`;
};

const buildCombinedDataset = (transactions = [], budgetDataset = [], dailyLimit = 0) => {
  const spendTotals = transactions.reduce((acc, transaction) => {
    const category = transaction?.category || "Others";
    acc[category] = (acc[category] || 0) + Math.abs(Number(transaction?.amount) || 0);
    return acc;
  }, {});

  return budgetDataset
    .map((item) => ({
      category: item?.category || "Others",
      allowed: Math.round(Number(item?.allowed) || 0),
      spent: Math.round(spendTotals[item?.category] || 0),
      target:
        dailyLimit > 0
          ? Math.round(dailyLimit)
          : Math.max(Math.round((Number(item?.allowed) || 0) * 0.35), 600),
    }))
    .filter((item) => item.allowed > 0 || item.spent > 0)
    .sort((a, b) => Math.max(b.allowed, b.spent) - Math.max(a.allowed, a.spent))
    .slice(0, 5)
    .map((item) => ({
      label: shortenLabel(item.category),
      spent: item.spent,
      target: item.target,
      allowed: item.allowed,
    }));
};

export default function CombinedRhythmChart({
  transactions = [],
  budgetDataset = [],
  dailyLimit = 0,
}) {
  const { containerRef, width } = useChartWidth(760);
  const chartData = buildCombinedDataset(transactions, budgetDataset, dailyLimit);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <BarChart
        dataset={chartData}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "label",
            tickLabelStyle: axisLabelStyle,
          },
        ]}
        yAxis={[{ tickLabelStyle: axisLabelStyle }]}
        series={[
          {
            dataKey: "target",
            label: "Daily target",
            color: chartPalette.slate,
            highlightScope: { highlighted: "item", faded: "global" },
          },
          {
            dataKey: "allowed",
            label: "Allowed",
            color: chartPalette.emerald,
            highlightScope: { highlighted: "item", faded: "global" },
          },
          {
            dataKey: "spent",
            label: "Spent",
            color: chartPalette.violet,
            highlightScope: { highlighted: "item", faded: "global" },
          },
        ]}
        margin={{ top: 22, right: 16, bottom: 44, left: 42 }}
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
        height={340}
      />
    </div>
  );
}

CombinedRhythmChart.propTypes = {
  transactions: PropTypes.array,
  budgetDataset: PropTypes.array,
  dailyLimit: PropTypes.number,
};
