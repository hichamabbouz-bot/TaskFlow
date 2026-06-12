import React, { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Moon, Settings, Sun } from "lucide-react";
import NotificationDropdown from "../ui/NotificationDropdown";
import api from "../../services/api";

const Topbar = ({
  user,
  tasks,
  theme,
  onThemeChange,
  onLogout,
  onOpenSidebar,
  onOpenSettings,
  onUserUpdate,
  onNotify,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  notificationPermission,
  onRequestNotificationPermission,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const displayName = user?.fullName || user?.email?.split("@")[0] || "User";
  const unreadCount = notifications?.unreadCount || 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      setIsUploading(true);
      const res = await api.put("/auth/profile-picture", formData);
      onUserUpdate?.(res.data);
      onNotify?.({
        type: "success",
        title: "Photo mise a jour",
        message: "Votre avatar a ete actualise.",
      });
    } catch (err) {
      onNotify?.({
        type: "error",
        title: "Upload impossible",
        message: err.response?.data?.message || "Erreur lors de l'upload de la photo.",
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleOpenSettings = () => {
    setIsUserMenuOpen(false);
    onOpenSettings?.();
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    onLogout?.();
  };

  return (
    <header className="topbar">
      <button type="button" className="mobile-menu-button" onClick={onOpenSidebar}>
        <Menu />
      </button>

      <div className="topbar-spacer" />

      <div className="topbar-actions">
        <span className="task-pill">{tasks.length} taches</span>

        <div className="notification-center" ref={notificationRef}>
          <button
            type="button"
            className={`top-icon-button ${unreadCount > 0 ? "has-alerts" : ""}`}
            onClick={() => setIsNotificationsOpen((current) => !current)}
            aria-label="Notifications"
            aria-haspopup="dialog"
            aria-expanded={isNotificationsOpen}
          >
            <Bell />
            {unreadCount > 0 && <span>{unreadCount}</span>}
          </button>
          {isNotificationsOpen && (
            <NotificationDropdown
              notifications={notifications}
              permission={notificationPermission}
              onRequestPermission={onRequestNotificationPermission}
              onMarkAsRead={onMarkNotificationAsRead}
              onMarkAllAsRead={onMarkAllNotificationsAsRead}
            />
          )}
        </div>

        <div className="theme-switch">
          <button
            type="button"
            className={theme === "light" ? "active" : ""}
            onClick={() => onThemeChange("light")}
            aria-label="Theme clair"
          >
            <Sun />
          </button>
          <button
            type="button"
            className={theme === "dark" ? "active" : ""}
            onClick={() => onThemeChange("dark")}
            aria-label="Theme sombre"
          >
            <Moon />
          </button>
        </div>

        <div className="user-menu-wrap" ref={userMenuRef}>
          <button
            type="button"
            className={`topbar-user ${isUserMenuOpen ? "open" : ""}`}
            onClick={() => setIsUserMenuOpen((current) => !current)}
            aria-label="Menu utilisateur"
            aria-haspopup="menu"
            aria-expanded={isUserMenuOpen}
          >
            {user?.profilePicture ? (
              <img src={`http://localhost:3001${user.profilePicture}`} alt="Profil" />
            ) : (
              <span>{displayName.charAt(0).toUpperCase()}</span>
            )}
            <strong>{displayName}</strong>
            <ChevronDown />
          </button>

          {isUserMenuOpen && (
            <div className="user-dropdown" role="menu">
              <div className="user-dropdown-profile">
                <strong>{displayName}</strong>
                <span>{user?.email}</span>
              </div>
              <label className={`user-upload-action ${isUploading ? "uploading" : ""}`}>
                <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleAvatarChange} />
                Changer la photo
              </label>
              <button type="button" onClick={handleOpenSettings}>
                <Settings /> Parametres
              </button>
              <button type="button" className="user-dropdown-logout" onClick={handleLogout}>
                <LogOut /> Logout
              </button>
            </div>
          )}
        </div>

        <button type="button" className="logout-button" onClick={handleLogout}>
          <LogOut />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
