import React from "react";
import {
  AlarmClock,
  AlertTriangle,
  Bell,
  CalendarClock,
  CheckCheck,
  XCircle,
} from "lucide-react";
import { formatDateTime } from "../../utils/dateHelpers";

const notificationIcons = {
  reminder_overdue: AlarmClock,
  task_overdue: AlertTriangle,
  due_soon: CalendarClock,
  not_done: XCircle,
};

const NotificationDropdown = ({
  notifications,
  onRequestPermission,
  onMarkAsRead,
  onMarkAllAsRead,
  permission,
}) => {
  const hasNotifications = notifications.items.length > 0;

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <div>
          <p className="ui-kicker">Notifications</p>
          <strong>{notifications.unreadCount} non lue(s)</strong>
        </div>
        {notifications.unreadCount > 0 && (
          <button type="button" className="mark-all-button" onClick={onMarkAllAsRead}>
            <CheckCheck /> Tout lire
          </button>
        )}
      </div>

      {permission === "default" && (
        <button type="button" className="notification-permission" onClick={onRequestPermission}>
          Activer les notifications navigateur
        </button>
      )}

      {permission === "denied" && (
        <p className="notification-note">
          Notifications bloquees. Activez-les depuis les parametres du navigateur.
        </p>
      )}

      {!hasNotifications ? (
        <div className="notification-empty">
          <Bell />
          <strong>Aucune notification</strong>
          <p>Tout est calme pour le moment.</p>
        </div>
      ) : (
        <>
          {notifications.unreadCount === 0 && (
            <p className="notification-note">Toutes vos notifications sont lues.</p>
          )}
          <div className="notification-list">
            {notifications.items.map((item) => {
              const Icon = notificationIcons[item.type] || Bell;

              return (
                <article
                  key={item.id}
                  className={`notification-item ${item.read ? "read" : "unread"}`}
                >
                  <span className="notification-item-icon">
                    <Icon />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.message}</p>
                    <small>{formatDateTime(item.date)}</small>
                  </div>
                  {!item.read && (
                    <button
                      type="button"
                      className="mark-read-button"
                      onClick={() => onMarkAsRead(item.id)}
                    >
                      <CheckCheck /> Lu
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
