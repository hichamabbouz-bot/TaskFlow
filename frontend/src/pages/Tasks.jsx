import React from "react";
import PageHeader from "../components/common/PageHeader";
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import TaskKanban from "../components/TaskKanban";
import TaskList from "../components/TaskList";

const TasksPage = ({
  setTasks,
  filters,
  setFilters,
  filteredTasks,
  totalTasks,
  viewMode,
  setViewMode,
  onNotify,
}) => {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Mes taches"
        title="Organiser, filtrer et suivre"
        description="Retrouvez toutes vos taches avec recherche, tri, liste et Kanban."
      />

      <section className="workspace-panel">
        <div className="panel-header">
          <div>
            <p className="ui-kicker">Espace personnel</p>
            <h2>{viewMode === "list" ? "Liste des taches" : "Tableau Kanban"}</h2>
          </div>
          <div className="view-switch" aria-label="Choisir la vue">
            <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>
              Liste
            </button>
            <button type="button" className={viewMode === "kanban" ? "active" : ""} onClick={() => setViewMode("kanban")}>
              Kanban
            </button>
          </div>
        </div>

        <TaskForm setTasks={setTasks} onNotify={onNotify} />
        <TaskFilters
          filters={filters}
          setFilters={setFilters}
          resultCount={filteredTasks.length}
          totalCount={totalTasks}
        />
        {viewMode === "list" ? (
          <TaskList
            tasks={filteredTasks}
            setTasks={setTasks}
            hasAnyTasks={totalTasks > 0}
            onNotify={onNotify}
          />
        ) : (
          <TaskKanban
            tasks={filteredTasks}
            setTasks={setTasks}
            hasAnyTasks={totalTasks > 0}
            onNotify={onNotify}
          />
        )}
      </section>
    </div>
  );
};

export default TasksPage;
