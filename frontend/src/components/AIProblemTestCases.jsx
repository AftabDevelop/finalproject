import { useState } from "react";

function AIProblemTestCases() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    setTestCases([]);

    try {
      const res = await fetch("http://localhost:3000/problem/generate-testcases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        const cases = data.testCases || [];
        setTestCases(cases);
        setInfo(`AI ne ${cases.length} test cases generate kiye (backend).`);
        if (cases.length > 0) {
          alert(`AI ne ${cases.length} test cases generate kiye (backend).`);
        }
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="max-w-3xl mx-auto bg-base-100 shadow-xl rounded-xl p-8">
        <h1 className="text-2xl font-semibold mb-2">
          AI Test Case Generator
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Problem ka title aur description do, AI automatically diverse test cases banayega.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Problem Title
            </label>
            <input
              className="input input-bordered w-full"
              placeholder="e.g. Two Sum"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Problem Description
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-40"
              placeholder="Describe the problem, constraints, input/output format..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <div className="alert alert-error text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !title || !description}
            className="btn btn-primary"
          >
            {loading ? "Generating..." : "Generate Test Cases"}
          </button>

          {info && (
            <p className="mt-2 text-sm text-green-400">
              {info}
            </p>
          )}
        </form>

        {testCases.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">
              Generated Test Cases
            </h2>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {testCases.map((tc, idx) => (
                <div
                  key={idx}
                  className="border border-base-300 rounded-lg p-3 text-sm bg-base-200"
                >
                  <div className="font-semibold mb-1">
                    #{idx + 1} ({tc.explanation || "Test case"})
                  </div>
                  <div>
                    <span className="font-medium">Input:</span> {tc.input}
                  </div>
                  <div>
                    <span className="font-medium">Expected Output:</span>{" "}
                    {tc.expectedOutput}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIProblemTestCases;
