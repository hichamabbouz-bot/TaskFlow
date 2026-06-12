import React from "react";
import { Bell, LogOut, Moon, Sun } from "lucide-react";
import PageHeader from "../components/common/PageHeader";

const SettingsPage = ({
  user,
  theme,
  onThemeChange,
  viewMode,
  setViewMode,
  notificationPermission,
  onRequestNotificationPermission,
  onLogout,
}) => {
  const displayName = user?.fullName || user?.email?.split("@")[0] || "User";
  const notificationLabels = {
    default: "Non activee",
    granted: "Activee",
    denied: "Bloquee",
    unsupported: "Non supportee",
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Parametres"
        title="Preferences"
        description="Personnalisez l'affichage connecte aux fonctionnalites actuelles."
      />

      <section className="settings-grid">
        <article className="settings-card">
          <p className="ui-kicker">Profil</p>
          <h3>{displayName}</h3>
          <p>{user?.email}</p>
          <span className="settings-note">Modification du nom: UI only pour cette version.</span>
        </article>

        <article className="settings-card">
          <p className="ui-kicker">Theme</p>
          <h3>Mode clair / sombre</h3>
          <div className="view-switch">
            <button type="button" className={theme === "light" ? "active" : ""} onClick={() => onThemeChange("light")}>
              <Sun /> Clair
            </button>
            <button type="button" className={theme === "dark" ? "active" : ""} onClick={() => onThemeChange("dark")}>
              <Moon /> Sombre
            </button>
          </div>
        </article>

        <article className="settings-card">
          <p className="ui-kicker">Affichage</p>
          <h3>Vue par defaut</h3>
          <div className="view-switch">
            <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>
              Liste
            </button>
            <button type="button" className={viewMode === "kanban" ? "active" : ""} onClick={() => setViewMode("kanban")}>
              Kanban
            </button>
          </div>
        </article>

        <article className="settings-card">
          <p className="ui-kicker">Notifications</p>
          <h3>Rappels navigateur</h3>
          <p>Statut actuel: {notificationLabels[notificationPermission] || notificationPermission}</p>
          {notificationPermission === "default" && (
            <button type="button" className="primary-button" onClick={onRequestNotificationPermission}>
              <Bell />
              Activer les notifications
            </button>
          )}
          {notificationPermission === "granted" && (
            <span className="settings-note">Les rappels importants peuvent s'afficher dans le navigateur.</span>
          )}
          {notificationPermission === "denied" && (
            <span className="settings-note">Autorisez les notifications depuis les parametres du navigateur.</span>
          )}
          {notificationPermission === "unsupported" && (
            <span className="settings-note">Votre navigateur ne supporte pas cette fonctionnalite.</span>
          )}
        </article>

        <article className="settings-card">
          <p className="ui-kicker">Compte</p>
          <h3>Session</h3>
          <p>Deconnectez-vous proprement de votre espace TaskFlow.</p>
          <button type="button" className="danger-button compact-button" onClick={onLogout}>
            <LogOut />
            Logout
          </button>
        </article>
      </section>
    </div>
  );
};

export default SettingsPage;
