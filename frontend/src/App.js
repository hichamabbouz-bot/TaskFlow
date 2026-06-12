import React, { useEffect, useMemo, useState } from "react";
import api from "./services/api";
import AuthForm from "./components/AuthForm";
import AppLayout from "./components/layout/AppLayout";
import Toast from "./components/ui/Toast";
import CalendarPage from "./pages/Calendar";
import DashboardPage from "./pages/Dashboard";
import ProjectsPage from "./pages/Projects";
import RemindersPage from "./pages/Reminders";
import SettingsPage from "./pages/Settings";
import StatisticsPage from "./pages/Statistics";
import TasksPage from "./pages/Tasks";
import { getDateTime, isWithinDays } from "./utils/dateHelpers";
import { getTaskStats } from "./utils/taskStats";
import { getTaskStatus, isReminderExpired, isTaskOverdue } from "./utils/statusHelpers";
import "./App.css";

const priorityWeight = {
  high: 3,
  medium: 2,
  low: 1,
};

const REMINDER_LOOKAHEAD_MS = 10 * 60 * 1000;
const NOTIFIED_REMINDERS_KEY = "taskflow_notified_reminders";
const READ_NOTIFICATIONS_KEY = "taskflow_read_notifications";
const INITIAL_TOKEN = localStorage.getItem("token") || "";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "dark" ? "dark" : "light";
};

const getInitialViewMode = () => {
  const savedView = localStorage.getItem("taskflow_view_mode");
  return savedView === "kanban" ? "kanban" : "list";
};

const getInitialNotificationPermission = () => {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
};

const getReminderNotificationKey = (task) => {
  const reminderTime = getDateTime(task.reminderAt, null);
  return reminderTime ? `${task._id}:${reminderTime}` : null;
};

const readNotifiedReminders = () => {
  try {
    return JSON.parse(localStorage.getItem(NOTIFIED_REMINDERS_KEY)) || {};
  } catch {
    return {};
  }
};

const saveNotifiedReminders = (value) => {
  localStorage.setItem(NOTIFIED_REMINDERS_KEY, JSON.stringify(value));
};

const readStoredNotifications = () => {
  try {
    return JSON.parse(localStorage.getItem(READ_NOTIFICATIONS_KEY)) || {};
  } catch {
    return {};
  }
};

const saveStoredNotifications = (value) => {
  localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(value));
};

