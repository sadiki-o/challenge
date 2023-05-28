import { axiosPrivate } from "./axiosInstances";

export const getLoadedFileData = async (id: number): Promise<any> => {
  try {
    const { data } = await axiosPrivate.get(`/files/${id}/get_csv_content/`);
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getAllUserTransformations = async (): Promise<any> => {
  try {
    const { data } = await axiosPrivate.get(`/transformations/`);
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const apply_transformation = async (
  id: number,
  operator: "*" | "+" | "-" | "/",
  value: string,
  column_name: string
): Promise<any> => {
  try {
    const data_ = {
      operator,
      value,
      column_name,
    };
    const { data } = await axiosPrivate.post(
      `/files/${id}/apply_transformation/`,
      data_
    );
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const eval_transformation = async (
  id: number,
  operation: string
): Promise<any> => {
  try {
    const data_ = {
      operation,
    };
    const { data } = await axiosPrivate.post(
      `/files/${id}/eval_transformation/`,
      data_
    );
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const save_transformation = async (
  transformation_code: string
): Promise<any> => {
  try {
    const data_ = {
      name: makeid(),
      transformation_code,
    };
    const { data } = await axiosPrivate.post(`/transformations/`, data_);
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const delete_transformation = async (
  transformation_id: number
): Promise<any> => {
  try {
    const { data } = await axiosPrivate.delete(
      `/transformations/${transformation_id}/`
    );
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

// helper to generate random string
function makeid() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 20) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
