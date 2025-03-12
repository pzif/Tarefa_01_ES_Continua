import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/tasks";

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editingTask, setEditingTask] = useState(null);

    // Carregar tarefas ao iniciar
    useEffect(() => {
        axios.get(API_URL)
            .then(response => setTasks(response.data))
            .catch(error => console.error("Erro ao carregar tarefas:", error));
    }, []);

    // Criar nova tarefa
    const handleCreateTask = () => {
        if (!title || !description) return alert("Preencha todos os campos!");
        
        axios.post(API_URL, { title, description })
            .then(response => {
                setTasks([...tasks, response.data]);
                setTitle("");
                setDescription("");
            })
            .catch(error => console.error("Erro ao criar tarefa:", error));
    };

    // Editar tarefa
    const handleEditTask = (task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description);
    };

    // Atualizar tarefa
    const handleUpdateTask = () => {
        axios.put(`${API_URL}/${editingTask.id}`, { title, description })
            .then(response => {
                setTasks(tasks.map(task => task.id === editingTask.id ? response.data : task));
                setEditingTask(null);
                setTitle("");
                setDescription("");
            })
            .catch(error => console.error("Erro ao atualizar tarefa:", error));
    };

    // Deletar tarefa
    const handleDeleteTask = (id) => {
        axios.delete(`${API_URL}/${id}`)
            .then(() => setTasks(tasks.filter(task => task.id !== id)))
            .catch(error => console.error("Erro ao deletar tarefa:", error));
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", textAlign: "center" }}>
            <h1>Gerenciador de Tarefas</h1>
            
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título"
                style={{ margin: "5px", padding: "10px", width: "80%" }}
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição"
                style={{ margin: "5px", padding: "10px", width: "80%" }}
            />
            <button onClick={editingTask ? handleUpdateTask : handleCreateTask} style={{ padding: "10px 20px", margin: "10px" }}>
                {editingTask ? "Atualizar Tarefa" : "Criar Tarefa"}
            </button>

            <h2>Tarefas</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {tasks.map(task => (
                    <li key={task.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <button onClick={() => handleEditTask(task)} style={{ marginRight: "5px" }}>Editar</button>
                        <button onClick={() => handleDeleteTask(task.id)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
