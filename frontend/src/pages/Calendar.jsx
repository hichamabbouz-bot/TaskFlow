import React, { useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import { formatDate, isSameDay, isWithinDays } from "../utils/dateHelpers";
import { priorityLabels, statusLabels, getTaskStatus } from "../utils/statusHelpers";

const CalendarPage = ({ tasks, currentTime }) => {
  const [range, setRange] = useState("week");

  const visibleTasks = useMemo(() => {
    const now = new Date();

    return tasks
      .filter((task) => {
        if (!task.dueDate) return false;
        if (range === "today") return isSameDay(task.dueDate, now);
        if (range === "week") return isWithinDays(task.dueDate, 7);
        return isWithinDays(task.dueDate, 31);
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [range, tasks]);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Calendrier"
        title="Livraisons planifiees"
        description="Visualisez les taches selon leur date de livraison."
      />

      <div className="range-switch">
        {[
          { value: "today", label: "Aujourd'hui" },
          { value: "week", label: "Semaine" },
          { value: "month", label: "Mois" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            className={range === option.value ? "active" : ""}
            onClick={() => setRange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {visibleTasks.length === 0 ? (
        <div className="empty-state">
          <span className="outline-badge">0 tache</span>
          <h3>Aucune livraison</h3>
          <p>Aucune tache trouvee pour cette periode.</p>
        </div>
      ) : (
        <section className="calendar-list">
          {visibleTasks.map((task) => (
            <article key={task._id} className="calendar-item">
              <div className="calendar-date">
                <strong>{formatDate(task.dueDate)}</strong>
                <span>{task.projectName || "General"}</span>
              </div>
              <div>
                <h3>{task.title}</h3>
                <p>{priorityLabels[task.priority || "medium"]} - {statusLabels[getTaskStatus(task, currentTime)]}</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default CalendarPage;
