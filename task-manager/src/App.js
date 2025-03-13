import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:3000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas", error);
    }
  };

  const addOrUpdateTask = async () => {
    if (!title.trim()) return;

    try {
      if (editingTask) {
        const response = await axios.put(`${API_URL}/${editingTask.id}`, { title, description });
        setTasks(tasks.map(task => (task.id === editingTask.id ? response.data : task)));
        setEditingTask(null);
      } else {
        const response = await axios.post(API_URL, { title, description });
        setTasks([...tasks, response.data]);
      }
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Erro ao salvar tarefa", error);
    }
  };

  const editTask = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditingTask(task);
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Erro ao excluir tarefa", error);
    }
  };

  return (
    <div className="container">
      <h1>Gerenciador de Tarefas</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descrição (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addOrUpdateTask}>
          {editingTask ? "Salvar" : "Adicionar"}
        </button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-content">
              <strong>{task.title}</strong>: {task.description}
            </div>
            <div className="task-buttons">
              <button className="edit" onClick={() => editTask(task)}>Editar</button>
              <button className="delete" onClick={() => deleteTask(task.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
