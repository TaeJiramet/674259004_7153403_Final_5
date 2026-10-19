import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/learning-resources';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// 1. ดึงรายการสื่อทั้งหมด พร้อมรองรับการค้นหา (search) และกรอง (category)
export const getResources = async (search = '', category = '') => {
  const params = {};
  if (search && search.trim() !== '') params.search = search.trim();
  if (category && category.trim() !== '' && category !== 'ทั้งหมด') params.category = category.trim();

  const response = await apiClient.get('/', { params });
  return response.data;
};

// 2. ดึงรายละเอียดสื่อ 1 รายการตาม ID
export const getResourceById = async (id) => {
  const response = await apiClient.get(`/${id}`);
  return response.data;
};

// 3. เพิ่มสื่อการเรียนรู้ใหม่
export const createResource = async (resourceData) => {
  const response = await apiClient.post('/', resourceData);
  return response.data;
};

// 4. แก้ไขข้อมูลสื่อการเรียนรู้
export const updateResource = async (id, resourceData) => {
  const response = await apiClient.put(`/${id}`, resourceData);
  return response.data;
};

// 5. ลบสื่อการเรียนรู้
export const deleteResource = async (id) => {
  const response = await apiClient.delete(`/${id}`);
  return response.data;
};

export default {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
};
