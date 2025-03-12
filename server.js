const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;

// Middleware para JSON e CORS
app.use(express.json());
app.use(cors());

// Simulando um banco de dados em memória
let tasks = [];

// Criar uma nova tarefa
app.post("/tasks", (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: "Título e descrição são obrigatórios" });
    }

    const newTask = { id: uuidv4(), title, description };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Listar todas as tarefas
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// Atualizar uma tarefa
app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    let task = tasks.find((t) => t.id === id);
    if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

    task.title = title || task.title;
    task.description = description || task.description;

    res.json(task);
});

// Deletar uma tarefa
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter((t) => t.id !== id);
    res.status(204).send();
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
