import { NavLink, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const typewriterWords = ["Practice", "Upskill", "Crack"];

function useTypewriter(words, typingSpeed = 120, pauseTime = 1200) {
  const [index, setIndex] = useState(0); // current word index
  const [subIndex, setSubIndex] = useState(0); // current substring length
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index];

    // pause at full word
    if (!deleting && subIndex === currentWord.length) {
      const timeout = setTimeout(() => setDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    // when finished deleting, move to next word
    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (deleting ? -1 : 1));
      },
      deleting ? typingSpeed / 2 : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, words, typingSpeed, pauseTime]);

  return words[index].substring(0, subIndex);
}

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const typedWord = useTypewriter(typewriterWords);

  const handlePrimary = () => {
    if (isAuthenticated) {
      navigate("/");
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content flex flex-col">
      {/* Top nav */}
      <header className="w-full border-b border-base-300 bg-base-100/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md bg-emerald-500" />
            <span className="text-lg font-semibold tracking-tight">
              CodeJudge
            </span>
          </div>

          <nav className="hidden items-center gap-6 text-xs text-base-content/70 md:flex">
            <button className="hover:text-base-content hover:underline underline-offset-4">
              Products
            </button>
            <button className="hover:text-base-content hover:underline underline-offset-4">
              Solutions
            </button>
            <button className="hover:text-base-content hover:underline underline-offset-4">
              Resources
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className="btn btn-ghost btn-xs normal-case text-xs"
            >
              Log in
            </NavLink>
            <button
              onClick={handlePrimary}
              className="btn btn-xs bg-slate-900 text-slate-50 hover:bg-slate-800 rounded-full px-4"
            >
              Create a free account
            </button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex flex-1 items-center">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:flex-row md:items-center">
          {/* Left: text */}
          <section className="flex-1">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight mb-4">
              <span className="text-emerald-400">
                {typedWord || "Practice"}
                <span className="inline-block w-[2px] ml-0.5 bg-emerald-400 align-middle animate-pulse" />
              </span>{" "}
              DSA and{" "}
              <br className="hidden md:block" />
              crack your next{" "}
              <span className="text-emerald-400">interview</span>.
            </h1>
            <p className="max-w-xl text-sm text-base-content/70 mb-6">
              CodeJudge helps students and developers solve real interview‑style
              problems with instant feedback, AI‑generated testcases, and a
              clean HackerRank‑inspired coding environment.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button
                onClick={handlePrimary}
                className="btn btn-sm rounded-full px-6 bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400"
              >
                Start solving for free
              </button>

              <NavLink
                to={isAuthenticated ? "/" : "/login"}
                className="btn btn-ghost btn-sm normal-case text-xs"
              >
                View problem set
              </NavLink>
            </div>

            <p className="text-[11px] text-base-content/60">
              No credit card needed • Built for students & freshers • AI‑powered
              hidden testcases
            </p>
          </section>

          {/* Right: stats card */}
          <section className="flex-1">
            <div className="mx-auto w-full max-w-md rounded-2xl border border-base-300 bg-base-100 px-5 py-4 shadow-lg">
              <p className="text-xs font-medium text-base-content/70 mb-3">
                Live snapshot
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Practice problems</span>
                  <span className="font-semibold text-base-content">50+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>AI‑generated hidden cases</span>
                  <span className="font-semibold text-base-content">
                    Enabled
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Languages supported</span>
                  <span className="font-semibold text-base-content">
                    C++, Java, JS
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-base-200 px-4 py-3 text-[11px] text-base-content/70">
                <p className="font-medium mb-1 text-base-content">
                  “Feels just like solving on HackerRank.”
                </p>
                <p>
                  Clean editor, clear testcases, and instant feedback for every
                  submission.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
