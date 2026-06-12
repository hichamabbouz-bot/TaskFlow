export const formatDate = (value) => {
  if (!value) return null;
  return new Date(value).toLocaleDateString();
};

export const formatDateTime = (value) => {
  if (!value) return null;
  return new Date(value).toLocaleString();
};

export const getDateTime = (value, fallback) => {
  if (!value) return fallback;

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? fallback : time;
};

export const isSameDay = (left, right) => {
  if (!left || !right) return false;

  const leftDate = new Date(left);
  const rightDate = new Date(right);

  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  );
};

export const isWithinDays = (value, days) => {
  if (!value) return false;

  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return false;

  const now = Date.now();
  return time >= now && time <= now + days * 24 * 60 * 60 * 1000;
};
