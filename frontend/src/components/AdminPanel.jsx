import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum(["array", "linkedList", "graph", "dp"]),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one visible test case required"),

  // Hidden test cases now include explanation
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one hidden test case required"),

  startCode: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        initialCode: z.string().min(1, "Initial code is required"),
      })
    )
    .length(3, "All three languages required"),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        completeCode: z.string().min(1, "Complete code is required"),
      })
    )
    .length(3, "All three languages required"),
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: "C++", initialCode: "" },
        { language: "Java", initialCode: "" },
        { language: "JavaScript", initialCode: "" },
      ],
      referenceSolution: [
        { language: "C++", completeCode: "" },
        { language: "Java", completeCode: "" },
        { language: "JavaScript", completeCode: "" },
      ],
      visibleTestCases: [],
      hiddenTestCases: [],
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  // Generate hidden test cases with AI (includes explanation)
  const handleGenerateHiddenWithAI = async () => {
    const { title, description } = getValues();

    if (!title || !description) {
      alert("Pehle Title aur Description bhar lo, tab hi AI se test cases banenge.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/problem/generate-testcases",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title, description }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "AI test cases generate karte waqt error aaya.");
        return;
      }

      const cases = data.testCases || [];

      if (!cases.length) {
        alert("AI ne koi hidden test case nahi diya.");
        return;
      }

      // clear existing hidden cases safely (reverse order)
      for (let i = hiddenFields.length - 1; i >= 0; i--) {
        removeHidden(i);
      }

      cases.forEach((tc, idx) => {
        appendHidden({
          input: tc.input ?? "",
          output: tc.expectedOutput ?? "",
          explanation:
            (tc.explanation && tc.explanation.trim()) ||
            `Auto-generated hidden test case #${idx + 1} to cover additional scenario.`,
        });
      });

      alert(`AI ne ${cases.length} hidden test cases add kar diye.`);
    } catch (err) {
      console.error(err);
      alert("Network error: AI test cases generate nahi ho paye.");
    }
  };

  const onSubmit = async (data) => {
    try {
      await axiosClient.post("/problem/create", data);
      alert("Problem created successfully!");
      navigate("/");
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200 text-base-content flex justify-center px-4 py-6">
      <div className="w-full max-w-5xl">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Create new problem
            </h1>
            <p className="mt-1 text-xs text-base-content/70">
              Add statement, testcases and starter code for all languages.
            </p>
          </div>
          <span className="badge badge-outline text-[10px]">Admin panel</span>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Basic Information */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="card-title text-base">Basic information</h2>
                  <p className="text-[11px] text-base-content/60">
                    Title, description, difficulty and main topic tag.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="label py-1">
                    <span className="label-text text-xs font-medium">
                      Title
                    </span>
                  </label>
                  <input
                    {...register("title")}
                    placeholder="e.g. Subarray with given sum"
                    className={`input input-sm input-bordered w-full ${
                      errors.title && "input-error"
                    }`}
                  />
                  {errors.title && (
                    <span className="mt-1 text-[11px] text-error">
                      {errors.title.message}
                    </span>
                  )}
                </div>

                {/* Difficulty */}
                <div>
                  <label className="label py-1">
                    <span className="label-text text-xs font-medium">
                      Difficulty
                    </span>
                  </label>
                  <select
                    {...register("difficulty")}
                    className={`select select-sm select-bordered w-full ${
                      errors.difficulty && "select-error"
                    }`}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-xs font-medium">
                    Description
                  </span>
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Explain the problem, input/output format and examples..."
                  className={`textarea textarea-bordered textarea-sm w-full min-h-32 ${
                    errors.description && "textarea-error"
                  }`}
                />
                {errors.description && (
                  <span className="mt-1 text-[11px] text-error">
                    {errors.description.message}
                  </span>
                )}
              </div>

              {/* Tag */}
              <div className="w-full md:w-1/3">
                <label className="label py-1">
                  <span className="label-text text-xs font-medium">Tag</span>
                </label>
                <select
                  {...register("tags")}
                  className={`select select-sm select-bordered w-full ${
                    errors.tags && "select-error"
                  }`}
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
                {errors.tags && (
                  <span className="mt-1 text-[11px] text-error">
                    {errors.tags.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="card-title text-base">Test cases</h2>
                  <p className="text-[11px] text-base-content/60">
                    Visible cases are shown to users, hidden cases are used only
                    for evaluation.
                  </p>
                </div>
              </div>

              {/* Visible Test Cases */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Visible test cases</h3>
                  <button
                    type="button"
                    onClick={() =>
                      appendVisible({
                        input: "",
                        output: "",
                        explanation: "",
                      })
                    }
                    className="btn btn-xs btn-primary"
                  >
                    + Add visible case
                  </button>
                </div>

                {visibleFields.length === 0 && (
                  <p className="rounded-md border border-dashed border-base-300 bg-base-200 px-3 py-2 text-[11px] text-base-content/70">
                    No visible testcases yet. Add at least one simple example.
                  </p>
                )}

                <div className="space-y-3">
                  {visibleFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-md border border-base-300 bg-base-200/80 p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium">
                          Case {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeVisible(index)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          Remove
                        </button>
                      </div>

                      <input
                        {...register(`visibleTestCases.${index}.input`)}
                        placeholder="Input"
                        className="input input-xs input-bordered w-full"
                      />
                      <input
                        {...register(`visibleTestCases.${index}.output`)}
                        placeholder="Output"
                        className="input input-xs input-bordered w-full"
                      />
                      <textarea
                        {...register(`visibleTestCases.${index}.explanation`)}
                        placeholder="Explanation"
                        className="textarea textarea-bordered textarea-xs w-full"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Hidden Test Cases */}
              <section className="space-y-3 border-t border-base-300 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Hidden test cases</h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateHiddenWithAI}
                      className="btn btn-xs btn-secondary"
                    >
                      Generate with AI
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        appendHidden({
                          input: "",
                          output: "",
                          explanation: "",
                        })
                      }
                      className="btn btn-xs btn-primary"
                    >
                      + Add hidden case
                    </button>
                  </div>
                </div>

                {hiddenFields.length === 0 && (
                  <p className="rounded-md border border-dashed border-base-300 bg-base-200 px-3 py-2 text-[11px] text-base-content/70">
                    Hidden cases will be used to catch edge cases and cheating.
                  </p>
                )}

                <div className="space-y-3">
                  {hiddenFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-md border border-base-300 bg-base-200/80 p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium">
                          Hidden case {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeHidden(index)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          Remove
                        </button>
                      </div>

                      <input
                        {...register(`hiddenTestCases.${index}.input`)}
                        placeholder="Input"
                        className="input input-xs input-bordered w-full"
                      />
                      <input
                        {...register(`hiddenTestCases.${index}.output`)}
                        placeholder="Output"
                        className="input input-xs input-bordered w-full"
                      />
                      <textarea
                        {...register(`hiddenTestCases.${index}.explanation`)}
                        placeholder="Explanation"
                        className="textarea textarea-bordered textarea-xs w-full"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Code Templates */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="card-title text-base">Code templates</h2>
                  <p className="text-[11px] text-base-content/60">
                    Starter code and reference solutions for each language.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="text-sm font-semibold">
                      {index === 0
                        ? "C++"
                        : index === 1
                        ? "Java"
                        : "JavaScript"}
                    </h3>

                    <div className="space-y-1">
                      <span className="text-[11px] font-medium">
                        Initial code
                      </span>
                      <div className="rounded-md border border-base-300 bg-base-200">
                        <textarea
                          {...register(`startCode.${index}.initialCode`)}
                          className="textarea textarea-xs w-full bg-transparent font-mono leading-relaxed"
                          rows={6}
                          spellCheck={false}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-medium">
                        Reference solution
                      </span>
                      <div className="rounded-md border border-base-300 bg-base-200">
                        <textarea
                          {...register(
                            `referenceSolution.${index}.completeCode`
                          )}
                          className="textarea textarea-xs w-full bg-transparent font-mono leading-relaxed"
                          rows={6}
                          spellCheck={false}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block mt-2"
          >
            Create problem
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
