import React from "react";
import PageHeader from "../components/common/PageHeader";
import { formatDate, formatDateTime } from "../utils/dateHelpers";

const ReminderSection = ({ title, tasks, getMeta }) => (
  <section className="reminder-page-section">
    <div className="section-heading">
      <div>
        <p className="ui-kicker">Rappels</p>
        <h3>{title}</h3>
      </div>
      <strong>{tasks.length}</strong>
    </div>
    {tasks.length === 0 ? (
      <p className="soft-empty">Aucun element.</p>
    ) : (
      <div className="compact-card-list">
        {tasks.map((task) => (
          <article key={`${title}-${task._id}`} className="compact-task-card">
            <strong>{task.title}</strong>
            <span>{getMeta(task)}</span>
          </article>
        ))}
      </div>
    )}
  </section>
);

const RemindersPage = ({ notifications, upcomingReminders }) => {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Rappels"
        title="Notifications et alertes"
        description="Suivez les rappels a venir, les rappels depasses et les taches en retard."
      />

      <div className="reminder-page-grid">
        <ReminderSection
          title="Rappels a venir"
          tasks={upcomingReminders}
          getMeta={(task) => formatDateTime(task.reminderAt)}
        />
        <ReminderSection
          title="Rappels depasses"
          tasks={notifications.overdueReminders}
          getMeta={(task) => formatDateTime(task.reminderAt)}
        />
        <ReminderSection
          title="Taches en retard"
          tasks={notifications.overdueTasks}
          getMeta={(task) => formatDate(task.dueDate)}
        />
      </div>
    </div>
  );
};

export default RemindersPage;
