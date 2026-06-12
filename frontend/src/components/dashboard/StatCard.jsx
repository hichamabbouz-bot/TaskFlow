import React from "react";

const StatCard = ({ icon: Icon, value, label, description, tone = "violet" }) => {
  return (
    <article className={`stat-card tone-${tone}`}>
      <span className="stat-icon">
        <Icon />
      </span>
      <strong>{value}</strong>
      <p>{label}</p>
      <small>{description}</small>
    </article>
  );
};

export default StatCard;
