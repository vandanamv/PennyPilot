const formatTransactionsForBarChart = (transactions) => {
  const scopedTransactions = transactions.slice(0, 6).reverse();
  const categories = scopedTransactions.map(
    (transaction) => transaction.to || transaction.category || "Untitled"
  );
  const categoryData = scopedTransactions.map((transaction) => ({
    category: transaction.category,
    total: Math.abs(Number(transaction.amount) || 0),
  }));

  return {
    data: categoryData.map((item) => item.total),
    labels: categories.map((label) =>
      label.length > 10 ? `${label.slice(0, 10)}...` : label
    ),
  };
};
const formatTransactionsForPieChart = (transactions) => {
  const categoryTotals = transactions.reduce((acc, transaction) => {
    const category = transaction.category || "Others";

    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += Math.abs(Number(transaction.amount) || 0);
    return acc;
  }, {});

  return Object.keys(categoryTotals).map((category, index) => ({
    id: index,
    value: categoryTotals[category],
    label: category,
  }));
};

export { formatTransactionsForBarChart, formatTransactionsForPieChart };
