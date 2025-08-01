// Brand and branding related types
export interface Brand {
  id: string;
  name: string;
  type: "B2B" | "B2C";
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  logo: string;
}

export interface BrandState {
  brand: Brand | null;
  setBrand: (brand: Brand) => void;
}

export interface BrandTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  logo: string;
  fonts?: {
    primary: string;
    secondary: string;
  };
}
