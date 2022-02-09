import axios from "axios";
import { API_VERSION } from "./api";

/**
 * @desc Create user
 * @format /api/v1/users
 * @method POST
 * @access Public
 */
export const createUserAPI = async (
  formData: IServiceFormState
): Promise<HTTPRequestUser> => {
  console.log(formData);

  try {
    const { data } = await axios.post<HTTPRequestUser>(
      `api/${API_VERSION}/users`,
      {
        ...formData,
      }
    );

    if (!data.success) {
      throw new Error("request not successful");
    }

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const requestUserPinByEmailAPI = async (email: string) => {
  try {
    const { data } = await axios.post(`api/${API_VERSION}/users/utils`, {
      email,
    });

    if (!data.success) {
      throw new Error("request not successful");
    }

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const updateUserSeatsByPinAPI = async (
  userpin: string,
  userseats: number,
  serviceid: string
) => {
  const formData = { userseats, serviceid };
  try {
    const { data } = await axios.put(
      `api/${API_VERSION}/users/utils/${userpin}`,
      {
        ...formData,
      }
    );

    if (!data.success) {
      throw new Error("request not successful");
    }

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const deleteUserByPinAPI = async (userpin: string) => {
  try {
    const { data } = await axios.delete(
      `api/${API_VERSION}/users/utils/${userpin}`
    );

    if (!data.success) {
      throw new Error("request not successful");
    }

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
