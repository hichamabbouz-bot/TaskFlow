import React, { useState } from "react";
import { Plus } from "lucide-react";
import api from "../services/api";

const priorityOptions = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" },
];

const statusOptions = [
  { value: "todo", label: "A faire" },
  { value: "in_progress", label: "En cours" },
  { value: "done", label: "Terminee" },
];

const TaskForm = ({ setTasks, onNotify }) => {
  const [newTask, setNewTask] = useState("");
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");

  const resetForm = () => {
    setNewTask("");
    setDescription("");
    setProjectName("");
    setDueDate("");
    setReminderAt("");
    setPriority("medium");
    setStatus("todo");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const res = await api.post("/tasks", {
        title: newTask.trim(),
        description: description.trim(),
        projectName: projectName.trim() || "General",
        dueDate: dueDate || null,
        reminderAt: reminderAt || null,
        priority,
        status,
      });
      setTasks((prev) => [...prev, res.data]);
      onNotify?.({
        type: "success",
        title: "Tache ajoutee",
        message: "La nouvelle tache est disponible dans votre espace.",
      });
      resetForm();
    } catch (err) {
      onNotify?.({
        type: "error",
        title: "Ajout impossible",
        message: err.response?.data?.message || "Erreur lors de l'ajout de la tache.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="task-main-row">
        <label className="field task-input">
          <span>Nouvelle tache</span>
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Ex: preparer la soutenance"
            required
          />
        </label>

        <button type="submit" className="primary-button">
          <Plus /> Ajouter
        </button>
      </div>

      <label className="field task-description-field">
        <span>Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ajouter quelques details sur la tache"
          rows="1"
        />
      </label>

      <div className="task-options-grid">
        <label className="field">
          <span>Projet</span>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="General"
          />
        </label>

        <label className="field">
          <span>Date de livraison</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Reminder</span>
          <input
            type="datetime-local"
            value={reminderAt}
            onChange={(e) => setReminderAt(e.target.value)}
          />
        </label>
        <label className="field">
          <span>Priorite</span>
          <div className="segmented-control">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={priority === option.value ? "active" : ""}
                onClick={() => setPriority(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </label>

        <label className="field">
          <span>Statut</span>
          <div className="segmented-control">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={status === option.value ? "active" : ""}
                onClick={() => setStatus(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </label>
      </div>
    </form>
  );
};

export default TaskForm;
