// src/pages/AdminUpdate.jsx
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

const AdminUpdate = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingProblem, setEditingProblem] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    tags: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/problem/getAllProblem");
      setProblems(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (problem) => {
    setEditingProblem(problem);
    setForm({
      title: problem.title || "",
      description: problem.description || "",
      difficulty: problem.difficulty || "Easy",
      tags: Array.isArray(problem.tags)
        ? problem.tags.join(", ")
        : problem.tags || "",
    });
  };

  const closeEdit = () => {
    setEditingProblem(null);
    setForm({
      title: "",
      description: "",
      difficulty: "Easy",
      tags: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingProblem) return;

    try {
      setSaving(true);

      // ✅ FIXED: tags ko string bhej, array nahi
      const payload = {
        title: form.title,
        description: form.description,
        difficulty: form.difficulty,
        tags: form.tags, // string as-is
      };

      const { data } = await axiosClient.put(
        `/problem/update/${editingProblem._id}`,
        payload
      );

      // local list update
      setProblems((prev) => prev.map((p) => (p._id === data._id ? data : p)));

      closeEdit();
      setError(null); // clear previous errors
    } catch (err) {
      console.error(err);
      setError("Failed to update problem");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Update Problems</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="w-1/12">#</th>
              <th className="w-4/12">Title</th>
              <th className="w-2/12">Difficulty</th>
              <th className="w-3/12">Tags</th>
              <th className="w-2/12">Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr key={problem._id}>
                <th>{index + 1}</th>
                <td>{problem.title}</td>
                <td>
                  <span
                    className={`badge ${
                      problem.difficulty === "Easy"
                        ? "badge-success"
                        : problem.difficulty === "Medium"
                        ? "badge-warning"
                        : "badge-error"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </td>
                <td>
                  <span className="badge badge-outline">
                    {Array.isArray(problem.tags)
                      ? problem.tags.join(", ")
                      : problem.tags}
                  </span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEdit(problem)}
                      className="btn btn-sm btn-primary"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingProblem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-xl">
            <h2 className="text-2xl font-bold mb-4">
              Edit Problem - {editingProblem.title}
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="input input-bordered w-full"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  className="textarea textarea-bordered w-full"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Difficulty</span>
                </label>
                <select
                  name="difficulty"
                  className="select select-bordered w-full"
                  value={form.difficulty}
                  onChange={handleChange}
                >
                  <option value="easy">Easy</option> {/* ✅ lowercase */}
                  <option value="medium">Medium</option> {/* ✅ lowercase */}
                  <option value="hard">Hard</option> {/* ✅ lowercase */}
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Tags (comma separated)</span>
                </label>
                <input
                  type="text"
                  name="tags"
                  className="input input-bordered w-full"
                  value={form.tags}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpdate;
