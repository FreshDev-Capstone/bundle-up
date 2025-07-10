// Address related types
export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  isDefault?: boolean;
  instructions?: string;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  id: string;
}
