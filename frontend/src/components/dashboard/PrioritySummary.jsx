import React from "react";

const priorities = [
  { key: "high", label: "Haute" },
  { key: "medium", label: "Moyenne" },
  { key: "low", label: "Basse" },
];

const PrioritySummary = ({ stats }) => {
  return (
    <article className="priority-summary">
      <div className="section-heading">
        <div>
          <p className="ui-kicker">Priorites</p>
          <h3>Repartition</h3>
        </div>
        <strong>{stats.total}</strong>
      </div>
      <div className="priority-chip-row">
        {priorities.map((priority) => (
          <div key={priority.key} className={`priority-chip priority-${priority.key}`}>
            <span />
            <p>{priority.label}</p>
            <strong>{stats.priorities[priority.key]}</strong>
          </div>
        ))}
      </div>
    </article>
  );
};

export default PrioritySummary;
