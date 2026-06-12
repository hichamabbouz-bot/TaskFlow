import React, { useState } from "react";
import { AlarmClock, CalendarClock, Folder, Lock, Pencil, Trash2 } from "lucide-react";
import api from "../services/api";
import { formatDate, formatDateTime } from "../utils/dateHelpers";
import { getTaskStatus, isTaskOverdue, priorityLabels, statusLabels } from "../utils/statusHelpers";

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

const toDateInputValue = (value) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

const toDateTimeInputValue = (value) => {
  if (!value) return "";

  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const TaskList = ({ tasks, setTasks, hasAnyTasks = tasks.length > 0, onNotify }) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    projectName: "",
    dueDate: "",
    reminderAt: "",
    priority: "medium",
    status: "todo",
  });

  const startEdit = (task) => {
    if (getTaskStatus(task) === "not_done") return;

    setEditingTaskId(task._id);
    setEditedTask({
      title: task.title,
      description: task.description || "",
      projectName: task.projectName || "General",
      dueDate: toDateInputValue(task.dueDate),
      reminderAt: toDateTimeInputValue(task.reminderAt),
      priority: task.priority || "medium",
      status: task.status || "todo",
    });
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditedTask({
      title: "",
      description: "",
      projectName: "",
      dueDate: "",
      reminderAt: "",
      priority: "medium",
      status: "todo",
    });
  };

  const updateEditedTask = (field, value) => {
    setEditedTask((current) => ({ ...current, [field]: value }));
  };

  const updateTask = async (id) => {
    const title = editedTask.title.trim();
    if (!title) return;

    try {
      const res = await api.put(`/tasks/${id}`, {
        title,
        description: editedTask.description.trim(),
        projectName: editedTask.projectName.trim() || "General",
        dueDate: editedTask.dueDate || null,
        reminderAt: editedTask.reminderAt || null,
        priority: editedTask.priority,
        status: editedTask.status,
      });
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? res.data : task))
      );
      onNotify?.({
        type: "success",
        title: "Tache modifiee",
        message: "Les changements ont ete enregistres.",
      });
      cancelEdit();
    } catch (err) {
      onNotify?.({
        type: "error",
        title: "Modification impossible",
        message: err.response?.data?.message || "Erreur lors de la modification.",
      });
    }
  };

  const deleteTask = async (id) => {
    if (!id) return;
    const shouldDelete = window.confirm("Supprimer cette tache definitivement ?");
    if (!shouldDelete) return;

    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      onNotify?.({
        type: "success",
        title: "Tache supprimee",
        message: "La tache a ete retiree de votre espace.",
      });
    } catch (err) {
      onNotify?.({
        type: "error",
        title: "Suppression impossible",
        message: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="outline-badge">0 resultat</span>
        <h3>{hasAnyTasks ? "Aucune tache trouvee" : "Aucune tache pour le moment"}</h3>
        <p>
          {hasAnyTasks
            ? "Ajustez la recherche ou les filtres pour retrouver vos taches."
            : "Ajoutez votre premiere tache avec le formulaire ci-dessus."}
        </p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task, index) => {
        const isEditing = editingTaskId === task._id;
        const displayStatus = getTaskStatus(task);
        const isLocked = displayStatus === "not_done";

        return (
          <article key={task._id} className={`task-card ${isLocked ? "locked-task" : ""}`}>
            <div className="task-index">{String(index + 1).padStart(2, "0")}</div>
            <div className="task-content">
              {isEditing ? (
                <div className="task-edit-fields">
                  <input
                    className="task-edit-input"
                    value={editedTask.title}
                    onChange={(e) => updateEditedTask("title", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") updateTask(task._id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                  />

                  <label className="field">
                    <span>Projet</span>
                    <input
                      value={editedTask.projectName}
                      onChange={(e) => updateEditedTask("projectName", e.target.value)}
                    />
                  </label>

                  <label className="field">
                    <span>Description</span>
                    <textarea
                      value={editedTask.description}
                      onChange={(e) => updateEditedTask("description", e.target.value)}
                      rows="2"
                    />
                  </label>

                  <div className="task-edit-dates">
                    <label className="field">
                      <span>Date de livraison</span>
                      <input
                        type="date"
                        value={editedTask.dueDate}
                        onChange={(e) => updateEditedTask("dueDate", e.target.value)}
                      />
                    </label>
                    <label className="field">
                      <span>Reminder</span>
                      <input
                        type="datetime-local"
                        value={editedTask.reminderAt}
                        onChange={(e) => updateEditedTask("reminderAt", e.target.value)}
                      />
                    </label>
                  </div>

                  <div className="task-edit-dates">
                    <label className="field">
                      <span>Priorite</span>
                      <div className="segmented-control">
                        {priorityOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={editedTask.priority === option.value ? "active" : ""}
                            onClick={() => updateEditedTask("priority", option.value)}
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
                            className={editedTask.status === option.value ? "active" : ""}
                            onClick={() => updateEditedTask("status", option.value)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{task.title}</h3>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  <div className="task-meta">
                    <span>Ajoutee le {new Date(task.createdAt).toLocaleDateString()}</span>
                    <span>
                      <Folder /> {task.projectName || "General"}
                    </span>
                    <span className="priority-badge">
                      Priorite {priorityLabels[task.priority || "medium"]}
                    </span>
                    <span className={`status-badge ${isLocked ? "not-done-badge" : ""}`}>
                      Statut {statusLabels[displayStatus]}
                    </span>
                    {task.dueDate && (
                      <span>
                        <CalendarClock /> Livraison {formatDate(task.dueDate)}
                      </span>
                    )}
                    {isTaskOverdue(task) && (
                      <span className="overdue-badge">En retard</span>
                    )}
                    {task.reminderAt && (
                      <span className={isLocked ? "overdue-badge" : ""}>
                        <AlarmClock /> {isLocked ? "Rappel depasse" : "Rappel"} {formatDateTime(task.reminderAt)}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="task-actions">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => updateTask(task._id)}
                    className="primary-button compact-button"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="ghost-button compact-button"
                  >
                    Annuler
                  </button>
                </>
              ) : isLocked ? (
                <span className="locked-badge" title="Modification bloquee">
                  <Lock /> Non modifiable
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => startEdit(task)}
                    className="icon-button"
                    aria-label="Modifier la tache"
                    title="Modifier"
                  >
                    <Pencil />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTask(task._id)}
                    className="danger-icon-button"
                    aria-label="Supprimer la tache"
                    title="Supprimer"
                  >
                    <Trash2 />
                  </button>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default TaskList;
