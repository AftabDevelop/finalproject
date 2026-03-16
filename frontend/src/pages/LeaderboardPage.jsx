import { useEffect, useState, useMemo } from "react";
import axiosClient from "../utils/axiosClient";

const TIME_RANGES = ["overall", "month", "week"];

function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("overall");

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const { data } = await axiosClient.get("/api/leaderboard", {
          params: { range: timeRange }, // backend me optional use kar sakta hai
        });
        setRows(data || []);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [timeRange]);

  const topThree = useMemo(() => rows.slice(0, 3), [rows]);

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header + tabs */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Leaderboard
            </h2>
            <p className="text-[11px] text-base-content/60">
              Ranked by total points
            </p>
          </div>

          <div className="flex items-center gap-2 bg-base-300 rounded-full px-1 py-1">
            {TIME_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-full text-[11px] capitalize transition-colors ${
                  timeRange === range
                    ? "bg-primary text-primary-content"
                    : "text-base-content/70 hover:bg-base-200"
                }`}
              >
                {range === "overall"
                  ? "All time"
                  : range === "month"
                  ? "This month"
                  : "This week"}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 cards */}
        {topThree.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            {topThree.map((row, idx) => {
              const rank = row.rank;
              const colors =
                rank === 1
                  ? "bg-yellow-500/10 border-yellow-500/40"
                  : rank === 2
                  ? "bg-slate-200/5 border-slate-300/40"
                  : "bg-amber-700/10 border-amber-700/40";

              const label =
                rank === 1 ? "Top coder" : rank === 2 ? "Runner‑up" : "Third place";

              return (
                <div
                  key={row.emailId}
                  className={`border ${colors} rounded-xl px-4 py-3 flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-base-content/60">
                        #{rank}
                      </span>
                      <span className="text-sm font-semibold">
                        {row.firstName}
                      </span>
                    </div>
                    <span className="text-[11px] text-base-content/60">
                      {label}
                    </span>
                  </div>

                  <p className="text-[11px] text-base-content/50 truncate mb-2">
                    {row.emailId}
                  </p>

                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex flex-col">
                      <span className="text-base-content/60">Points</span>
                      <span className="font-semibold text-primary">
                        {row.totalPoints}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base-content/60">Solved</span>
                      <span className="font-semibold">
                        {row.easySolved + row.mediumSolved + row.hardSolved}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-base-content/60">Difficulty</span>
                      <span className="text-[10px]">
                        E:{row.easySolved} M:{row.mediumSolved} H:{row.hardSolved}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full list card */}
        <div className="bg-base-100 rounded-xl p-4 border border-base-300/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-base-content/60">
              {rows.length} players
            </span>
            <span className="text-[10px] uppercase text-base-content/50">
              Top {Math.min(rows.length, 10)}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-6">
              <span className="loading loading-spinner loading-sm" />
            </div>
          ) : rows.length === 0 ? (
            <p className="text-xs text-base-content/60">
              No submissions yet. Solve problems to appear here.
            </p>
          ) : (
            <div className="space-y-1">
              {rows.slice(0, 10).map((row) => {
                const rank = row.rank;

                const rankBg =
                  rank === 1
                    ? "bg-yellow-500/10 border-yellow-500/40"
                    : rank === 2
                    ? "bg-slate-200/5 border-slate-300/40"
                    : rank === 3
                    ? "bg-amber-700/10 border-amber-700/40"
                    : "bg-transparent border-transparent";

                const rankText =
                  rank === 1
                    ? "text-yellow-400"
                    : rank === 2
                    ? "text-slate-200"
                    : rank === 3
                    ? "text-amber-500"
                    : "text-base-content/70";

                return (
                  <div
                    key={row.emailId}
                    className={`flex items-center justify-between text-xs px-3 py-2 rounded-lg hover:bg-base-200/70 transition-colors border ${rankBg}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-4 text-[11px] font-semibold text-center ${rankText}`}
                      >
                        {rank}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium truncate max-w-[160px]">
                          {row.firstName}
                        </span>
                        <span className="text-[10px] text-base-content/50 truncate max-w-[200px]">
                          {row.emailId}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end gap-3 text-[11px]">
                      <span className="font-semibold text-primary">
                        {row.totalPoints} pts
                      </span>
                      <span className="text-base-content/60">
                        {row.easySolved + row.mediumSolved + row.hardSolved} solved
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
