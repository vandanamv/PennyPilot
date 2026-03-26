import AuthShell from "@/components/AuthShell";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [mailId, setMailId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [income, setIncome] = useState("");
  const [balance, setBalance] = useState("");
  const [fixedExpense, setFixedExpense] = useState("");
  const [expectedSaving, setExpectedSaving] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = {
      mailId,
      username,
      password,
      income: parseInt(income, 10),
      balance: parseInt(balance, 10),
      fixedExpense: parseInt(fixedExpense, 10),
      expectedSaving: parseInt(expectedSaving, 10),
    };

    try {
      const response = await api.post(
        "/user/signup",
        formData
      );

      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "We could not create your account right now. Please review the form and try again.";
      setErrorMessage(message);
      console.error("Error during signup:", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Sign Up"
      title="Create your money dashboard"
      alternateLabel="Already have an account?"
      alternateHref="/signin"
      alternateText="Sign in instead"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="mailId" className="text-slate-700">
              Email
            </Label>
            <Input
              type="email"
              id="mailId"
              name="mailId"
              placeholder="you@example.com"
              value={mailId}
              onChange={(e) => setMailId(e.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-slate-50"
              required
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="username" className="text-slate-700">
              Username
            </Label>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-slate-50"
              required
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="password" className="text-slate-700">
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl border-slate-200 bg-slate-50 pr-11"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income" className="text-slate-700">
              Monthly income
            </Label>
            <Input
              type="number"
              id="income"
              name="income"
              placeholder="50000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-slate-50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance" className="text-slate-700">
              Current balance
            </Label>
            <Input
              type="number"
              id="balance"
              name="balance"
              placeholder="12000"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-slate-50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fixedExpense" className="text-slate-700">
              Fixed expenses
            </Label>
            <Input
              type="number"
              id="fixedExpense"
              name="fixedExpense"
              placeholder="18000"
              value={fixedExpense}
              onChange={(e) => setFixedExpense(e.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-slate-50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedSaving" className="text-slate-700">
              Expected savings
            </Label>
            <Input
              type="number"
              id="expectedSaving"
              name="expectedSaving"
              placeholder="10000"
              value={expectedSaving}
              onChange={(e) => setExpectedSaving(e.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-slate-50"
              required
            />
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <Button
          size="lg"
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthShell>
  );
};

export default SignUpPage;
