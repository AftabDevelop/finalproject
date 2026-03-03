import { useState } from "react";
import { useNavigate } from "react-router";

const profileOptions = [
  {
    id: "student",
    label: "Student",
    desc: "College / school student learning DSA and coding.",
  },
  {
    id: "professional",
    label: "Working professional",
    desc: "Software engineer or in another tech job.",
  },
  {
    id: "jobseeker",
    label: "Preparing for interviews",
    desc: "Actively preparing for placements / tech interviews.",
  },
];

const goalOptions = [
  { id: "learn-basics", label: "Learn DSA basics" },
  { id: "crack-interviews", label: "Crack coding interviews" },
  { id: "practice", label: "Just practice problems" },
];

const difficultyOptions = [
  { id: "easy-only", label: "Mostly Easy" },
  { id: "mix-em", label: "Easy + Medium" },
  { id: "all", label: "Easy / Medium / Hard" },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1, 2, 3
  const [profileType, setProfileType] = useState("student");
  const [goal, setGoal] = useState("learn-basics");
  const [preferredDifficulty, setPreferredDifficulty] = useState("mix-em");

  const handleContinue = () => {
    // Sirf demo ke liye – koi backend nahi
    console.log({
      profileType,
      goal,
      preferredDifficulty,
    });
    navigate("/signup");
  };

  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">
            Tell us about <span className="text-violet-400">yourself</span>
          </h1>
          <p className="text-xs text-slate-300/80 mb-5">
            This helps CodeJudge show problems that match your background.
          </p>

          <h2 className="text-sm font-semibold mb-3 text-slate-100">
            Who are you?
          </h2>
          <div className="space-y-3">
            {profileOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setProfileType(opt.id)}
                className={
                  "w-full rounded-xl border px-3.5 py-3 text-left text-sm transition-all " +
                  (profileType === opt.id
                    ? "border-violet-400/70 bg-violet-500/10 shadow-[0_0_0_1px_rgba(139,92,246,0.4)]"
                    : "border-slate-700 bg-slate-900 hover:border-slate-500")
                }
              >
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className={
                      "flex h-6 w-6 items-center justify-center rounded-full text-[11px] " +
                      (profileType === opt.id
                        ? "bg-violet-500 text-slate-950"
                        : "bg-slate-800 text-slate-300")
                    }
                  >
                    {opt.label[0]}
                  </div>
                  <div className="font-medium text-slate-50">
                    {opt.label}
                  </div>
                </div>
                <p className="text-[11px] text-slate-300/80">{opt.desc}</p>
              </button>
            ))}
          </div>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">
            What&apos;s your <span className="text-violet-400">main goal</span>?
          </h1>
          <p className="text-xs text-slate-300/80 mb-5">
            We&apos;ll suggest problems that match why you&apos;re here.
          </p>

          <div className="space-y-3">
            {goalOptions.map((opt) => (
              <label
                key={opt.id}
                className={
                  "flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-all " +
                  (goal === opt.id
                    ? "border-violet-400/70 bg-violet-500/10 shadow-[0_0_0_1px_rgba(139,92,246,0.4)]"
                    : "border-slate-700 bg-slate-900 hover:border-slate-500")
                }
              >
                <input
                  type="radio"
                  name="goal"
                  className="radio radio-xs"
                  value={opt.id}
                  checked={goal === opt.id}
                  onChange={() => setGoal(opt.id)}
                />
                <span className="text-slate-100">{opt.label}</span>
              </label>
            ))}
          </div>
        </>
      );
    }

    // step === 3
    return (
      <>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          Choose your <span className="text-violet-400">difficulty</span>
        </h1>
        <p className="text-xs text-slate-300/80 mb-5">
          You can change this later from your profile.
        </p>

        <div className="space-y-3 mb-4">
          {difficultyOptions.map((opt) => (
            <label
              key={opt.id}
              className={
                "flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-all " +
                (preferredDifficulty === opt.id
                  ? "border-violet-400/70 bg-violet-500/10 shadow-[0_0_0_1px_rgba(139,92,246,0.4)]"
                  : "border-slate-700 bg-slate-900 hover:border-slate-500")
              }
            >
              <input
                type="radio"
                name="difficulty"
                className="radio radio-xs"
                value={opt.id}
                checked={preferredDifficulty === opt.id}
                onChange={() => setPreferredDifficulty(opt.id)}
              />
              <span className="text-slate-100">{opt.label}</span>
            </label>
          ))}
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-[11px] text-slate-300/80">
          <p className="font-medium mb-1 text-slate-100">Preview</p>
          <p>
            You&apos;re a{" "}
            <span className="font-semibold text-violet-300">
              {profileType.replace("-", " ")}
            </span>{" "}
            who wants to{" "}
            <span className="font-semibold text-violet-300">
              {goal.replace("-", " ")}
            </span>{" "}
            with{" "}
            <span className="font-semibold text-violet-300">
              {
                difficultyOptions.find((d) => d.id === preferredDifficulty)
                  ?.label
              }
            </span>{" "}
            problems.
          </p>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-base-content flex justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* step indicator */}
        <div className="mb-4 flex items-center justify-between text-[11px] text-slate-300/80">
          <span>Step {step} of 3</span>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={
                  "h-1.5 w-6 rounded-full transition-colors " +
                  (s <= step ? "bg-violet-400" : "bg-slate-700")
                }
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-5 py-6 shadow-2xl backdrop-blur-sm">
          {renderStepContent()}
        </div>

        {/* Bottom actions */}
        <div className="mt-5 flex items-center justify-between">
          {step === 1 ? (
            <button
              type="button"
              className="btn btn-ghost btn-xs normal-case text-[11px] text-slate-300"
              onClick={() => navigate("/signup")}
            >
              Skip for now
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-ghost btn-xs normal-case text-[11px]"
              onClick={prev}
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              className="btn btn-sm px-6 rounded-full bg-violet-500 border-0 text-slate-50 shadow-lg hover:bg-violet-400"
              onClick={next}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sm px-6 rounded-full bg-violet-500 border-0 text-slate-50 shadow-lg hover:bg-violet-400"
              onClick={handleContinue}
            >
              Continue to signup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
