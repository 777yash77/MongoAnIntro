"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

type QueryCard = {
  title: string;
  description: string;
  code: string;
  level?: string;
};

type Topic = {
  id: TopicId;
  label: string;
  eyebrow: string;
  heading: string;
  summary: string;
  queries: QueryCard[];
};

type TopicId =
  | "setup"
  | "create"
  | "read"
  | "update"
  | "delete"
  | "aggregate"
  | "challenge";

type Challenge = {
  prompt: string;
  answer: string;
  hint: string;
};

const topics: Topic[] = [
  {
    id: "setup",
    label: "Setup",
    eyebrow: "Foundation",
    heading: "Start with a realistic Mongo shell workflow",
    summary:
      "These commands prepare a collection and seed enough data to practice filtering, updates, and aggregation without staying at beginner level.",
    queries: [
      {
        title: "Download MongoDB Community Server",
        description:
          "Use the official installer link to download MongoDB for Windows directly from the setup section.",
        level: "Starter",
        code: "Download from the button below",
      },
      {
        title: "Switch database",
        description: "Create or move into the working database for command practice.",
        level: "Core",
        code: "use mongoCommandLab",
      },
      {
        title: "Create collection with validation",
        description:
          "Add a lightweight schema so bad documents do not silently enter the collection.",
        level: "Intermediate",
        code: `db.createCollection("students", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "dept", "marks", "semester"],
      properties: {
        name: { bsonType: "string" },
        dept: { bsonType: "string" },
        marks: { bsonType: "int", minimum: 0, maximum: 100 },
        semester: { bsonType: "int", minimum: 1, maximum: 8 },
        skills: {
          bsonType: "array",
          items: { bsonType: "string" }
        }
      }
    }
  }
})`,
      },
      {
        title: "Seed sample records",
        description:
          "Insert richer documents with arrays and nested fields so advanced queries are actually meaningful.",
        level: "Practice data",
        code: `db.students.insertMany([
  {
    name: "Aarav",
    dept: "CSE",
    semester: 5,
    marks: 91,
    city: "Bengaluru",
    skills: ["mongodb", "node", "react"],
    projects: { completed: 3, active: 1 }
  },
  {
    name: "Diya",
    dept: "ECE",
    semester: 6,
    marks: 84,
    city: "Chennai",
    skills: ["iot", "python"],
    projects: { completed: 2, active: 2 }
  },
  {
    name: "Kabir",
    dept: "CSE",
    semester: 4,
    marks: 76,
    city: "Hyderabad",
    skills: ["mongodb", "java"],
    projects: { completed: 1, active: 1 }
  },
  {
    name: "Meera",
    dept: "IT",
    semester: 7,
    marks: 88,
    city: "Pune",
    skills: ["aws", "mongodb", "analytics"],
    projects: { completed: 4, active: 1 }
  },
  {
    name: "Rohan",
    dept: "MECH",
    semester: 6,
    marks: 69,
    city: "Coimbatore",
    skills: ["cad", "matlab"],
    projects: { completed: 2, active: 0 }
  }
])`,
      },
    ],
  },
  {
    id: "create",
    label: "Create",
    eyebrow: "Insert Queries",
    heading: "Insert commands beyond the basic one-line examples",
    summary:
      "This section focuses on create operations, especially inserts with multiple fields, generated values, and safer write options.",
    queries: [
      {
        title: "Insert one detailed document",
        description:
          "Store nested objects and arrays in a single write, which is common in MongoDB designs.",
        level: "Intermediate",
        code: `db.students.insertOne({
  name: "Nisha",
  dept: "AI",
  semester: 3,
  marks: 95,
  city: "Mumbai",
  skills: ["python", "ml", "mongodb"],
  projects: { completed: 2, active: 1 },
  createdAt: new Date()
})`,
      },
      {
        title: "Ordered bulk insert",
        description:
          "Use ordered insert mode when sequence matters and you want the batch to stop on the first failure.",
        level: "Intermediate",
        code: `db.students.insertMany(
  [
    {
      name: "Farhan",
      dept: "CSE",
      semester: 2,
      marks: 82,
      city: "Delhi",
      skills: ["c", "mongodb"]
    },
    {
      name: "Isha",
      dept: "DS",
      semester: 4,
      marks: 89,
      city: "Kolkata",
      skills: ["sql", "python", "statistics"]
    }
  ],
  { ordered: true }
)`,
      },
      {
        title: "Upsert while creating if missing",
        description:
          "Create a record only if it does not exist, which is useful for seeded or admin-managed data.",
        level: "Useful pattern",
        code: `db.students.updateOne(
  { name: "Admin Demo" },
  {
    $setOnInsert: {
      dept: "ADMIN",
      semester: 1,
      marks: 0,
      city: "Remote",
      skills: []
    }
  },
  { upsert: true }
)`,
      },
    ],
  },
  {
    id: "read",
    label: "Read",
    eyebrow: "Filtering",
    heading: "Use better filters, projections, sorting, and array matching",
    summary:
      "These queries move from simple finds to the kinds of conditions you use in assignments, labs, and interview exercises.",
    queries: [
      {
        title: "Filter with range and sort",
        description:
          "Find strong performers and show the highest marks first.",
        level: "Intermediate",
        code: `db.students
  .find({ marks: { $gte: 80, $lte: 95 } })
  .sort({ marks: -1 })`,
      },
      {
        title: "Projection without internal id",
        description:
          "Return only the fields needed by the UI or report output.",
        level: "Core",
        code: `db.students.find(
  { dept: "CSE" },
  { _id: 0, name: 1, semester: 1, marks: 1, city: 1 }
)`,
      },
      {
        title: "Find documents by array value",
        description:
          "Match students who already know MongoDB as one of their skills.",
        level: "Intermediate",
        code: `db.students.find({
  skills: "mongodb"
})`,
      },
      {
        title: "Combine AND and OR conditions",
        description:
          "Useful when requirements mix department rules with score thresholds.",
        level: "Interview-style",
        code: `db.students.find({
  $and: [
    { semester: { $gte: 4 } },
    {
      $or: [
        { dept: "CSE" },
        { marks: { $gt: 90 } }
      ]
    }
  ]
})`,
      },
      {
        title: "Match nested object values",
        description:
          "Query based on counts inside an embedded object.",
        level: "Intermediate",
        code: `db.students.find({
  "projects.completed": { $gte: 3 }
})`,
      },
      {
        title: "Paginate with skip and limit",
        description:
          "Common admin panel pattern for handling larger collections.",
        level: "Practical",
        code: `db.students
  .find({})
  .sort({ name: 1 })
  .skip(0)
  .limit(5)`,
      },
    ],
  },
  {
    id: "update",
    label: "Update",
    eyebrow: "Modify Data",
    heading: "Update documents with operators instead of replacing entire records",
    summary:
      "Intermediate Mongo work usually means targeted updates: incrementing counters, pushing into arrays, and using array or conditional operators.",
    queries: [
      {
        title: "Set multiple fields in one update",
        description:
          "Promote a student to the next semester and refresh marks in the same operation.",
        level: "Core",
        code: `db.students.updateOne(
  { name: "Kabir" },
  {
    $set: {
      semester: 5,
      marks: 81,
      city: "Hyderabad"
    }
  }
)`,
      },
      {
        title: "Increment nested values",
        description:
          "Track project completion without rewriting the full document.",
        level: "Intermediate",
        code: `db.students.updateMany(
  { dept: "CSE" },
  {
    $inc: {
      "projects.completed": 1
    }
  }
)`,
      },
      {
        title: "Push a new skill into an array",
        description:
          "Append values to arrays during profile enrichment.",
        level: "Intermediate",
        code: `db.students.updateOne(
  { name: "Diya" },
  {
    $push: { skills: "mongodb" }
  }
)`,
      },
      {
        title: "Add to array only if missing",
        description:
          "Avoid duplicate skill tags by using a set-like array update.",
        level: "Better practice",
        code: `db.students.updateOne(
  { name: "Meera" },
  {
    $addToSet: { skills: "cloud-security" }
  }
)`,
      },
    ],
  },
  {
    id: "delete",
    label: "Delete",
    eyebrow: "Remove Data",
    heading: "Delete commands with conditions you would actually use",
    summary:
      "Deleting should be precise. These examples show targeted cleanup and batch removal patterns instead of broad destructive queries.",
    queries: [
      {
        title: "Delete one archived demo row",
        description:
          "Remove a single record by an exact identifier.",
        level: "Core",
        code: `db.students.deleteOne({
  name: "Admin Demo"
})`,
      },
      {
        title: "Delete many low-score records",
        description:
          "Clean up failing practice data with a score threshold.",
        level: "Intermediate",
        code: `db.students.deleteMany({
  marks: { $lt: 70 }
})`,
      },
      {
        title: "Delete with multiple conditions",
        description:
          "Use combined filters when data removal needs to be safer and more specific.",
        level: "Safer pattern",
        code: `db.students.deleteMany({
  dept: "MECH",
  semester: { $gte: 6 }
})`,
      },
    ],
  },
  {
    id: "aggregate",
    label: "Aggregate",
    eyebrow: "Analysis",
    heading: "Use aggregation pipelines for reporting and summaries",
    summary:
      "Aggregation is where Mongo starts feeling more intermediate. These pipelines group, reshape, and rank data for dashboards and reports.",
    queries: [
      {
        title: "Average marks by department",
        description:
          "Create a grouped academic performance summary.",
        level: "Intermediate",
        code: `db.students.aggregate([
  {
    $group: {
      _id: "$dept",
      averageMarks: { $avg: "$marks" },
      totalStudents: { $sum: 1 }
    }
  },
  { $sort: { averageMarks: -1 } }
])`,
      },
      {
        title: "Top students report",
        description:
          "Project only the fields needed after sorting the collection.",
        level: "Practical",
        code: `db.students.aggregate([
  { $sort: { marks: -1 } },
  { $limit: 3 },
  {
    $project: {
      _id: 0,
      name: 1,
      dept: 1,
      marks: 1
    }
  }
])`,
      },
      {
        title: "Count skill usage",
        description:
          "Break arrays into separate rows and measure which skills are most common.",
        level: "Intermediate",
        code: `db.students.aggregate([
  { $unwind: "$skills" },
  {
    $group: {
      _id: "$skills",
      total: { $sum: 1 }
    }
  },
  { $sort: { total: -1, _id: 1 } }
])`,
      },
    ],
  },
];

