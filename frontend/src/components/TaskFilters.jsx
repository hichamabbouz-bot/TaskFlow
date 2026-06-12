import React from "react";
import { Search } from "lucide-react";

const statusOptions = [
  { value: "all", label: "Tout" },
  { value: "todo", label: "A faire" },
  { value: "in_progress", label: "En cours" },
  { value: "done", label: "Terminee" },
  { value: "not_done", label: "Non faite" },
];

const priorityOptions = [
  { value: "all", label: "Tout" },
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" },
];

const sortOptions = [
  { value: "created_desc", label: "Recent" },
  { value: "created_asc", label: "Ancien" },
  { value: "due_asc", label: "Livraison proche" },
  { value: "due_desc", label: "Livraison loin" },
  { value: "priority", label: "Priorite" },
];

const TaskFilters = ({ filters, setFilters, resultCount, totalCount }) => {
  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  return (
    <section className="filter-panel" aria-label="Recherche et filtres">
      <div className="filter-search-row">
        <label className="field search-field">
          <span>Recherche</span>
          <div className="search-input-wrap">
            <Search />
            <input
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              placeholder="Rechercher par titre ou projet"
            />
          </div>
        </label>
        <div className="filter-result-count">
          <strong>{resultCount}</strong>
          <span>sur {totalCount}</span>
        </div>
      </div>

      <div className="filter-grid">
        <div className="field">
          <span>Statut</span>
          <div className="segmented-control filter-segments">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={filters.status === option.value ? "active" : ""}
                onClick={() => updateFilter("status", option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <span>Priorite</span>
          <div className="segmented-control filter-segments">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={filters.priority === option.value ? "active" : ""}
                onClick={() => updateFilter("priority", option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field filter-sort-field">
          <span>Tri</span>
          <div className="sort-control">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={filters.sort === option.value ? "active" : ""}
                onClick={() => updateFilter("sort", option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskFilters;
