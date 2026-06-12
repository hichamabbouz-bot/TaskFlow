const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

const parseOptionalDate = (value) => {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizePriority = (value) => {
  return ["low", "medium", "high"].includes(value) ? value : "medium";
};

const normalizeStatus = (value) => {
  return ["todo", "in_progress", "done"].includes(value) ? value : "todo";
};

const getTaskPayload = (body) => ({
  title: body.title?.trim(),
  description: body.description?.trim() || "",
  projectName: body.projectName?.trim() || "General",
  dueDate: parseOptionalDate(body.dueDate),
  reminderAt: parseOptionalDate(body.reminderAt),
  priority: normalizePriority(body.priority),
  status: normalizeStatus(body.status),
  updatedAt: new Date(),
});

const isReminderExpired = (task) => {
  if (!task.reminderAt || task.status === "done") return false;

  const reminderTime = new Date(task.reminderAt).getTime();
  return !Number.isNaN(reminderTime) && reminderTime < Date.now();
};

const applyReminderStatus = (task) => {
  if (isReminderExpired(task)) {
    task.status = "not_done";
    task.completed = false;
  }

  return task;
};

const lockExpiredReminderTasks = async (userId) => {
  await Task.updateMany(
    {
      user: userId,
      reminderAt: { $lt: new Date() },
      status: { $nin: ["done", "not_done"] },
    },
    { $set: { status: "not_done", completed: false } }
  );
};

router.get("/", auth, async (req, res) => {
  try {
    await lockExpiredReminderTasks(req.user.id);
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error("Erreur lecture taches:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/", auth, async (req, res) => {
  const taskData = getTaskPayload(req.body);

  if (!taskData.title) {
    return res.status(400).json({ message: "Le titre de la tache est requis" });
  }

  try {
    const task = new Task({
      ...taskData,
      user: req.user.id,
    });

    applyReminderStatus(task);

    await task.save();
    res.json(task);
  } catch (err) {
    console.error("Erreur creation tache:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/:id", auth, async (req, res) => {
  const taskData = getTaskPayload(req.body);

  if (!taskData.title) {
    return res.status(400).json({ message: "Le titre de la tache est requis" });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Tache non trouvee ou non autorisee" });
    }

    if (task.status === "not_done" || isReminderExpired(task)) {
      applyReminderStatus(task);
      await task.save();
      return res.status(403).json({
        message: "Cette tache est non faite car le rappel est depasse. Modification bloquee.",
      });
    }

    applyReminderStatus(taskData);

    Object.assign(task, taskData);
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Erreur modification tache:", err);
    res.status(500).json({ message: "Erreur serveur lors de la modification" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Tache non trouvee ou non autorisee" });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: "Tache supprimee" });
  } catch (err) {
    console.error("Erreur suppression tache:", err);
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
});

module.exports = router;
