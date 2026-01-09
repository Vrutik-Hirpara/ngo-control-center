import api from "./api";

// GET ALL CONTACTS
export const getContacts = async () => {
  const res = await api.get("contact/");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

// CREATE CONTACT
export const createContact = (data) => {
  return api.post("contact/", data);
};

// UPDATE CONTACT (PATCH)
export const updateContact = (id, data) => {
  return api.patch(`contact/${id}/`, data);
};

// DELETE CONTACT
export const deleteContact = (id) => {
  return api.delete(`contact/${id}/`);
};
