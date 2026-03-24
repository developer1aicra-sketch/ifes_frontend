import axiosInstance from './axiosInstance';
import endpoints from './endpoints';

export const addAdvisoryBoard = (formData) =>
  axiosInstance.post(endpoints.advisoryBoard.add, formData);

export const getAdvisoryBoard = (website = 'worso', partnerCode = 'IN') =>
  axiosInstance.get(endpoints.advisoryBoard.get, {
    params: { website, partnerCode },
  });

export const editAdvisoryBoard = (id, formData) =>
  axiosInstance.put(endpoints.advisoryBoard.edit(id), formData);

export const deleteAdvisoryBoard = (id) =>
  axiosInstance.delete(endpoints.advisoryBoard.delete(id));

export const addAdvisoryRefree = (formData) =>
  axiosInstance.post(endpoints.advisoryRefree.add, formData);

export const getAdvisoryRefree = (website = 'worso', partnerCode = 'IN') =>
  axiosInstance.get(endpoints.advisoryRefree.get, {
    params: { website, partnerCode },
  });

export const editAdvisoryRefree = (id, formData) =>
  axiosInstance.put(endpoints.advisoryRefree.edit(id), formData);

export const deleteAdvisoryRefree = (id) =>
  axiosInstance.delete(endpoints.advisoryRefree.delete(id));
