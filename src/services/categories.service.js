import api from "./api";

// GET
export const getCategories = async () => {
  const res = await api.get("categories/");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

// CREATE
export const createCategory = (formData) => {
  return api.post("categories/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 🔥 UPDATE → PATCH (VERY IMPORTANT)
export const updateCategory = (id, formData) => {
  return api.patch(`categories/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// DELETE
export const deleteCategory = (id) => {
  return api.delete(`categories/${id}/`);
};
