import React from "react";
import { AlertTriangle, ChartNoAxesColumn, CircleCheck, ListChecks, LoaderCircle } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/dashboard/StatCard";

const miniBars = [
  { key: "todo", label: "A faire", value: "todo" },
  { key: "inProgress", label: "En cours", value: "inProgress" },
  { key: "completed", label: "Terminees", value: "completed" },
  { key: "notDone", label: "Non faites", value: "notDone" },
];

const StatisticsPage = ({ stats, recentTasks }) => {
  const maxValue = Math.max(stats.total, 1);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Statistiques"
        title="Performance des taches"
        description="Une synthese simple pour comprendre votre progression."
      />

      <section className="stats-grid">
        <StatCard icon={ListChecks} value={stats.total} label="Total" description="Taches creees" />
        <StatCard icon={CircleCheck} value={`${stats.completionRate}%`} label="Completion" description="Taux global" tone="green" />
        <StatCard icon={LoaderCircle} value={stats.inProgress} label="En cours" description="Actives" tone="blue" />
        <StatCard icon={AlertTriangle} value={stats.overdue} label="En retard" description="A surveiller" tone="red" />
        <StatCard icon={ChartNoAxesColumn} value={recentTasks.length} label="Recentes" description="Dernieres taches" tone="orange" />
      </section>

      <section className="analytics-grid">
        <article className="analytics-card">
          <div className="section-heading">
            <div>
              <p className="ui-kicker">Statuts</p>
              <h3>Taches par statut</h3>
            </div>
          </div>
          <div className="mini-bars">
            {miniBars.map((bar) => (
              <div key={bar.key}>
                <span>{bar.label}</span>
                <div><i style={{ width: `${(stats[bar.value] / maxValue) * 100}%` }} /></div>
                <strong>{stats[bar.value]}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="analytics-card">
          <div className="section-heading">
            <div>
              <p className="ui-kicker">Priorites</p>
              <h3>Distribution</h3>
            </div>
          </div>
          <div className="mini-bars">
            {Object.entries(stats.priorities).map(([key, value]) => (
              <div key={key}>
                <span>{key}</span>
                <div><i style={{ width: `${(value / maxValue) * 100}%` }} /></div>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default StatisticsPage;
