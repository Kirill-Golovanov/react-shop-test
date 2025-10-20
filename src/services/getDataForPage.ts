import axios from "axios";
import { Action } from "../types/Action";
import { Product } from "../types/Product";
import { Category } from "../types/Category";

export interface PageData {
  actions: Action[];
  products: Product[];
  categories: Category[];
}

export const getDataForPage = async (): Promise<PageData> => {
  try {
    const response = await axios.get(
      "https://noxer-test.ru/webapp/api/products/on_main"
    );
    const data = response.data;

    if (data.status !== "ok") {
      throw new Error(
        `API вернул статус не "ok": ${data.status || "Unknown status"}`
      );
    }

    const actions: Action[] = data.special_project_parameters_actions || [];
    const products: Product[] = data.products || [];
    const categories: Category[] = data.categories || [];

    return {
      actions,
      products,
      categories,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const statusText = error.response?.statusText;
      throw new Error(
        `Failed to fetch data for page: ${status} ${
          statusText || error.message
        }`
      );
    } else {
      throw new Error(
        `An unexpected error occurred: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
};
