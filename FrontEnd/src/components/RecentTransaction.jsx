export const RecentsTransactions = ({ type, amount, to }) => {
  const transactionColor = type === "+" ? "text-green-500" : "text-red-500";

  return (
    <div className="cols-span-1 bg-white p-4 rounded-lg shadow-md flex flex-row justify-between">
      <h1 className="text-xl font-semibold">{to}</h1>
      <h1 className={`text-xl font-semibold ${transactionColor}`}>{amount}</h1>
    </div>
  );
};
