import {
  fetchHandler,
  getPatchOptions,
  getPostOptions,
  deleteOptions,
} from "../utils/fetchingUtils";
import { Address } from "../../shared/types";

const baseUrl = "http://localhost:3001/api/addresses";

export interface CreateAddressData {
  nickname: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  isDefault?: boolean;
  instructions?: string;
}

export const getAllAddresses = async () => {
  return await fetchHandler(baseUrl);
};

export const getAddress = async (id: string) => {
  return await fetchHandler(`${baseUrl}/${id}`);
};

export const createAddress = async (addressData: CreateAddressData) => {
  if (!addressData || !addressData.street || !addressData.city) {
    console.error("createAddress: required address data missing");
    return [null, "Street and city are required"];
  }

  try {
    const result = await fetchHandler(
      baseUrl,
      getPostOptions({
        ...addressData,
        country: addressData.country || "USA",
      })
    );
    return result;
  } catch (error) {
    console.error("Create address error:", error);
    return [null, error];
  }
};

export const updateAddress = async (
  addressId: string,
  addressData: Partial<CreateAddressData>
) => {
  if (!addressId || !addressData) {
    console.error("updateAddress: addressId and data are required");
    return [null, "Address ID and data are required"];
  }

  try {
    const result = await fetchHandler(
      `${baseUrl}/${addressId}`,
      getPatchOptions(addressData)
    );
    return result;
  } catch (error) {
    console.error("Update address error:", error);
    return [null, error];
  }
};

export const deleteAddress = async (id: string) => {
  return fetchHandler(`${baseUrl}/${id}`, deleteOptions);
};

export const setDefaultAddress = async (id: string) => {
  try {
    const result = await fetchHandler(
      `${baseUrl}/${id}/default`,
      getPatchOptions({ isDefault: true })
    );
    return result;
  } catch (error) {
    console.error("Set default address error:", error);
    return [null, error];
  }
};
