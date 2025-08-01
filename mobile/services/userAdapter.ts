import {
  fetchHandler,
  getPatchOptions,
  getPostOptions,
  deleteOptions,
} from "../utils/fetchingUtils";
import { ProfileUpdateData } from "../../shared/types";

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export const getUserProfile = async () => {
  return await fetchHandler("/auth/profile");
};

export const updateProfile = async (profileData: ProfileUpdateData) => {
  if (!profileData) {
    console.error("updateProfile: profileData is undefined");
    return [null, "No profile data provided"];
  }

  try {
    const result = await fetchHandler(
      "/auth/profile",
      getPatchOptions({ ...profileData })
    );
    return result;
  } catch (error) {
    console.error("Update profile error:", error);
    return [null, error];
  }
};

export const changePassword = async (passwordData: PasswordChangeData) => {
  if (!passwordData.currentPassword || !passwordData.newPassword) {
    console.error("changePassword: missing password data");
    return [null, "Current and new passwords are required"];
  }

  try {
    const result = await fetchHandler(
      "/auth/change-password",
      getPostOptions({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
    );
    return result;
  } catch (error) {
    console.error("Change password error:", error);
    return [null, error];
  }
};

export const deleteAccount = async () => {
  try {
    const result = await fetchHandler("/auth/delete-account", deleteOptions);
    return result;
  } catch (error) {
    console.error("Delete account error:", error);
    return [null, error];
  }
};
