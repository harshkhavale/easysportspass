import axios from 'axios';

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
const setAuthToken = token => {
  if (token) {
    publicApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete publicApi.defaults.headers.common['Authorization'];
  }
};
const createPrivateApi = token => {
  const privateApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  privateApi.interceptors.request.use(
    config => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  return privateApi;
};

// Reusable POST function
const postRequest = async ({ url, data, customAxios }) => {
  try {
    const response = await customAxios.post(`${url}`, data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const postMultipartRequest = async ({ url, customAxios, formData }) => {
  try {
    const response = await customAxios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

const getRequest = async ({ url, customAxios }) => {
  try {
    const response = await customAxios.get(url);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const putRequest = async ({ url, customAxios, payload }) => {
  try {
    const response = await customAxios.put(url, payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const putMultipartRequest = async ({ url, customAxios, formData }) => {
  try {
    const response = await customAxios.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const deleteRequest = async ({ url, customAxios }) => {
  try {
    const response = await customAxios.delete(url);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const deleteMultipartRequest = async ({ url, customAxios, formData }) => {
  try {
    const response = await customAxios.delete(url, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

function handleAxiosError(error) {
  if (error.response) {
    const errorData = error.response.data;
    const customError = new Error(errorData.message);
    customError.info = errorData;
    customError.code = error.response.status;
    throw customError;
  } else {
    throw new Error('Please try again.');
  }
}

export { handleAxiosError, publicApi, setAuthToken, createPrivateApi, postRequest, getRequest };
