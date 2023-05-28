import { axiosPrivate, axiosPublic } from "./axiosInstances";

export const signin = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<any> => {
  try {
    const { data } = await axiosPublic.post("signin", {
      username,
      password,
    });
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const signup = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}): Promise<any> => {
  try {
    const { data } = await axiosPublic.post("signup", {
      username,
      email,
      password,
    });
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const signout = async (): Promise<any> => {
  try {
    const { data } = await axiosPrivate.post("signout");
    localStorage.removeItem("token");
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getProfile = async (): Promise<any> => {
  try {
    const { data } = await axiosPrivate.get("profile");
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};
