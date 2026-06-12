import React from "react";
import { AlarmClock, CalendarClock, Folder, Lock } from "lucide-react";
import api from "../services/api";
import { formatDate, formatDateTime } from "../utils/dateHelpers";
import { getTaskStatus, priorityLabels } from "../utils/statusHelpers";

const columns = [
  { value: "todo", label: "A faire" },
  { value: "in_progress", label: "En cours" },
  { value: "done", label: "Terminee" },
  { value: "not_done", label: "Non faite" },
];

const editableStatuses = columns.filter((column) => column.value !== "not_done");

const TaskKanban = ({ tasks, setTasks, hasAnyTasks = tasks.length > 0, onNotify }) => {
  const updateTaskStatus = async (task, status) => {
    if (!task?._id || getTaskStatus(task) === "not_done" || task.status === status) {
      return;
    }

    try {
      const res = await api.put(`/tasks/${task._id}`, {
        title: task.title,
        description: task.description || "",
        projectName: task.projectName || "General",
        dueDate: task.dueDate || null,
        reminderAt: task.reminderAt || null,
        priority: task.priority || "medium",
        status,
      });

      setTasks((current) =>
        current.map((item) => (item._id === task._id ? res.data : item))
      );
      onNotify?.({
        type: "success",
        title: "Statut mis a jour",
        message: `La tache est maintenant "${columns.find((item) => item.value === status)?.label}".`,
      });
    } catch (err) {
      onNotify?.({
        type: "error",
        title: "Changement impossible",
        message: err.response?.data?.message || "Erreur lors du changement de statut.",
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
            ? "Ajustez la recherche ou les filtres pour remplir le tableau Kanban."
            : "Ajoutez votre premiere tache pour commencer le suivi Kanban."}
        </p>
      </div>
    );
  }

  return (
    <div className="kanban-board" aria-label="Tableau Kanban des taches">
      {columns.map((column) => {
        const columnTasks = tasks.filter(
          (task) => getTaskStatus(task) === column.value
        );

        return (
          <section key={column.value} className="kanban-column">
            <div className="kanban-column-header">
              <h3>{column.label}</h3>
              <span>{columnTasks.length}</span>
            </div>

            <div className="kanban-column-body">
              {columnTasks.length === 0 ? (
                <p className="kanban-empty">Aucune tache</p>
              ) : (
                columnTasks.map((task) => {
                  const isLocked = getTaskStatus(task) === "not_done";

                  return (
                    <article
                      key={task._id}
                      className={`kanban-card ${isLocked ? "locked-task" : ""}`}
                    >
                      <div className="kanban-card-header">
                        <h4>{task.title}</h4>
                        <span className="priority-badge">
                          {priorityLabels[task.priority || "medium"]}
                        </span>
                      </div>

                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}

                      <div className="task-meta">
                        <span>
                          <Folder /> {task.projectName || "General"}
                        </span>
                        {task.dueDate && (
                          <span>
                            <CalendarClock /> Livraison {formatDate(task.dueDate)}
                          </span>
                        )}
                        {task.reminderAt && (
                          <span className={isLocked ? "overdue-badge" : ""}>
                            <AlarmClock /> {isLocked ? "Rappel depasse" : "Rappel"}{" "}
                            {formatDateTime(task.reminderAt)}
                          </span>
                        )}
                      </div>

                      {isLocked ? (
                        <span className="locked-badge">
                          <Lock /> Non modifiable
                        </span>
                      ) : (
                        <div className="kanban-status-actions">
                          {editableStatuses.map((statusOption) => (
                            <button
                              key={statusOption.value}
                              type="button"
                              className={
                                task.status === statusOption.value ? "active" : ""
                              }
                              onClick={() => updateTaskStatus(task, statusOption.value)}
                            >
                              {statusOption.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default TaskKanban;
