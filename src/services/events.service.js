import api from "./api";

// GET
export const getEvents = async () => {
  const res = await api.get("events/");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

// CREATE
export const createEvent = (formData) => {
  return api.post("events/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// UPDATE (PATCH)
export const updateEvent = (id, formData) => {
  return api.patch(`events/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// DELETE
export const deleteEvent = (id) => {
  return api.delete(`events/${id}/`);
};
