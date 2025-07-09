export interface User {
  id: number;
  username: string;
  email: string;
  groups?: string[]; // if using this in your Django serializer
}
export interface Group {
  id: number;
  name: string;
  users: User[];
}
