import { getTaskStatus, isTaskDone, isTaskOverdue } from "./statusHelpers";

export const getTaskStats = (tasks, currentTime = Date.now()) => {
  const total = tasks.length;
  const completed = tasks.filter(isTaskDone).length;
  const inProgress = tasks.filter(
    (task) => getTaskStatus(task, currentTime) === "in_progress"
  ).length;
  const todo = tasks.filter((task) => getTaskStatus(task, currentTime) === "todo").length;
  const notDone = tasks.filter(
    (task) => getTaskStatus(task, currentTime) === "not_done"
  ).length;
  const overdue = tasks.filter(isTaskOverdue).length;

  const priorities = {
    high: tasks.filter((task) => task.priority === "high").length,
    medium: tasks.filter((task) => (task.priority || "medium") === "medium").length,
    low: tasks.filter((task) => task.priority === "low").length,
  };

  return {
    total,
    completed,
    inProgress,
    todo,
    notDone,
    overdue,
    priorities,
    completionRate: total ? Math.round((completed / total) * 100) : 0,
  };
};

export const groupTasksByProject = (tasks) => {
  return tasks.reduce((projects, task) => {
    const name = task.projectName?.trim() || "General";
    const current = projects[name] || [];
    return { ...projects, [name]: [...current, task] };
  }, {});
};
