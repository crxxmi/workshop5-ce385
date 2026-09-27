import express from "express";

const app = express();

app.use(express.json());

// Array TODOS
const TODOS = [
{
id: "1",
title: "อ่านสไลด์สัปดาห์ที่ 5",
done: true,
priority: "high"
},
{
id: "2",
title: "ติดตั้ง express",
done: true,
priority: "high"
},
{
id: "3",
title: "ทำ workshop 4",
done: false,
priority: "normal"
},
{
id: "4",
title: "เตรียมสอบกลางภาค",
done: false,
priority: "low"
}
];

const PRIORITIES = ["high", "normal", "low"];

// Middleware
function validateTodo(req, res, next) {
const { title, priority } = req.body ?? {};

if (typeof title !== "string" || title.trim() === "") {
return res.status(400).json({
error: "ต้องมี title เป็นข้อความ"
});
}

if (
priority !== undefined &&
!PRIORITIES.includes(priority)
) {
return res.status(400).json({
error: "priority ไม่ถูกต้อง"
});
}

next();
}

// Group Router
const todoRouter = express.Router();

// GET /health
todoRouter.get("/health", (req, res) => {
res.json({
status: "ok"
});
});

// GET /
todoRouter.get("/", (req, res) => {
res.json(TODOS);
});

// GET /:id
todoRouter.get("/:id", (req, res) => {
const todo = TODOS.find(
(t) => t.id === req.params.id
);

if (!todo) {
return res.status(404).json({
error: `ไม่พบรายการ ${req.params.id}`
});
}

res.json(todo);
});

// POST /todos
todoRouter.post("/todos", validateTodo, (req, res) => {
const created = {
id: String(TODOS.length + 1),
title: req.body.title,
done: req.body.done ?? false,
priority: req.body.priority ?? "normal"
};

TODOS.push(created);

res.status(201).json(created);
});

// Group Router
app.use("/api/v1/todos", todoRouter);

// Port 3000
app.listen(3000, () => {
console.log("Server running at http://localhost:3000");
});