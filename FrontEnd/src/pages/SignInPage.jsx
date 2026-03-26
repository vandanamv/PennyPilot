import AuthShell from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const navigate = useNavigate();
  const [mailId, setMailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3002/pennypilot/user/signin",
        { mailId, password }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "We could not sign you in. Check your credentials and try again.";
      setErrorMessage(message);
      console.error("Error during login:", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Sign In"
      title="Welcome back"
      description="Pick up where you left off and head straight into your dashboard."
      alternateLabel="Need an account?"
      alternateHref="/signup"
      alternateText="Create one here"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
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

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700">
            Password
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
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

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <Button
          size="lg"
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthShell>
  );
};

export default SignInPage;
