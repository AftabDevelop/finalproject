import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get(
          "/problem/problemSolvedByUser"
        );
        setSolvedProblems(data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" ||
      problem.difficulty === filters.difficulty;

    const tagMatch =
      filters.tag === "all" || problem.tags === filters.tag;

    const isSolved = solvedProblems.some(
      (sp) => sp._id === problem._id
    );

    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" && isSolved);

    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navigation Bar */}
      <nav className="navbar bg-base-100 shadow-sm px-4">
        <div className="flex-1">
          <NavLink
            to="/"
            className="btn btn-ghost px-0 text-xl font-semibold tracking-tight"
          >
            CodeJudge
          </NavLink>
        </div>
        <div className="flex-none gap-4">
          {user && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost btn-sm px-3">
                {user.firstName}
              </div>
              <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                {user.role === "admin" && (
                  <li>
                    <NavLink to="/admin">Admin</NavLink>
                  </li>
                )}
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Header + count */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-semibold tracking-tight">
            Problems
          </h1>
          <span className="text-xs text-base-content/60">
            {filteredProblems.length} of {problems.length} problems
          </span>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            className="select select-sm select-bordered"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="all">All problems</option>
            <option value="solved">Solved problems</option>
          </select>

          <select
            className="select select-sm select-bordered"
            value={filters.difficulty}
            onChange={(e) =>
              setFilters({ ...filters, difficulty: e.target.value })
            }
          >
            <option value="all">All difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select select-sm select-bordered"
            value={filters.tag}
            onChange={(e) =>
              setFilters({ ...filters, tag: e.target.value })
            }
          >
            <option value="all">All tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {/* Problems List */}
        <div className="grid gap-3">
          {filteredProblems.map((problem) => {
            const isSolved = solvedProblems.some(
              (sp) => sp._id === problem._id
            );

            return (
              <div
                key={problem._id}
                className="card bg-base-100 shadow-sm border border-base-300 hover:border-primary/60 transition-colors"
              >
                <div className="card-body py-3">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="card-title text-sm md:text-base">
                      <NavLink
                        to={`/problem/${problem._id}`}
                        className="hover:text-primary"
                      >
                        {problem.title}
                      </NavLink>
                    </h2>

                    <div className="flex items-center gap-2">
                      {isSolved ? (
                        <span className="badge badge-success badge-sm gap-1">
                          ✔ Solved
                        </span>
                      ) : (
                        <span className="badge badge-ghost badge-sm">
                          Unsolved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span
                      className={`badge badge-sm ${getDifficultyBadgeColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="badge badge-sm badge-info">
                      {problem.tags}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredProblems.length === 0 && (
            <div className="py-10 text-center text-xs text-base-content/60">
              No problems match the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export default Homepage;
