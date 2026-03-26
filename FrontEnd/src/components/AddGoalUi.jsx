import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { useEffect, useState } from "react";
import { Plus, Target } from "lucide-react";

export const AddGoalUI = ({ goals }) => {
  const [showInputCard, setShowInputCard] = useState(false);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [amount, setAmount] = useState("");
  const [baseamount, setBaseamount] = useState(0);
  const handleAddGoal = () => {
    setShowInputCard(true);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3002/pennypilot/user/getuser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Goals fetched successfully:", response.data);
        setBaseamount(response.data.user.expectedSaving);
      })
      .catch((error) => {
        console.error("Error fetching goals:", error);
      });
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:3002/pennypilot/goal/postgoal",
        { title: name, targetAmount: amount, duration: duration },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Goal added successfully:", response.data);
      setShowInputCard(false);
      setName("");
      setDuration("");
      setAmount("");
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const handleCancel = () => {
    setShowInputCard(false);
    setName("");
    setDuration("");
    setAmount("");
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-3">
          {goals.map((goal) => {
            const percentOfBaseAmount = (
              (baseamount / goal.targetAmount) *
              100
            ).toFixed(2);

            return (
              <div
                key={goal._id}
                className="surface-hover rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">
                      {goal.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {goal.duration} year horizon
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                    <Target size={18} />
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-500">Target amount</p>
                <p className="text-2xl font-semibold text-slate-950">
                  Rs. {goal.targetAmount}
                </p>
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                    <span>Projected progress</span>
                    <span>{percentOfBaseAmount}%</span>
                  </div>
                  <Progress value={percentOfBaseAmount} className="w-full" />
                </div>
              </div>
            );
          })}
        <button
          type="button"
          className="surface-hover flex min-h-40 w-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-emerald-300 bg-emerald-50/70 text-emerald-700 transition hover:bg-emerald-100"
          onClick={handleAddGoal}
        >
          <Plus className="h-8 w-8" />
          <p className="mt-3 text-lg font-semibold">Add a new goal</p>
          <p className="mt-1 text-sm text-emerald-700/80">
            Track one more milestone inside your dashboard
          </p>
        </button>
        {showInputCard && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.3)]">
              <h2 className="text-2xl font-semibold text-slate-950">Add Goal</h2>
              <p className="mt-1 text-sm text-slate-500">
                Create a new savings target and start measuring progress.
              </p>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Goal Name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="mt-5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3"
                />
                <input
                  type="number"
                  name="duration"
                  placeholder="Goal Duration (years)"
                  onChange={(e) => {
                    setDuration(e.target.value);
                  }}
                  className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3"
                />
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount Required"
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3"
                />
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-white"
                  >
                    Start
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
