import { axiosFiles, axiosPrivate } from "./axiosInstances";

export const fetchUserFiles = async (): Promise<any> => {
  try {
    const { data } = await axiosPrivate.get("files/");
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const uploadFile = async (file: any): Promise<any> => {
  try {
    const { data } = await axiosFiles.post("files/", file);
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteFile = async (id: number): Promise<any> => {
  try {
    const { data } = await axiosFiles.delete(`files/${id}/`,);
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const downloadFile = async (id: number): Promise<any> => {
  try {
    const { data } = await axiosPrivate.get(`files/${id}/`, {
        responseType: 'blob'
    });
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};
