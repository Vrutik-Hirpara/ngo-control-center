import api from "./api";

// GET ALL DONATIONS
export const getDonations = async () => {
  const res = await api.get("donations/");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

// CREATE DONATION
export const createDonation = async (formData) => {
  return api.post("donations/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// UPDATE DONATION
export const updateDonation = async (id, formData) => {
  return api.patch(`donations/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// DELETE DONATION
export const deleteDonation = async (id) => {
  return api.delete(`donations/${id}/`);
};