function App() {
  const [token, setToken] = useState(INITIAL_TOKEN);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(Boolean(INITIAL_TOKEN));
  const [toast, setToast] = useState(null);
  const [readNotifications, setReadNotifications] = useState(readStoredNotifications);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [activePage, setActivePage] = useState("dashboard");
  const [theme, setTheme] = useState(getInitialTheme);
  const [viewMode, setViewMode] = useState(getInitialViewMode);
  const [notificationPermission, setNotificationPermission] = useState(
    getInitialNotificationPermission
  );
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    sort: "created_desc",
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("taskflow_view_mode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        setIsLoadingData(true);
        const tasksRes = await api.get("/tasks");
        setTasks(tasksRes.data);

        const userRes = await api.get("/auth/me");
        setUser(userRes.data);
      } catch (err) {
        setToast({
          type: "error",
          title: "Session expiree",
          message: "Reconnectez-vous pour recuperer vos donnees.",
        });
        setToken("");
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const filteredTasks = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    const result = tasks.filter((task) => {
      const title = task.title?.toLowerCase() || "";
      const project = task.projectName?.toLowerCase() || "";
      const status = getTaskStatus(task, currentTime);
      const priority = task.priority || "medium";

      const matchesSearch = !search || title.includes(search) || project.includes(search);
      const matchesStatus = filters.status === "all" || status === filters.status;
      const matchesPriority =
        filters.priority === "all" || priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    return [...result].sort((a, b) => {
      if (filters.sort === "created_asc") {
        return getDateTime(a.createdAt, 0) - getDateTime(b.createdAt, 0);
      }

      if (filters.sort === "due_asc") {
        return getDateTime(a.dueDate, Infinity) - getDateTime(b.dueDate, Infinity);
      }

      if (filters.sort === "due_desc") {
        return getDateTime(b.dueDate, -Infinity) - getDateTime(a.dueDate, -Infinity);
      }

      if (filters.sort === "priority") {
        return (
          (priorityWeight[b.priority || "medium"] || 0) -
          (priorityWeight[a.priority || "medium"] || 0)
        );
      }

      return getDateTime(b.createdAt, 0) - getDateTime(a.createdAt, 0);
    });
  }, [currentTime, filters, tasks]);

  const stats = useMemo(() => getTaskStats(tasks, currentTime), [currentTime, tasks]);

  const activeReminders = useMemo(() => {
    return tasks
      .map((task) => {
        const reminderTime = getDateTime(task.reminderAt, null);

        if (!reminderTime || task.status === "done") {
          return null;
        }

        const isDue = reminderTime <= currentTime;
        const isSoon =
          reminderTime > currentTime &&
          reminderTime <= currentTime + REMINDER_LOOKAHEAD_MS;

        if (!isDue && !isSoon) {
          return null;
        }

        return {
          ...task,
          reminderTime,
          reminderState: isDue ? "due" : "soon",
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.reminderTime - b.reminderTime);
  }, [currentTime, tasks]);

  const notifications = useMemo(() => {
    const overdueReminders = tasks.filter((task) => isReminderExpired(task, currentTime));
    const overdueTasks = tasks.filter(isTaskOverdue);
    const dueSoon = tasks
      .filter((task) => task.dueDate && !isTaskOverdue(task) && isWithinDays(task.dueDate, 3))
      .sort((a, b) => getDateTime(a.dueDate, 0) - getDateTime(b.dueDate, 0));
    const notDoneTasks = tasks.filter((task) => getTaskStatus(task, currentTime) === "not_done");

    const items = [
      ...overdueReminders.map((task) => ({
        id: `reminder-overdue:${task._id}:${getDateTime(task.reminderAt, 0)}`,
        type: "reminder_overdue",
        title: "Rappel depasse",
        message: `"${task.title}" avait un rappel prevu.`,
        date: task.reminderAt,
        taskId: task._id,
      })),
      ...overdueTasks.map((task) => ({
        id: `task-overdue:${task._id}:${getDateTime(task.dueDate, 0)}`,
        type: "task_overdue",
        title: "Tache en retard",
        message: `"${task.title}" a depasse sa date de livraison.`,
        date: task.dueDate,
        taskId: task._id,
      })),
      ...dueSoon.map((task) => ({
        id: `due-soon:${task._id}:${getDateTime(task.dueDate, 0)}`,
        type: "due_soon",
        title: "Livraison proche",
        message: `"${task.title}" arrive bientot a echeance.`,
        date: task.dueDate,
        taskId: task._id,
      })),
      ...notDoneTasks.map((task) => ({
        id: `not-done:${task._id}:${getTaskStatus(task, currentTime)}`,
        type: "not_done",
        title: "Tache non faite",
        message: `"${task.title}" est marquee non faite.`,
        date: task.reminderAt || task.updatedAt || task.createdAt,
        taskId: task._id,
      })),
    ]
      .filter((item, index, allItems) => allItems.findIndex((candidate) => candidate.id === item.id) === index)
      .map((item) => ({ ...item, read: Boolean(readNotifications[item.id]) }))
      .sort((a, b) => getDateTime(b.date, 0) - getDateTime(a.date, 0));

    const unreadCount = items.filter((item) => !item.read).length;

    return {
      overdueReminders,
      overdueTasks,
      dueSoon,
      notDoneTasks,
      items,
      total: items.length,
      unreadCount,
    };
  }, [currentTime, readNotifications, tasks]);

  const upcomingReminders = useMemo(() => {
    return tasks
      .filter((task) => {
        const reminderTime = getDateTime(task.reminderAt, null);
        return reminderTime && reminderTime > currentTime && task.status !== "done";
      })
      .sort((a, b) => getDateTime(a.reminderAt, 0) - getDateTime(b.reminderAt, 0));
  }, [currentTime, tasks]);

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => getDateTime(b.createdAt, 0) - getDateTime(a.createdAt, 0))
      .slice(0, 5);
  }, [tasks]);

  useEffect(() => {
    if (!token || !("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    const notifiedReminders = readNotifiedReminders();
    let hasNewNotification = false;

    activeReminders.forEach((task) => {
      const notificationKey = getReminderNotificationKey(task);

      if (!notificationKey || notifiedReminders[notificationKey]) {
        return;
      }

      const body =
        task.reminderState === "due"
          ? `Le rappel de "${task.title}" est arrive.`
          : `"${task.title}" arrive dans moins de 10 minutes.`;

      new Notification("Rappel TaskFlow", {
        body,
        tag: notificationKey,
      });

      notifiedReminders[notificationKey] = Date.now();
      hasNewNotification = true;
    });

    if (hasNewNotification) {
      saveNotifiedReminders(notifiedReminders);
    }
  }, [activeReminders, token]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
    setUser(null);
    setToast(null);
  };

  const markNotificationAsRead = (id) => {
    if (!id) return;

    setReadNotifications((current) => {
      const next = { ...current, [id]: Date.now() };
      saveStoredNotifications(next);
      return next;
    });
  };

  const markAllNotificationsAsRead = () => {
    setReadNotifications((current) => {
      const next = { ...current };
      notifications.items.forEach((item) => {
        next[item.id] = Date.now();
      });
      saveStoredNotifications(next);
      return next;
    });
  };

  if (!token) {
    return (
      <div className="auth-shell">
        <div className="auth-brand-panel">
          <span>TaskFlow</span>
          <h1>Organisez vos taches avec clarte.</h1>
          <p>Dashboard moderne, rappels, priorites, Kanban et statistiques.</p>
        </div>
        <main className="auth-page">
          <AuthForm setToken={setToken} setUser={setUser} onNotify={setToast} />
        </main>
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    );
  }

  const displayName = user?.fullName || user?.email?.split("@")[0] || "User";
  const sharedTaskProps = {
    setTasks,
    onNotify: setToast,
    filters,
    setFilters,
    filteredTasks,
    totalTasks: tasks.length,
    viewMode,
    setViewMode,
  };

  const page = {
    dashboard: (
      <DashboardPage
        displayName={displayName}
        stats={stats}
        {...sharedTaskProps}
      />
    ),
    tasks: <TasksPage {...sharedTaskProps} />,
    projects: <ProjectsPage tasks={tasks} />,
    calendar: <CalendarPage tasks={tasks} currentTime={currentTime} />,
    reminders: (
      <RemindersPage
        notifications={notifications}
        upcomingReminders={upcomingReminders}
      />
    ),
    statistics: <StatisticsPage stats={stats} recentTasks={recentTasks} />,
    settings: (
      <SettingsPage
        user={user}
        theme={theme}
        onThemeChange={setTheme}
        viewMode={viewMode}
        setViewMode={setViewMode}
        notificationPermission={notificationPermission}
        onRequestNotificationPermission={requestNotificationPermission}
        onLogout={logout}
      />
    ),
  }[activePage];

  return (
    <AppLayout
      activePage={activePage}
      onPageChange={setActivePage}
      user={user}
      tasks={tasks}
      theme={theme}
      onThemeChange={setTheme}
      onLogout={logout}
      onUserUpdate={setUser}
      onNotify={setToast}
      notifications={notifications}
      onMarkNotificationAsRead={markNotificationAsRead}
      onMarkAllNotificationsAsRead={markAllNotificationsAsRead}
      notificationPermission={notificationPermission}
      onRequestNotificationPermission={requestNotificationPermission}
    >
      {isLoadingData ? (
        <div className="loading-state">
          <span />
          <strong>Chargement du dashboard</strong>
          <p>Recuperation de vos taches et statistiques.</p>
        </div>
      ) : (
        page
      )}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </AppLayout>
  );
}

export default App;
