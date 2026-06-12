import React from "react";
import { Circle, CircleCheck, ListChecks, LoaderCircle, XCircle } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import ProgressCard from "../components/dashboard/ProgressCard";
import PrioritySummary from "../components/dashboard/PrioritySummary";
import PageHeader from "../components/common/PageHeader";
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import TaskKanban from "../components/TaskKanban";
import TaskList from "../components/TaskList";

const DashboardPage = ({
  displayName,
  stats,
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
        eyebrow="Dashboard"
        title={`Bonjour, ${displayName}`}
        description="Voici un apercu de vos taches. Restez concentre et avancez chaque jour."
      />

      <section className="stats-grid">
        <StatCard icon={ListChecks} value={stats.total} label="Total" description="Toutes vos taches" />
        <StatCard icon={CircleCheck} value={stats.completed} label="Terminees" description="Objectifs finalises" tone="green" />
        <StatCard icon={LoaderCircle} value={stats.inProgress} label="En cours" description="Travail actif" tone="blue" />
        <StatCard icon={Circle} value={stats.todo} label="A faire" description="A lancer" tone="orange" />
        <StatCard icon={XCircle} value={stats.notDone} label="Non faites" description="Rappels depasses" tone="red" />
      </section>

      <section className="insight-grid">
        <ProgressCard stats={stats} />
        <PrioritySummary stats={stats} />
      </section>

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

export default DashboardPage;
