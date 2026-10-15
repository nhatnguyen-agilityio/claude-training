export interface UserInterface {
  user: {
    id: number;
    username: string;
    address?: string;
    name?: string;
    phone?: number;
  };
}

export interface UserStoreInterface {
  id: number;
  username: string;
  address?: string;
  name?: string;
  phone?: number;
}
