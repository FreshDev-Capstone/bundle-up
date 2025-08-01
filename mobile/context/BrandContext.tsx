import React, { createContext, useContext, ReactNode } from "react";
import { create } from "zustand";
import { Brand, BrandState } from "../../shared/types";

const useBrandStore = create<BrandState>((set) => ({
  brand: null,
  setBrand: (brand) => set({ brand }),
}));

const BrandContext = createContext<BrandState | null>(null);

export const BrandProvider = ({ children }: { children: ReactNode }) => {
  const store = useBrandStore();
  return (
    <BrandContext.Provider value={store}>{children}</BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) throw new Error("useBrand must be used within BrandProvider");
  return context;
};
