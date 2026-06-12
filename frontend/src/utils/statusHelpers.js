export const statusLabels = {
  todo: "A faire",
  in_progress: "En cours",
  done: "Terminee",
  not_done: "Non faite",
};

export const priorityLabels = {
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

export const isReminderExpired = (task, currentTime = Date.now()) => {
  if (!task?.reminderAt || task.status === "done") return false;

  const reminderTime = new Date(task.reminderAt).getTime();
  return !Number.isNaN(reminderTime) && reminderTime < currentTime;
};

export const getTaskStatus = (task, currentTime = Date.now()) => {
  return isReminderExpired(task, currentTime) ? "not_done" : task.status || "todo";
};

export const isTaskDone = (task) => task.status === "done" || task.completed;

export const isTaskOverdue = (task) => {
  if (!task?.dueDate || isTaskDone(task)) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
};