const challenges: Challenge[] = [
  {
    prompt: "Write a query to show only CSE students with marks greater than or equal to 80.",
    answer: `db.students.find({
  dept: "CSE",
  marks: { $gte: 80 }
})`,
    hint: "Use both `dept` and `marks` in the same filter object.",
  },
  {
    prompt: "Write an update query to add `mongodb` to Meera's skills without creating duplicates.",
    answer: `db.students.updateOne(
  { name: "Meera" },
  { $addToSet: { skills: "mongodb" } }
)`,
    hint: "Use `$addToSet`, not `$push`.",
  },
  {
    prompt: "Write an aggregation query to count how many students belong to each department.",
    answer: `db.students.aggregate([
  {
    $group: {
      _id: "$dept",
      totalStudents: { $sum: 1 }
    }
  }
])`,
    hint: "Start with `db.students.aggregate([` and use `$group`.",
  },
  {
    prompt: "Write a query to delete students whose marks are less than 70.",
    answer: `db.students.deleteMany({
  marks: { $lt: 70 }
})`,
    hint: "Use `deleteMany` with a `marks` filter.",
  },
  {
    prompt: "Write a query to show the top 3 students by marks in descending order.",
    answer: `db.students.find({})
  .sort({ marks: -1 })
  .limit(3)`,
    hint: "Use `find`, then `sort`, then `limit`.",
  },
];

