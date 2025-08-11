const basicFetchOptions = {
  method: "GET",
  credentials: "include",
};

export const deleteOptions = {
  method: "DELETE",
  credentials: "include",
};

export const getPostOptions = (body: Record<string, any>) => ({
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const getPatchOptions = (body: Record<string, any>) => ({
  method: "PATCH",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/api`;

export const fetchHandler = async (url: string, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, options);
    const { ok, status, headers } = response;
    if (!ok)
      throw new Error(`Fetch failed with status - ${status}`, {
        cause: status,
      });

    const isJson = (headers.get("content-type") || "").includes(
      "application/json"
    );
    const responseData = await (isJson ? response.json() : response.text());

    return [responseData, null];
  } catch (error) {
    console.warn(error);
    return [null, error];
  }
};
