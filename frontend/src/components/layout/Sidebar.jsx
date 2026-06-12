import React from "react";
import {
  BellRing,
  CalendarDays,
  ChartNoAxesColumn,
  CircleHelp,
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Settings,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "Mes taches", icon: ListChecks },
  { id: "projects", label: "Projets", icon: FolderKanban },
  { id: "calendar", label: "Calendrier", icon: CalendarDays },
  { id: "reminders", label: "Rappels", icon: BellRing },
  { id: "statistics", label: "Statistiques", icon: ChartNoAxesColumn },
  { id: "settings", label: "Parametres", icon: Settings },
];

const Sidebar = ({ activePage, onPageChange, isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <span className="sidebar-logo">
          <ClipboardCheck />
        </span>
        <div>
          <strong>TaskFlow</strong>
          <span>Dashboard V2</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Navigation dashboard">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={activePage === item.id ? "active" : ""}
              onClick={() => {
                onPageChange(item.id);
                onClose?.();
              }}
            >
              <Icon />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button type="button" className="support-link">
          <CircleHelp />
          <span>Aide & support</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
