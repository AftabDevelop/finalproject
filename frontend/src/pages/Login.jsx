import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { loginUser } from "../authSlice";
import { useEffect, useState } from "react";

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak"),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md">
        {/* brand + subtitle */}
        <div className="mb-5 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-6 w-6 rounded-md bg-emerald-500" />
            <span className="text-lg font-semibold tracking-tight text-slate-100">
              CodeJudge
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Log in to continue solving problems and track your progress.
          </p>
        </div>

        <div className="card bg-slate-900/80 border border-slate-700/70 shadow-2xl backdrop-blur-sm">
          <div className="card-body px-6 py-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-50">
              Welcome back
            </h2>

            {error && (
              <div className="mb-3 rounded-md border border-error/60 bg-error/10 px-3 py-2 text-[11px] text-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs text-slate-200">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className={`input input-bordered input-sm w-full bg-slate-950/80 text-slate-100 ${
                    errors.emailId ? "input-error" : "border-slate-700"
                  }`}
                  {...register("emailId")}
                />
                {errors.emailId && (
                  <span className="text-error text-[11px] mt-1">
                    {errors.emailId.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs text-slate-200">
                    Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`input input-bordered input-sm w-full pr-10 bg-slate-950/80 text-slate-100 ${
                      errors.password ? "input-error" : "border-slate-700"
                    }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-error text-[11px] mt-1">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Submit */}
              <div className="form-control pt-3">
                <button
                  type="submit"
                  className={`btn btn-sm rounded-full bg-emerald-500 border-0 text-slate-950 font-medium hover:bg-emerald-400 ${
                    loading ? "loading btn-disabled" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center text-[11px] text-slate-400">
              Don&apos;t have an account?{" "}
              <NavLink to="/signup" className="link link-primary text-xs">
                Sign up
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
