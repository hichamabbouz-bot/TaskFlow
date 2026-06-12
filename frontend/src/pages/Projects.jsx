import React from "react";
import PageHeader from "../components/common/PageHeader";
import { groupTasksByProject, getTaskStats } from "../utils/taskStats";

const ProjectsPage = ({ tasks }) => {
  const projects = Object.entries(groupTasksByProject(tasks));

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Projets"
        title="Suivi par projet"
        description="Les taches sont groupees avec le champ projet. Les anciennes taches restent dans General."
      />

      {projects.length === 0 ? (
        <div className="empty-state">
          <span className="outline-badge">0 projet</span>
          <h3>Aucun projet</h3>
          <p>Ajoutez une tache avec un nom de projet pour commencer.</p>
        </div>
      ) : (
        <section className="project-grid">
          {projects.map(([name, projectTasks]) => {
            const stats = getTaskStats(projectTasks);
            return (
              <article key={name} className="project-card">
                <div className="project-card-header">
                  <div>
                    <p className="ui-kicker">Projet</p>
                    <h3>{name}</h3>
                  </div>
                  <strong>{projectTasks.length}</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${stats.completionRate}%` }} />
                </div>
                <div className="project-progress-meta">
                  <p>{stats.completed} terminee(s) sur {stats.total}</p>
                  <span>{stats.completionRate}%</span>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default ProjectsPage;