function normalizeCode(value: string) {
  return value.replace(/\s+/g, "").trim();
}

export default function Home() {
  const [activeTopic, setActiveTopic] = useState<TopicId>("create");
  const [copied, setCopied] = useState<string | null>(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeCode, setChallengeCode] = useState("");
  const [challengeResult, setChallengeResult] = useState("");

  const selectedTopic = topics.find((topic) => topic.id === activeTopic);
  const activeChallenge = challenges[challengeIndex];

  const copyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1200);
  };

  const checkAnswer = () => {
    if (normalizeCode(challengeCode) === normalizeCode(activeChallenge.answer)) {
      setChallengeResult("Correct answer.");
      return;
    }

    setChallengeResult("Not quite. Use the hint and try again.");
  };

  const nextChallenge = () => {
    setChallengeIndex((current) => (current + 1) % challenges.length);
    setChallengeCode("");
    setChallengeResult("");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_32%),linear-gradient(180deg,_#06110b_0%,_#081510_45%,_#030806_100%)] text-stone-100">
      <div className="mx-auto flex min-h-screen w-full max-w-none flex-col gap-8 px-4 py-6 md:px-6 lg:flex-row lg:px-8 2xl:px-10">
        <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:py-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">
              mongo Commands
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Mongo command lab
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              Filter by topic on the left. Each section focuses on queries that
              feel closer to lab exams, practice rounds, and intermediate usage.
            </p>

            <nav className="mt-6 space-y-2">
              {topics.map((topic) => {
                const isActive = topic.id === activeTopic;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setActiveTopic(topic.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                      isActive
                        ? "border-emerald-400/60 bg-emerald-400/15 text-white"
                        : "border-white/8 bg-black/20 text-stone-300 hover:border-white/20 hover:bg-white/6 hover:text-white"
                    }`}
                  >
                    <span className="text-sm font-medium">{topic.label}</span>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400">
                      {topic.eyebrow}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setActiveTopic("challenge")}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  activeTopic === "challenge"
                    ? "border-amber-400/60 bg-amber-300/15 text-white"
                    : "border-white/8 bg-black/20 text-stone-300 hover:border-white/20 hover:bg-white/6 hover:text-white"
                }`}
              >
                <span className="text-sm font-medium">Challenge</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400">
                  Practice
                </span>
              </button>
            </nav>

            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-50">
              <p className="font-medium">Quick note</p>
              <p className="mt-2 leading-6 text-emerald-50/85">
                The content now uses MongoDB commands consistently. Your earlier
                page mixed basic examples and encoding issues.
              </p>
            </div>
          </div>
        </aside>

        <section className="flex-1 py-2 lg:py-6">
          <div className="space-y-6">
            <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
              <div className="rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">
                  Topic based learning
                </p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                  {activeTopic === "challenge"
                    ? "Challenge your Mongo query skills"
                    : selectedTopic?.heading}
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">
                  {activeTopic === "challenge"
                    ? "Solve the active problem in the editor and compare your answer against a normalized version of the expected query."
                    : selectedTopic?.summary}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                    Sections
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {topics.length + 1}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                    Query cards
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {topics.reduce((total, topic) => total + topic.queries.length, 0)}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                    Challenges
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {challenges.length}
                  </p>
                </div>
              </div>
            </div>

            {activeTopic !== "challenge" && selectedTopic ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-emerald-200">
                    {selectedTopic.eyebrow}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-stone-300">
                    {selectedTopic.label}
                  </span>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  {selectedTopic.queries.map((query, index) => {
                    const cardId = `${selectedTopic.id}-${index}`;

                    return (
                      <article
                        key={cardId}
                        className="rounded-[28px] border border-white/10 bg-[#08110d]/90 p-5 shadow-lg shadow-black/20"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.28em] text-emerald-300/80">
                              {query.level ?? "Command"}
                            </p>
                            <h3 className="mt-2 text-xl font-semibold text-white">
                              {query.title}
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={() => copyCode(query.code, cardId)}
                            className="rounded-full border border-white/12 px-3 py-1 text-xs font-medium text-stone-200 transition hover:border-emerald-400/60 hover:bg-emerald-400/10"
                          >
                            {copied === cardId ? "Copied" : "Copy"}
                          </button>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-stone-300">
                          {query.description}
                        </p>

                        {selectedTopic.id === "setup" && index === 0 ? (
                          <div className="mt-4 flex flex-wrap gap-3">
                            <a
                              href="https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-8.2.6-signed.msi"
                              className="inline-flex rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300"
                            >
                              Download MongoDB
                            </a>
                            <a
                              href="https://downloads.mongodb.com/compass/mongosh-2.8.1-win32-x64.zip"
                              className="inline-flex rounded-full border border-emerald-400/50 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-400/10"
                            >
                              Download Mongosh
                            </a>
                            <a
                              href="https://downloads.mongodb.com/compass/mongodb-compass-1.49.4-win32-x64.exe"
                              className="inline-flex rounded-full border border-emerald-400/50 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-400/10"
                            >
                              Download Compass
                            </a>
                          </div>
                        ) : null}

                        <pre className="mt-4 overflow-x-auto rounded-2xl border border-emerald-400/15 bg-black/60 p-4 text-sm leading-6 text-emerald-300">
                          <code>{query.code}</code>
                        </pre>
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[28px] border border-white/10 bg-[#09120e]/90 p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-300/80">
                    Challenge {challengeIndex + 1}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">
                    {activeChallenge.prompt}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-stone-300">
                    Hint: {activeChallenge.hint}
                  </p>

                  <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
                    <Editor
                      height="280px"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={challengeCode}
                      onChange={(value) => setChallengeCode(value || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        padding: { top: 14, bottom: 14 },
                        scrollBeyondLastLine: false,
                      }}
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={checkAnswer}
                      className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300"
                    >
                      Check answer
                    </button>
                    <button
                      type="button"
                      onClick={nextChallenge}
                      className="rounded-full border border-white/12 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/6"
                    >
                      Next challenge
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChallengeCode(activeChallenge.answer);
                        setChallengeResult("Reference answer loaded.");
                      }}
                      className="rounded-full border border-amber-400/30 px-5 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-300/10"
                    >
                      Show answer
                    </button>
                  </div>

                  {challengeResult ? (
                    <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200">
                      {challengeResult}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-5">
                  <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                      Current answer key
                    </p>
                    <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/8 bg-black/60 p-4 text-sm leading-6 text-emerald-300">
                      <code>{activeChallenge.answer}</code>
                    </pre>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                      Practice flow
                    </p>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-300">
                      <li>Open a topic from the left to review command patterns.</li>
                      <li>Switch to Challenge to test yourself without scrolling the full page.</li>
                      <li>Use copy buttons to move working queries into Mongo shell quickly.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
