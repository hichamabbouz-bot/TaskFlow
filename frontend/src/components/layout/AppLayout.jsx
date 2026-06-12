import React, { useState } from "react";
import Footer from "../Footer";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppLayout = ({
  activePage,
  onPageChange,
  user,
  tasks,
  theme,
  onThemeChange,
  onLogout,
  onUserUpdate,
  onNotify,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  notificationPermission,
  onRequestNotificationPermission,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-shell">
      <Sidebar
        activePage={activePage}
        onPageChange={onPageChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {isSidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Fermer le menu"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="dashboard-main">
        <Topbar
          user={user}
          tasks={tasks}
          theme={theme}
          onThemeChange={onThemeChange}
          onLogout={onLogout}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenSettings={() => onPageChange("settings")}
          onUserUpdate={onUserUpdate}
          onNotify={onNotify}
          notifications={notifications}
          onMarkNotificationAsRead={onMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
          notificationPermission={notificationPermission}
          onRequestNotificationPermission={onRequestNotificationPermission}
        />
        <main className="dashboard-content">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
