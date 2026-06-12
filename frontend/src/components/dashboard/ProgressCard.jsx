import React from "react";

const ProgressCard = ({ stats }) => {
  return (
    <article className="progress-card">
      <div className="section-heading">
        <div>
          <p className="ui-kicker">Progression globale</p>
          <h3>{stats.completionRate}% termine</h3>
        </div>
        <strong>{stats.completed}/{stats.total}</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${stats.completionRate}%` }} />
      </div>
      <p>{stats.completed} tache(s) terminee(s) sur {stats.total}</p>
    </article>
  );
};

export default ProgressCard;
